import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import SeekerDashboard from '../components/SeekerDashboard';
import RecruiterDashboard from '../components/RecruiterDashboard';

const Dashboard = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
        </div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-zinc-700 dark:text-zinc-300">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white drop-shadow-sm">Dashboard</h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">Welcome back, <span className="text-blue-600 dark:text-blue-300">{user.name}</span> 👋</p>
            </div>

            {user.role === 'seeker' ? <SeekerDashboard /> : <RecruiterDashboard />}
        </div>
    );
};

export default Dashboard;
