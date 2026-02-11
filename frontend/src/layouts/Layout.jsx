import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Briefcase } from 'lucide-react';

export default function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isAuthPage = ['/login', '/register'].includes(location.pathname);

    if (isAuthPage) {
        return <Outlet />;
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Glassmorphism Header */}
            <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="p-2 bg-indigo-600 rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-200">
                                <Briefcase className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                                JobTracker
                            </span>
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-slate-500 hidden sm:block">Welcome back</span>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all duration-200 border border-transparent hover:border-indigo-100"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign out
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-4">
                                <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                                    Log in
                                </Link>
                                <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-md hover:shadow-lg transition-all duration-200">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
                <Outlet />
            </main>

            <footer className="border-t border-slate-200 mt-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-center text-sm text-slate-400">
                    &copy; {new Date().getFullYear()} JobTracker. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
