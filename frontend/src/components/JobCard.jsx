import { motion } from 'framer-motion';
import { ExternalLink, Calendar, Briefcase, Building2 } from 'lucide-react';

const statusColors = {
    APPLIED: 'bg-blue-500/20 text-blue-200 border-blue-500/30',
    SCREENING: 'bg-purple-500/20 text-purple-200 border-purple-500/30',
    INTERVIEW: 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30',
    OFFER: 'bg-green-500/20 text-green-200 border-green-500/30',
    REJECTED: 'bg-red-500/20 text-red-200 border-red-500/30',
};

const JobCard = ({ application }) => {
    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="glass-panel p-5 relative group overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white truncate pr-2">{application.role_title}</h3>
                    <div className="flex items-center text-white/70 text-sm mt-1">
                        <Building2 size={14} className="mr-1" />
                        <span>{application.company_name}</span>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[application.status] || statusColors.APPLIED}`}>
                    {application.status}
                </span>
            </div>

            <div className="space-y-2 mt-4">
                <div className="flex items-center text-white/50 text-xs">
                    <Calendar size={14} className="mr-2" />
                    <span>Applied: {application.date_applied}</span>
                </div>

                {application.job_link && (
                    <a
                        href={application.job_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-300 text-xs hover:text-blue-100 transition-colors w-fit"
                    >
                        <ExternalLink size={14} className="mr-2" />
                        View Posting
                    </a>
                )}
            </div>
        </motion.div>
    );
};

export default JobCard;
