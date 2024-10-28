import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!name || !email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            setSuccess('');
            return;
        } else if (password !== confirmPassword) {
            setError('Passwords do not match');
            setSuccess('');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post('http://localhost:5000/register', {
                name,
                email,
                password,
            });

            setSuccess('Registered successfully!');
            setError('');
            navigate('/mail-verification');
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Registration failed');
            setSuccess('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-bl from-green-500 to-yellow-50">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h3 className="text-2xl font-semibold text-green-700 mb-6 text-center">Create Your Account</h3>

                {error && <p className="text-red-600 text-center mb-4">{error}</p>}
                {success && <p className="text-green-600 text-center mb-4">{success}</p>}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-gray-700 font-medium">Name</label>
                        <input
                            type="text"
                            id="name"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-gray-700 font-medium">Email Address</label>
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

                    <div>
                        <label htmlFor="password" className="block text-gray-700 font-medium">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-gray-700 font-medium">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all"
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Register'}
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-4">
                    Already have an account?{' '}
                    <button
                        className="text-green-600 hover:underline"
                        onClick={() => navigate('/login')}
                    >
                        Login here
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Signup;
