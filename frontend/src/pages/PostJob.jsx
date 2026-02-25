import { useForm } from 'react-hook-form';
import { useContext, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Upload } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const PostJob = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);

    if (!loading && (!user || user.role !== 'recruiter')) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                if (key === 'salary') {
                    formData.append(key, Number(data[key]));
                } else {
                    formData.append(key, data[key]);
                }
            });

            if (logoFile) {
                formData.append('companyLogo', logoFile);
            }

            await axios.post('/jobs', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success('Job posted successfully!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to post job');
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="bg-white/5 backdrop-blur-2xl rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.3)] border border-white/10 p-8 relative overflow-hidden">
                {/* Decorative glows */}
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="mb-8 relative z-10">
                    <h1 className="text-3xl font-extrabold text-white drop-shadow-sm tracking-tight">Post a New Job</h1>
                    <p className="text-zinc-400 mt-2 font-medium">Fill out the details below to create a new job listing.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-zinc-300 mb-1.5 ml-1">Job Title</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 bg-black/20 focus:bg-black/40 text-white placeholder-zinc-500 transition-all font-medium shadow-inner"
                                placeholder="e.g. Senior React Developer"
                                {...register('title', { required: 'Required' })}
                            />
                            {errors.title && <p className="text-rose-400 text-sm mt-1">{errors.title.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-zinc-300 mb-1.5 ml-1">Company Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 bg-black/20 focus:bg-black/40 text-white placeholder-zinc-500 transition-all font-medium shadow-inner"
                                placeholder="Acme Corp"
                                {...register('company', { required: 'Required' })}
                            />
                            {errors.company && <p className="text-rose-400 text-sm mt-1">{errors.company.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-zinc-300 mb-1.5 ml-1">Company Logo</label>
                            <div className="flex items-center space-x-4">
                                <div className="w-14 h-14 rounded-xl bg-black/20 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <Upload className="text-zinc-500 w-6 h-6" />
                                    )}
                                </div>
                                <label className="flex-1 cursor-pointer">
                                    <div className="w-full px-4 py-3.5 rounded-xl border border-white/10 hover:border-blue-500/50 bg-black/20 hover:bg-black/40 text-zinc-400 transition-all font-medium shadow-inner text-center">
                                        Select Image...
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleLogoChange}
                                    />
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-zinc-300 mb-1.5 ml-1">Location</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 bg-black/20 focus:bg-black/40 text-white placeholder-zinc-500 transition-all font-medium shadow-inner"
                                placeholder="e.g. New York, NY or Remote"
                                {...register('location', { required: 'Required' })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-zinc-300 mb-1.5 ml-1">Salary Amount (Annual)</label>
                            <div className="flex gap-2">
                                <select
                                    className="w-1/3 px-4 py-3.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 bg-black/20 focus:bg-black/40 text-white transition-all font-medium appearance-none shadow-inner"
                                    {...register('currency')}
                                >
                                    <option value="INR" className="bg-zinc-900 text-white">INR (₹)</option>
                                    <option value="USD" className="bg-zinc-900 text-white">USD ($)</option>
                                </select>
                                <input
                                    type="number"
                                    className="w-2/3 px-4 py-3.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 bg-black/20 focus:bg-black/40 text-white placeholder-zinc-500 transition-all font-medium shadow-inner"
                                    placeholder="e.g. 1200000"
                                    {...register('salary', { required: 'Required', min: 0 })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-zinc-300 mb-1.5 ml-1">Job Type</label>
                            <select
                                className="w-full px-4 py-3.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 bg-black/20 focus:bg-black/40 text-white transition-all font-medium shadow-inner appearance-none relative"
                                {...register('type')}
                            >
                                <option value="Full-time" className="bg-zinc-900 text-white">Full-time</option>
                                <option value="Part-time" className="bg-zinc-900 text-white">Part-time</option>
                                <option value="Contract" className="bg-zinc-900 text-white">Contract</option>
                                <option value="Internship" className="bg-zinc-900 text-white">Internship</option>
                                <option value="Remote" className="bg-zinc-900 text-white">Remote</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-zinc-300 mb-1.5 ml-1">Application Deadline</label>
                            <input
                                type="date"
                                className="w-full px-4 py-3.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 bg-black/20 focus:bg-black/40 text-white placeholder-zinc-500 transition-all font-medium shadow-inner"
                                {...register('deadline')}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-zinc-300 mb-1.5 ml-1">Experience Level</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 bg-black/20 focus:bg-black/40 text-white placeholder-zinc-500 transition-all font-medium shadow-inner"
                                placeholder="e.g. 3-5 years"
                                {...register('experience')}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-zinc-300 mb-1.5 ml-1">Required Skills (comma-separated)</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 bg-black/20 focus:bg-black/40 text-white placeholder-zinc-500 transition-all font-medium shadow-inner"
                            placeholder="React, Node.js, MongoDB"
                            {...register('skills')}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-zinc-300 mb-1.5 ml-1">Job Description</label>
                        <textarea
                            rows="6"
                            className="w-full px-4 py-3.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 bg-black/20 focus:bg-black/40 text-white placeholder-zinc-500 transition-all font-medium shadow-inner resize-y"
                            placeholder="Describe the role, responsibilities, and requirements..."
                            {...register('description', { required: 'Required' })}
                        ></textarea>
                    </div>

                    <div className="flex justify-end pt-6 space-x-4 border-t border-white/10 mt-8">
                        <button type="button" onClick={() => navigate('/dashboard')} className="px-6 py-3 font-bold text-zinc-400 hover:text-white transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="relative group overflow-hidden px-8 py-3 rounded-xl font-bold transition-all border border-blue-500/50 shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] bg-blue-600/20">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <span className="relative z-10 text-blue-100 group-hover:text-white drop-shadow-md transition-colors">Post Job</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostJob;
