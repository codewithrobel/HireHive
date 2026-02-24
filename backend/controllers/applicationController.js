import Application from '../models/Application.js';
import Job from '../models/Job.js';

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private/Seeker
const applyForJob = async (req, res, next) => {
    try {
        const fetchJob = await Job.findById(req.params.jobId);
        if (!fetchJob) {
            res.status(404);
            throw new Error('Job not found');
        }

        const existingApplication = await Application.findOne({
            job: req.params.jobId,
            applicant: req.user._id,
        });

        if (existingApplication) {
            res.status(400);
            throw new Error('You have already applied for this job');
        }

        if (!req.file) {
            res.status(400);
            throw new Error('Please upload a resume');
        }

        const resumeUrl = `/${req.file.path.replace(/\\/g, '/')}`; // Normalize paths for cross-platform

        const application = await Application.create({
            job: req.params.jobId,
            applicant: req.user._id,
            resumeUrl,
            resumeOriginalName: req.file.originalname,
        });

        res.status(201).json(application);
    } catch (error) {
        next(error);
    }
};

// @desc    Get applicants for a job
// @route   GET /api/applications/job/:jobId
// @access  Private/Recruiter
const getJobApplicants = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.jobId);
        if (!job) {
            res.status(404);
            throw new Error('Job not found');
        }

        if (job.postedBy.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to view applicants for this job');
        }

        const applications = await Application.find({ job: req.params.jobId })
            .populate('applicant', 'name email skills experience profileInfo');

        res.json(applications);
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's applied jobs
// @route   GET /api/applications/my-applications
// @access  Private/Seeker
const getMyApplications = async (req, res, next) => {
    try {
        const applications = await Application.find({ applicant: req.user._id })
            .populate('job', 'title company location salary type')
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        next(error);
    }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private/Recruiter
const updateApplicationStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const application = await Application.findById(req.params.id).populate('job');

        if (!application) {
            res.status(404);
            throw new Error('Application not found');
        }

        if (application.job.postedBy.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to access this application');
        }

        application.status = status;
        await application.save();

        const updatedApplication = await Application.findById(req.params.id)
            .populate('applicant', 'name email skills experience profileInfo');

        res.json(updatedApplication);
    } catch (error) {
        next(error);
    }
};

export { applyForJob, getJobApplicants, getMyApplications, updateApplicationStatus };
