import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Briefcase, TrendingUp, Award } from 'lucide-react';
import api from '../api/axios';
import JobCard from '../components/JobCard';
import JobModal from '../components/JobModal';
import DeleteModal from '../components/DeleteModal';

const Dashboard = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [jobToDelete, setJobToDelete] = useState(null);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await api.get('/applications/');
            setApplications(response.data);
        } catch (error) {
            console.error("Failed to fetch applications", error);
        } finally {
            setLoading(false);
        }
    };

    const handleJobSaved = () => {
        fetchApplications();
    };

    const handleEdit = (job) => {
        setEditingJob(job);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (job) => {
        setJobToDelete(job);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!jobToDelete) return;
        try {
            await api.delete(`/applications/${jobToDelete.id}/`);
            fetchApplications();
            setIsDeleteModalOpen(false);
            setJobToDelete(null);
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingJob(null);
    };

    const stats = [
        {
            label: 'Total Applications',
            value: applications.length,
            icon: Briefcase,
            color: 'from-indigo-500/10 to-indigo-500/5',
            textColor: 'text-indigo-400',
            borderColor: 'border-indigo-500/10',
            iconBg: 'bg-indigo-500/10',
        },
        {
            label: 'Interviews',
            value: applications.filter(a => a.status === 'INTERVIEW').length,
            icon: TrendingUp,
            color: 'from-amber-500/10 to-amber-500/5',
            textColor: 'text-amber-400',
            borderColor: 'border-amber-500/10',
            iconBg: 'bg-amber-500/10',
        },
        {
            label: 'Offers',
            value: applications.filter(a => a.status === 'OFFER').length,
            icon: Award,
            color: 'from-emerald-500/10 to-emerald-500/5',
            textColor: 'text-emerald-400',
            borderColor: 'border-emerald-500/10',
            iconBg: 'bg-emerald-500/10',
        },
    ];

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Dashboard</h2>
                    <p className="text-slate-500 text-sm">Overview of your job search journey</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center space-x-2 py-2 px-4 rounded-xl font-medium text-white text-sm
                               bg-indigo-600 hover:bg-indigo-500
                               shadow-[0_0_15px_rgba(79,70,229,0.2)] hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]
                               border border-indigo-500/50
                               transition-all duration-300 cursor-pointer"
                >
                    <Plus size={18} />
                    <span>Add Application</span>
                </button>
            </div>

            {/* Modals */}
            <JobModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onJobSaved={handleJobSaved}
                initialData={editingJob}
            />
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                jobTitle={jobToDelete?.role_title}
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        className={`glass-panel p-5 bg-gradient-to-br ${stat.color} ${stat.borderColor} flex items-center space-x-4`}
                    >
                        <div className={`w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center border border-white/5`}>
                            <stat.icon size={20} className={stat.textColor} />
                        </div>
                        <div>
                            <p className={`text-2xl font-bold ${stat.textColor} leading-none mb-1`}>{stat.value}</p>
                            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">{stat.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Applications Grid */}
            <div>
                <div className="flex items-center mb-6">
                    <h3 className="text-lg font-semibold text-slate-200">Recent Applications</h3>
                    <span className="ml-3 text-xs bg-white/[0.05] px-2.5 py-0.5 rounded-full text-slate-400 border border-white/[0.08] font-mono">
                        {applications.length}
                    </span>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                    </div>
                ) : applications.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 glass-panel border-dashed"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-4 border border-indigo-500/10">
                            <Briefcase size={24} className="text-indigo-400" />
                        </div>
                        <p className="text-slate-400 mb-1 font-medium">No applications yet</p>
                        <p className="text-slate-600 text-sm">Click "Add Application" to get started</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {applications.map((app, index) => (
                            <motion.div
                                key={app.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05, duration: 0.3 }}
                            >
                                <JobCard
                                    application={app}
                                    onUpdate={fetchApplications}
                                    onDelete={handleDeleteClick}
                                    onEdit={handleEdit}
                                />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
