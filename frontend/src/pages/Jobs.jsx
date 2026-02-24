import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, SlidersHorizontal, Loader } from 'lucide-react';
import JobCard from '../components/JobCard';
import { motion } from 'framer-motion';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Filters
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');
    const [type, setType] = useState('');
    const [skills, setSkills] = useState('');
    const [minSalary, setMinSalary] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                let url = `/jobs?pageNumber=${page}`;
                if (keyword) url += `&keyword=${keyword}`;
                if (location) url += `&location=${location}`;
                if (type) url += `&type=${type}`;
                if (skills) url += `&skills=${skills}`;
                if (minSalary) url += `&minSalary=${minSalary}`;

                const { data } = await axios.get(url);
                setJobs(data.jobs);
                setTotalPages(data.pages);
            } catch (error) {
                console.error('Error fetching jobs', error);
            } finally {
                setLoading(false);
            }
        };
        // Debounce simple
        const delayBounceFn = setTimeout(() => {
            fetchJobs();
        }, 300);
        return () => clearTimeout(delayBounceFn);
    }, [keyword, location, type, skills, minSalary, page]);

    return (
        <div className="min-h-screen pb-12 overflow-x-hidden text-zinc-700 dark:text-zinc-300">
            <div className="py-24 px-4 sm:px-6 lg:px-8 border-b border-zinc-200 dark:border-white/10 relative overflow-hidden">
                {/* Decorative background circles */}
                <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-3xl transform -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-fuchsia-500/10 rounded-full blur-3xl transform translate-y-1/2"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-900 via-indigo-600 to-indigo-500 dark:from-white dark:via-indigo-200 dark:to-indigo-400 text-center mb-6 drop-shadow-lg tracking-tight"
                    >
                        Find Your Dream Job
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-indigo-800/80 dark:text-indigo-200/80 text-center max-w-2xl mx-auto text-lg md:text-xl mb-12 font-medium"
                    >
                        Discover thousands of job opportunities matching your skills and expertise.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
                        className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl p-3 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-2xl max-w-4xl mx-auto flex flex-col gap-3 border border-white/60 dark:border-white/10 relative z-20"
                    >
                        <div className="flex flex-col md:flex-row gap-3">
                            <div className="flex-1 flex items-center px-4 bg-white/70 dark:bg-black/20 rounded-xl border border-white dark:border-white/5 focus-within:border-indigo-400 focus-within:bg-white dark:focus-within:border-indigo-500/50 dark:focus-within:bg-black/40 focus-within:shadow-[0_0_15px_rgba(99,102,241,0.15)] transition-all duration-300 shadow-sm dark:shadow-none">
                                <Search className="text-indigo-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Job title or keywords..."
                                    className="w-full bg-transparent px-3 py-3.5 outline-none text-zinc-900 dark:text-white font-semibold placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                                    value={keyword}
                                    onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
                                />
                            </div>
                            <div className="flex-1 flex items-center px-4 bg-white/70 dark:bg-black/20 rounded-xl border border-white dark:border-white/5 focus-within:border-indigo-400 focus-within:bg-white dark:focus-within:border-indigo-500/50 dark:focus-within:bg-black/40 focus-within:shadow-[0_0_15px_rgba(99,102,241,0.15)] transition-all duration-300 shadow-sm dark:shadow-none">
                                <MapPin className="text-indigo-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Location..."
                                    className="w-full bg-transparent px-3 py-3.5 outline-none text-zinc-900 dark:text-white font-semibold placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                                    value={location}
                                    onChange={(e) => { setLocation(e.target.value); setPage(1); }}
                                />
                            </div>
                            <select
                                className="bg-white/70 dark:bg-black/20 rounded-xl px-4 py-3.5 outline-none text-zinc-900 dark:text-white border border-white dark:border-white/5 focus:border-indigo-400 focus:bg-white dark:focus:border-indigo-500/50 dark:focus:bg-black/40 focus:shadow-[0_0_15px_rgba(99,102,241,0.15)] transition-all duration-300 md:w-48 appearance-none cursor-pointer font-semibold shadow-sm dark:shadow-none"
                                value={type}
                                onChange={(e) => { setType(e.target.value); setPage(1); }}
                            >
                                <option value="" className="bg-white dark:bg-zinc-900">All Types</option>
                                <option value="Full-time" className="bg-white dark:bg-zinc-900">Full-time</option>
                                <option value="Part-time" className="bg-white dark:bg-zinc-900">Part-time</option>
                                <option value="Contract" className="bg-white dark:bg-zinc-900">Contract</option>
                                <option value="Internship" className="bg-white dark:bg-zinc-900">Internship</option>
                                <option value="Remote" className="bg-white dark:bg-zinc-900">Remote</option>
                            </select>
                        </div>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="flex flex-col md:flex-row gap-3"
                            >
                                <div className="flex-1 flex items-center px-4 bg-white/70 dark:bg-black/20 rounded-xl border border-white dark:border-white/5 focus-within:border-indigo-400 focus-within:bg-white dark:focus-within:border-indigo-500/50 dark:focus-within:bg-black/40 focus-within:shadow-[0_0_15px_rgba(99,102,241,0.15)] transition-all duration-300 shadow-sm dark:shadow-none">
                                    <input
                                        type="text"
                                        placeholder="Skills (e.g. React, Node.js)"
                                        className="w-full bg-transparent px-3 py-3.5 outline-none text-zinc-900 dark:text-white font-semibold placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                                        value={skills}
                                        onChange={(e) => { setSkills(e.target.value); setPage(1); }}
                                    />
                                </div>
                                <div className="flex-1 flex items-center px-4 bg-white/70 dark:bg-black/20 rounded-xl border border-white dark:border-white/5 focus-within:border-indigo-400 focus-within:bg-white dark:focus-within:border-indigo-500/50 dark:focus-within:bg-black/40 focus-within:shadow-[0_0_15px_rgba(99,102,241,0.15)] transition-all duration-300 shadow-sm dark:shadow-none">
                                    <span className="text-zinc-400 font-semibold pl-2">$</span>
                                    <input
                                        type="number"
                                        placeholder="Minimum Salary"
                                        className="w-full bg-transparent px-3 py-3.5 outline-none text-zinc-900 dark:text-white font-semibold placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                                        value={minSalary}
                                        onChange={(e) => { setMinSalary(e.target.value); setPage(1); }}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight flex items-center">
                        Latest Opportunities
                        <span className="ml-3 px-3 py-1 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 text-sm font-bold rounded-full shadow-sm dark:shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                            {jobs.length} Results
                        </span>
                    </h2>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center text-sm font-bold text-zinc-600 dark:text-zinc-300 bg-white dark:bg-white/5 px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/10 hover:text-zinc-900 dark:hover:text-white transition-all shadow-sm"
                    >
                        <SlidersHorizontal size={16} className="mr-2 text-indigo-500 dark:text-indigo-400" /> Filters
                    </motion.button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-32">
                        <Loader className="animate-spin text-indigo-500 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]" size={40} />
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-32 bg-white dark:bg-white/5 backdrop-blur-md rounded-3xl border border-zinc-200 dark:border-white/10 shadow-xl">
                        <div className="bg-indigo-50 dark:bg-indigo-500/20 shadow-sm dark:shadow-[0_0_20px_rgba(99,102,241,0.2)] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-200 dark:border-indigo-500/30">
                            <Search className="text-indigo-500 dark:text-indigo-400" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">No jobs found</h3>
                        <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-lg">Try adjusting your search or filters to find what you're looking for.</p>
                        <button
                            onClick={() => { setKeyword(''); setLocation(''); setType(''); setSkills(''); setMinSalary(''); }}
                            className="mt-8 px-6 py-2.5 bg-indigo-50 dark:bg-indigo-600/20 border border-indigo-200 dark:border-indigo-500/50 text-indigo-600 dark:text-indigo-300 rounded-xl font-bold hover:bg-indigo-100 dark:hover:bg-indigo-600/40 hover:text-indigo-800 dark:hover:text-white transition-all shadow-sm dark:shadow-[0_0_10px_rgba(99,102,241,0.3)]"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {jobs.map((job, index) => (
                                <JobCard key={job._id} job={job} index={index} />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center mt-16 space-x-3">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    className="px-5 py-2.5 border border-zinc-200 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 backdrop-blur-sm text-zinc-600 dark:text-zinc-300 font-bold hover:bg-zinc-50 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm transition-colors"
                                >
                                    Previous
                                </button>
                                <span className="flex items-center px-4 font-bold text-zinc-900 dark:text-white">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    disabled={page === totalPages}
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    className="px-5 py-2.5 border border-zinc-200 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 backdrop-blur-sm text-zinc-600 dark:text-zinc-300 font-bold hover:bg-zinc-50 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Jobs;
