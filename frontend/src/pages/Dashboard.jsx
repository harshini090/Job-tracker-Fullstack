import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import api from '../api/axios';
import JobCard from '../components/JobCard';
import JobModal from '../components/JobModal';
import DeleteModal from '../components/DeleteModal';

const Dashboard = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState(null);

    // Delete State
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

    const stats = {
        total: applications.length,
        interview: applications.filter(a => a.status === 'INTERVIEW').length,
        offer: applications.filter(a => a.status === 'OFFER').length,
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white">Dashboard</h2>
                    <p className="text-slate-400">Overview of your job search</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="glass-button flex items-center space-x-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border-indigo-500/20"
                >
                    <Plus size={20} />
                    <span>Add Application</span>
                </button>
            </div>

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

            {/* Bento Grid Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-panel p-6 flex flex-col items-center justify-center space-y-2"
                >
                    <span className="text-4xl font-bold text-white">{stats.total}</span>
                    <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Total Applications</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel p-6 flex flex-col items-center justify-center space-y-2"
                >
                    <span className="text-4xl font-bold text-yellow-200">{stats.interview}</span>
                    <span className="text-xs text-yellow-500/70 uppercase tracking-widest font-semibold">Interviews</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="glass-panel p-6 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20"
                >
                    <span className="text-4xl font-bold text-emerald-400">{stats.offer}</span>
                    <span className="text-xs text-emerald-500/70 uppercase tracking-widest font-semibold">Offers</span>
                </motion.div>
            </div>

            {/* Job Grid */}
            <div>
                <h3 className="text-xl font-semibold mb-6 flex items-center text-slate-200">
                    Recent Applications
                    <span className="ml-3 text-xs bg-white/5 px-2 py-1 rounded-full text-slate-400 border border-white/5 font-mono">{applications.length}</span>
                </h3>

                {loading ? (
                    <div className="text-center py-20 text-slate-500">Loading application data...</div>
                ) : applications.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-xl border border-dashed border-white/10">
                        <p className="text-slate-400">No applications yet. Start tracking!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {applications.map((app) => (
                            <JobCard
                                key={app.id}
                                application={app}
                                onUpdate={fetchApplications}
                                onDelete={handleDeleteClick}
                                onEdit={handleEdit}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
