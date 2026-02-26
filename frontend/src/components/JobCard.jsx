import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Clock, Building } from 'lucide-react';
import { motion } from 'framer-motion';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const JobCard = ({ job, index = 0 }) => {
    const { getFileUrl } = useContext(AuthContext);

    // Safer date parsing
    const postedDate = job?.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Invalid Date';
    const deadlineDate = job?.deadline ? new Date(job.deadline).toLocaleDateString() : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 100 }}
            whileHover={{ y: -5 }}
            className="h-full relative group"
        >
            <Link to={`/jobs/${job._id}`} className="block group h-full relative z-10 w-full">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 h-full flex flex-col relative overflow-hidden">

                    {/* Subtle dynamic hover background */}
                    <div className="absolute inset-0 bg-blue-50/0 group-hover:bg-blue-50/50 dark:group-hover:bg-blue-900/10 transition-colors duration-300 pointer-events-none"></div>

                    <div className="flex justify-between items-start mb-5 relative z-10">
                        <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 bg-zinc-50 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 font-extrabold text-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm shrink-0 overflow-hidden">
                                {job.companyLogo ? (
                                    <img src={getFileUrl(job.companyLogo)} alt={`${job.company} Logo`} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                                ) : null}
                                <span style={{ display: job.companyLogo ? 'none' : 'block' }}>
                                    {job.company?.[0]?.toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">{job.title}</h3>
                                <p className="text-zinc-500 dark:text-zinc-400 text-sm flex items-center mt-1 font-medium">
                                    <Building size={14} className="mr-1.5 shrink-0 text-zinc-400 dark:text-zinc-500" /> {job.company}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-sm text-zinc-700 dark:text-zinc-300 mb-6 relative z-10">
                        <div className="flex items-center px-3 py-1.5 bg-zinc-100/50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 font-medium">
                            <MapPin size={14} className="mr-1.5 text-blue-500 dark:text-blue-400" />
                            {job.location}
                        </div>
                        <div className="flex items-center px-3 py-1.5 bg-zinc-100/50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 font-medium">
                            <DollarSign size={14} className="mr-1.5 text-emerald-500 dark:text-emerald-400" />
                            {job.currency === 'USD' ? '$' : '₹'}{job.salary?.toLocaleString()}
                        </div>
                        <div className="flex items-center px-3 py-1.5 bg-zinc-100/50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 font-medium">
                            <Clock size={14} className="mr-1.5 text-amber-500 dark:text-amber-400" />
                            {job.type}
                        </div>
                    </div>

                    <div className="space-y-5 mt-auto relative z-10">
                        <div className="flex gap-2 flex-wrap">
                            {job.skills?.slice(0, 3).map((skill, i) => (
                                <span key={i} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-bold rounded-full border border-blue-200 dark:border-blue-800">
                                    {skill}
                                </span>
                            ))}
                            {job.skills?.length > 3 && (
                                <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-bold rounded-full border border-zinc-200 dark:border-zinc-700">
                                    +{job.skills.length - 3}
                                </span>
                            )}
                        </div>

                        <div className="pt-5 flex justify-between items-center border-t border-zinc-200 dark:border-zinc-800">
                            <div className="flex flex-col">
                                <span className={`text-xs font-semibold ${postedDate === 'Invalid Date' ? 'text-rose-500' : 'text-zinc-500 dark:text-zinc-400'}`}>
                                    Posted: {postedDate !== 'Invalid Date' ? postedDate : 'Recently'}
                                </span>
                                {deadlineDate && deadlineDate !== 'Invalid Date' && (
                                    <span className="text-xs font-semibold text-rose-500 dark:text-rose-400 mt-0.5">
                                        Expires: {deadlineDate}
                                    </span>
                                )}
                            </div>
                            <span className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center group-hover:translate-x-1 transition-transform">
                                View Details
                                <span className="ml-1 inline-block">→</span>
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default JobCard;
