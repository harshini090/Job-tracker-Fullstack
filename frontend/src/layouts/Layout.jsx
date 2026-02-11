import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LayoutDashboard, PlusCircle, LogOut } from 'lucide-react';

const Layout = ({ children }) => {
    const { logout } = useAuth();
    const location = useLocation();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    ];

    return (
        <div className="min-h-screen flex bg-transparent">
            {/* Sidebar */}
            <motion.aside
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-64 glass-panel m-4 flex flex-col p-6 fixed h-[calc(100vh-2rem)]"
            >
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 mb-10">
                    JobTracker
                </h1>

                <nav className="flex-1 space-y-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${location.pathname === item.path
                                    ? 'bg-white/20 shadow-lg'
                                    : 'hover:bg-white/10'
                                }`}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <button
                    onClick={logout}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-all mt-auto"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 ml-72 p-8">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
};

export default Layout;
