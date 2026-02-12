import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2 } from 'lucide-react';
import api from '../api/axios';

const JobModal = ({ isOpen, onClose, onJobSaved, initialData = null }) => {
    const [loading, setLoading] = useState(false);
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
            // Reset if opening in Add mode
            setFormData({
                company_name: '',
                role_title: '',
                status: 'APPLIED',
                date_applied: new Date().toISOString().split('T')[0],
                job_link: '',
                notes: ''
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (initialData) {
                // Update Mode
                await api.patch(`/applications/${initialData.id}/`, formData);
            } else {
                // Create Mode
                await api.post('/applications/', formData);
            }
            onJobSaved();
            onClose();
        } catch (error) {
            console.error("Failed to save job", error);
            alert("Failed to save job. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass-panel w-full max-w-lg relative overflow-hidden bg-[#0f172a] border-slate-700"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-6 border-b border-white/5">
                        <h2 className="text-xl font-bold text-white">{initialData ? 'Edit Application' : 'Add New Application'}</h2>
                        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-1 text-slate-400">Company Name</label>
                                <input
                                    type="text"
                                    name="company_name"
                                    required
                                    className="glass-input w-full"
                                    value={formData.company_name}
                                    onChange={handleChange}
                                    placeholder="e.g. Google"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-1 text-slate-400">Role Title</label>
                                <input
                                    type="text"
                                    name="role_title"
                                    required
                                    className="glass-input w-full"
                                    value={formData.role_title}
                                    onChange={handleChange}
                                    placeholder="e.g. Senior Frontend Engineer"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-400">Status</label>
                                <select
                                    name="status"
                                    className="glass-input w-full appearance-none bg-[#1e293b]"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="APPLIED">Applied</option>
                                    <option value="SCREENING">Screening</option>
                                    <option value="INTERVIEW">Interview</option>
                                    <option value="OFFER">Offer</option>
                                    <option value="REJECTED">Rejected</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-400">Date Applied</label>
                                <input
                                    type="date"
                                    name="date_applied"
                                    required
                                    className="glass-input w-full"
                                    value={formData.date_applied}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-1 text-slate-400">Job Link (Optional)</label>
                                <input
                                    type="url"
                                    name="job_link"
                                    className="glass-input w-full"
                                    value={formData.job_link}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg text-slate-400 hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="glass-button bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 border-indigo-500/30 flex items-center space-x-2"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                <span>{initialData ? 'Update' : 'Save'}</span>
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default JobModal;
