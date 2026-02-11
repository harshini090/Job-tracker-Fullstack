import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // We might need a register function in context or just call API directly
import api from '../api/axios';
import { UserPlus } from 'lucide-react';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }
        try {
            await api.post('/auth/register/', { email, password });
            navigate('/login');
        } catch (err) {
            setError('Registration failed. Email may be taken.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-[-10%] right-[20%] w-96 h-96 bg-pink-500/30 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl" />

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="glass-panel p-8 w-full max-w-md relative z-10"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Create Account</h1>
                    <p className="text-white/60">Join to track your journey</p>
                </div>

                {error && <div className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-4 text-sm text-center border border-red-500/30">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-white/80">Email</label>
                        <input
                            type="email"
                            className="glass-input w-full"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-white/80">Password</label>
                        <input
                            type="password"
                            className="glass-input w-full"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-white/80">Confirm Password</label>
                        <input
                            type="password"
                            className="glass-input w-full"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="glass-button w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-pink-500 to-indigo-500 hover:from-pink-400 hover:to-indigo-400 border-none shadow-lg shadow-indigo-500/20">
                        <UserPlus size={20} />
                        <span>Register</span>
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <span className="text-white/60">Already have an account? </span>
                    <Link to="/login" className="text-white font-medium hover:underline">Sign In</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
