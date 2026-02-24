import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Clock, Building } from 'lucide-react';
import { motion } from 'framer-motion';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const JobCard = ({ job, index = 0 }) => {
    const { getFileUrl } = useContext(AuthContext);
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 100 }}
            whileHover={{ y: -5 }}
            className="h-full relative group"
        >
            {/* Glowing border effect under the card */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-300/40 to-fuchsia-300/40 dark:from-indigo-500/30 dark:to-fuchsia-500/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <Link to={`/jobs/${job._id}`} className="block group h-full relative z-10 w-full">
                <div className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/60 dark:border-white/10 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-none group-hover:bg-white/80 dark:group-hover:bg-white/10 group-hover:border-white/80 dark:group-hover:border-indigo-500/50 group-hover:shadow-[0_8px_30px_rgba(99,102,241,0.1)] transition-all duration-300 h-full flex flex-col relative overflow-hidden backdrop-saturate-150">
                    {/* Decorative gradient blob inside card */}
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-fuchsia-500/5 dark:from-indigo-500/20 dark:to-fuchsia-500/10 rounded-full blur-2xl opacity-50 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700"></div>

                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 bg-white/80 dark:bg-black/40 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-extrabold text-2xl border border-white dark:border-white/5 shadow-sm dark:shadow-inner shrink-0 group-hover:scale-110 group-hover:border-indigo-200 dark:group-hover:border-indigo-400/50 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.15)] dark:group-hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all duration-300 overflow-hidden">
                                {job.companyLogo ? (
                                    <img src={getFileUrl(job.companyLogo)} alt={`${job.company} Logo`} className="w-full h-full object-cover" />
                                ) : (
                                    job.company.charAt(0)
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors line-clamp-1 drop-shadow-sm">{job.title}</h3>
                                <p className="text-zinc-500 dark:text-zinc-400 text-sm flex items-center mt-1 font-medium group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
                                    <Building size={14} className="mr-1.5 shrink-0 text-zinc-400 dark:text-zinc-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors" /> {job.company}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-sm text-zinc-700 dark:text-zinc-300 mb-6 relative z-10">
                        <div className="flex items-center px-3 py-1.5 bg-white/50 dark:bg-black/30 rounded-lg border border-white/60 dark:border-white/5 font-medium group-hover:border-white/80 dark:group-hover:border-white/10 transition-colors shadow-sm dark:shadow-none">
                            <MapPin size={14} className="mr-1.5 text-indigo-500 dark:text-indigo-400 drop-shadow-[0_0_5px_rgba(99,102,241,0.2)] dark:drop-shadow-[0_0_5px_rgba(99,102,241,0.5)]" />
                            {job.location}
                        </div>
                        <div className="flex items-center px-3 py-1.5 bg-white/50 dark:bg-black/30 rounded-lg border border-white/60 dark:border-white/5 font-medium group-hover:border-white/80 dark:group-hover:border-white/10 transition-colors shadow-sm dark:shadow-none">
                            <DollarSign size={14} className="mr-1.5 text-emerald-500 dark:text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.2)] dark:drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]" />
                            {job.salary?.toLocaleString()}
                        </div>
                        <div className="flex items-center px-3 py-1.5 bg-white/50 dark:bg-black/30 rounded-lg border border-white/60 dark:border-white/5 font-medium group-hover:border-white/80 dark:group-hover:border-white/10 transition-colors shadow-sm dark:shadow-none">
                            <Clock size={14} className="mr-1.5 text-amber-500 dark:text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.2)] dark:drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]" />
                            {job.type}
                        </div>
                    </div>

                    <div className="space-y-5 mt-auto relative z-10">
                        <div className="flex gap-2 flex-wrap">
                            {job.skills?.slice(0, 3).map((skill, i) => (
                                <span key={i} className="px-3 py-1 bg-white/80 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 text-xs font-bold rounded-full border border-white dark:border-indigo-500/30 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/20 shadow-sm dark:shadow-none transition-all">
                                    {skill}
                                </span>
                            ))}
                            {job.skills?.length > 3 && (
                                <span className="px-3 py-1 bg-white/50 dark:bg-white/5 text-zinc-600 dark:text-zinc-300 text-xs font-bold rounded-full border border-white/60 dark:border-white/10 shadow-sm dark:shadow-none">
                                    +{job.skills.length - 3}
                                </span>
                            )}
                        </div>

                        <div className="pt-5 flex justify-between items-center border-t border-zinc-200 dark:border-white/10">
                            <span className="text-xs font-semibold text-zinc-500">
                                Posted {new Date(job.createdAt).toLocaleDateString()}
                            </span>
                            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center group-hover:text-indigo-700 dark:group-hover:text-indigo-300 group-hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.4)] dark:group-hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.8)] transition-all">
                                View Details
                                <motion.span
                                    className="ml-1 inline-block"
                                    initial={{ x: 0, opacity: 0 }}
                                    whileInView={{ x: 4, opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    →
                                </motion.span>
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default JobCard;
