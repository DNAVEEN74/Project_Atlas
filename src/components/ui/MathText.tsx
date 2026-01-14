'use client';

import { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathTextProps {
    /** Text that may contain inline LaTeX */
    children: string;
    /** Additional CSS class */
    className?: string;
}

/**
 * MathText - Smart LaTeX/Math renderer component
 * 
 * Auto-detects and renders:
 * - Inline math: \(...\) or $...$
 * - Display math: \[...\] or $$...$$
 * 
 * If no LaTeX delimiters found, renders plain text.
 *
 * Usage:
 * <MathText>Find the value of \(x^2 + y^2\) when x = 3</MathText>
 * <MathText>Plain text without math is also fine</MathText>
 */
export function MathText({ children, className = '' }: MathTextProps) {
    const { html, hasMath } = useMemo(() => {
        if (!children) return { html: '', hasMath: false };

        let text = children;
        let foundMath = false;

        // Check if text contains any LaTeX delimiters
        const hasLatex = /\\\(|\\\[|\$/.test(text);

        // Check if text contains bare LaTeX commands (without delimiters)
        const latexCommands = /\\(frac|sqrt|text|triangle|times|div|cdot|pm|geq|leq|neq|approx|sum|prod|int|alpha|beta|gamma|Delta|Sigma|pi|theta|infty|partial|nabla|forall|exists|in|subset|cup|cap|angle|degree|circ|sin|cos|tan|log|ln|lim|rightarrow|leftarrow|Rightarrow|Leftarrow)/;
        const hasBareLatex = !hasLatex && latexCommands.test(text);

        if (hasBareLatex) {
            // Auto-wrap in $ delimiters if bare LaTeX commands are detected
            text = `$${text}$`;
            foundMath = true;
        }

        if (!hasLatex && !hasBareLatex) {
            // No LaTeX delimiters or commands - clean up any escaped characters and return
            const cleaned = text
                .replace(/\\%/g, '%')
                .replace(/\\#/g, '#')
                .replace(/\\&/g, '&')
                .replace(/\\_/g, '_');
            return { html: cleaned, hasMath: false };
        }

        // Process $$...$$ display math FIRST (before single $)
        text = text.replace(/\$\$([^$]+)\$\$/g, (_, math) => {
            foundMath = true;
            try {
                return katex.renderToString(math.trim(), {
                    throwOnError: false,
                    displayMode: true
                });
            } catch {
                return `$$${math}$$`;
            }
        });

        // Process \[...\] display math
        text = text.replace(/\\\[([^\]]+)\\\]/g, (_, math) => {
            foundMath = true;
            try {
                return katex.renderToString(math.trim(), {
                    throwOnError: false,
                    displayMode: true
                });
            } catch {
                return `\\[${math}\\]`;
            }
        });

        // Process \(...\) inline math
        text = text.replace(/\\\(([^)]+)\\\)/g, (_, math) => {
            foundMath = true;
            try {
                return katex.renderToString(math.trim(), {
                    throwOnError: false,
                    displayMode: false
                });
            } catch {
                return `\\(${math}\\)`;
            }
        });

        // Process $...$ inline math (single dollar signs, not already processed)
        // Only match single $ that are not part of $$
        text = text.replace(/\$([^$\n]+)\$/g, (match, math) => {
            // Skip if already rendered (contains katex html)
            if (match.includes('katex')) return match;
            foundMath = true;
            try {
                return katex.renderToString(math.trim(), {
                    throwOnError: false,
                    displayMode: false
                });
            } catch {
                return `$${math}$`;
            }
        });

        return { html: text, hasMath: foundMath };
    }, [children]);

    // If no math found, render cleaned text (escaped chars converted)
    if (!hasMath) {
        return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
    }

    return (
        <span
            className={className}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}

/**
 * MathBlock - For standalone display math equations
 */
export function MathBlock({
    children,
    className = ''
}: {
    children: string;
    className?: string;
}) {
    const rendered = useMemo(() => {
        if (!children) return '';
        try {
            return katex.renderToString(children, {
                throwOnError: false,
                displayMode: true
            });
        } catch {
            return children;
        }
    }, [children]);

    return (
        <div
            className={`text-center my-4 ${className}`}
            dangerouslySetInnerHTML={{ __html: rendered }}
        />
    );
}

export default MathText;
