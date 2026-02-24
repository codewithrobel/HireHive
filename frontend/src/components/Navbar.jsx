import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import ThemeContext from '../context/ThemeContext';
import { Briefcase, Sun, Moon, Info, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
    const { user, logout, getFileUrl } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="border-b bg-white/60 dark:bg-zinc-950/50 backdrop-blur-2xl border-white/50 dark:border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-none sticky top-0 z-50 transition-all duration-300"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center"
                    >
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2 group relative">
                            {/* Glowing effect behind icon */}
                            <div className="absolute inset-0 bg-indigo-500 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                            <div className="relative p-2 bg-indigo-50 dark:bg-white/5 rounded-xl border border-indigo-100 dark:border-white/10 group-hover:bg-indigo-100 dark:group-hover:bg-white/10 transition-colors shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                                <Briefcase className="h-7 w-7 text-indigo-400 group-hover:text-indigo-300" />
                            </div>
                            <span className="font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400 tracking-tight drop-shadow-sm">
                                HireHive
                            </span>
                        </Link>
                    </motion.div>
                    <div className="flex space-x-6 items-center">
                        <Link to="/about" className="p-2 mr-2 rounded-full bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors" title="About Us">
                            <Info size={20} />
                        </Link>
                        <button
                            onClick={toggleTheme}
                            className="p-2 mr-2 rounded-full bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <Link to="/" className="text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-white font-bold transition-all hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.3)] dark:hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">Home</Link>
                        <Link to="/jobs" className="text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-white font-bold transition-all hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.3)] dark:hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">Jobs</Link>

                        {user ? (
                            <>
                                <Link to="/dashboard" className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-white font-bold transition-all">
                                    {user.profilePicture ? (
                                        <img src={getFileUrl(user.profilePicture)} className="w-8 h-8 rounded-full border border-indigo-200 dark:border-indigo-500/50 shadow-sm object-cover" alt="Profile" />
                                    ) : (
                                        <UserCircle className="w-8 h-8 rounded-full text-indigo-400" />
                                    )}
                                    <span className="hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.3)] dark:hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">Dashboard</span>
                                </Link>

                                {user.role === 'admin' && (
                                    <Link to="/admin" className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold transition-all border border-indigo-200 dark:border-indigo-500/30 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 shadow-sm">
                                        <span className="hidden sm:inline">Admin Panel</span>
                                    </Link>
                                )}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={logout}
                                    className="bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-white/10 px-5 py-2.5 rounded-xl font-bold hover:bg-zinc-200 dark:hover:bg-white/10 hover:text-zinc-900 dark:hover:text-white transition-all shadow-sm"
                                >
                                    Logout
                                </motion.button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-white font-bold transition-all hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.3)] dark:hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">Login</Link>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link to="/register" className="relative group overflow-hidden px-6 py-2.5 rounded-xl font-bold transition-all inline-block bg-white dark:bg-white/5 border border-indigo-300 dark:border-indigo-500/30 hover:border-indigo-500 dark:hover:border-indigo-400/80">
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-fuchsia-500/10 dark:from-indigo-600/40 dark:to-fuchsia-600/40 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300 ease-out"></div>
                                        <span className="relative z-10 text-indigo-600 dark:text-indigo-300 group-hover:text-indigo-700 dark:group-hover:text-white transition-colors duration-300 dark:drop-shadow-[0_0_5px_rgba(99,102,241,0.5)]">Sign Up</span>
                                    </Link>
                                </motion.div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
