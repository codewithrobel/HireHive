import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resumeUrl: { type: String },
    resumeOriginalName: { type: String },
    status: { type: String, enum: ['Pending', 'Shortlisted', 'Rejected'], default: 'Pending' },
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);
export default Application;
