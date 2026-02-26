import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Building, MapPin, DollarSign, Clock, Briefcase, Calendar, ChevronLeft, Upload, Users } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';

const JobDetails = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user, getFileUrl } = useContext(AuthContext);
    const navigate = useNavigate();

    // Application state
    const [file, setFile] = useState(null);
    const [applying, setApplying] = useState(false);
    const [showApplyModal, setShowApplyModal] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const { data } = await axios.get(`/jobs/${id}`);
                setJob(data);
            } catch (error) {
                toast.error('Job not found');
                navigate('/jobs');
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id, navigate]);

    const handleApply = async (e) => {
        e.preventDefault();
        if (!file && !user?.resumeUrl) {
            return toast.error('Please upload a resume to apply.');
        }

        setApplying(true);
        try {
            const formData = new FormData();
            if (file) {
                formData.append('resume', file);
            }

            await axios.post(`/applications/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success('Successfully applied for this job!');
            setShowApplyModal(false);
            setFile(null);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to apply');
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!job) return null;

    const isRecruiterOwner = user?.role === 'recruiter' && job.postedBy?._id === user._id;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <div className="min-h-screen pb-12 overflow-x-hidden text-zinc-700 dark:text-zinc-300">
            {/* Header */}
            <div className="border-b border-zinc-200 dark:border-zinc-800 pt-8 pb-12 relative overflow-hidden bg-zinc-50/50 dark:bg-zinc-800">
                {/* Decorative background gradients */}




                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <Link to="/jobs" className="inline-flex items-center text-sm font-bold text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-white mb-6 transition-all dark:hover:drop-shadow-sm group">
                            <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Jobs
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, type: "spring" }}
                        className="flex flex-col md:flex-row md:items-start md:justify-between gap-6"
                    >
                        <div className="flex items-start gap-5">
                            <motion.div
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                className="w-16 h-16 bg-blue-50 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-3xl border border-blue-100 dark:border-zinc-200 dark:border-zinc-800 shadow-sm shrink-0 group-hover:shadow-md dark:group-hover:shadow-sm transition-all overflow-hidden"
                            >
                                {job.companyLogo ? (
                                    <img src={getFileUrl(job.companyLogo)} alt={`${job.company} Logo`} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                                ) : null}
                                <span style={{ display: job.companyLogo ? 'none' : 'block' }}>
                                    {job.company?.[0]?.toUpperCase()}
                                </span>
                            </motion.div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight drop-shadow-md">{job.title}</h1>
                                <div className="flex items-center text-lg text-zinc-500 dark:text-zinc-400 mt-2 font-semibold">
                                    <Building size={18} className="mr-2 text-zinc-400 dark:text-zinc-500" />
                                    {job.company}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            {user?.role === 'seeker' && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowApplyModal(true)}
                                    className="hover:bg-blue-600 hover:text-white transition-colors border border-blue-200 bg-white text-blue-600 dark:bg-blue-600/20 dark:text-blue-100 px-8 py-3 rounded-lg font-bold transition-all  dark:border-blue-200 dark:border-blue-800 shadow-sm   dark:bg-blue-600/20 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                                >

                                    <span className="relative z-10 text-blue-600 dark:text-blue-100 group-hover:text-white drop-shadow-md">Apply Now</span>
                                </motion.button>
                            )}
                            {isRecruiterOwner && (
                                <Link
                                    to={`/dashboard`}
                                    className="px-6 py-3 bg-white dark:bg-zinc-800 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 dark:border-zinc-200 text-zinc-900 dark:text-white font-bold rounded-lg hover:bg-white dark:hover:bg-white hover:border-white flex items-center justify-center transition-all shadow-sm dark:shadow-none"
                                >
                                    <Users size={18} className="mr-2 text-blue-500 dark:text-blue-400" />
                                    View Applicants
                                </Link>
                            )}
                            {!user && (
                                <Link
                                    to="/login"
                                    className="hover:bg-blue-600 hover:text-white transition-colors border border-blue-200 bg-blue-50 text-blue-600 dark:bg-blue-600/20 dark:text-blue-100 px-8 py-3 rounded-lg font-bold transition-all  dark:border-blue-200 dark:border-blue-800 shadow-sm   dark:bg-blue-600/20 text-center"
                                >

                                    <span className="relative z-10 text-blue-600 dark:text-blue-100 group-hover:text-white drop-shadow-md">Sign in to Apply</span>
                                </Link>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Content Container */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
                {/* Left Column - Main Details */}
                <div className="lg:col-span-2 space-y-8">
                    <motion.div variants={itemVariants} className="bg-white dark:bg-zinc-800 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 dark:border-zinc-200 shadow-sm hover:border-zinc-200 dark:hover:border-zinc-200 transition-all">
                        <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white mb-4 flex items-center">
                            <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-200 dark:border-blue-800 flex justify-center items-center mr-3 shadow-sm">
                                <Briefcase size={18} />
                            </span>
                            Job Description
                        </h2>
                        <div className="prose max-w-none text-zinc-700 dark:text-zinc-300 whitespace-pre-line leading-relaxed font-medium">
                            {job.description}
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-white dark:bg-zinc-800 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 dark:border-zinc-200 shadow-sm hover:border-zinc-200 dark:hover:border-zinc-200 transition-all">
                        <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white mb-4">Required Skills</h2>
                        <div className="flex flex-wrap gap-2.5">
                            {job.skills?.length > 0 ? job.skills.map((skill, index) => (
                                <span key={index} className="px-4 py-2 bg-blue-50 dark:bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 font-bold rounded-lg border border-blue-200 dark:border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-100 transition-colors shadow-sm cursor-default">
                                    {skill}
                                </span>
                            )) : <span className="text-zinc-500 font-medium">Not specified</span>}
                        </div>
                    </motion.div>
                </div>

                {/* Right Column - Meta Data */}
                <div className="lg:col-span-1 space-y-6">
                    <motion.div variants={itemVariants} className="bg-white dark:bg-zinc-800 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 dark:border-zinc-200 shadow-sm hover:border-zinc-200 dark:hover:border-zinc-200 transition-all">
                        <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white mb-5 border-b border-zinc-200 dark:border-zinc-800 pb-3 drop-shadow-sm">Job Overview</h3>
                        <div className="space-y-5">
                            <div className="flex items-start">
                                <span className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-200 dark:border-blue-800 flex items-center justify-center mr-4 shrink-0 text-blue-600 dark:text-blue-400 shadow-sm">
                                    <Briefcase size={20} />
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Job Type</p>
                                    <p className="font-bold text-zinc-900 dark:text-white">{job.type}</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <span className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center mr-4 shrink-0 text-emerald-600 dark:text-emerald-400 shadow-sm">
                                    <MapPin size={20} />
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Location</p>
                                    <p className="font-bold text-zinc-900 dark:text-white">{job.location}</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <span className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-100 dark:bg-purple-900/40 border border-purple-200 dark:border-purple-500/30 flex items-center justify-center mr-4 shrink-0 text-purple-600 dark:text-purple-400 shadow-sm">
                                    <DollarSign size={20} />
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Salary</p>
                                    <p className="font-bold text-zinc-900 dark:text-white">{job.currency === 'USD' ? '$' : '₹'}{job.salary?.toLocaleString()} / year</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <span className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-500/20 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center mr-4 shrink-0 text-cyan-600 dark:text-cyan-400 shadow-sm">
                                    <Calendar size={20} />
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Posted on</p>
                                    <p className="font-bold text-zinc-900 dark:text-white">{new Date(job.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            {job.deadline && (
                                <div className="flex items-start">
                                    <span className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-500/20 border border-rose-200 dark:border-rose-500/30 flex items-center justify-center mr-4 shrink-0 text-rose-600 dark:text-rose-400 shadow-sm">
                                        <Clock size={20} />
                                    </span>
                                    <div>
                                        <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Expires on</p>
                                        <p className="font-bold text-zinc-900 dark:text-white">{new Date(job.deadline).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Apply Modal */}
            {
                showApplyModal && (
                    <div className="fixed inset-0 bg-black/40 dark:bg-zinc-900 bg-white border border-zinc-200 dark:border-zinc-800 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 dark:border-zinc-200 rounded-lg shadow-sm w-full max-w-md p-6 relative overflow-hidden"
                        >
                            {/* Decorative modal glow */}



                            <div className="flex justify-between items-center mb-6 relative z-10">
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white drop-shadow-sm">Apply for this Job</h3>
                                <button onClick={() => setShowApplyModal(false)} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white text-2xl leading-none transition-colors">
                                    &times;
                                </button>
                            </div>

                            <form onSubmit={handleApply} className="space-y-5 relative z-10">
                                <div>
                                    <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 flex items-center">
                                        Upload Resume (PDF, DOC, DOCX) {!user?.resumeUrl && <span className="text-red-500 ml-1 text-2xl leading-none">*</span>}
                                    </label>
                                    {user?.resumeUrl && (
                                        <div className="mb-4 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center justify-between shadow-sm">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-blue-500 dark:text-blue-400 font-bold uppercase tracking-wider mb-0.5">Saved Resume</span>
                                                <span className="text-sm font-bold text-blue-700 dark:text-blue-300">{user.resumeOriginalName || 'Profile Resume'}</span>
                                            </div>
                                            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-black tracking-widest uppercase bg-white dark:bg-zinc-800 px-2.5 py-1.5 rounded-md shadow-sm opacity-80 border border-blue-100 dark:border-blue-700/50">Auto-Apply</span>
                                        </div>
                                    )}
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-zinc-300 dark:border-zinc-700 hover:border-blue-200 dark:border-blue-800 border-dashed rounded-lg bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-black/40 transition-all shadow-inner">
                                        <div className="space-y-1 text-center">
                                            <Upload className="mx-auto h-10 w-10 text-blue-500/70 dark:text-blue-400/70 shadow-none dark:drop-shadow-sm" />
                                            <div className="flex text-sm text-zinc-500 dark:text-zinc-400 justify-center">
                                                <label htmlFor="file-upload" className="relative cursor-pointer rounded font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 focus-within:outline-none flex justify-center items-center">
                                                    <span className="px-2">{user?.resumeUrl ? "Click to upload a different resume" : "Click to select a file"}</span>
                                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files[0])} />
                                                </label>
                                            </div>
                                            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2 font-medium">
                                                {file ? <span className="text-purple-600 dark:text-purple-400 font-bold drop-shadow-sm">{file.name}</span> : "File should be < 5MB"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={(!file && !user?.resumeUrl) || applying}
                                    className="w-full px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {applying ? 'Submitting Application...' : 'Submit Application'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )
            }
        </div >
    );
};

export default JobDetails;
