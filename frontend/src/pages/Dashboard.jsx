import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import api from '../api/axios';
import JobCard from '../components/JobCard';
import AddJobModal from '../components/AddJobModal';

const Dashboard = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleJobAdded = () => {
        fetchApplications();
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
                    <h2 className="text-3xl font-bold">Dashboard</h2>
                    <p className="text-white/60">Overview of your job search</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="glass-button flex items-center space-x-2 bg-white/10 hover:bg-white/20"
                >
                    <Plus size={20} />
                    <span>Add Application</span>
                </button>
            </div>

            <AddJobModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onJobAdded={handleJobAdded}
            />

            {/* Bento Grid Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-panel p-6 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-blue-500/20 to-transparent border-blue-500/30"
                >
                    <span className="text-4xl font-bold">{stats.total}</span>
                    <span className="text-sm text-white/70 uppercase tracking-wider">Total Applications</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel p-6 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-purple-500/20 to-transparent border-purple-500/30"
                >
                    <span className="text-4xl font-bold">{stats.interview}</span>
                    <span className="text-sm text-white/70 uppercase tracking-wider">Interviews</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="glass-panel p-6 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-green-500/20 to-transparent border-green-500/30"
                >
                    <span className="text-4xl font-bold text-green-300">{stats.offer}</span>
                    <span className="text-sm text-white/70 uppercase tracking-wider">Offers</span>
                </motion.div>
            </div>

            {/* Job Grid */}
            <div>
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                    Recent Applications
                    <span className="ml-3 text-xs bg-white/10 px-2 py-1 rounded-full text-white/50">{applications.length}</span>
                </h3>

                {loading ? (
                    <div className="text-center py-20 text-white/50">Loading application data...</div>
                ) : applications.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-xl border border-dashed border-white/20">
                        <p className="text-white/60">No applications yet. Start tracking!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {applications.map((app) => (
                            <JobCard key={app.id} application={app} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
