'use client';

import { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';

interface OCRModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTextExtracted: (text: string) => void;
    title?: string;
}

/**
 * OCR Modal - Extract text from uploaded image
 * 
 * Opens a modal where user can upload an image, OCR extracts text,
 * user can edit and confirm. Image is NOT uploaded to R2.
 */
export function OCRModal({ isOpen, onClose, onTextExtracted, title = 'Extract Text from Image' }: OCRModalProps) {
    const [image, setImage] = useState<string | null>(null);
    const [extractedText, setExtractedText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Create preview URL (in-memory, not uploaded)
        const imageUrl = URL.createObjectURL(file);
        setImage(imageUrl);

        // Start OCR
        await performOCR(imageUrl);
    };

    const performOCR = async (imageUrl: string) => {
        setIsProcessing(true);
        setProgress(0);

        try {
            const result = await Tesseract.recognize(
                imageUrl,
                'eng', // English language
                {
                    logger: (m) => {
                        if (m.status === 'recognizing text') {
                            setProgress(Math.round(m.progress * 100));
                        }
                    },
                }
            );

            setExtractedText(result.data.text.trim());
        } catch (error) {
            console.error('OCR failed:', error);
            setExtractedText('[OCR Failed - Please try again or type manually]');
        }

        setIsProcessing(false);
    };

    const handleConfirm = () => {
        onTextExtracted(extractedText);
        handleClose();
    };

    const handleClose = () => {
        // Cleanup
        if (image) {
            URL.revokeObjectURL(image);
        }
        setImage(null);
        setExtractedText('');
        setProgress(0);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white text-2xl"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 space-y-4">
                    {/* Image Upload */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                    />

                    {!image ? (
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full py-12 border-2 border-dashed border-gray-600 rounded-xl 
                                       text-gray-400 hover:border-blue-500 hover:text-blue-400 transition
                                       flex flex-col items-center justify-center gap-2"
                        >
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-lg">Click to upload image for OCR</span>
                            <span className="text-sm text-gray-500">(Image will NOT be saved)</span>
                        </button>
                    ) : (
                        /* Image Preview */
                        <div className="relative">
                            <img
                                src={image}
                                alt="OCR source"
                                className="w-full max-h-48 object-contain rounded-lg border border-gray-600"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute top-2 right-2 bg-gray-900/80 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                            >
                                Change
                            </button>
                        </div>
                    )}

                    {/* Progress */}
                    {isProcessing && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-400">
                                <span>Extracting text...</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Extracted Text */}
                    {extractedText && !isProcessing && (
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Extracted Text (edit as needed):</label>
                            <textarea
                                value={extractedText}
                                onChange={(e) => setExtractedText(e.target.value)}
                                className="w-full h-40 bg-gray-900 border border-gray-600 rounded-lg p-3 
                                           text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder="Extracted text will appear here..."
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-700 flex justify-end gap-3">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!extractedText || isProcessing}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Apply Text
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OCRModal;
