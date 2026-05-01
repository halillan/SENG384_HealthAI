import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import prisma from '../config/prisma';

// POST /api/meetings/request
export const createMeetingRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { postId, proposedSlots, message } = req.body;
    const requesterId = req.user?.id;

    if (!requesterId) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    // Find the post to get the receiverId
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true }
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.authorId === requesterId) {
      return res.status(400).json({ error: 'You cannot request a meeting with yourself' });
    }

    // 1. Log the NDA agreement
    // Check if an NDA already exists to avoid unique constraint errors
    let ndaLog = await prisma.ndaLog.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: requesterId
        }
      }
    });

    if (!ndaLog) {
      ndaLog = await prisma.ndaLog.create({
        data: {
          postId,
          userId: requesterId,
          ipAddress: req.ip // Simulate logging IP
        }
      });
    }

    // 2. Create the Meeting Request
    const meetingRequest = await prisma.meetingRequest.create({
      data: {
        postId,
        requesterId,
        receiverId: post.authorId,
        proposedSlots, // It's a JSON array
        // Optionally save the message in a new field if schema had it, but for now we just handle slots.
        // If schema doesn't have a message field, we will just omit it or rely on the frontend message being an introduction.
      }
    });

    res.status(201).json({ message: 'Meeting request created successfully', meetingRequest });
  } catch (error) {
    console.error('Error creating meeting request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/meetings
export const getMeetingRequests = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const meetings = await prisma.meetingRequest.findMany({
      where: {
        OR: [
          { requesterId: userId },
          { receiverId: userId }
        ]
      },
      include: {
        post: {
          select: { title: true, domain: true }
        },
        requester: {
          select: { fullName: true, role: true, specialization: true }
        },
        receiver: {
          select: { fullName: true, role: true, specialization: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(meetings);
  } catch (error) {
    console.error('Error fetching meetings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUT /api/meetings/:id/confirm
export const confirmMeeting = async (req: AuthRequest, res: Response) => {
  try {
    const meetingId = req.params.id;
    const { confirmedSlot } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const meeting = await prisma.meetingRequest.findUnique({
      where: { id: meetingId }
    });

    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    // Only the receiver can confirm the meeting
    if (meeting.receiverId !== userId) {
      return res.status(403).json({ error: 'Only the post owner can confirm this meeting' });
    }

    // Update the meeting
    const updatedMeeting = await prisma.meetingRequest.update({
      where: { id: meetingId },
      data: {
        confirmedSlot: new Date(confirmedSlot),
        status: 'TIME_CONFIRMED'
      }
    });

    // We also need an NDA log for the receiver since they are accepting the meeting
    const ndaExists = await prisma.ndaLog.findUnique({
      where: { postId_userId: { postId: meeting.postId, userId } }
    });

    if (!ndaExists) {
      await prisma.ndaLog.create({
        data: {
          postId: meeting.postId,
          userId,
          ipAddress: req.ip
        }
      });
    }

    res.status(200).json({ message: 'Meeting confirmed', meeting: updatedMeeting });
  } catch (error) {
    console.error('Error confirming meeting:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
