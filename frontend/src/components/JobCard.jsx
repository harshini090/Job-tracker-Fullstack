import { Pencil, Trash2, Calendar, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const statusColors = {
    APPLIED: 'bg-blue-100 text-blue-800',
    SCREENING: 'bg-yellow-100 text-yellow-800',
    INTERVIEW: 'bg-indigo-100 text-indigo-800',
    OFFER: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
};

const STATUS_OPTIONS = ["APPLIED", "SCREENING", "INTERVIEW", "OFFER", "REJECTED"];

export default function JobCard({ job, onEdit, onDelete, onStatusChange }) {
    const handleStatusClick = (e) => {
        e.stopPropagation();
    };

    const handleStatusChange = (e) => {
        e.stopPropagation();
        onStatusChange(job, e.target.value);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 p-5 group relative"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1 pr-8">
                    <h3 className="font-semibold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {job.company_name}
                    </h3>
                    <div className="text-slate-600 font-medium">{job.role_title}</div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute top-5 right-5 bg-white pl-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(job); }}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(job.id); }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-auto">
                {/* Status Dropdown */}
                <div className="relative group/status" onClick={handleStatusClick}>
                    <select
                        value={job.status}
                        onChange={handleStatusChange}
                        className={`appearance-none pl-3 pr-8 py-1 rounded-full text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition-all ${statusColors[job.status]}`}
                    >
                        {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s} className="bg-white text-slate-700">{s}</option>
                        ))}
                    </select>
                    <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-500 ml-auto">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{job.applied_date}</span>
                </div>
            </div>

            {job.notes && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                    <p className="text-sm text-slate-500 line-clamp-2">{job.notes}</p>
                </div>
            )}
        </motion.div>
    );
}
