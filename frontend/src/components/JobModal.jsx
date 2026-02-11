import { Fragment, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Input, Button } from './ui';

const STATUSES = ["APPLIED", "SCREENING", "INTERVIEW", "OFFER", "REJECTED"];

export default function JobModal({ isOpen, onClose, onSubmit, initialData }) {
    const [formData, setFormData] = useState({
        company_name: '',
        role_title: '',
        status: 'APPLIED',
        applied_date: new Date().toISOString().split('T')[0],
        notes: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                company_name: '',
                role_title: '',
                status: 'APPLIED',
                applied_date: new Date().toISOString().split('T')[0],
                notes: '',
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to save job'); // Simple error handling for now
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        style={{ pointerEvents: 'none' }}
                    >
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100" style={{ pointerEvents: 'auto' }}>
                            <div className="flex justify-between items-center p-6 border-b border-slate-100">
                                <h3 className="text-xl font-semibold text-slate-900">
                                    {initialData ? 'Edit Application' : 'New Application'}
                                </h3>
                                <button
                                    onClick={onClose}
                                    className="text-slate-400 hover:text-slate-500 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Company"
                                        required
                                        value={formData.company_name}
                                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                        className="w-full"
                                    />
                                    <Input
                                        label="Role"
                                        required
                                        value={formData.role_title}
                                        onChange={(e) => setFormData({ ...formData, role_title: e.target.value })}
                                        className="w-full"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                        <select
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        >
                                            {STATUSES.map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <Input
                                        label="Date Applied"
                                        type="date"
                                        required
                                        value={formData.applied_date}
                                        onChange={(e) => setFormData({ ...formData, applied_date: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                                    <textarea
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px]"
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        placeholder="Key contacts, interview notes, etc..."
                                    />
                                </div>

                                <div className="pt-2 flex justify-end gap-3">
                                    <Button type="button" variant="secondary" onClick={onClose} className="w-auto">
                                        Cancel
                                    </Button>
                                    <Button type="submit" isLoading={loading} className="w-auto">
                                        {initialData ? 'Save Changes' : 'Create Application'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
