import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './ui';

export default function DeleteModal({ isOpen, onClose, onConfirm, jobTitle, isLoading }) {
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
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-100" style={{ pointerEvents: 'auto' }}>
                            <div className="p-6 text-center">
                                <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                    <AlertTriangle className="w-6 h-6 text-red-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">Delete Application?</h3>
                                <p className="text-sm text-slate-500 mb-6">
                                    Are you sure you want to delete <span className="font-medium text-slate-900">{jobTitle}</span>? This action cannot be undone.
                                </p>

                                <div className="flex gap-3 justify-center">
                                    <Button variant="secondary" onClick={onClose} disabled={isLoading}>
                                        Cancel
                                    </Button>
                                    <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
