import { Link, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import ThemeContext from '../context/ThemeContext';
import { Briefcase, Sun, Moon, Info, UserCircle, Menu, X, LogOut, LayoutDashboard, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout, getFileUrl } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    // Close menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Jobs', path: '/jobs' },
        { name: 'About', path: '/about' },
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="border-b bg-white/70 dark:bg-zinc-950/70 backdrop-blur-2xl border-white/50 dark:border-white/10 shadow-sm sticky top-0 z-[60] transition-all duration-300"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center"
                    >
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2 group relative">
                            <div className="relative p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl border border-indigo-100 dark:border-indigo-500/20 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 transition-all shadow-sm">
                                <Briefcase className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />
                            </div>
                            <span className="font-black text-2xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-400 dark:from-white dark:via-indigo-200 dark:to-indigo-400 tracking-tight">
                                HireHive
                            </span>
                        </Link>
                    </motion.div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8 items-center">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-sm font-bold transition-all hover:text-indigo-600 dark:hover:text-white ${location.pathname === link.path ? 'text-indigo-600 dark:text-white' : 'text-zinc-600 dark:text-zinc-400'}`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="h-6 w-px bg-zinc-200 dark:bg-white/10 mx-2"></div>

                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10 transition-all"
                        >
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link to="/dashboard" className="flex items-center gap-2 group">
                                    <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-transparent group-hover:border-indigo-500/50 transition-all">
                                        {user.profilePicture ? (
                                            <img src={getFileUrl(user.profilePicture)} className="w-full h-full object-cover" alt="Profile" />
                                        ) : (
                                            <div className="w-full h-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                                <UserCircle size={24} />
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">Dash</span>
                                </Link>

                                <button
                                    onClick={logout}
                                    className="px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-zinc-50 dark:text-zinc-900 text-sm font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all shadow-md active:scale-95"
                                >
                                    Log Out
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="px-5 py-2.5 text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-white transition-colors">
                                    Login
                                </Link>
                                <Link to="/register" className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="flex md:hidden items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-300"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-zinc-100 dark:border-white/5 bg-white dark:bg-zinc-950 overflow-hidden"
                    >
                        <div className="px-4 py-8 space-y-6">
                            <div className="space-y-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className={`block text-lg font-bold px-4 py-3 rounded-2xl transition-all ${location.pathname === link.path ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-white' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5'}`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>

                            <div className="h-px bg-zinc-100 dark:bg-white/5 mx-4"></div>

                            {user ? (
                                <div className="space-y-4">
                                    <Link to="/dashboard" className="flex items-center gap-4 px-4 py-3 bg-zinc-50 dark:bg-white/5 rounded-2xl">
                                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-500/20">
                                            {user.profilePicture ? (
                                                <img src={getFileUrl(user.profilePicture)} className="w-full h-full object-cover" alt="Profile" />
                                            ) : (
                                                <div className="w-full h-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                                    <UserCircle size={24} />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-zinc-900 dark:text-white">{user.fullName}</p>
                                            <p className="text-xs text-zinc-500 uppercase font-black tracking-widest">{user.role}</p>
                                        </div>
                                    </Link>

                                    {user.role === 'admin' && (
                                        <Link to="/admin" className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/20">
                                            <LayoutDashboard size={20} />
                                            Admin Dashboard
                                        </Link>
                                    )}

                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl bg-zinc-100 dark:bg-white/5 text-zinc-900 dark:text-white font-bold"
                                    >
                                        <LogOut size={20} />
                                        Log Out
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <Link to="/login" className="flex justify-center items-center py-4 rounded-2xl bg-zinc-100 dark:bg-white/5 text-zinc-900 dark:text-white font-bold">
                                        Login
                                    </Link>
                                    <Link to="/register" className="flex justify-center items-center py-4 rounded-2xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/20">
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
