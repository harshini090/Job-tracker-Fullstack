import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Calendar, Building2, Trash2, Edit2, MoreVertical } from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../api/axios';

const statusColors = {
    APPLIED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    SCREENING: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    INTERVIEW: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    OFFER: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    REJECTED: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const JobCard = ({ application, onUpdate, onDelete, onEdit }) => {
    const [loading, setLoading] = useState(false);

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        setLoading(true);
        try {
            await api.patch(`/applications/${application.id}/`, { status: newStatus });
            onUpdate();

            if (newStatus === 'OFFER') {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#34d399', '#ffb700', '#ffffff']
                });
            }
        } catch (error) {
            console.error("Failed to update status", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete your application for ${application.company_name}?`)) {
            try {
                await api.delete(`/applications/${application.id}/`);
                onDelete();
            } catch (error) {
                console.error("Failed to delete", error);
            }
        }
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="glass-panel p-5 relative group"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0 pr-4">
                    <h3 className="text-xl font-bold text-white truncate">{application.role_title}</h3>
                    <div className="flex items-center text-slate-400 text-sm mt-1">
                        <Building2 size={14} className="mr-1" />
                        <span>{application.company_name}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit(application)}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                        title="Edit"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {/* Status Dropdown */}
                <div className="relative">
                    <select
                        value={application.status}
                        onChange={handleStatusChange}
                        disabled={loading}
                        className={`w-full appearance-none px-3 py-2 rounded-lg text-xs font-medium border ${statusColors[application.status]} bg-transparent focus:outline-none cursor-pointer hover:bg-white/5 transition-colors`}
                    >
                        <option value="APPLIED" className="bg-slate-900 text-slate-200">Applied</option>
                        <option value="SCREENING" className="bg-slate-900 text-slate-200">Screening</option>
                        <option value="INTERVIEW" className="bg-slate-900 text-slate-200">Interview</option>
                        <option value="OFFER" className="bg-slate-900 text-emerald-400 font-bold">Offer ✨</option>
                        <option value="REJECTED" className="bg-slate-900 text-slate-200">Rejected</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs opacity-50">
                        ▼
                    </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                    <div className="flex items-center text-slate-500">
                        <Calendar size={14} className="mr-1.5" />
                        <span>{application.date_applied}</span>
                    </div>

                    {application.job_link && (
                        <a
                            href={application.job_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                            <ExternalLink size={14} className="mr-1" />
                            View
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default JobCard;
