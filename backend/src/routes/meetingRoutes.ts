import { Router } from 'express';
import { createMeetingRequest, getMeetingRequests, confirmMeeting } from '../controllers/meetingController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// Apply auth middleware to all meeting routes
router.use(authenticate);

router.post('/request', createMeetingRequest);
router.get('/', getMeetingRequests);
router.put('/:id/confirm', confirmMeeting);

export default router;
