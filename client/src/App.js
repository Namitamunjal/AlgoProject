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
import { useEffect, useState } from 'react';


function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check for the authentication token in cookies when the app loads
    useEffect(() => {
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];
        
        if (token) {
            setIsAuthenticated(true);  // Set isAuthenticated based on the token presence
        }
    }, []);

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
