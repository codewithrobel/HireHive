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
                <motion.div variants={itemVariants} className="bg-white dark:bg-zinc-800 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm dark:border-zinc-200 p-6 hover:border-white dark:hover:border-zinc-200 hover:bg-white transition-all relative overflow-hidden group">
                    
                    <div className="relative z-10 flex items-center space-x-4 mb-6">
                        <div className="relative group/avatar">
                            {user?.profilePicture ? (
                                <img src={getFileUrl(user.profilePicture)} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-blue-200 dark:border-blue-200 dark:border-blue-800 shadow-sm" />
                            ) : (
                                <div className="bg-blue-50 dark:bg-zinc-800 p-3 rounded-full text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-zinc-200 dark:border-zinc-800 w-16 h-16 flex items-center justify-center">
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
                                        <span key={i} className="px-3 py-1 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg text-sm font-semibold border border-zinc-200 dark:border-zinc-800 dark:border-zinc-200 shadow-sm dark:shadow-none">
                                            {skill}
                                        </span>
                                    )) : <p className="text-sm font-medium text-zinc-500">No skills added yet</p>}
                                </div>
                            </div>

                            {user.experience && (
                                <div>
                                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 mt-4">Experience</h3>
                                    <p className="text-sm text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 dark:border-zinc-200 shadow-sm dark:shadow-none">{user.experience}</p>
                                </div>
                            )}

                            {user.profileInfo && (
                                <div>
                                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 mt-4">About Me</h3>
                                    <p className="text-sm text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 dark:border-zinc-200 shadow-sm dark:shadow-none">{user.profileInfo}</p>
                                </div>
                            )}

                            {(user.socialLinks?.linkedin || user.socialLinks?.github || user.socialLinks?.leetcode) && (
                                <div>
                                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 mt-4">Social Links</h3>
                                    <div className="flex flex-col gap-2">
                                        {user.socialLinks?.linkedin && <a href={user.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-sm text-blue-600 dark:text-blue-400 font-bold hover:underline truncate">LinkedIn Profile</a>}
                                        {user.socialLinks?.github && <a href={user.socialLinks.github} target="_blank" rel="noreferrer" className="text-sm text-blue-600 dark:text-blue-400 font-bold hover:underline truncate">GitHub Profile</a>}
                                        {user.socialLinks?.leetcode && <a href={user.socialLinks.leetcode} target="_blank" rel="noreferrer" className="text-sm text-blue-600 dark:text-blue-400 font-bold hover:underline truncate">LeetCode Profile</a>}
                                    </div>
                                </div>
                            )}

                            <button onClick={() => setIsEditingProfile(true)} className="w-full mt-8 py-2.5 bg-white dark:bg-zinc-800 border border-white dark:border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-300 font-bold hover:bg-white dark:hover:bg-white hover:text-zinc-900 dark:hover:text-white transition-all relative z-10 shadow-sm dark:shadow-none">
                                Edit Profile
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleProfileUpdate} className="space-y-4 relative z-10 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                            <div className="flex flex-col items-center justify-center mb-4">
                                <div className="relative w-20 h-20 mb-2">
                                    <img src={profilePicturePreview || (user?.profilePicture ? getFileUrl(user.profilePicture) : 'https://via.placeholder.com/150')} alt="Avatar Preview" className="w-20 h-20 rounded-full object-cover border-2 border-blue-200 dark:border-blue-200 dark:border-blue-800 shadow-sm" />
                                    <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1.5 cursor-pointer hover:bg-blue-700 transition shadow-sm">
                                        <Upload size={14} />
                                    </label>
                                    <input id="avatar-upload" type="file" accept="image/*" onChange={handleProfilePictureChange} className="hidden" />
                                </div>
                                <span className="text-xs font-bold text-zinc-500">Change Photo</span>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Name</label>
                                <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-400 dark:focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Skills (comma separated)</label>
                                <input type="text" value={profileForm.skills} onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })} className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-400 dark:focus:border-blue-500" placeholder="e.g. React, Node.js, MongoDB" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">LinkedIn URL</label>
                                <input type="url" value={profileForm.socialLinks.linkedin} onChange={(e) => setProfileForm({ ...profileForm, socialLinks: { ...profileForm.socialLinks, linkedin: e.target.value } })} className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-400 dark:focus:border-blue-500" placeholder="https://linkedin.com/in/..." />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">GitHub URL</label>
                                <input type="url" value={profileForm.socialLinks.github} onChange={(e) => setProfileForm({ ...profileForm, socialLinks: { ...profileForm.socialLinks, github: e.target.value } })} className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-400 dark:focus:border-blue-500" placeholder="https://github.com/..." />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">LeetCode URL</label>
                                <input type="url" value={profileForm.socialLinks.leetcode} onChange={(e) => setProfileForm({ ...profileForm, socialLinks: { ...profileForm.socialLinks, leetcode: e.target.value } })} className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-400 dark:focus:border-blue-500" placeholder="https://leetcode.com/..." />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Experience</label>
                                <textarea value={profileForm.experience} onChange={(e) => setProfileForm({ ...profileForm, experience: e.target.value })} className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 h-20" placeholder="E.g. 5 years in Frontend Dev." />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">About Me</label>
                                <textarea value={profileForm.profileInfo} onChange={(e) => setProfileForm({ ...profileForm, profileInfo: e.target.value })} className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 h-20" placeholder="Brief summary about yourself..." />
                            </div>

                            <div className="flex space-x-3 pt-2">
                                <button type="button" onClick={() => { setIsEditingProfile(false); setProfilePicturePreview(null); }} className="flex-1 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-500 dark:text-zinc-400 font-bold hover:bg-zinc-50 dark:hover:bg-white hover:text-zinc-900 dark:hover:text-white transition-all shadow-sm">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 py-2 bg-blue-50 dark:bg-blue-600/30 border border-blue-200 dark:border-blue-200 dark:border-blue-800 rounded-lg text-blue-600 dark:text-blue-100 font-bold hover:bg-blue-100 dark:hover:bg-blue-600/50 hover:text-blue-800 dark:hover:text-white transition-all shadow-sm">
                                    Save
                                </button>
                            </div>
                        </form>
                    )}
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white dark:bg-zinc-800 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm dark:border-zinc-200 p-6 hover:border-white dark:hover:border-zinc-200 hover:bg-white transition-all">
                    <h2 className="text-lg font-extrabold text-zinc-900 dark:text-white mb-5 flex items-center drop-shadow-sm">
                        <div className="p-2 bg-blue-100 dark:bg-blue-100 dark:bg-blue-900/40 rounded-lg text-blue-600 dark:text-blue-400 mr-3 border border-blue-200 dark:border-blue-200 dark:border-blue-800 shadow-sm">
                            <FileText size={20} />
                        </div>
                        Resume / CV <span className="text-red-500 ml-1 text-2xl leading-none">*</span>
                    </h2>
                    {user.resumeUrl ? (
                        <div className="mb-5 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-800 flex justify-between items-center group hover:bg-zinc-100 dark:hover:bg-black/40 hover:border-blue-200 dark:hover:border-blue-200 dark:border-blue-800 transition-all ">
                            <span className="text-sm text-zinc-700 dark:text-zinc-300 font-bold truncate group-hover:text-blue-600 dark:group-hover:text-blue-200 transition-colors">{user.resumeOriginalName || 'My_Resume.pdf'}</span>
                            <a href={getFileUrl(user.resumeUrl)} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-300 text-sm font-bold flex items-center bg-blue-50 dark:bg-blue-600/20 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-600/40 hover:text-blue-800 dark:hover:text-white transition-all shadow-sm">
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
                            className="block w-full text-sm text-zinc-500 dark:text-zinc-400 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-zinc-100 dark:file:bg-white file:text-zinc-700 dark:file:text-zinc-300 hover:file:bg-zinc-200 dark:hover:file:bg-white hover:file:text-zinc-900 dark:hover:file:text-white transition-colors cursor-pointer"
                        />
                        <button
                            type="submit"
                            disabled={!file || uploading}
                            className="w-full hover:bg-blue-600 hover:text-white transition-colors border border-blue-200 bg-blue-50 text-blue-600 dark:bg-blue-600/20 dark:text-blue-100  dark:bg-blue-600/20  dark:border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-100 py-3 rounded-lg font-bold transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md dark:hover:shadow-sm"
                        >
                            
                            <span className="relative z-10 flex items-center group-hover:text-white transition-colors">
                                {uploading ? 'Uploading...' : <><Upload size={18} className="mr-2" /> Upload CV</>}
                            </span>
                        </button>
                    </form>
                </motion.div>
            </div>

            <div className="lg:col-span-2 space-y-6">
                <motion.div variants={itemVariants} className="bg-white dark:bg-zinc-800 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm dark:border-zinc-200 p-8 hover:border-white dark:hover:border-zinc-200 hover:bg-white transition-all h-full">
                    <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-8 flex items-center drop-shadow-sm">
                        <div className="p-2.5 bg-blue-100 dark:bg-blue-100 dark:bg-blue-900/40 rounded-lg text-blue-600 dark:text-blue-400 mr-4 border border-blue-200 dark:border-blue-200 dark:border-blue-800 shadow-sm">
                            <Briefcase size={24} />
                        </div>
                        Applied Jobs
                        <span className="ml-3 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 text-sm font-bold rounded-full shadow-inner">
                            {applications.length}
                        </span>
                    </h2>

                    <div className="space-y-4">
                        {applications.length === 0 ? (
                            <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-200 dark:border-zinc-800 shadow-inner">
                                <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                                    <Briefcase className="text-zinc-400 dark:text-zinc-500" size={24} />
                                </div>
                                <p className="text-zinc-500 dark:text-zinc-400 font-medium text-lg">You haven't applied to any jobs yet.</p>
                                <button className="mt-4 text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300 dark:hover:drop-shadow-sm transition-all">Explore Jobs →</button>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {applications.map((app, index) => (
                                    <motion.div
                                        key={app._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="p-5 border border-zinc-200 dark:border-zinc-800 dark:border-zinc-200 rounded-lg  hover:border-blue-200 dark:hover:border-blue-200 dark:border-blue-800 transition-all bg-white dark:bg-zinc-800 flex flex-col sm:flex-row justify-between sm:items-center gap-4 group hover:bg-white"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-zinc-800 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xl border border-blue-100 dark:border-zinc-200 dark:border-zinc-800 shrink-0 group-hover:border-blue-300 dark:group-hover:border-blue-400/50 group-hover:shadow-sm dark:group-hover:shadow-sm transition-all">
                                                {app.job?.company?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors drop-shadow-sm">{app.job?.title || 'Unknown Job'}</h3>
                                                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-0.5 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">{app.job?.company || 'Unknown Company'} • {app.job?.location}</p>
                                            </div>
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-full text-sm font-bold border flex w-fit sm:w-auto justify-center items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 ${app.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-sm' :
                                            app.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-sm' :
                                                'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-sm'
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
