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
    const { register, verifyOTP, resendOTP } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isOtpStep, setIsOtpStep] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [captchaValue, setCaptchaValue] = useState('');

    useEffect(() => {
        if (!isOtpStep) {
            loadCaptchaEnginge(6, 'transparent');
        }
    }, [isOtpStep]);

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
            setRegisteredEmail(data.email);
            setIsOtpStep(true);
            toast.success(res.message || 'Registration successful! Please check your email for the OTP.');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
            setCaptchaValue('');
            loadCaptchaEnginge(6, 'transparent');
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        try {
            await verifyOTP(registeredEmail, otp);
            toast.success('Email verified successfully!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid OTP.');
        }
    };

    const handleResendOtp = async () => {
        try {
            await resendOTP(registeredEmail);
            toast.success('New OTP sent to your email.');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to resend OTP.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12 relative overflow-hidden text-zinc-700 dark:text-zinc-300">
            {/* Decorative background glows */}
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-md w-full bg-white/60 dark:bg-zinc-900/50 backdrop-blur-3xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_0_40px_rgba(0,0,0,0.5)] p-8 border border-white/60 dark:border-white/10 relative z-10 my-8">
                {isOtpStep ? (
                    <>
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-black/40 border border-zinc-200 dark:border-white/5 shadow-sm dark:shadow-[0_0_15px_rgba(99,102,241,0.2)] mb-6">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]"></div>
                            </div>
                            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white drop-shadow-sm">Verify Email</h2>
                            <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">Enter the 6-digit OTP sent to {registeredEmail}</p>
                        </div>

                        <form onSubmit={handleOtpSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 ml-1">One Time Password (OTP)</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3.5 rounded-xl border border-zinc-300 dark:border-white/10 focus:border-indigo-400/80 dark:focus:border-indigo-500/50 focus:ring-indigo-400/30 dark:focus:ring-indigo-500/50 bg-zinc-50 dark:bg-black/20 focus:bg-white dark:focus:bg-black/40 focus:outline-none focus:ring-2 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 transition-all font-medium shadow-inner tracking-widest text-center text-lg"
                                    placeholder="------"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    maxLength={6}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full relative group overflow-hidden bg-indigo-50 dark:bg-indigo-600/20 border border-indigo-200 dark:border-indigo-500/50 text-indigo-600 dark:text-indigo-100 font-bold py-3.5 rounded-xl transition-all shadow-sm dark:shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:shadow-md dark:hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] mt-6"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <span className="relative z-10 flex justify-center items-center group-hover:text-indigo-900 dark:group-hover:text-white transition-colors">Verify & Continue</span>
                            </button>
                        </form>

                        <p className="text-center mt-8 text-zinc-500 dark:text-zinc-400 font-medium">
                            Didn't receive the email?{' '}
                            <button onClick={handleResendOtp} type="button" className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors drop-shadow-sm">
                                Resend OTP
                            </button>
                        </p>
                    </>
                ) : (
                    <>
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-black/40 border border-zinc-200 dark:border-white/5 shadow-sm dark:shadow-[0_0_15px_rgba(99,102,241,0.2)] mb-6">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]"></div>
                            </div>
                            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white drop-shadow-sm">Create an Account</h2>
                            <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">Join us and find your dream job or perfect candidate</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 ml-1">Full Name</label>
                                <input
                                    type="text"
                                    className={`w-full px-4 py-3.5 rounded-xl border ${errors.name ? 'border-rose-500/50 focus:border-rose-500/50 focus:ring-rose-500/50' : 'border-zinc-300 dark:border-white/10 focus:border-indigo-400/80 dark:focus:border-indigo-500/50 focus:ring-indigo-400/30 dark:focus:ring-indigo-500/50'} bg-zinc-50 dark:bg-black/20 focus:bg-white dark:focus:bg-black/40 focus:outline-none focus:ring-2 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 transition-all font-medium shadow-inner`}
                                    placeholder="John Doe"
                                    {...registerField('name', { required: 'Name is required' })}
                                />
                                {errors.name && <p className="text-rose-600 dark:text-rose-400 text-sm mt-1.5 ml-1">{errors.name.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 ml-1">Email Address</label>
                                <input
                                    type="email"
                                    className={`w-full px-4 py-3.5 rounded-xl border ${errors.email ? 'border-rose-500/50 focus:border-rose-500/50 focus:ring-rose-500/50' : 'border-zinc-300 dark:border-white/10 focus:border-indigo-400/80 dark:focus:border-indigo-500/50 focus:ring-indigo-400/30 dark:focus:ring-indigo-500/50'} bg-zinc-50 dark:bg-black/20 focus:bg-white dark:focus:bg-black/40 focus:outline-none focus:ring-2 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 transition-all font-medium shadow-inner`}
                                    placeholder="you@example.com"
                                    {...registerField('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })}
                                />
                                {errors.email && <p className="text-rose-600 dark:text-rose-400 text-sm mt-1.5 ml-1">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 ml-1">Account Type</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <label className={`cursor-pointer border rounded-xl p-4 text-center transition-all ${watch('role') === 'seeker' ? 'border-indigo-400/80 dark:border-indigo-500/50 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'border-zinc-300 dark:border-white/10 hover:border-zinc-400 dark:hover:border-white/20 bg-zinc-50 dark:bg-black/20 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'}`}>
                                        <input type="radio" value="seeker" {...registerField('role')} className="hidden" />
                                        <span className={`font-bold drop-shadow-sm`}>Job Seeker</span>
                                    </label>
                                    <label className={`cursor-pointer border rounded-xl p-4 text-center transition-all ${watch('role') === 'recruiter' ? 'border-indigo-400/80 dark:border-indigo-500/50 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'border-zinc-300 dark:border-white/10 hover:border-zinc-400 dark:hover:border-white/20 bg-zinc-50 dark:bg-black/20 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'}`}>
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
                                        className={`w-full px-4 py-3.5 pr-12 rounded-xl border ${errors.password ? 'border-rose-500/50 focus:border-rose-500/50 focus:ring-rose-500/50' : 'border-zinc-300 dark:border-white/10 focus:border-indigo-400/80 dark:focus:border-indigo-500/50 focus:ring-indigo-400/30 dark:focus:ring-indigo-500/50'} bg-zinc-50 dark:bg-black/20 focus:bg-white dark:focus:bg-black/40 focus:outline-none focus:ring-2 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 transition-all font-medium shadow-inner`}
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
                                    <div className="captcha-container [&_canvas]:w-[200px] [&_canvas]:h-[50px] dark:[&_canvas]:invert dark:[&_canvas]:hue-rotate-180 [&_a]:mt-2 [&_a]:text-sm [&_a]:font-bold [&_a]:text-indigo-600 dark:[&_a]:text-indigo-400 hover:[&_a]:text-indigo-700 dark:hover:[&_a]:text-indigo-300 [&_a]:transition-colors [&_a]:decoration-transparent hover:[&_a]:underline">
                                        <LoadCanvasTemplate reloadText="⟳ Reload Captcha" />
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3.5 rounded-xl border border-zinc-300 dark:border-white/10 focus:border-indigo-400/80 dark:focus:border-indigo-500/50 focus:ring-indigo-400/30 dark:focus:ring-indigo-500/50 bg-zinc-50 dark:bg-black/20 focus:bg-white dark:focus:bg-black/40 focus:outline-none focus:ring-2 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 transition-all font-medium shadow-inner"
                                    placeholder="Enter Captcha Value"
                                    value={captchaValue}
                                    onChange={(e) => setCaptchaValue(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full relative group overflow-hidden bg-indigo-50 dark:bg-indigo-600/20 border border-indigo-200 dark:border-indigo-500/50 text-indigo-600 dark:text-indigo-100 font-bold py-3.5 rounded-xl transition-all shadow-sm dark:shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:shadow-md dark:hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] mt-6"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <span className="relative z-10 flex justify-center items-center group-hover:text-white transition-colors">Create Account</span>
                            </button>
                        </form>

                        <p className="text-center mt-8 text-zinc-500 dark:text-zinc-400 font-medium">
                            Already have an account?{' '}
                            <Link to="/login" className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors drop-shadow-sm">
                                Sign in
                            </Link>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default Register;
