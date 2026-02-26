import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Users, Briefcase, Trash2, LayoutDashboard, Clock } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        // Kick them out if not admin
        if (!user || user.role !== 'admin') {
            toast.error('Unauthorized access');
            navigate('/');
            return;
        }

        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, jobsRes] = await Promise.all([
                axios.get('/admin/users'),
                axios.get('/admin/jobs')
            ]);
            setUsers(usersRes.data);
            setJobs(jobsRes.data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch admin data');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user? This will also delete all their jobs and applications. This action cannot be undone.')) {
            try {
                await axios.delete(`/admin/users/${id}`);
                toast.success('User deleted successfully');
                setUsers(users.filter(u => u._id !== id));
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete user');
            }
        }
    };

    const handleDeleteJob = async (id) => {
        if (window.confirm('Are you sure you want to delete this job posting?')) {
            try {
                await axios.delete(`/admin/jobs/${id}`);
                toast.success('Job deleted successfully');
                setJobs(jobs.filter(j => j._id !== id));
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete job');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-80px)] bg-zinc-50 dark:bg-zinc-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-80px)] bg-zinc-50 dark:bg-zinc-900 pt-8 pb-16 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header section */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 mb-8 shadow-sm flex items-center justify-between">
                    <div>
                        <div className="inline-flex items-center justify-center p-3 rounded-lg bg-blue-50 dark:bg-blue-100 dark:bg-blue-900/40 mb-4 border border-blue-100 dark:border-blue-200 dark:border-blue-800 shadow-sm relative overflow-hidden group">
                            <LayoutDashboard className="w-8 h-8 text-blue-600 dark:text-blue-400 relative z-10" />
                        </div>
                        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2 tracking-tight">Admin Portal</h1>
                        <p className="text-zinc-500 dark:text-zinc-400 font-medium">Manage all platform users and job listings from one place.</p>
                    </div>

                    <div className="hidden md:flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-100 dark:bg-blue-900/40 px-4 py-2 rounded-lg border border-blue-100 dark:border-blue-200 dark:border-blue-800 shadow-sm">
                            <Clock size={16} />
                            <span>{currentTime.toLocaleTimeString()}</span>
                        </div>
                        <div className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-400 dark:text-zinc-500 mr-1">
                            Real-time Portal
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg px-6 py-4 text-center shadow-inner">
                            <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{users.length}</div>
                            <div className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Total Users</div>
                        </div>
                        <div className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg px-6 py-4 text-center shadow-inner">
                            <div className="text-2xl font-black text-purple-600 dark:text-purple-400">{jobs.length}</div>
                            <div className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Total Jobs</div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-zinc-200 dark:border-zinc-800 mb-6">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex items-center gap-2 pb-4 px-6 font-bold transition-all text-lg ${activeTab === 'users'
                            ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 drop-shadow-sm'
                            : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                            }`}
                    >
                        <Users size={20} />
                        Manage Users
                    </button>
                    <button
                        onClick={() => setActiveTab('jobs')}
                        className={`flex items-center gap-2 pb-4 px-6 font-bold transition-all text-lg ${activeTab === 'jobs'
                            ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 drop-shadow-sm'
                            : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                            }`}
                    >
                        <Briefcase size={20} />
                        Manage Jobs
                    </button>
                </div>

                {/* Content Area */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden shadow-sm">
                    {activeTab === 'users' ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-800">
                                        <th className="py-4 px-6 font-bold text-zinc-600 dark:text-zinc-300">Name</th>
                                        <th className="py-4 px-6 font-bold text-zinc-600 dark:text-zinc-300">Email</th>
                                        <th className="py-4 px-6 font-bold text-zinc-600 dark:text-zinc-300">Role</th>
                                        <th className="py-4 px-6 font-bold text-zinc-600 dark:text-zinc-300 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u) => (
                                        <tr key={u._id} className="border-b border-zinc-100 dark:border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-white transition-colors">
                                            <td className="py-4 px-6 text-zinc-900 dark:text-white font-medium">{u.name}</td>
                                            <td className="py-4 px-6 text-zinc-500 dark:text-zinc-400">{u.email}</td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-100 dark:bg-purple-900/40 dark:text-purple-300' :
                                                    u.role === 'recruiter' ? 'bg-blue-100 text-blue-700 dark:bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300' :
                                                        'bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
                                                    }`}>
                                                    {u.role.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <button
                                                    onClick={() => handleDeleteUser(u._id)}
                                                    disabled={u.email === user.email}
                                                    className={`p-2 rounded-lg transition-all ${u.email === user.email
                                                        ? 'text-zinc-300 dark:text-zinc-700 cursor-not-allowed'
                                                        : 'text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10'
                                                        }`}
                                                    title={u.email === user.email ? "You cannot delete yourself" : "Delete User"}
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="py-8 text-center text-zinc-500 dark:text-zinc-400 italic">No users found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-800">
                                        <th className="py-4 px-6 font-bold text-zinc-600 dark:text-zinc-300">Job Title</th>
                                        <th className="py-4 px-6 font-bold text-zinc-600 dark:text-zinc-300">Company</th>
                                        <th className="py-4 px-6 font-bold text-zinc-600 dark:text-zinc-300">Employer</th>
                                        <th className="py-4 px-6 font-bold text-zinc-600 dark:text-zinc-300 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobs.map((job) => (
                                        <tr key={job._id} className="border-b border-zinc-100 dark:border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-white transition-colors">
                                            <td className="py-4 px-6 text-zinc-900 dark:text-white font-medium">{job.title}</td>
                                            <td className="py-4 px-6 text-zinc-500 dark:text-zinc-400">{job.company}</td>
                                            <td className="py-4 px-6 text-zinc-500 dark:text-zinc-400">{job.postedBy?.name || 'Unknown'}</td>
                                            <td className="py-4 px-6 text-right">
                                                <button
                                                    onClick={() => handleDeleteJob(job._id)}
                                                    className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                                                    title="Delete Job"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {jobs.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="py-8 text-center text-zinc-500 dark:text-zinc-400 italic">No jobs posted yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
