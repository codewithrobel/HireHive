import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
    // Exclude passwords from the query results
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
});

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        // Prevent admin from deleting themselves
        if (user._id.toString() === req.user._id.toString()) {
            res.status(400);
            throw new Error('You cannot delete your own admin account');
        }

        // Also delete any jobs and applications associated with this user if they are a recruiter or seeker
        await Job.deleteMany({ postedBy: user._id });
        await Application.deleteMany({ applicant: user._id });

        await user.deleteOne();
        res.json({ message: 'User removed successfully' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get all jobs
// @route   GET /api/admin/jobs
// @access  Private/Admin
export const getJobs = asyncHandler(async (req, res) => {
    // Populate employer details so admin can see who posted what
    const jobs = await Job.find({}).populate('postedBy', 'name email').sort({ createdAt: -1 });
    res.json(jobs);
});

// @desc    Delete a job
// @route   DELETE /api/admin/jobs/:id
// @access  Private/Admin
export const deleteJob = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id);

    if (job) {
        // Delete all applications for this job as well
        await Application.deleteMany({ job: job._id });

        await job.deleteOne();
        res.json({ message: 'Job removed successfully' });
    } else {
        res.status(404);
        throw new Error('Job not found');
    }
});
