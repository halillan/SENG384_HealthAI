import { Request, Response } from 'express';
import prisma from '../config/prisma';

// GET /api/posts
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const { domain, tags } = req.query;

    const posts = await prisma.post.findMany({
      where: {
        ...(domain && { domain: String(domain) }),
        ...(tags && { tags: { hasSome: String(tags).split(',') } }),
      },
      include: {
        author: {
          select: { fullName: true, role: true, specialization: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

import { AuthRequest } from '../middlewares/authMiddleware';

// POST /api/posts
export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, tags, domain } = req.body;

    // Use the authenticated user's ID
    const authorId = req.user?.id;

    if (!authorId) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        description,
        tags,
        domain,
        authorId
      }
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
