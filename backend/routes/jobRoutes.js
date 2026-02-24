import express from 'express';
import { createJob, getJobs, getJobById, updateJob, deleteJob } from '../controllers/jobController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getJobs)
    .post(protect, authorize('recruiter'), upload.single('companyLogo'), createJob);

router.route('/:id')
    .get(getJobById)
    .put(protect, authorize('recruiter'), upload.single('companyLogo'), updateJob)
    .delete(protect, authorize('recruiter'), deleteJob);

export default router;
