import React, { useState } from 'react';
import { CloseIcon, WarningIcon } from '@/components/icons';
import { useToast } from '@/contexts/ToastContext';
import { CustomSelect } from '@/components/ui/CustomSelect';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    questionId: string;
    questionTitle?: string;
}

export function ReportModal({ isOpen, onClose, questionId, questionTitle }: ReportModalProps) {
    const { success, error: notifyError } = useToast();
    const [reason, setReason] = useState<string>('Content Error');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason) return;

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    questionId,
                    reason,
                    description
                }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                success('Report submitted successfully. We will review it shortly.');
                onClose();
                setDescription('');
                setReason('Content Error');
            } else {
                notifyError(data.error || 'Failed to submit report');
            }
        } catch (error) {
            console.error('Report submission error:', error);
            notifyError('An error occurred while submitting the report');
        } finally {
            setIsSubmitting(false);
        }
    };

    const reportReasons = [
        { value: 'Content Error', label: 'Content Error (Typo, Wrong Value)' },
        { value: 'Wrong Answer', label: 'Wrong Answer / Solution' },
        { value: 'Image Missing', label: 'Image Missing / Unclear' },
        { value: 'Formatting Issue', label: 'Formatting Issue' },
        { value: 'Other', label: 'Other' }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-lg bg-[#1a1a1a] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center">
                            <WarningIcon sx={{ fontSize: '1.2rem' }} className="text-rose-500" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Report Issue</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors"
                    >
                        <CloseIcon sx={{ fontSize: '1.2rem' }} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    <div className="p-4 bg-neutral-900/50 rounded-xl border border-neutral-800">
                        <p className="text-xs text-neutral-500 uppercase font-semibold mb-1">Question ID</p>
                        <p className="text-neutral-300 font-mono text-sm">{questionId}</p>
                        {questionTitle && (
                            <p className="text-neutral-400 text-sm mt-1 line-clamp-2">{questionTitle}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Reason</label>
                        <CustomSelect
                            value={reason}
                            onChange={setReason}
                            options={reportReasons}
                            placeholder="Select a reason"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Description (Optional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Please provide more details about the issue..."
                            className="w-full h-32 px-4 py-3 bg-[#0f0f0f] border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all resize-none text-sm"
                        />
                    </div>

                    <div className="pt-2 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !reason}
                            className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors shadow-lg shadow-rose-600/20"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Report'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
