import { useEffect, useState, useMemo } from 'react';
import { Plus, Search, Filter, PartyPopper } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { fetchApplications, createApplication, updateApplication, deleteApplication } from '../api';
import JobCard from '../components/JobCard';
import JobModal from '../components/JobModal';
import DeleteModal from '../components/DeleteModal'; // New Import

const STATUSES = ["APPLIED", "SCREENING", "INTERVIEW", "OFFER", "REJECTED"];

export default function Dashboard() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState('ALL');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState(null);

    // New State for Delete Modal
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {
        setLoading(true);
        try {
            const data = await fetchApplications();
            setJobs(data);
        } catch (err) {
            setError('Failed to load applications.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fireConfetti = () => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    };

    const handleCreate = async (data) => {
        await createApplication(data);
        await loadJobs();
    };

    const handleUpdate = async (data) => {
        if (!editingJob) return;
        await updateApplication(editingJob.id, data);

        // Check for status upgrades
        if (data.status === 'OFFER' && editingJob.status !== 'OFFER') {
            fireConfetti();
        }

        await loadJobs();
        setEditingJob(null);
    };

    // Quick action from Card
    const handleQuickStatusChange = async (job, newStatus) => {
        if (job.status === newStatus) return;

        // Optimistic Update
        const updatedJobs = jobs.map(j => j.id === job.id ? { ...j, status: newStatus } : j);
        setJobs(updatedJobs);

        try {
            await updateApplication(job.id, { ...job, status: newStatus });
            if (newStatus === 'OFFER') fireConfetti();
        } catch (err) {
            console.error("Failed to update status", err);
            // Revert on error
            loadJobs();
        }
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setDeleteLoading(true);
        try {
            await deleteApplication(deleteId);
            setJobs(jobs.filter(j => j.id !== deleteId));
            setIsDeleteModalOpen(false);
            setDeleteId(null);
        } catch (err) {
            alert('Failed to delete job');
        } finally {
            setDeleteLoading(false);
        }
    };

    const openCreateModal = () => {
        setEditingJob(null);
        setIsModalOpen(true);
    };

    const openEditModal = (job) => {
        setEditingJob(job);
        setIsModalOpen(true);
    };

    // Stats
    const stats = useMemo(() => {
        const counts = { TOTAL: jobs.length };
        STATUSES.forEach(s => counts[s] = 0);
        jobs.forEach(j => {
            if (counts[j.status] !== undefined) counts[j.status]++;
        });
        return counts;
    }, [jobs]);

    // Filters
    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
            const matchesQuery = !query ||
                job.company_name.toLowerCase().includes(query.toLowerCase()) ||
                job.role_title.toLowerCase().includes(query.toLowerCase());
            const matchesFilter = filter === 'ALL' || job.status === filter;
            return matchesQuery && matchesFilter;
        });
    }, [jobs, query, filter]);

    if (loading && jobs.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header & Stats */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div className="col-span-2 md:col-span-1 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-sm text-slate-500 font-medium">Total</div>
                    <div className="text-2xl font-bold text-slate-900">{stats.TOTAL}</div>
                </div>
                {STATUSES.map(s => (
                    <div key={s} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hidden md:block relative overflow-hidden group">
                        {s === 'OFFER' && <div className="absolute top-0 right-0 w-16 h-16 bg-green-100 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:opacity-100 transition-opacity" />}
                        <div className="text-xs text-slate-500 font-medium capitalize relative z-10">{s.toLowerCase()}</div>
                        <div className="text-xl font-bold text-slate-900 relative z-10">{stats[s]}</div>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex w-full sm:w-auto gap-4 flex-1">
                    <div className="relative flex-1 sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search applications..."
                            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                            className="pl-9 pr-8 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white appearance-none"
                            value={filter}
                            onChange={e => setFilter(e.target.value)}
                        >
                            <option value="ALL">All Statuses</option>
                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>

                <button
                    onClick={openCreateModal}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-indigo-500/30"
                >
                    <Plus className="w-4 h-4" />
                    New Application
                </button>
            </div>

            {/* Content */}
            <AnimatePresence>
                {filteredJobs.length > 0 ? (
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredJobs.map(job => (
                            <JobCard
                                key={job.id}
                                job={job}
                                onEdit={openEditModal}
                                onDelete={confirmDelete}
                                onStatusChange={handleQuickStatusChange}
                            />
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                        <div className="mx-auto w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <Search className="w-6 h-6 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">No applications found</h3>
                        <p className="text-slate-500 mt-1">
                            {query || filter !== 'ALL' ? 'Try adjusting your filters' : 'Get started by adding your first job application'}
                        </p>
                        {!query && filter === 'ALL' && (
                            <button
                                onClick={openCreateModal}
                                className="mt-4 text-indigo-600 font-medium hover:text-indigo-700"
                            >
                                Create new application
                            </button>
                        )}
                    </div>
                )}
            </AnimatePresence>

            <JobModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={editingJob ? handleUpdate : handleCreate}
                initialData={editingJob}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                jobTitle={jobs.find(j => j.id === deleteId)?.company_name}
                isLoading={deleteLoading}
            />
        </div>
    );
}
