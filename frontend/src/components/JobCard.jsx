import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Calendar, Building2, Trash2, Edit2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../api/axios';

const statusConfig = {
    APPLIED: { label: 'Applied', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', dot: 'bg-blue-400' },
    SCREENING: { label: 'Screening', bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', dot: 'bg-purple-400' },
    INTERVIEW: { label: 'Interview', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', dot: 'bg-amber-400' },
    OFFER: { label: 'Offer ✨', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', dot: 'bg-emerald-400' },
    REJECTED: { label: 'Rejected', bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', dot: 'bg-red-400' },
};

const JobCard = ({ application, onUpdate, onDelete, onEdit }) => {
    const [loading, setLoading] = useState(false);
    const config = statusConfig[application.status];

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        setLoading(true);
        try {
            await api.patch(`/applications/${application.id}/`, { status: newStatus });
            onUpdate();

            if (newStatus === 'OFFER') {
                confetti({
                    particleCount: 150,
                    spread: 80,
                    origin: { y: 0.6 },
                    colors: ['#34d399', '#fbbf24', '#a78bfa', '#ffffff'],
                });
            }
        } catch (error) {
            console.error("Failed to update status", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="glass-panel p-5 relative group hover:border-white/15 transition-all duration-300"
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0 pr-3">
                    <h3 className="text-lg font-bold text-white truncate">{application.role_title}</h3>
                    <div className="flex items-center text-slate-400 text-sm mt-1.5">
                        <Building2 size={14} className="mr-1.5 shrink-0" />
                        <span className="truncate">{application.company_name}</span>
                    </div>
                </div>

                {/* Action buttons — appear on hover */}
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                    <button
                        onClick={() => onEdit(application)}
                        className="p-2 rounded-lg hover:bg-white/[0.08] text-slate-500 hover:text-white transition-all duration-200 cursor-pointer"
                        title="Edit"
                    >
                        <Edit2 size={15} />
                    </button>
                    <button
                        onClick={() => onDelete(application)}
                        className="p-2 rounded-lg hover:bg-red-500/15 text-slate-500 hover:text-red-400 transition-all duration-200 cursor-pointer"
                        title="Delete"
                    >
                        <Trash2 size={15} />
                    </button>
                </div>
            </div>

            {/* Status dropdown */}
            <div className="relative mb-4">
                <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${config.dot}`} />
                <select
                    value={application.status}
                    onChange={handleStatusChange}
                    disabled={loading}
                    className={`w-full appearance-none pl-7 pr-8 py-2 rounded-lg text-xs font-semibold border ${config.bg} ${config.text} ${config.border} bg-transparent focus:outline-none cursor-pointer hover:bg-white/[0.03] transition-all duration-200`}
                >
                    <option value="APPLIED">Applied</option>
                    <option value="SCREENING">Screening</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="OFFER">Offer ✨</option>
                    <option value="REJECTED">Rejected</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] opacity-40">▼</div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs pt-3 border-t border-white/[0.05]">
                <div className="flex items-center text-slate-500">
                    <Calendar size={13} className="mr-1.5" />
                    <span>{application.date_applied}</span>
                </div>

                {application.job_link && (
                    <a
                        href={application.job_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-indigo-400/70 hover:text-indigo-300 transition-colors duration-200"
                    >
                        <ExternalLink size={13} className="mr-1" />
                        View
                    </a>
                )}
            </div>
        </motion.div>
    );
};

export default JobCard;
