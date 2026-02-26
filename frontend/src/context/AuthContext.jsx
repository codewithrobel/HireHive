import { createContext, useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    axios.defaults.baseURL = import.meta.env.PROD ? 'https://hirehive-o1x6.onrender.com/api' : 'http://localhost:5001/api';
    axios.defaults.withCredentials = true;

    const getFileUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http') || path.startsWith('data:')) return path;
        const baseUrl = import.meta.env.PROD ? 'https://hirehive-o1x6.onrender.com' : 'http://localhost:5001';
        return `${baseUrl}${path}`;
    };

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    // --- Auto Logout on Inactivity (15 minutes) ---
    const inactivityLogoutTimer = useRef(null);

    const resetInactivityTimer = useCallback(() => {
        if (inactivityLogoutTimer.current) {
            clearTimeout(inactivityLogoutTimer.current);
        }

        // 15 minutes (15 * 60 * 1000 = 900000 ms)
        inactivityLogoutTimer.current = setTimeout(() => {
            if (user) {
                logout();
                toast('You have been logged out due to inactivity.', {
                    icon: '😴',
                    style: {
                        borderRadius: '10px',
                        background: '#3f3f46',
                        color: '#fff',
                    },
                });
            }
        }, 900000);
    }, [user]);

    useEffect(() => {
        // Only track inactivity if the user is logged in
        if (!user) {
            if (inactivityLogoutTimer.current) {
                clearTimeout(inactivityLogoutTimer.current);
            }
            return;
        }

        const events = ['mousemove', 'keydown', 'scroll', 'click'];

        const handleActivity = () => {
            resetInactivityTimer();
        };

        // Initialize the timer
        resetInactivityTimer();

        // Attach event listeners
        events.forEach(event => {
            window.addEventListener(event, handleActivity);
        });

        // Cleanup
        return () => {
            if (inactivityLogoutTimer.current) {
                clearTimeout(inactivityLogoutTimer.current);
            }
            events.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
        };
    }, [user, resetInactivityTimer]);
    // ----------------------------------------------

    const checkUserLoggedIn = async () => {
        try {
            const res = await axios.get('/auth/profile');
            setUser(res.data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const res = await axios.post('/auth/login', { email, password });
        setUser(res.data);
    };

    const register = async (userData) => {
        const res = await axios.post('/auth/register', userData);
        setUser(res.data);
        return res.data;
    };

    const forgotPassword = async (email) => {
        const res = await axios.post('/auth/forgot-password', { email });
        return res.data;
    };

    const resetPassword = async (email, otp, password) => {
        const res = await axios.post('/auth/reset-password', { email, otp, password });
        return res.data;
    };

    const verifyOTP = async (email, otp) => {
        const res = await axios.post('/auth/verify-otp', { email, otp });
        setUser(res.data);
    };

    const resendOTP = async (email) => {
        const res = await axios.post('/auth/resend-otp', { email });
        return res.data;
    };

    const logout = async () => {
        await axios.post('/auth/logout');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, register, logout, loading, checkUserLoggedIn, verifyOTP, resendOTP, forgotPassword, resetPassword, getFileUrl }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
