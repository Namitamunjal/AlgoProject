import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (email === '') {
      setError('Please enter your email');
      setSuccess('');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/forgot-password', {
        email,
      });
      console.log(response.data);
      setSuccess('Password reset link sent! Check your email.');
      setError('');
      setEmail('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      setSuccess('');
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-bl from-green-500 to-yellow-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h3 className="text-2xl font-semibold text-green-700 text-center mb-6">Forgot Password</h3>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        {success && <p className="text-green-600 text-center mb-4">{success}</p>}

        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium">Enter your email</label>
            <input
              type="email"
              id="email"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all"
          >
            Send Reset Link
          </button>
        </form>

        <p
          className="mt-4 text-green-600 text-center cursor-pointer hover:underline"
          onClick={handleBackToLogin}
        >
          Back to Login
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
