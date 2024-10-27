import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MailVerification = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleOtpChange = (e) => {
    const { value } = e.target;
    if (/^\d*$/.test(value) && value.length <= 4) {
      setOtp(value);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/send-otp', { email });
      console.log('OTP sent successfully:', response.data);
      setSuccess(response.data.message);
      setError('');
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError(error.response?.data?.message || 'Failed to send OTP');
      setSuccess('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/verify-otp', { email, otp });
      console.log('OTP verification successful:', response.data);
      setSuccess(response.data.message);
      setError('');
      navigate('/login'); // Redirect on success
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError(error.response?.data?.message || 'Verification failed');
      setOtp(''); // Clear the OTP field on error
      setSuccess('');
    }
  };

  return (
    <form className="max-w-md mx-auto bg-white shadow-md rounded-lg p-8 mt-10" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Email Verification</h2>
      <p className="text-gray-600 text-center mb-6">
        We will send a verification code to your email address
      </p>

      {/* Email Input Field */}
      <div className="mb-4">
        <input
          required
          type="email"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
        />
      </div>
      <button
        type="button"
        className="w-full bg-indigo-600 text-white py-2 rounded-md mb-4 font-semibold hover:bg-indigo-700 transition"
        onClick={handleSendOtp}
      >
        Send OTP
      </button>

      {/* OTP Input Field */}
      <div className="mb-4 flex justify-center">
        <input
          className="w-20 text-center py-2 border-b-2 border-gray-300 focus:outline-none focus:border-indigo-500 text-xl tracking-widest"
          placeholder="_ _ _ _"
          maxLength="4"
          type="text"
          value={otp}
          onChange={handleOtpChange}
        />
      </div>

      {/* Verify Button */}
      <button
        className="w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 transition"
        type="submit"
      >
        Verify
      </button>

      {/* Resend Code Section */}
      <p className="text-gray-600 text-center mt-4">
        Didn't receive the code?{' '}
        <button
          type="button"
          className="text-indigo-600 hover:underline"
          onClick={handleSendOtp}
        >
          Resend Code
        </button>
      </p>
      {success && <p className="text-green-600 text-center mt-4">{success}</p>}
      {error && <p className="text-red-600 text-center mt-4">{error}</p>}
    </form>
  );
};

export default MailVerification;
