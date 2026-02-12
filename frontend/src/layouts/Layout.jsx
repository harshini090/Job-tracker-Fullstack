import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LayoutDashboard, LogOut, Briefcase } from 'lucide-react';

const Layout = ({ children }) => {
    const { logout } = useAuth();
    const location = useLocation();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    ];

    return (
        <div className="min-h-screen flex bg-[#020617]">
            {/* Sidebar */}
            <motion.aside
                initial={{ x: -80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-[260px] glass-panel m-4 flex flex-col p-6 fixed h-[calc(100vh-2rem)] z-40"
            >
                {/* Brand */}
                <div className="flex items-center space-x-3 mb-12 px-2">
                    <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                        <Briefcase size={18} className="text-indigo-400" />
                    </div>
                    <span className="text-lg font-bold text-slate-100 tracking-tight">JobFlow</span>
                </div>

                {/* Nav */}
                <nav className="flex-1 space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${isActive
                                        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                        : 'hover:bg-white/[0.04] text-slate-400 hover:text-slate-200 border border-transparent'
                                    }`}
                            >
                                <item.icon size={18} className={isActive ? 'text-indigo-400' : 'group-hover:text-slate-200 transition-colors'} />
                                <span className="font-medium text-sm">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <button
                    onClick={logout}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-500/5 text-slate-500 hover:text-red-400 transition-all duration-200 mt-auto group cursor-pointer border border-transparent hover:border-red-500/10"
                >
                    <LogOut size={18} className="group-hover:text-red-400 transition-colors" />
                    <span className="font-medium text-sm">Logout</span>
                </button>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 ml-[292px] p-8 min-h-screen">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
};

export default Layout;
