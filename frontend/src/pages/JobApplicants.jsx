import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ChevronLeft, Download, CheckCircle, XCircle } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const JobApplicants = () => {
    const { id } = useParams();
    const [applications, setApplications] = useState([]);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user, getFileUrl } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                // Fetch job details to get title
                const jobRes = await axios.get(`/jobs/${id}`);
                setJob(jobRes.data);

                // Fetch applications
                const res = await axios.get(`/applications/job/${id}`);
                setApplications(res.data);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to fetch applicants');
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };

        if (user && user.role === 'recruiter') {
            fetchApplicants();
        } else {
            navigate('/dashboard');
        }
    }, [id, user, navigate]);

    const handleStatusUpdate = async (appId, newStatus) => {
        try {
            await axios.put(`/applications/${appId}/status`, { status: newStatus });
            setApplications(applications.map(app =>
                app._id === appId ? { ...app, status: newStatus } : app
            ));
            toast.success(`Applicant marked as ${newStatus}`);
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 text-zinc-700 dark:text-zinc-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <Link to="/dashboard" className="inline-flex items-center text-sm font-bold text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-white mb-6 transition-colors group">
                    <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                </Link>

                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight drop-shadow-sm">Applicants</h1>
                        <p className="text-blue-600 dark:text-blue-300 mt-1 text-lg font-medium">{job?.title} <span className="text-zinc-400 dark:text-zinc-500 mx-1">at</span> {job?.company}</p>
                    </div>
                    <div className="mt-4 md:mt-0 px-4 py-2 bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold rounded-xl border border-blue-200 dark:border-blue-500/30 shadow-sm dark:shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                        {applications.length} Total Applicants
                    </div>
                </div>

                <div className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/60 dark:border-white/10 overflow-hidden">
                    {applications.length === 0 ? (
                        <div className="p-16 text-center text-zinc-500 dark:text-zinc-400 font-medium text-lg bg-zinc-50 dark:bg-black/20 shadow-inner">
                            No applicants yet for this position.
                        </div>
                    ) : (
                        <div className="divide-y divide-white/40 dark:divide-white/10 bg-white/40 dark:bg-black/20">
                            {applications.map((app) => (
                                <div key={app._id} className="p-6 md:p-8 hover:bg-white/80 dark:hover:bg-black/40 transition-colors flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-3">
                                            <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white">{app.applicant.name}</h3>
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${app.status === 'Shortlisted' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30' :
                                                app.status === 'Rejected' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30' :
                                                    'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30'
                                                }`}>
                                                {app.status}
                                            </span>
                                        </div>
                                        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">{app.applicant.email}</p>

                                        {app.applicant.skills?.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {app.applicant.skills.map((skill, i) => (
                                                    <span key={i} className="px-2.5 py-1 bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 text-xs font-bold rounded-lg border border-zinc-200 dark:border-white/10 shadow-inner">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                                        <a
                                            href={getFileUrl(app.resumeUrl)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-full sm:w-auto px-5 py-2.5 flex items-center justify-center bg-white/80 dark:bg-white/5 border border-white dark:border-white/10 text-zinc-600 dark:text-zinc-300 font-bold rounded-xl hover:bg-white dark:hover:bg-white/10 hover:text-zinc-900 dark:hover:text-white transition-all shadow-sm dark:shadow-none"
                                        >
                                            <Download size={18} className="mr-2 text-blue-600 dark:text-blue-400" /> Resume
                                        </a>

                                        <div className="flex justify-end gap-3 w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-zinc-200 dark:border-white/10 pt-4 sm:pt-0 sm:pl-4">
                                            <button
                                                onClick={() => handleStatusUpdate(app._id, 'Shortlisted')}
                                                title="Shortlist"
                                                className="p-2.5 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 hover:text-emerald-700 dark:hover:text-emerald-300 rounded-xl transition-all border border-emerald-200 dark:border-emerald-500/30 shadow-sm"
                                            >
                                                <CheckCircle size={22} />
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(app._id, 'Rejected')}
                                                title="Reject"
                                                className="p-2.5 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 hover:text-rose-700 dark:hover:text-rose-300 rounded-xl transition-all border border-rose-200 dark:border-rose-500/30 shadow-sm"
                                            >
                                                <XCircle size={22} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobApplicants;
