import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2, Briefcase } from 'lucide-react';
import api from '../api/axios';

const JobModal = ({ isOpen, onClose, onJobSaved, initialData = null }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        company_name: '',
        role_title: '',
        status: 'APPLIED',
        date_applied: new Date().toISOString().split('T')[0],
        job_link: '',
        notes: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                company_name: initialData.company_name || '',
                role_title: initialData.role_title || '',
                status: initialData.status || 'APPLIED',
                date_applied: initialData.date_applied || new Date().toISOString().split('T')[0],
                job_link: initialData.job_link || '',
                notes: initialData.notes || ''
            });
        } else {
            setFormData({
                company_name: '',
                role_title: '',
                status: 'APPLIED',
                date_applied: new Date().toISOString().split('T')[0],
                job_link: '',
                notes: ''
            });
        }
        setError('');
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (initialData) {
                await api.patch(`/applications/${initialData.id}/`, formData);
            } else {
                await api.post('/applications/', formData);
            }
            onJobSaved();
            onClose();
        } catch (err) {
            setError('Failed to save. Please check your inputs and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="glass-panel w-full max-w-lg relative overflow-hidden bg-[#0f172a]/90 border-white/[0.08] glow-indigo z-10"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-white/[0.06]">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                    <Briefcase size={20} className="text-indigo-400" />
                                </div>
                                <h2 className="text-xl font-bold text-white">
                                    {initialData ? 'Edit Application' : 'New Application'}
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {error && (
                                <div className="bg-red-500/10 text-red-300 p-3 rounded-xl text-sm text-center border border-red-500/20">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5 ml-1">Company Name</label>
                                    <input
                                        type="text"
                                        name="company_name"
                                        required
                                        className="glass-input w-full bg-black/20"
                                        value={formData.company_name}
                                        onChange={handleChange}
                                        placeholder="e.g. Google"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5 ml-1">Role Title</label>
                                    <input
                                        type="text"
                                        name="role_title"
                                        required
                                        className="glass-input w-full bg-black/20"
                                        value={formData.role_title}
                                        onChange={handleChange}
                                        placeholder="e.g. Senior Software Engineer"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5 ml-1">Status</label>
                                    <div className="relative">
                                        <select
                                            name="status"
                                            className="glass-input w-full appearance-none bg-black/20"
                                            value={formData.status}
                                            onChange={handleChange}
                                        >
                                            <option value="APPLIED" className="bg-slate-900 text-slate-200">Applied</option>
                                            <option value="SCREENING" className="bg-slate-900 text-slate-200">Screening</option>
                                            <option value="INTERVIEW" className="bg-slate-900 text-slate-200">Interview</option>
                                            <option value="OFFER" className="bg-slate-900 text-slate-200">Offer</option>
                                            <option value="REJECTED" className="bg-slate-900 text-slate-200">Rejected</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                                            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5 ml-1">Date Applied</label>
                                    <input
                                        type="date"
                                        name="date_applied"
                                        required
                                        className="glass-input w-full bg-black/20"
                                        value={formData.date_applied}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5 ml-1">Job Link <span className="text-slate-600 normal-case">(optional)</span></label>
                                    <input
                                        type="url"
                                        name="job_link"
                                        className="glass-input w-full bg-black/20"
                                        value={formData.job_link}
                                        onChange={handleChange}
                                        placeholder="https://..."
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5 ml-1">Notes <span className="text-slate-600 normal-case">(optional)</span></label>
                                    <textarea
                                        name="notes"
                                        rows={3}
                                        className="glass-input w-full resize-none bg-black/20"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        placeholder="Add any notes about this application..."
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-2 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-5 py-2.5 rounded-xl text-slate-400 hover:bg-white/[0.05] hover:text-slate-200 transition-all font-medium cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium text-white
                                               bg-indigo-600 hover:bg-indigo-500
                                               shadow-[0_0_15px_rgba(79,70,229,0.2)] hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]
                                               border border-indigo-500/50
                                               transition-all duration-300 disabled:opacity-50 cursor-pointer"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    <span>{initialData ? 'Update' : 'Save'}</span>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default JobModal;
