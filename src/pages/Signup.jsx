import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
    // Get the login function and navigate
    const { register } = useAuth();
    const navigate = useNavigate();
  
    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(email, password);
            navigate('/dashboard');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
          {/* Container card */}
          <div className="w-full max-w-md">
            {/* Logo/Title */}
            <h1 className="text-4xl font-bold text-center mb-8">
              <span className="text-white">5G</span>
              <span className="text-red-600"> Fitness</span>
            </h1>
      
            {/* Login Card */}
            <div className="bg-gray-800 rounded-lg shadow-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Register</h2>
      
              {/* Error message */}
              {error && (
                <div className="bg-red-600 text-white px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
      
        <form onSubmit={handleSubmit}>
        {/* Email input */}
        <div className="mb-4">
            <label className="block text-white mb-2">Email</label>
            <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            />
        </div>

        {/* Password input */}
        <div className="mb-6">
            <label className="block text-white mb-2">Password</label>
            <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            />
        </div>

        {/* Submit button */}
        <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition duration-200"
        >
            Register
        </button>

        {/* Link to Login */}
        <p className="text-gray-400 text-center mt-4">
        Already have an account?{' '}
        <a href="/login" className="text-red-600 hover:text-red-500">
            Login
        </a>
        </p>

        </form>
            </div>
            </div>
            </div>
    );
}
  
export default Register;