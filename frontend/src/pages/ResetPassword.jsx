import { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';
import { KeyRound, Eye, EyeOff, Loader } from 'lucide-react';

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { resetPassword } = useContext(AuthContext);

    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timer, setTimer] = useState(60);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const { resendOTP } = useContext(AuthContext);

    const handleResendOtp = async () => {
        if (timer > 0) return;
        try {
            await resendOTP(email);
            setTimer(60);
            toast.success('New OTP sent to your email.');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to resend OTP.');
        }
    };

    const email = location.state?.email;

    if (!email) {
        navigate('/forgot-password');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return toast.error("Passwords don't match");
        }

        if (password.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        try {
            setIsSubmitting(true);
            await resetPassword(email, otp, password);
            toast.success('Password updated successfully! Please login.');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 relative overflow-hidden text-zinc-700 dark:text-zinc-300">
            {/* Decorative background glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-md w-full bg-white/60 dark:bg-zinc-900/50 backdrop-blur-3xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_0_40px_rgba(0,0,0,0.5)] p-8 border border-white/60 dark:border-white/10 relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-black/40 border border-zinc-200 dark:border-white/5 shadow-sm dark:shadow-[0_0_15px_rgba(99,102,241,0.2)] mb-6">
                        <KeyRound className="w-8 h-8 text-blue-500" />
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white drop-shadow-sm">Reset Password</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">OTP sent to {email}</p>
                    {timer > 0 && (
                        <p className="text-blue-600 dark:text-blue-400 mt-2 text-sm font-black tracking-widest bg-blue-50 dark:bg-blue-500/10 px-4 py-1.5 rounded-full inline-block">
                            EXPIRING IN: {timer}s
                        </p>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 ml-1">6-Digit OTP</label>
                        <input
                            type="text"
                            maxLength={6}
                            className="w-full px-4 py-3.5 text-center text-lg tracking-widest rounded-xl border border-zinc-300 dark:border-white/10 focus:border-blue-400/80 dark:focus:border-blue-500/50 bg-zinc-50 dark:bg-black/20 focus:outline-none focus:ring-2 text-zinc-900 dark:text-white transition-all font-bold shadow-inner"
                            placeholder="------"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 ml-1">New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full px-4 py-3.5 pr-12 rounded-xl border border-zinc-300 dark:border-white/10 focus:border-blue-400/80 dark:focus:border-blue-500/50 bg-zinc-50 dark:bg-black/20 focus:outline-none focus:ring-2 text-zinc-900 dark:text-white transition-all font-medium shadow-inner"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 ml-1">Confirm New Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3.5 rounded-xl border border-zinc-300 dark:border-white/10 focus:border-blue-400/80 dark:focus:border-blue-500/50 bg-zinc-50 dark:bg-black/20 focus:outline-none focus:ring-2 text-zinc-900 dark:text-white transition-all font-medium shadow-inner"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full relative group overflow-hidden bg-blue-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 mt-2"
                    >
                        {isSubmitting ? <Loader className="animate-spin" size={20} /> : 'Reset Password'}
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
            </div>
        </div>
    );
};

export default ResetPassword;
