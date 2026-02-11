import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/5GFLogo.png';

function Signup() {
    const { register } = useAuth();
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Basic password strength check
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        try {
            await register(email, password);
            navigate('/dashboard');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <img 
                        src={logo} 
                        alt="5G Fitness" 
                        className="h-36 w-auto"
                    />
                </div>
        
                {/* Signup Card */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700/50">
                    <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                    <p className="text-gray-400 mb-8">Start your fitness journey today</p>
        
                    {/* Error message */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}
        
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                            />
                        </div>

                        {/* Password input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <p className="mt-2 text-xs text-gray-400">Must be at least 6 characters</p>
                        </div>

                        {/* Confirm Password input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Confirm Password
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                            />
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3.5 rounded-lg transition duration-200 shadow-lg shadow-red-900/30"
                        >
                            Create Account
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-800 text-gray-400">Already have an account?</span>
                        </div>
                    </div>

                    {/* Login link */}
                    <Link 
                        to="/login"
                        className="block w-full text-center bg-gray-700/50 hover:bg-gray-700 border border-gray-600 text-white font-semibold py-3.5 rounded-lg transition duration-200"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}
    
export default Signup;