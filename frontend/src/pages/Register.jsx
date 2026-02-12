import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            await register(email, password);
            navigate('/login');
        } catch (err) {
            const detail = err.response?.data;
            if (detail?.email) {
                setError(detail.email[0]);
            } else if (detail?.password) {
                setError(detail.password[0]);
            } else {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
            {/* Subtle animated background blobs */}
            <div className="absolute top-[-10%] right-[20%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] animate-pulse opacity-50" />
            <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] animate-pulse opacity-50" style={{ animationDelay: '1s' }} />

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="glass-panel p-8 md:p-10 w-full max-w-[420px] relative z-10 glow-indigo border-t border-white/[0.08]"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-500/10 mb-5 border border-indigo-500/20"
                    >
                        <UserPlus size={24} className="text-indigo-400" />
                    </motion.div>
                    <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-slate-400 text-sm">Start tracking your job applications today</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/10 text-red-300 p-3 rounded-lg mb-6 text-sm text-center border border-red-500/10"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide ml-1">Email</label>
                        <div className="relative group">
                            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                            <input
                                type="email"
                                className="glass-input w-full !pl-11 text-sm bg-black/20"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide ml-1">Password</label>
                        <div className="relative group">
                            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                            <input
                                type="password"
                                className="glass-input w-full !pl-11 text-sm bg-black/20"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide ml-1">Confirm Password</label>
                        <div className="relative group">
                            <ShieldCheck size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                            <input
                                type="password"
                                className="glass-input w-full !pl-11 text-sm bg-black/20"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl font-medium text-white text-sm
                                   bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700
                                   shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]
                                   border border-indigo-500/50
                                   transition-all duration-300 disabled:opacity-50 cursor-pointer mt-2"
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>Create Account</span>
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm">
                    <span className="text-slate-500">Already have an account? </span>
                    <Link to="/login" className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors">
                        Sign In
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
