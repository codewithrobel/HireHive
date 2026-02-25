import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft, Loader } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { forgotPassword } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            await forgotPassword(email);
            toast.success('Check your email for the OTP!');
            navigate('/reset-password', { state: { email } });
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
                        <Mail className="w-8 h-8 text-blue-500" />
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white drop-shadow-sm">Forgot Password?</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">No worries, we'll send you an OTP to reset it.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 ml-1">Email Address</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3.5 rounded-xl border border-zinc-300 dark:border-white/10 focus:border-blue-400/80 dark:focus:border-blue-500/50 focus:ring-blue-400/30 dark:focus:ring-blue-500/50 bg-zinc-50 dark:bg-black/20 focus:bg-white dark:focus:bg-black/40 focus:outline-none focus:ring-2 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 transition-all font-medium shadow-inner"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full relative group overflow-hidden bg-blue-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? <Loader className="animate-spin" size={20} /> : 'Send OTP'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <ArrowLeft size={16} />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
