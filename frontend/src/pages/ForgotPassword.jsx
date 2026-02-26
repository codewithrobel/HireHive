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
            
            

            <div className="max-w-md w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm p-8 dark:border-zinc-200 relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 shadow-sm mb-6">
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
                            className="w-full px-4 py-3.5 rounded-lg border border-zinc-300 dark:border-zinc-200 dark:border-zinc-800 focus:border-blue-400/80 dark:focus:border-blue-200 dark:border-blue-800 focus:ring-blue-400/30 dark:focus:ring-blue-500/50 bg-zinc-50 dark:bg-zinc-800 focus:bg-white dark:focus:bg-black/40 focus:outline-none focus:ring-2 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 transition-all font-medium shadow-inner"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full hover:bg-blue-600 hover:text-white transition-colors border border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-600/20 dark:text-blue-100 bg-blue-600 text-white font-bold py-3.5 rounded-lg transition-all shadow-lg shadow-sm hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
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
