import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, AlertTriangle } from 'lucide-react';

const DeleteModal = ({ isOpen, onClose, onConfirm, jobTitle }) => {
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
                        className="glass-panel w-full max-w-sm relative overflow-hidden bg-[#0f172a]/90 border-red-500/20 z-10"
                    >
                        <div className="p-8 text-center">
                            {/* Icon */}
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 mb-6 border border-red-500/20">
                                <Trash2 className="h-6 w-6 text-red-500" />
                            </div>

                            <h3 className="text-lg font-bold text-white mb-2">Delete Application?</h3>
                            <p className="text-slate-400 mb-8 text-sm leading-relaxed">
                                Are you sure you want to delete{' '}
                                <span className="text-slate-200 font-medium">{jobTitle}</span>?
                                <br />
                                <span className="text-slate-500 text-xs mt-1 block">This action cannot be undone.</span>
                            </p>

                            {/* Actions */}
                            <div className="flex space-x-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] transition-all font-medium border border-transparent cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all font-medium flex items-center justify-center space-x-2 cursor-pointer border border-red-500/50"
                                >
                                    <Trash2 size={16} />
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DeleteModal;
