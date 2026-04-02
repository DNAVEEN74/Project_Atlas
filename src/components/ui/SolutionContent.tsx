import React from 'react';
import { MathText } from './MathText';

export function SolutionContent({ solution }: { solution: string }) {
    const lines = solution.split('\n').filter(line => line.trim());

    // Group lines into blocks
    const blocks: { header?: string; content: string[] }[] = [];
    let currentBlock: { header?: string; content: string[] } | null = null;

    lines.forEach(line => {
        const trimmedLine = line.trim();
        const boldHeaderMatch = trimmedLine.match(/^\*\*([^*]+)\*\*:?\s*(.*)/);

        if (boldHeaderMatch) {
            const [, headerText, remainingText] = boldHeaderMatch;
            currentBlock = { header: headerText, content: [] };
            if (remainingText) currentBlock.content.push(remainingText);
            blocks.push(currentBlock);
        } else {
            if (!currentBlock) {
                currentBlock = { content: [] };
                blocks.push(currentBlock);
            }
            currentBlock.content.push(trimmedLine);
        }
    });

    return (
        <div className="space-y-8 py-4">
            {blocks.map((block, bIdx) => (
                <div key={bIdx} className="relative pl-10 group">
                    {/* Vertical Connector Line */}
                    {bIdx !== blocks.length - 1 && (
                        <div className="absolute left-[7px] top-8 bottom-[-32px] w-px bg-neutral-800 group-hover:bg-amber-500/30 transition-colors" />
                    )}

                    {/* Step Indicator Dot */}
                    <div className="absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-neutral-700 bg-[#0f0f0f] z-10 group-hover:border-amber-500 transition-colors flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-neutral-700 group-hover:bg-amber-500 transition-colors" />
                    </div>

                    {block.header && (
                        <h3 className="text-amber-500 text-xs font-black uppercase tracking-[0.2em] mb-4">
                            {block.header}
                        </h3>
                    )}

                    <div className="space-y-4">
                        {block.content.map((item, iIdx) => {
                            const trimmedItem = item.trim();

                            if (trimmedItem.startsWith('- ') || trimmedItem.startsWith('• ')) {
                                const bulletText = trimmedItem.substring(2);
                                return (
                                    <div key={iIdx} className="flex gap-4 text-neutral-300 text-[15px] leading-relaxed">
                                        <div className="mt-2.5 w-1 h-1 rounded-full bg-neutral-600 shrink-0" />
                                        <MathText>{bulletText}</MathText>
                                    </div>
                                );
                            }

                            if (trimmedItem.startsWith('$$') && trimmedItem.endsWith('$$')) {
                                return (
                                    <div key={iIdx} className="my-2 flex justify-center items-center overflow-x-auto custom-scrollbar-horizontal">
                                        <MathText>{trimmedItem}</MathText>
                                    </div>
                                );
                            }

                            return (
                                <div key={iIdx} className="text-neutral-200 text-[16px] leading-relaxed font-medium">
                                    <MathText>{trimmedItem}</MathText>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
