import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import PostJob from './pages/PostJob';
import JobDetails from './pages/JobDetails';
import JobApplicants from './pages/JobApplicants';
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';
import Chatbot from './components/Chatbot';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <Router>
      <Navbar />
      <Toaster position="top-right" />
      <Chatbot />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Jobs />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/jobs/:id/applicants" element={<JobApplicants />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {/* More routes to come */}
        </Routes>
      </main>
    </Router>
  );
}

export default App;
