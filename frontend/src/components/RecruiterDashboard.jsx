import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PlusCircle, Users, Briefcase, ChevronRight, Activity, MapPin } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';

const RecruiterDashboard = () => {
    const { user } = useContext(AuthContext);
    const [myJobs, setMyJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyJobs = async () => {
            try {
                const { data } = await axios.get(`/jobs?postedBy=${user._id}`);
                setMyJobs(data.jobs);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (user?._id) fetchMyJobs();
    }, [user]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
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
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div variants={itemVariants} className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/60 dark:border-white/10 p-6 flex flex-col justify-between hover:border-white/80 dark:hover:border-white/20 hover:bg-white/80 dark:hover:bg-white/5 transition-all relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700"></div>
                    <div className="flex items-center space-x-4 mb-4 relative z-10">
                        <div className="p-3 bg-indigo-50 dark:bg-black/30 border border-indigo-100 dark:border-white/5 text-indigo-600 dark:text-indigo-400 rounded-xl shadow-sm dark:shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                            <Briefcase size={28} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Active Listings</p>
                        </div>
                    </div>
                    <h3 className="text-4xl font-extrabold text-zinc-900 dark:text-white drop-shadow-sm relative z-10">{loading ? '-' : myJobs.length}</h3>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/60 dark:border-white/10 p-6 flex flex-col justify-between hover:border-white/80 dark:hover:border-white/20 hover:bg-white/80 dark:hover:bg-white/5 transition-all relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700"></div>
                    <div className="flex items-center space-x-4 mb-4 relative z-10">
                        <div className="p-3 bg-emerald-50 dark:bg-black/30 border border-emerald-100 dark:border-white/5 text-emerald-600 dark:text-emerald-400 rounded-xl shadow-sm dark:shadow-[0_0_15px_rgba(52,211,153,0.2)]">
                            <Activity size={28} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Total Views</p>
                        </div>
                    </div>
                    <h3 className="text-4xl font-extrabold text-zinc-900 dark:text-white drop-shadow-sm relative z-10">--</h3>
                </motion.div>

                <motion.div variants={itemVariants} className="h-full">
                    <Link to="/post-job" className="bg-gradient-to-br from-indigo-300/20 via-white/50 to-fuchsia-300/20 dark:from-indigo-900/40 dark:via-indigo-600/30 dark:to-fuchsia-900/40 border border-white/80 dark:border-indigo-500/30 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_0_20px_rgba(99,102,241,0.2)] p-6 flex items-center justify-between text-zinc-900 dark:text-white hover:shadow-[0_8px_30px_rgba(99,102,241,0.1)] dark:hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:border-white transition-all h-full group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent blur-md transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        <div className="relative z-10">
                            <h3 className="text-xl font-extrabold mb-1 drop-shadow-sm group-hover:text-indigo-700 dark:group-hover:text-indigo-200 transition-colors">Post a New Job</h3>
                            <p className="text-indigo-700/80 dark:text-indigo-200/80 text-sm font-medium">Find your next great hire</p>
                        </div>
                        <PlusCircle size={36} className="text-indigo-600 dark:text-indigo-300 opacity-80 group-hover:text-indigo-900 dark:group-hover:text-white group-hover:opacity-100 group-hover:rotate-90 transition-all duration-300 relative z-10 drop-shadow-md" />
                    </Link>
                </motion.div>
            </div>

            <motion.div variants={itemVariants} className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/60 dark:border-white/10 p-8 overflow-hidden hover:border-white/80 dark:hover:border-white/20 transition-all">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white flex items-center drop-shadow-sm">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 rounded-lg mr-3 shadow-sm dark:shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                            <Users size={20} />
                        </div>
                        Your Recent Postings
                    </h2>
                </div>

                {loading ? (
                    <div className="py-16 flex justify-center"><div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div></div>
                ) : myJobs.length === 0 ? (
                    <div className="text-center py-16 bg-zinc-50 dark:bg-black/20 rounded-2xl border border-dashed border-zinc-300 dark:border-white/10 shadow-inner">
                        <div className="w-16 h-16 bg-white dark:bg-black/40 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-200 dark:border-white/5 shadow-sm dark:shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                            <Briefcase className="text-zinc-400 dark:text-zinc-500" size={24} />
                        </div>
                        <p className="text-zinc-500 dark:text-zinc-400 font-medium text-lg mb-6">You haven't posted any jobs yet.</p>
                        <Link to="/post-job" className="px-6 py-3 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/10 hover:text-zinc-900 dark:hover:text-white transition-all shadow-sm inline-block">
                            Create your first listing
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-100 dark:divide-white/5 -mx-8 px-8">
                        {myJobs.map((job, index) => (
                            <motion.div
                                key={job._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-white/80 dark:hover:bg-black/20 transition-colors rounded-xl px-4 -mx-4 cursor-default"
                            >
                                <div>
                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors drop-shadow-sm">{job.title}</h3>
                                    <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-3 mt-1.5 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
                                        <span className="flex items-center px-2 py-0.5 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded text-zinc-600 dark:text-zinc-300 shadow-inner">{job.type}</span>
                                        <span className="text-zinc-300 dark:text-zinc-600">•</span>
                                        <span className="flex items-center"><MapPin size={14} className="mr-1 inline text-indigo-500/80 dark:text-indigo-400/80" /> {job.location}</span>
                                        <span className="text-zinc-300 dark:text-zinc-600">•</span>
                                        <span className="text-zinc-500">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <Link
                                    to={`/jobs/${job._id}/applicants`}
                                    className="px-5 py-2.5 bg-indigo-50 dark:bg-indigo-600/10 border border-indigo-200 dark:border-indigo-500/30 rounded-xl text-sm font-bold text-indigo-600 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-white hover:border-indigo-400 dark:hover:border-indigo-400/80 shadow-sm dark:shadow-[0_0_10px_rgba(99,102,241,0.1)] hover:shadow-md dark:hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] flex items-center justify-center transition-all hover:bg-indigo-100 dark:hover:bg-indigo-600/30 group/btn"
                                >
                                    View Applicants <ChevronRight size={16} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default RecruiterDashboard;
