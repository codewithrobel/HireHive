import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AuthContext from '../context/AuthContext';
import { Upload, Briefcase, UserCircle, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const SeekerDashboard = () => {
    const { user, setUser, getFileUrl } = useContext(AuthContext);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [applications, setApplications] = useState([]);

    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profilePictureFile, setProfilePictureFile] = useState(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState(null);
    const [profileForm, setProfileForm] = useState({
        name: user?.name || '',
        skills: user?.skills?.join(', ') || '',
        experience: user?.experience || '',
        profileInfo: user?.profileInfo || '',
        socialLinks: {
            linkedin: user?.socialLinks?.linkedin || '',
            github: user?.socialLinks?.github || '',
            leetcode: user?.socialLinks?.leetcode || ''
        }
    });

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const { data } = await axios.get('/applications/my-applications');
            setApplications(data);
        } catch (error) {
            toast.error('Failed to load applications');
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return toast.error('Please select a file');

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('resume', file);

            const res = await axios.post('/auth/resume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setUser({ ...user, resumeUrl: res.data.resumeUrl, resumeOriginalName: res.data.resumeOriginalName });
            toast.success('Resume uploaded successfully');
            setFile(null);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to upload CV');
        } finally {
            setUploading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', profileForm.name);
            formData.append('skills', profileForm.skills);
            formData.append('experience', profileForm.experience);
            formData.append('profileInfo', profileForm.profileInfo);
            formData.append('socialLinks', JSON.stringify(profileForm.socialLinks));

            if (profilePictureFile) {
                formData.append('profilePicture', profilePictureFile);
            }

            const res = await axios.put('/auth/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setUser(res.data);
            setIsEditingProfile(false);
            setProfilePictureFile(null);
            setProfilePicturePreview(null);
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePictureFile(file);
            setProfilePicturePreview(URL.createObjectURL(file));
        }
    };

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
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
            <div className="lg:col-span-1 space-y-6">
                <motion.div variants={itemVariants} className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/60 dark:border-white/10 p-6 hover:border-white dark:hover:border-white/20 hover:bg-white/80 transition-all relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
                    <div className="relative z-10 flex items-center space-x-4 mb-6">
                        <div className="relative group/avatar">
                            {user?.profilePicture ? (
                                <img src={getFileUrl(user.profilePicture)} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200 dark:border-indigo-500/50 shadow-sm dark:shadow-[0_0_15px_rgba(99,102,241,0.2)]" />
                            ) : (
                                <div className="bg-indigo-50 dark:bg-black/30 p-3 rounded-full text-indigo-600 dark:text-indigo-400 shadow-sm dark:shadow-[0_0_15px_rgba(99,102,241,0.2)] border border-indigo-100 dark:border-white/5 w-16 h-16 flex items-center justify-center">
                                    <UserCircle size={32} />
                                </div>
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white drop-shadow-sm">{user.name || 'My Profile'}</h2>
                            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{user.email}</p>
                        </div>
                    </div>

                    {!isEditingProfile ? (
                        <div className="space-y-4 relative z-10">
                            <div>
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {user.skills?.length > 0 ? user.skills.map((skill, i) => (
                                        <span key={i} className="px-3 py-1 bg-white/60 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 rounded-lg text-sm font-semibold border border-white/80 dark:border-white/10 shadow-sm dark:shadow-none">
                                            {skill}
                                        </span>
                                    )) : <p className="text-sm font-medium text-zinc-500">No skills added yet</p>}
                                </div>
                            </div>

                            {user.experience && (
                                <div>
                                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 mt-4">Experience</h3>
                                    <p className="text-sm text-zinc-700 dark:text-zinc-300 bg-white/50 dark:bg-white/5 p-3 rounded-xl border border-white/80 dark:border-white/10 shadow-sm dark:shadow-none">{user.experience}</p>
                                </div>
                            )}

                            {user.profileInfo && (
                                <div>
                                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 mt-4">About Me</h3>
                                    <p className="text-sm text-zinc-700 dark:text-zinc-300 bg-white/50 dark:bg-white/5 p-3 rounded-xl border border-white/80 dark:border-white/10 shadow-sm dark:shadow-none">{user.profileInfo}</p>
                                </div>
                            )}

                            {(user.socialLinks?.linkedin || user.socialLinks?.github || user.socialLinks?.leetcode) && (
                                <div>
                                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 mt-4">Social Links</h3>
                                    <div className="flex flex-col gap-2">
                                        {user.socialLinks?.linkedin && <a href={user.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 dark:text-indigo-400 font-bold hover:underline truncate">LinkedIn Profile</a>}
                                        {user.socialLinks?.github && <a href={user.socialLinks.github} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 dark:text-indigo-400 font-bold hover:underline truncate">GitHub Profile</a>}
                                        {user.socialLinks?.leetcode && <a href={user.socialLinks.leetcode} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 dark:text-indigo-400 font-bold hover:underline truncate">LeetCode Profile</a>}
                                    </div>
                                </div>
                            )}

                            <button onClick={() => setIsEditingProfile(true)} className="w-full mt-8 py-2.5 bg-white/80 dark:bg-white/5 border border-white dark:border-white/10 rounded-xl text-zinc-600 dark:text-zinc-300 font-bold hover:bg-white dark:hover:bg-white/10 hover:text-zinc-900 dark:hover:text-white transition-all relative z-10 shadow-sm dark:shadow-none">
                                Edit Profile
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleProfileUpdate} className="space-y-4 relative z-10 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                            <div className="flex flex-col items-center justify-center mb-4">
                                <div className="relative w-20 h-20 mb-2">
                                    <img src={profilePicturePreview || (user?.profilePicture ? getFileUrl(user.profilePicture) : 'https://via.placeholder.com/150')} alt="Avatar Preview" className="w-20 h-20 rounded-full object-cover border-2 border-indigo-200 dark:border-indigo-500/50 shadow-sm" />
                                    <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-1.5 cursor-pointer hover:bg-indigo-700 transition shadow-sm">
                                        <Upload size={14} />
                                    </label>
                                    <input id="avatar-upload" type="file" accept="image/*" onChange={handleProfilePictureChange} className="hidden" />
                                </div>
                                <span className="text-xs font-bold text-zinc-500">Change Photo</span>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Name</label>
                                <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className="w-full bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Skills (comma separated)</label>
                                <input type="text" value={profileForm.skills} onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })} className="w-full bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-500" placeholder="e.g. React, Node.js, MongoDB" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">LinkedIn URL</label>
                                <input type="url" value={profileForm.socialLinks.linkedin} onChange={(e) => setProfileForm({ ...profileForm, socialLinks: { ...profileForm.socialLinks, linkedin: e.target.value } })} className="w-full bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-500" placeholder="https://linkedin.com/in/..." />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">GitHub URL</label>
                                <input type="url" value={profileForm.socialLinks.github} onChange={(e) => setProfileForm({ ...profileForm, socialLinks: { ...profileForm.socialLinks, github: e.target.value } })} className="w-full bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-500" placeholder="https://github.com/..." />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">LeetCode URL</label>
                                <input type="url" value={profileForm.socialLinks.leetcode} onChange={(e) => setProfileForm({ ...profileForm, socialLinks: { ...profileForm.socialLinks, leetcode: e.target.value } })} className="w-full bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-500" placeholder="https://leetcode.com/..." />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Experience</label>
                                <textarea value={profileForm.experience} onChange={(e) => setProfileForm({ ...profileForm, experience: e.target.value })} className="w-full bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-500 h-20" placeholder="E.g. 5 years in Frontend Dev." />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">About Me</label>
                                <textarea value={profileForm.profileInfo} onChange={(e) => setProfileForm({ ...profileForm, profileInfo: e.target.value })} className="w-full bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-500 h-20" placeholder="Brief summary about yourself..." />
                            </div>

                            <div className="flex space-x-3 pt-2">
                                <button type="button" onClick={() => { setIsEditingProfile(false); setProfilePicturePreview(null); }} className="flex-1 py-2 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl text-zinc-500 dark:text-zinc-400 font-bold hover:bg-zinc-50 dark:hover:bg-white/10 hover:text-zinc-900 dark:hover:text-white transition-all shadow-sm">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 py-2 bg-indigo-50 dark:bg-indigo-600/30 border border-indigo-200 dark:border-indigo-500/50 rounded-xl text-indigo-600 dark:text-indigo-100 font-bold hover:bg-indigo-100 dark:hover:bg-indigo-600/50 hover:text-indigo-800 dark:hover:text-white transition-all shadow-sm">
                                    Save
                                </button>
                            </div>
                        </form>
                    )}
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/60 dark:border-white/10 p-6 hover:border-white dark:hover:border-white/20 hover:bg-white/80 transition-all">
                    <h2 className="text-lg font-extrabold text-zinc-900 dark:text-white mb-5 flex items-center drop-shadow-sm">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg text-indigo-600 dark:text-indigo-400 mr-3 border border-indigo-200 dark:border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                            <FileText size={20} />
                        </div>
                        Resume / CV <span className="text-red-500 ml-1 text-2xl leading-none">*</span>
                    </h2>
                    {user.resumeUrl ? (
                        <div className="mb-5 p-4 bg-zinc-50 dark:bg-black/20 rounded-xl border border-zinc-200 dark:border-white/5 flex justify-between items-center group hover:bg-zinc-100 dark:hover:bg-black/40 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all hover:shadow-sm dark:hover:shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                            <span className="text-sm text-zinc-700 dark:text-zinc-300 font-bold truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-200 transition-colors">{user.resumeOriginalName || 'My_Resume.pdf'}</span>
                            <a href={getFileUrl(user.resumeUrl)} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-300 text-sm font-bold flex items-center bg-indigo-50 dark:bg-indigo-600/20 px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-500/30 hover:bg-indigo-100 dark:hover:bg-indigo-600/40 hover:text-indigo-800 dark:hover:text-white transition-all shadow-sm">
                                View
                            </a>
                        </div>
                    ) : (
                        <p className="text-sm font-medium text-zinc-500 mb-5">You haven't uploaded a resume yet.</p>
                    )}

                    <form onSubmit={handleUpload} className="space-y-4">
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-zinc-500 dark:text-zinc-400 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-zinc-100 dark:file:bg-white/10 file:text-zinc-700 dark:file:text-zinc-300 hover:file:bg-zinc-200 dark:hover:file:bg-white/20 hover:file:text-zinc-900 dark:hover:file:text-white transition-colors cursor-pointer"
                        />
                        <button
                            type="submit"
                            disabled={!file || uploading}
                            className="w-full relative group overflow-hidden bg-indigo-50 dark:bg-indigo-600/20 border border-indigo-200 dark:border-indigo-500/50 text-indigo-600 dark:text-indigo-100 py-3 rounded-xl font-bold transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md dark:hover:shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <span className="relative z-10 flex items-center group-hover:text-white transition-colors">
                                {uploading ? 'Uploading...' : <><Upload size={18} className="mr-2" /> Upload CV</>}
                            </span>
                        </button>
                    </form>
                </motion.div>
            </div>

            <div className="lg:col-span-2 space-y-6">
                <motion.div variants={itemVariants} className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/60 dark:border-white/10 p-8 hover:border-white dark:hover:border-white/20 hover:bg-white/80 transition-all h-full">
                    <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-8 flex items-center drop-shadow-sm">
                        <div className="p-2.5 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl text-indigo-600 dark:text-indigo-400 mr-4 border border-indigo-200 dark:border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                            <Briefcase size={24} />
                        </div>
                        Applied Jobs
                        <span className="ml-3 px-3 py-1 bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-white/10 text-sm font-bold rounded-full shadow-inner">
                            {applications.length}
                        </span>
                    </h2>

                    <div className="space-y-4">
                        {applications.length === 0 ? (
                            <div className="text-center py-16 bg-zinc-50 dark:bg-black/20 rounded-2xl border border-dashed border-zinc-300 dark:border-white/10 shadow-inner">
                                <div className="w-16 h-16 bg-white dark:bg-black/40 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-200 dark:border-white/5 shadow-sm dark:shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                                    <Briefcase className="text-zinc-400 dark:text-zinc-500" size={24} />
                                </div>
                                <p className="text-zinc-500 dark:text-zinc-400 font-medium text-lg">You haven't applied to any jobs yet.</p>
                                <button className="mt-4 text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-700 dark:hover:text-indigo-300 dark:hover:drop-shadow-[0_0_5px_rgba(99,102,241,0.8)] transition-all">Explore Jobs →</button>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {applications.map((app, index) => (
                                    <motion.div
                                        key={app._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="p-5 border border-white/80 dark:border-white/10 rounded-xl hover:shadow-[0_8px_30px_rgba(99,102,241,0.1)] dark:hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] hover:border-indigo-200 dark:hover:border-indigo-500/50 transition-all bg-white/70 dark:bg-black/20 flex flex-col sm:flex-row justify-between sm:items-center gap-4 group hover:bg-white"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-black/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xl border border-indigo-100 dark:border-white/5 shrink-0 group-hover:border-indigo-300 dark:group-hover:border-indigo-400/50 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] dark:group-hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all">
                                                {app.job?.company?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors drop-shadow-sm">{app.job?.title || 'Unknown Job'}</h3>
                                                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-0.5 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">{app.job?.company || 'Unknown Company'} • {app.job?.location}</p>
                                            </div>
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-full text-sm font-bold border flex w-fit sm:w-auto justify-center items-center backdrop-blur-sm ${app.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(251,191,36,0.1)]' :
                                            app.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(52,211,153,0.1)]' :
                                                'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.1)]'
                                            }`}>
                                            <span className="w-2 h-2 rounded-full mr-2 currentColor bg-current opacity-75 drop-shadow-sm"></span>
                                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default SeekerDashboard;
