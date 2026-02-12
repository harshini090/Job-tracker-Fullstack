import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';

const DeleteModal = ({ isOpen, onClose, onConfirm, jobTitle }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass-panel w-full max-w-sm relative overflow-hidden bg-[#0f172a] border-red-500/30"
                >
                    <div className="p-6 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 mb-6 border border-red-500/20">
                            <Trash2 className="h-8 w-8 text-red-500" />
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">Delete Application?</h3>
                        <p className="text-slate-400 mb-6">
                            Are you sure you want to delete <span className="text-white font-medium">{jobTitle}</span>? This action cannot be undone.
                        </p>

                        <div className="flex space-x-3">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-2 rounded-lg text-slate-300 hover:bg-white/5 transition-colors border border-transparent font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transition-all font-medium flex items-center justify-center"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default DeleteModal;
