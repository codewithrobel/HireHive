import Job from '../models/Job.js';

// @desc    Create a Job
// @route   POST /api/jobs
// @access  Private/Recruiter
const createJob = async (req, res, next) => {
    try {
        const { title, company, description, skills, salary, location, type, experience, deadline } = req.body;

        const job = new Job({
            title,
            company,
            description,
            skills: skills && Array.isArray(skills) ? skills : (skills ? skills.split(',').map(skill => skill.trim()) : []),
            salary,
            location,
            type,
            experience,
            deadline,
            postedBy: req.user._id,
            companyLogo: req.file ? `/uploads/${req.file.filename}` : undefined
        });

        const createdJob = await job.save();
        res.status(201).json(createdJob);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all jobs (with filters)
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res, next) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;

        const keyword = req.query.keyword ? {
            title: {
                $regex: req.query.keyword,
                $options: 'i',
            }
        } : {};

        // Extract filters
        const { location, type, minSalary, skills, postedBy } = req.query;

        const filterArgs = { ...keyword };
        if (location) filterArgs.location = { $regex: location, $options: 'i' };
        if (type) filterArgs.type = type;
        if (minSalary) filterArgs.salary = { $gte: Number(minSalary) };
        if (skills) {
            const skillArray = skills.split(',').map(s => new RegExp(s.trim(), 'i'));
            filterArgs.skills = { $all: skillArray };
        }
        if (postedBy) filterArgs.postedBy = postedBy;

        const count = await Job.countDocuments({ ...filterArgs });
        const jobs = await Job.find({ ...filterArgs })
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 });

        res.json({ jobs, page, pages: Math.ceil(count / pageSize), count });
    } catch (error) {
        next(error);
    }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id).populate('postedBy', 'name email company');

        if (job) {
            res.json(job);
        } else {
            res.status(404);
            throw new Error('Job not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private/Recruiter
const updateJob = async (req, res, next) => {
    try {
        const { title, company, description, skills, salary, location, type, experience, deadline } = req.body;

        const job = await Job.findById(req.params.id);

        if (job) {
            // Check if user is the one who posted it
            if (job.postedBy.toString() !== req.user._id.toString()) {
                res.status(403);
                throw new Error('Not authorized to update this job');
            }

            job.title = title || job.title;
            job.company = company || job.company;
            job.description = description || job.description;
            job.skills = skills && Array.isArray(skills) ? skills : (skills ? skills.split(',').map(skill => skill.trim()) : job.skills);
            job.salary = salary || job.salary;
            job.location = location || job.location;
            job.type = type || job.type;
            job.experience = experience || job.experience;
            job.deadline = deadline || job.deadline;

            if (req.file) {
                job.companyLogo = `/uploads/${req.file.filename}`;
            }

            const updatedJob = await job.save();
            res.json(updatedJob);
        } else {
            res.status(404);
            throw new Error('Job not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private/Recruiter
const deleteJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);

        if (job) {
            if (job.postedBy.toString() !== req.user._id.toString()) {
                res.status(403);
                throw new Error('Not authorized to delete this job');
            }

            await job.deleteOne();
            res.json({ message: 'Job removed' });
        } else {
            res.status(404);
            throw new Error('Job not found');
        }
    } catch (error) {
        next(error);
    }
};

export { createJob, getJobs, getJobById, updateJob, deleteJob };
