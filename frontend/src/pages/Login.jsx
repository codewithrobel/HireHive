import { useForm } from 'react-hook-form';
import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login, verifyOTP, resendOTP } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isOtpStep, setIsOtpStep] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [captchaValue, setCaptchaValue] = useState('');
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

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
            await login(data.email, data.password);
            toast.success('Login successful!');
            navigate('/dashboard');
        } catch (error) {
            if (error.response?.data?.message === 'NOT_VERIFIED') {
                setRegisteredEmail(data.email);
                setIsOtpStep(true);
                try {
                    await resendOTP(data.email);
                    setTimer(60);
                    toast.success('Account not verified. A new OTP has been sent to your email.');
                } catch (resendError) {
                    toast.error('Failed to send verification OTP.');
                }
            } else {
                toast.error(error.response?.data?.message || 'Login failed. Please try again.');
                setCaptchaValue('');
                loadCaptchaEnginge(6, 'transparent');
            }
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
        if (timer > 0) return;
        try {
            await resendOTP(registeredEmail);
            setTimer(60);
            toast.success('New OTP sent to your email.');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to resend OTP.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 relative overflow-hidden text-zinc-700 dark:text-zinc-300">
            {/* Decorative background glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-md w-full bg-white/60 dark:bg-zinc-900/50 backdrop-blur-3xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_0_40px_rgba(0,0,0,0.5)] p-8 border border-white/60 dark:border-white/10 relative z-10 mt-10 mb-10">
                {isOtpStep ? (
                    <>
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-black/40 border border-zinc-200 dark:border-white/5 shadow-sm dark:shadow-[0_0_15px_rgba(99,102,241,0.2)] mb-6">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]"></div>
                            </div>
                            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white drop-shadow-sm">Verify Email</h2>
                            <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">Enter the 6-digit OTP sent to {registeredEmail}</p>
                            {timer > 0 && (
                                <p className="text-blue-600 dark:text-blue-400 mt-2 text-sm font-black tracking-widest bg-blue-50 dark:bg-blue-500/10 px-4 py-1.5 rounded-full inline-block">
                                    EXPIRING IN: {timer}s
                                </p>
                            )}
                        </div>

                        <form onSubmit={handleOtpSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 ml-1">One Time Password (OTP)</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3.5 rounded-xl border border-zinc-300 dark:border-white/10 focus:border-blue-400/80 dark:focus:border-blue-500/50 focus:ring-blue-400/30 dark:focus:ring-blue-500/50 bg-zinc-50 dark:bg-black/20 focus:bg-white dark:focus:bg-black/40 focus:outline-none focus:ring-2 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 transition-all font-medium shadow-inner tracking-widest text-center text-lg"
                                    placeholder="------"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    maxLength={6}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full relative group overflow-hidden bg-blue-50 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/50 text-blue-600 dark:text-blue-100 font-bold py-3.5 rounded-xl transition-all shadow-sm dark:shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:shadow-md dark:hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] mt-6"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <span className="relative z-10 flex justify-center items-center group-hover:text-blue-900 dark:group-hover:text-white transition-colors">Verify & Continue</span>
                            </button>
                        </form>

                        <p className="text-center mt-8 text-zinc-500 dark:text-zinc-400 font-medium">
                            Didn't receive the email?{' '}
                            <button
                                onClick={handleResendOtp}
                                disabled={timer > 0}
                                type="button"
                                className={`font-bold transition-colors drop-shadow-sm ${timer > 0 ? 'text-zinc-400 cursor-not-allowed' : 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'}`}
                            >
                                {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
                            </button>
                        </p>
                    </>
                ) : (
                    <>
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-black/40 border border-zinc-200 dark:border-white/5 shadow-sm dark:shadow-[0_0_15px_rgba(99,102,241,0.2)] mb-6">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]"></div>
                            </div>
                            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white drop-shadow-sm">Welcome Back</h2>
                            <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">Sign in to your account to continue</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 ml-1">Email Address</label>
                                <input
                                    type="email"
                                    className={`w-full px-4 py-3.5 rounded-xl border ${errors.email ? 'border-rose-500/50 focus:border-rose-500/50 focus:ring-rose-500/50' : 'border-zinc-300 dark:border-white/10 focus:border-blue-400/80 dark:focus:border-blue-500/50 focus:ring-blue-400/30 dark:focus:ring-blue-500/50'} bg-zinc-50 dark:bg-black/20 focus:bg-white dark:focus:bg-black/40 focus:outline-none focus:ring-2 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 transition-all font-medium shadow-inner`}
                                    placeholder="you@example.com"
                                    {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })}
                                />
                                {errors.email && <p className="text-rose-600 dark:text-rose-400 text-sm mt-1.5 ml-1">{errors.email.message}</p>}
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5 px-1">
                                    <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Password</label>
                                    <Link to="/forgot-password" title="Recover Password" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors drop-shadow-sm">Forgot password?</Link>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className={`w-full px-4 py-3.5 pr-12 rounded-xl border ${errors.password ? 'border-rose-500/50 focus:border-rose-500/50 focus:ring-rose-500/50' : 'border-zinc-300 dark:border-white/10 focus:border-blue-400/80 dark:focus:border-blue-500/50 focus:ring-blue-400/30 dark:focus:ring-blue-500/50'} bg-zinc-50 dark:bg-black/20 focus:bg-white dark:focus:bg-black/40 focus:outline-none focus:ring-2 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 transition-all font-medium shadow-inner`}
                                        placeholder="••••••••"
                                        {...register('password', { required: 'Password is required' })}
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
                                    {/* Appending invert on dark mode forces the canvas text to invert to white while keeping the transparent background */}
                                    <div className="captcha-container [&_canvas]:w-[200px] [&_canvas]:h-[50px] dark:[&_canvas]:invert dark:[&_canvas]:hue-rotate-180 [&_a]:mt-2 [&_a]:text-sm [&_a]:font-bold [&_a]:text-blue-600 dark:[&_a]:text-blue-400 hover:[&_a]:text-blue-700 dark:hover:[&_a]:text-blue-300 [&_a]:transition-colors [&_a]:decoration-transparent hover:[&_a]:underline">
                                        <LoadCanvasTemplate reloadText="⟳ Reload Captcha" />
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3.5 rounded-xl border border-zinc-300 dark:border-white/10 focus:border-blue-400/80 dark:focus:border-blue-500/50 focus:ring-blue-400/30 dark:focus:ring-blue-500/50 bg-zinc-50 dark:bg-black/20 focus:bg-white dark:focus:bg-black/40 focus:outline-none focus:ring-2 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 transition-all font-medium shadow-inner"
                                    placeholder="Enter Captcha Value"
                                    value={captchaValue}
                                    onChange={(e) => setCaptchaValue(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full relative group overflow-hidden bg-blue-50 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/50 text-blue-600 dark:text-blue-100 font-bold py-3.5 rounded-xl transition-all shadow-sm dark:shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:shadow-md dark:hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] mt-8"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <span className="relative z-10 flex justify-center items-center group-hover:text-white transition-colors">Sign in</span>
                            </button>
                        </form>

                        <p className="text-center mt-8 text-zinc-500 dark:text-zinc-400 font-medium">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors drop-shadow-sm">
                                Sign up
                            </Link>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default Login;
