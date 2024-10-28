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



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mail-verification" element={<MailVerification />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/" element={<Hero />} />
      </Routes>
    </Router>
  );
}

export default App;
