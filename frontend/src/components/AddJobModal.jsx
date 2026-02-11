import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2 } from 'lucide-react';
import api from '../api/axios';

const AddJobModal = ({ isOpen, onClose, onJobAdded }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        company_name: '',
        role_title: '',
        status: 'APPLIED',
        date_applied: new Date().toISOString().split('T')[0],
        job_link: '',
        notes: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/applications/', formData);
            onJobAdded();
            onClose();
            // Reset form
            setFormData({
                company_name: '',
                role_title: '',
                status: 'APPLIED',
                date_applied: new Date().toISOString().split('T')[0],
                job_link: '',
                notes: ''
            });
        } catch (error) {
            console.error("Failed to add job", error);
            alert("Failed to add job. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass-panel w-full max-w-lg relative overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-6 border-b border-white/10">
                        <h2 className="text-xl font-bold text-white">Add New Application</h2>
                        <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-1 text-white/70">Company Name</label>
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
                                <label className="block text-sm font-medium mb-1 text-white/70">Role Title</label>
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
                                <label className="block text-sm font-medium mb-1 text-white/70">Status</label>
                                <select
                                    name="status"
                                    className="glass-input w-full appearance-none bg-black/20"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="APPLIED" className="text-black">Applied</option>
                                    <option value="SCREENING" className="text-black">Screening</option>
                                    <option value="INTERVIEW" className="text-black">Interview</option>
                                    <option value="OFFER" className="text-black">Offer</option>
                                    <option value="REJECTED" className="text-black">Rejected</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-white/70">Date Applied</label>
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
                                <label className="block text-sm font-medium mb-1 text-white/70">Job Link (Optional)</label>
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
                                className="px-4 py-2 rounded-lg text-white/70 hover:bg-white/10 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="glass-button bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border-blue-500/30 flex items-center space-x-2"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                <span>Save Application</span>
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AddJobModal;
