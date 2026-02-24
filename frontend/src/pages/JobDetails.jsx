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
            } else {
                if (!file) {
                    toast.error('Backend requires a new file upload for each application currently.');
                    setApplying(false);
                    return;
                }
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
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
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
            <div className="border-b border-zinc-200 dark:border-white/10 pt-8 pb-12 relative overflow-hidden bg-zinc-50/50 dark:bg-black/20">
                {/* Decorative background gradients */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-500 blur-[2px]"></div>
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-[-50%] right-[-10%] w-[40%] h-[150%] bg-fuchsia-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <Link to="/jobs" className="inline-flex items-center text-sm font-bold text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-white mb-6 transition-all dark:hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] group">
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
                                className="w-16 h-16 bg-indigo-50 dark:bg-black/40 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-3xl border border-indigo-100 dark:border-white/5 shadow-sm dark:shadow-[0_0_15px_rgba(99,102,241,0.2)] shrink-0 group-hover:shadow-md dark:group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all overflow-hidden"
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
                                    className="relative group overflow-hidden px-8 py-3 rounded-xl font-bold transition-all border border-indigo-200 dark:border-indigo-500/50 shadow-[0_8px_30px_rgba(99,102,241,0.1)] dark:shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.2)] dark:hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] bg-white/80 dark:bg-indigo-600/20 backdrop-blur-md"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <span className="relative z-10 text-indigo-600 dark:text-indigo-100 group-hover:text-white drop-shadow-md">Apply Now</span>
                                </motion.button>
                            )}
                            {isRecruiterOwner && (
                                <Link
                                    to={`/dashboard`}
                                    className="px-6 py-3 bg-white/80 dark:bg-white/5 backdrop-blur-md border border-white/80 dark:border-white/10 text-zinc-900 dark:text-white font-bold rounded-xl hover:bg-white dark:hover:bg-white/10 hover:border-white flex items-center justify-center transition-all shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-none"
                                >
                                    <Users size={18} className="mr-2 text-indigo-500 dark:text-indigo-400" />
                                    View Applicants
                                </Link>
                            )}
                            {!user && (
                                <Link
                                    to="/login"
                                    className="relative group overflow-hidden px-8 py-3 rounded-xl font-bold transition-all border border-indigo-200 dark:border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.1)] dark:shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.2)] dark:hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] bg-indigo-50 dark:bg-indigo-600/20 text-center"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <span className="relative z-10 text-indigo-600 dark:text-indigo-100 group-hover:text-white drop-shadow-md">Sign in to Apply</span>
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
                    <motion.div variants={itemVariants} className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl rounded-2xl p-8 border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:border-white/80 dark:hover:border-white/20 transition-all">
                        <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white mb-4 flex items-center">
                            <span className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 flex justify-center items-center mr-3 shadow-sm dark:shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                                <Briefcase size={18} />
                            </span>
                            Job Description
                        </h2>
                        <div className="prose max-w-none text-zinc-700 dark:text-zinc-300 whitespace-pre-line leading-relaxed font-medium">
                            {job.description}
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl rounded-2xl p-8 border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:border-white/80 dark:hover:border-white/20 transition-all">
                        <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white mb-4">Required Skills</h2>
                        <div className="flex flex-wrap gap-2.5">
                            {job.skills?.length > 0 ? job.skills.map((skill, index) => (
                                <span key={index} className="px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 font-bold rounded-xl border border-indigo-200 dark:border-indigo-500/30 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors shadow-sm dark:shadow-[0_0_10px_rgba(99,102,241,0.1)] cursor-default">
                                    {skill}
                                </span>
                            )) : <span className="text-zinc-500 font-medium">Not specified</span>}
                        </div>
                    </motion.div>
                </div>

                {/* Right Column - Meta Data */}
                <div className="lg:col-span-1 space-y-6">
                    <motion.div variants={itemVariants} className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:border-white/80 dark:hover:border-white/20 transition-all">
                        <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white mb-5 border-b border-zinc-200 dark:border-white/10 pb-3 drop-shadow-sm">Job Overview</h3>
                        <div className="space-y-5">
                            <div className="flex items-start">
                                <span className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center mr-4 shrink-0 text-indigo-600 dark:text-indigo-400 shadow-sm dark:shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                                    <Briefcase size={20} />
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Job Type</p>
                                    <p className="font-bold text-zinc-900 dark:text-white">{job.type}</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <span className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center mr-4 shrink-0 text-emerald-600 dark:text-emerald-400 shadow-sm dark:shadow-[0_0_10px_rgba(52,211,153,0.2)]">
                                    <MapPin size={20} />
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Location</p>
                                    <p className="font-bold text-zinc-900 dark:text-white">{job.location}</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <span className="w-10 h-10 rounded-full bg-fuchsia-100 dark:bg-fuchsia-500/20 border border-fuchsia-200 dark:border-fuchsia-500/30 flex items-center justify-center mr-4 shrink-0 text-fuchsia-600 dark:text-fuchsia-400 shadow-sm dark:shadow-[0_0_10px_rgba(217,70,239,0.2)]">
                                    <DollarSign size={20} />
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Salary</p>
                                    <p className="font-bold text-zinc-900 dark:text-white">{job.currency === 'USD' ? '$' : '₹'}{job.salary?.toLocaleString()} / year</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <span className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-500/20 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center mr-4 shrink-0 text-cyan-600 dark:text-cyan-400 shadow-sm dark:shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                                    <Calendar size={20} />
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Posted on</p>
                                    <p className="font-bold text-zinc-900 dark:text-white">{new Date(job.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            {job.deadline && (
                                <div className="flex items-start">
                                    <span className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-500/20 border border-rose-200 dark:border-rose-500/30 flex items-center justify-center mr-4 shrink-0 text-rose-600 dark:text-rose-400 shadow-sm dark:shadow-[0_0_10px_rgba(244,63,94,0.2)]">
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
                    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white/80 dark:bg-zinc-900/90 backdrop-blur-3xl border border-white/60 dark:border-white/10 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_0_40px_rgba(0,0,0,0.5)] w-full max-w-md p-6 relative overflow-hidden"
                        >
                            {/* Decorative modal glow */}
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-fuchsia-500/20 rounded-full blur-3xl"></div>

                            <div className="flex justify-between items-center mb-6 relative z-10">
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white drop-shadow-sm">Apply for this Job</h3>
                                <button onClick={() => setShowApplyModal(false)} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white text-2xl leading-none transition-colors">
                                    &times;
                                </button>
                            </div>

                            <form onSubmit={handleApply} className="space-y-5 relative z-10">
                                <div>
                                    <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 flex items-center">
                                        Upload Resume (PDF, DOC, DOCX) <span className="text-red-500 ml-1 text-2xl leading-none">*</span>
                                    </label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-zinc-300 dark:border-zinc-700 hover:border-indigo-500/50 border-dashed rounded-xl bg-zinc-50 dark:bg-black/30 hover:bg-zinc-100 dark:hover:bg-black/40 transition-all shadow-inner">
                                        <div className="space-y-1 text-center">
                                            <Upload className="mx-auto h-10 w-10 text-indigo-500/70 dark:text-indigo-400/70 shadow-none dark:drop-shadow-[0_0_5px_rgba(99,102,241,0.3)]" />
                                            <div className="flex text-sm text-zinc-500 dark:text-zinc-400 justify-center">
                                                <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 focus-within:outline-none flex justify-center items-center">
                                                    <span className="px-2 drop-shadow-sm">Click to select a file</span>
                                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files[0])} />
                                                </label>
                                            </div>
                                            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2 font-medium">
                                                {file ? <span className="text-fuchsia-600 dark:text-fuchsia-400 font-bold drop-shadow-sm">{file.name}</span> : "File should be < 5MB"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={!file || applying}
                                    className="w-full relative group overflow-hidden bg-indigo-50 dark:bg-indigo-600/20 border border-indigo-200 dark:border-indigo-500/50 text-indigo-600 dark:text-indigo-100 font-bold py-3 rounded-xl hover:shadow-md dark:hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <span className="relative z-10 group-hover:text-white transition-colors">{applying ? 'Submitting Application...' : 'Submit Application'}</span>
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
