import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from './assets/images/logo.png';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (email === '' || password === '') {
      setError('Please fill in all fields');
      setSuccess('');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password,
      });
      console.log(response.data);

      setSuccess('Login successful! Redirecting...');
      setError('');
      navigate('/main');
      setEmail('');
      setPassword('');

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid email or password');
      setSuccess('');
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50">
      {/* Logo container */}
      <div className="flex items-center mt-8">
        <img src={logo} alt="Logo" className="h-12 w-12 mr-2" />
      </div>

      <div className="flex flex-col md:flex-row items-center mt-10">
        <div className="w-full md:w-1/2 px-6">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-semibold text-center text-gray-800 mb-6">Sign in to Your Account</h3>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {success && <p className="text-green-500 text-center mb-4">{success}</p>}

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  id="password"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-between mb-6 text-sm text-indigo-600">
                <button type="button" className="hover:underline" onClick={handleForgotPassword}>Forgot Your Password?</button>
                <button type="button" className="hover:underline" onClick={handleRegister}>Need an Account?</button>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>

        <div className="hidden md:block md:w-1/2 px-6">
          <img src={logo} alt="Flying image" className="h-96 w-full object-cover rounded-md shadow-lg" />
          <div className="mt-4 text-center text-gray-600 italic">
            "Dream big, work hard, stay focused, and surround yourself with good people." <br />– StudyBuddy
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
