import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/adminMiddleware.js';
import { getUsers, deleteUser, getJobs, deleteJob } from '../controllers/adminController.js';

const router = express.Router();

// Apply auth limits to all routes in this file
router.use(protect, isAdmin);

// User Management
router.route('/users')
    .get(getUsers);

router.route('/users/:id')
    .delete(deleteUser);

// Job Management
router.route('/jobs')
    .get(getJobs);

router.route('/jobs/:id')
    .delete(deleteJob);

export default router;
