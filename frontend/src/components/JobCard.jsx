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
            

            <Link to={`/jobs/${job._id}`} className="block group h-full relative z-10 w-full">
                <div className="bg-white dark:bg-zinc-800 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg dark:border-zinc-200 p-6 shadow-sm dark:shadow-none group-hover:bg-white dark:group-hover:bg-white group-hover:border-zinc-200 dark:group-hover:border-blue-200 dark:border-blue-800 group-hover:shadow-sm transition-all duration-300 h-full flex flex-col relative overflow-hidden backdrop-saturate-150">
                    {/* Decorative gradient blob inside card */}
                    

                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 bg-white dark:bg-zinc-800 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 font-extrabold text-2xl border border-white dark:border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-inner shrink-0 group-hover:scale-110 group-hover:border-blue-200 dark:group-hover:border-blue-400/50 group-hover:shadow-sm dark:group-hover:shadow-sm transition-all duration-300 overflow-hidden">
                                {job.companyLogo ? (
                                    <img src={getFileUrl(job.companyLogo)} alt={`${job.company} Logo`} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                                ) : null}
                                <span style={{ display: job.companyLogo ? 'none' : 'block' }}>
                                    {job.company?.[0]?.toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors line-clamp-1 drop-shadow-sm">{job.title}</h3>
                                <p className="text-zinc-500 dark:text-zinc-400 text-sm flex items-center mt-1 font-medium group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
                                    <Building size={14} className="mr-1.5 shrink-0 text-zinc-400 dark:text-zinc-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" /> {job.company}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-sm text-zinc-700 dark:text-zinc-300 mb-6 relative z-10">
                        <div className="flex items-center px-3 py-1.5 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-800 dark:border-zinc-200 font-medium group-hover:border-zinc-200 dark:group-hover:border-zinc-200 transition-colors shadow-sm dark:shadow-none">
                            <MapPin size={14} className="mr-1.5 text-blue-500 dark:text-blue-400 drop-shadow-sm dark:drop-shadow-sm" />
                            {job.location}
                        </div>
                        <div className="flex items-center px-3 py-1.5 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-800 dark:border-zinc-200 font-medium group-hover:border-zinc-200 dark:group-hover:border-zinc-200 transition-colors shadow-sm dark:shadow-none">
                            <DollarSign size={14} className="mr-1.5 text-emerald-500 dark:text-emerald-400 drop-shadow-sm dark:drop-shadow-sm" />
                            {job.currency === 'USD' ? '$' : '₹'}{job.salary?.toLocaleString()}
                        </div>
                        <div className="flex items-center px-3 py-1.5 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-800 dark:border-zinc-200 font-medium group-hover:border-zinc-200 dark:group-hover:border-zinc-200 transition-colors shadow-sm dark:shadow-none">
                            <Clock size={14} className="mr-1.5 text-amber-500 dark:text-amber-400 drop-shadow-sm dark:drop-shadow-sm" />
                            {job.type}
                        </div>
                    </div>

                    <div className="space-y-5 mt-auto relative z-10">
                        <div className="flex gap-2 flex-wrap">
                            {job.skills?.slice(0, 3).map((skill, i) => (
                                <span key={i} className="px-3 py-1 bg-white dark:bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 text-xs font-bold rounded-full border border-white dark:border-blue-200 dark:border-blue-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-100 shadow-sm dark:shadow-none transition-all">
                                    {skill}
                                </span>
                            ))}
                            {job.skills?.length > 3 && (
                                <span className="px-3 py-1 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-bold rounded-full border border-zinc-200 dark:border-zinc-800 dark:border-zinc-200 shadow-sm dark:shadow-none">
                                    +{job.skills.length - 3}
                                </span>
                            )}
                        </div>

                        <div className="pt-5 flex justify-between items-center border-t border-zinc-200 dark:border-zinc-800">
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-zinc-500">
                                    Posted: {new Date(job.createdAt).toLocaleDateString()}
                                </span>
                                {job.deadline && (
                                    <span className="text-xs font-semibold text-rose-500 dark:text-rose-400 mt-0.5">
                                        Expires: {new Date(job.deadline).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                            <span className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center group-hover:text-blue-700 dark:group-hover:text-blue-300 group-hover:drop-shadow-sm dark:group-hover:drop-shadow-sm transition-all">
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
