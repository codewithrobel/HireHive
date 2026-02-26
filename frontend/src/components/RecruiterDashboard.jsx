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
                <motion.div variants={itemVariants} className="bg-white dark:bg-zinc-800 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm dark:border-zinc-200 p-6 flex flex-col justify-between hover:border-zinc-200 dark:hover:border-zinc-200 hover:bg-white dark:hover:bg-white transition-all relative overflow-hidden group">
                    
                    <div className="flex items-center space-x-4 mb-4 relative z-10">
                        <div className="p-3 bg-blue-50 dark:bg-zinc-800 border border-blue-100 dark:border-zinc-200 dark:border-zinc-800 text-blue-600 dark:text-blue-400 rounded-lg shadow-sm">
                            <Briefcase size={28} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Active Listings</p>
                        </div>
                    </div>
                    <h3 className="text-4xl font-extrabold text-zinc-900 dark:text-white drop-shadow-sm relative z-10">{loading ? '-' : myJobs.length}</h3>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white dark:bg-zinc-800 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm dark:border-zinc-200 p-6 flex flex-col justify-between hover:border-zinc-200 dark:hover:border-zinc-200 hover:bg-white dark:hover:bg-white transition-all relative overflow-hidden group">
                    
                    <div className="flex items-center space-x-4 mb-4 relative z-10">
                        <div className="p-3 bg-emerald-50 dark:bg-zinc-800 border border-emerald-100 dark:border-zinc-200 dark:border-zinc-800 text-emerald-600 dark:text-emerald-400 rounded-lg shadow-sm">
                            <Activity size={28} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Total Views</p>
                        </div>
                    </div>
                    <h3 className="text-4xl font-extrabold text-zinc-900 dark:text-white drop-shadow-sm relative z-10">--</h3>
                </motion.div>

                <motion.div variants={itemVariants} className="h-full">
                    <Link to="/post-job" className="bg-gradient-to-br from-blue-300/20 via-white/50 to-purple-300/20 dark:from-blue-900/40 dark:via-blue-600/30 dark:to-purple-900/40 border border-zinc-200 dark:border-zinc-800 dark:border-blue-200 dark:border-blue-800 bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-6 flex items-center justify-between text-zinc-900 dark:text-white  hover:border-white transition-all h-full group relative overflow-hidden">
                        
                        <div className="relative z-10">
                            <h3 className="text-xl font-extrabold mb-1 drop-shadow-sm group-hover:text-blue-700 dark:group-hover:text-blue-200 transition-colors">Post a New Job</h3>
                            <p className="text-blue-700/80 dark:text-blue-200/80 text-sm font-medium">Find your next great hire</p>
                        </div>
                        <PlusCircle size={36} className="text-blue-600 dark:text-blue-300 opacity-80 group-hover:text-blue-900 dark:group-hover:text-white group-hover:opacity-100 group-hover:rotate-90 transition-all duration-300 relative z-10 drop-shadow-md" />
                    </Link>
                </motion.div>
            </div>

            <motion.div variants={itemVariants} className="bg-white dark:bg-zinc-800 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm dark:border-zinc-200 p-8 overflow-hidden hover:border-zinc-200 dark:hover:border-zinc-200 transition-all">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white flex items-center drop-shadow-sm">
                        <div className="p-2 bg-blue-100 dark:bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-200 dark:border-blue-800 rounded-lg mr-3 shadow-sm">
                            <Users size={20} />
                        </div>
                        Your Recent Postings
                    </h2>
                </div>

                {loading ? (
                    <div className="py-16 flex justify-center"><div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-500 shadow-sm"></div></div>
                ) : myJobs.length === 0 ? (
                    <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-200 dark:border-zinc-800 shadow-inner">
                        <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                            <Briefcase className="text-zinc-400 dark:text-zinc-500" size={24} />
                        </div>
                        <p className="text-zinc-500 dark:text-zinc-400 font-medium text-lg mb-6">You haven't posted any jobs yet.</p>
                        <Link to="/post-job" className="px-6 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white hover:text-zinc-900 dark:hover:text-white transition-all shadow-sm inline-block">
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
                                className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-white dark:hover:bg-black/20 transition-colors rounded-lg px-4 -mx-4 cursor-default"
                            >
                                <div>
                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors drop-shadow-sm">{job.title}</h3>
                                    <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-3 mt-1.5 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
                                        <span className="flex items-center px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded text-zinc-600 dark:text-zinc-300 shadow-inner">{job.type}</span>
                                        <span className="text-zinc-300 dark:text-zinc-600">•</span>
                                        <span className="flex items-center"><MapPin size={14} className="mr-1 inline text-blue-500/80 dark:text-blue-400/80" /> {job.location}</span>
                                        <span className="text-zinc-300 dark:text-zinc-600">•</span>
                                        <span className="text-zinc-500">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <Link
                                    to={`/jobs/${job._id}/applicants`}
                                    className="px-5 py-2.5 bg-blue-50 dark:bg-blue-600/10 border border-blue-200 dark:border-blue-200 dark:border-blue-800 rounded-lg text-sm font-bold text-blue-600 dark:text-blue-300 hover:text-blue-900 dark:hover:text-white hover:border-blue-400 dark:hover:border-blue-400/80 shadow-sm hover:shadow-md dark:hover:shadow-sm flex items-center justify-center transition-all hover:bg-blue-100 dark:hover:bg-blue-600/30 group/btn"
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
