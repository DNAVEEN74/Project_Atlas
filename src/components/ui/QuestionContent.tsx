'use client';

import { MathText } from './MathText';

interface QuestionContentProps {
    /** Question text that may contain [IMAGE] placeholder */
    text: string;
    /** Image URL to insert at [IMAGE] position */
    imageUrl?: string;
    /** CSS class for the container */
    className?: string;
}

/**
 * QuestionContent - Renders question text with embedded image
 * 
 * Place [IMAGE] in the text where the image should appear.
 * The component will split the text and render the image at that position.
 * 
 * Usage:
 * <QuestionContent 
 *   text="The table shows data: [IMAGE] What is the total?"
 *   imageUrl="https://r2.dev/image.png"
 * />
 */
export function QuestionContent({ text, imageUrl, className = '' }: QuestionContentProps) {
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
                        className="max-w-full rounded-lg my-4"
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
                            className="max-w-full rounded-lg my-4 mx-auto"
                        />
                    )}
                </span>
            ))}
        </div>
    );
}

export default QuestionContent;
