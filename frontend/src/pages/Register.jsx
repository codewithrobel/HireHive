import { useForm } from 'react-hook-form';
import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';

const Register = () => {
    const { register: registerField, handleSubmit, formState: { errors }, watch } = useForm({
        defaultValues: {
            role: 'seeker'
        }
    });
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [captchaValue, setCaptchaValue] = useState('');

    useEffect(() => {
        loadCaptchaEnginge(6, 'transparent');
    }, []);

    const onSubmit = async (data) => {
        if (!validateCaptcha(captchaValue)) {
            toast.error('Invalid Captcha. Please try again.');
            setCaptchaValue('');
            loadCaptchaEnginge(6, 'transparent');
            return;
        }

        try {
            const res = await register({
                name: data.name,
                email: data.email,
                password: data.password,
                role: data.role
            });
            toast.success(res.message || 'Registration successful!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
            setCaptchaValue('');
            loadCaptchaEnginge(6, 'transparent');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12 relative overflow-hidden text-zinc-700 dark:text-zinc-300">
            {/* Decorative background glows */}
            
            

            <div className="max-w-md w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm p-8 dark:border-zinc-200 relative z-10 my-8">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 shadow-sm mb-6">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 shadow-sm"></div>
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white drop-shadow-sm">Create an Account</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">Join us and find your dream job or perfect candidate</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 ml-1">Full Name</label>
                        <input
                            type="text"
                            className={`w-full px-4 py-3.5 rounded-lg border ${errors.name ? 'border-rose-500/50 focus:border-rose-500/50 focus:ring-rose-500/50' : 'border-zinc-300 dark:border-zinc-200 dark:border-zinc-800 focus:border-blue-400/80 dark:focus:border-blue-200 dark:border-blue-800 focus:ring-blue-400/30 dark:focus:ring-blue-500/50'} bg-zinc-50 dark:bg-zinc-800 focus:bg-white dark:focus:bg-black/40 focus:outline-none focus:ring-2 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 transition-all font-medium shadow-inner`}
                            placeholder="John Doe"
                            {...registerField('name', { required: 'Name is required' })}
                        />
                        {errors.name && <p className="text-rose-600 dark:text-rose-400 text-sm mt-1.5 ml-1">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 ml-1">Email Address</label>
                        <input
                            type="email"
                            className={`w-full px-4 py-3.5 rounded-lg border ${errors.email ? 'border-rose-500/50 focus:border-rose-500/50 focus:ring-rose-500/50' : 'border-zinc-300 dark:border-zinc-200 dark:border-zinc-800 focus:border-blue-400/80 dark:focus:border-blue-200 dark:border-blue-800 focus:ring-blue-400/30 dark:focus:ring-blue-500/50'} bg-zinc-50 dark:bg-zinc-800 focus:bg-white dark:focus:bg-black/40 focus:outline-none focus:ring-2 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 transition-all font-medium shadow-inner`}
                            placeholder="you@example.com"
                            {...registerField('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })}
                        />
                        {errors.email && <p className="text-rose-600 dark:text-rose-400 text-sm mt-1.5 ml-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 ml-1">Account Type</label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className={`cursor-pointer border rounded-lg p-4 text-center transition-all ${watch('role') === 'seeker' ? 'border-blue-400/80 dark:border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 shadow-sm' : 'border-zinc-300 dark:border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'}`}>
                                <input type="radio" value="seeker" {...registerField('role')} className="hidden" />
                                <span className={`font-bold drop-shadow-sm`}>Job Seeker</span>
                            </label>
                            <label className={`cursor-pointer border rounded-lg p-4 text-center transition-all ${watch('role') === 'recruiter' ? 'border-blue-400/80 dark:border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 shadow-sm' : 'border-zinc-300 dark:border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'}`}>
                                <input type="radio" value="recruiter" {...registerField('role')} className="hidden" />
                                <span className={`font-bold drop-shadow-sm`}>Recruiter</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 ml-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className={`w-full px-4 py-3.5 pr-12 rounded-lg border ${errors.password ? 'border-rose-500/50 focus:border-rose-500/50 focus:ring-rose-500/50' : 'border-zinc-300 dark:border-zinc-200 dark:border-zinc-800 focus:border-blue-400/80 dark:focus:border-blue-200 dark:border-blue-800 focus:ring-blue-400/30 dark:focus:ring-blue-500/50'} bg-zinc-50 dark:bg-zinc-800 focus:bg-white dark:focus:bg-black/40 focus:outline-none focus:ring-2 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 transition-all font-medium shadow-inner`}
                                placeholder="••••••••"
                                {...registerField('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.password && <p className="text-rose-600 dark:text-rose-400 text-sm mt-1.5 ml-1">{errors.password.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 ml-1">Security Verification</label>
                        <div className="p-2 mb-3 flex flex-col items-center justify-center min-h-[70px]">
                            <div className="captcha-container [&_canvas]:w-[200px] [&_canvas]:h-[50px] dark:[&_canvas]:invert dark:[&_canvas]:hue-rotate-180 [&_a]:mt-2 [&_a]:text-sm [&_a]:font-bold [&_a]:text-blue-600 dark:[&_a]:text-blue-400 hover:[&_a]:text-blue-700 dark:hover:[&_a]:text-blue-300 [&_a]:transition-colors [&_a]:decoration-transparent hover:[&_a]:underline">
                                <LoadCanvasTemplate reloadText="⟳ Reload Captcha" />
                            </div>
                        </div>
                        <input
                            type="text"
                            className="w-full px-4 py-3.5 rounded-lg border border-zinc-300 dark:border-zinc-200 dark:border-zinc-800 focus:border-blue-400/80 dark:focus:border-blue-200 dark:border-blue-800 focus:ring-blue-400/30 dark:focus:ring-blue-500/50 bg-zinc-50 dark:bg-zinc-800 focus:bg-white dark:focus:bg-black/40 focus:outline-none focus:ring-2 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 transition-all font-medium shadow-inner"
                            placeholder="Enter Captcha Value"
                            value={captchaValue}
                            onChange={(e) => setCaptchaValue(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full hover:bg-blue-600 hover:text-white transition-colors border border-blue-200 bg-blue-50 text-blue-600 dark:bg-blue-600/20 dark:text-blue-100  dark:bg-blue-600/20  dark:border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-100 font-bold py-3.5 rounded-lg transition-all shadow-sm hover:shadow-md dark:hover:shadow-sm mt-6"
                    >
                        
                        <span className="relative z-10 flex justify-center items-center group-hover:text-white transition-colors">Create Account</span>
                    </button>
                </form>

                <p className="text-center mt-8 text-zinc-500 dark:text-zinc-400 font-medium">
                    Already have an account?{' '}
                    <Link to="/login" className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors drop-shadow-sm">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
