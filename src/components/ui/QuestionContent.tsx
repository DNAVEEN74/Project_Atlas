'use client';

import { MathText } from './MathText';

interface QuestionContentProps {
    /** Question text that may contain [IMAGE] placeholder */
    text: string;
    /** Image URL to insert at [IMAGE] position */
    imageUrl?: string;
    /** CSS class for the container */
    className?: string;
    /** Optional click handler for image zoom */
    onImageClick?: (url: string) => void;
}

/**
 * QuestionContent - Renders question text with embedded image
 * 
 * Place [IMAGE] in the text where the image should appear.
 * The component will split the text and render the image at that position.
 * 
 *   imageUrl="https://r2.dev/image.png"
 * />
 */
export function QuestionContent({ text, imageUrl, className = '', onImageClick }: QuestionContentProps) {
    // Check if text contains [IMAGE] placeholder
    const hasPlaceholder = text.includes('[IMAGE]');

    if (!hasPlaceholder || !imageUrl) {
        // No placeholder or no image - render normally
        return (
            <div className={className}>
                <MathText className="block">{text}</MathText>
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt="Question diagram"
                        className={`max-w-full rounded-lg my-4 ${onImageClick ? 'cursor-zoom-in hover:opacity-90 transition-opacity' : ''}`}
                        onClick={() => onImageClick?.(imageUrl)}
                    />
                )}
            </div>
        );
    }

    // Split text at [IMAGE] and render image in between
    const parts = text.split('[IMAGE]');

    return (
        <div className={className}>
            {parts.map((part, index) => (
                <span key={index}>
                    <MathText className="block">{part.trim()}</MathText>
                    {/* Insert image after each part except the last */}
                    {index < parts.length - 1 && (
                        <img
                            src={imageUrl}
                            alt="Question diagram"
                            className={`max-w-full rounded-lg my-4 mx-auto ${onImageClick ? 'cursor-zoom-in hover:opacity-90 transition-opacity' : ''}`}
                            onClick={() => onImageClick?.(imageUrl)}
                        />
                    )}
                </span>
            ))}
        </div>
    );
}

export default QuestionContent;
