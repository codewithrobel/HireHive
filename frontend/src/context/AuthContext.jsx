import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    axios.defaults.baseURL = import.meta.env.PROD ? 'https://hirehive-o1x6.onrender.com/api' : 'http://localhost:5001/api';
    axios.defaults.withCredentials = true;

    const getFileUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        const baseUrl = import.meta.env.PROD ? 'https://hirehive-o1x6.onrender.com' : 'http://localhost:5001';
        return `${baseUrl}${path}`;
    };

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

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
