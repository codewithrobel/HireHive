import express from 'express';
import { applyForJob, getJobApplicants, getMyApplications, updateApplicationStatus } from '../controllers/applicationController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/:jobId', protect, authorize('seeker'), upload.single('resume'), applyForJob);
router.get('/job/:jobId', protect, authorize('recruiter'), getJobApplicants);
router.get('/my-applications', protect, authorize('seeker'), getMyApplications);
router.put('/:id/status', protect, authorize('recruiter'), updateApplicationStatus);

export default router;
