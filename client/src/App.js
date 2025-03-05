import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Dashboard from './Dashboard';
import Signup from './Signup';
import Login from './Login';
import MailVerification from './MailVerification';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import About from './About';
import Hero from './Hero';
import Profile from './Profile';
import Alerts from './Alerts';
import Settings from './settings';
import ProtectedRoute from './ProtectedRoute';
import LoginRedirect from './LoginRedirect';
import ContactUs from './ContactUs';
import PrivacyPolicy from './PrivacyPolicy';
import TermsConditions from './TermsConditions';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isVerifying, setIsVerifying] = useState(true);

    // Check for the token in localStorage and verify it with the backend
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsAuthenticated(false);
            setIsVerifying(false);
            return;
        }
        axios.get('http://127.0.0.1:5000/verify', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                if (response.data.authenticated) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            })
            .catch(error => {
                console.error("Auth verification error:", error);
                setIsAuthenticated(false);
            })
            .finally(() => {
                setIsVerifying(false);
            });
    }, []);

    if (isVerifying) {
        // Show a loading indicator until authentication is verified
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
              <div className="p-8 border rounded-lg shadow-lg bg-white">
                <h2 className="text-2xl font-bold mb-4">Loading...</h2>
                <p className="text-gray-600">Please wait while we verify your credentials.</p>
              </div>
            </div>
          );          
    }

    return (
        <>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Hero />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={isAuthenticated ? <LoginRedirect /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/login-redirect" element={<LoginRedirect />} />
                <Route path="/mail-verification" element={<MailVerification />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/about" element={<About />} />
                <Route path="/ContactUs" element={<ContactUs />} />
                <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
                <Route path="/TermsConditions" element={<TermsConditions />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
                    <Route path="/home" element={<Home isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
                    <Route path="/dashboard" element={<Dashboard isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
                    <Route path="/profile" element={<Profile isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
                    <Route path="/alerts" element={<Alerts isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
                    <Route path="/settings" element={<Settings isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
