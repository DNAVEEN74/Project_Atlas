"use client";

import React, { useState, useRef, useEffect } from 'react';
import { PsychologyOutlinedIcon, CloseIcon, CopyIcon, CheckIcon, DeleteIcon } from '@/components/icons';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { MathText } from '@/components/ui/MathText';

interface Message {
    role: 'user' | 'model';
    content: string;
}

export function AskAIClarification({ questionId }: { questionId: string }) {
    const { user } = useAuth();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [limitReached, setLimitReached] = useState(false);
    const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    const handleCopy = (text: string, idx: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 2000);
    };

    const handleClear = () => {
        setMessages([]);
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                wrapperRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }, 100);
        }
    }, [isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput('');
        const newMessages = [...messages, { role: 'user' as const, content: userMsg }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const res = await fetch('/api/ai/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ questionId, messages: newMessages }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                if (data.error === 'LIMIT_REACHED') {
                    setLimitReached(true);
                } else {
                    setMessages(prev => [...prev, { role: 'model', content: "Sorry, I couldn't process that right now." }]);
                }
                setIsLoading(false);
                return;
            }

            if (!res.body) throw new Error("No readable stream");

            setIsLoading(false); // Remove initial bounce loader

            // Add initial empty model message
            setMessages(prev => [...prev, { role: 'model', content: '' }]);

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let modelOutput = '';

            let done = false;
            while (!done) {
                const { value, done: readerDone } = await reader.read();
                done = readerDone;
                if (value) {
                    const chunk = decoder.decode(value, { stream: true });
                    modelOutput += chunk;

                    setMessages(prev => {
                        const updated = [...prev];
                        updated[updated.length - 1] = {
                            ...updated[updated.length - 1],
                            content: modelOutput
                        };
                        return updated;
                    });
                }
            }

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'model', content: "An error occurred while connecting to AI." }]);
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    };

    if (limitReached) {
        return (
            <div className="mt-4 p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl text-center">
                <PsychologyOutlinedIcon sx={{ fontSize: '2.5rem' }} className="text-amber-500 mb-3" />
                <h3 className="text-lg font-bold text-amber-400 mb-2">Limit Reached</h3>
                <p className="text-neutral-300 text-sm mb-4">
                    You've reached your 2 free AI clarifications. Get Premium to ask unlimited follow-up questions for every problem!
                </p>
                <button
                    onClick={() => router.push('/pricing')}
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/20"
                >
                    Upgrade to Premium
                </button>
            </div>
        );
    }

    if (!isOpen) {
        return (
            <div className="mt-4 flex justify-center">
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-400 font-bold hover:bg-violet-500/20 hover:scale-105 transition-all shadow-lg shadow-violet-500/5"
                >
                    <PsychologyOutlinedIcon sx={{ fontSize: '1.2rem' }} />
                    Ask AI Tutor
                </button>
            </div>
        );
    }

    return (
        <div ref={wrapperRef} className="mt-6 bg-[#1a1a1a] border border-violet-500/30 rounded-xl overflow-hidden shadow-2xl shadow-violet-500/5">
            {/* Header */}
            <div className="p-3 bg-violet-500/10 border-b border-violet-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <PsychologyOutlinedIcon className="text-violet-400" />
                    <span className="font-bold text-violet-400 text-sm">AI Tutor</span>
                    {!((user as any)?.config?.is_premium || (user as any)?.subscription?.status === 'ACTIVE') && (
                        <span className="text-[10px] font-bold bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full border border-neutral-700 uppercase tracking-wider">
                            Free Trial
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    {messages.length > 0 && (
                        <button
                            onClick={handleClear}
                            className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors"
                            title="Clear Chat"
                        >
                            <DeleteIcon sx={{ fontSize: '1rem' }} />
                        </button>
                    )}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1.5 text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 rounded-lg transition-colors"
                        title="Close Tutor"
                    >
                        <CloseIcon sx={{ fontSize: '1rem' }} />
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            <div ref={chatContainerRef} className="p-6 h-[400px] overflow-y-auto space-y-6" style={{ scrollbarWidth: 'thin', scrollbarColor: '#8b5cf6 transparent' }}>
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center px-4">
                        <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center mb-3">
                            <PsychologyOutlinedIcon sx={{ fontSize: '1.5rem' }} className="text-violet-400" />
                        </div>
                        <p className="text-neutral-400 text-sm">
                            Got a question about this problem or its solution? Tell me what you're stuck on!
                        </p>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-4 rounded-2xl text-[15px] leading-relaxed font-medium ${msg.role === 'user'
                                    ? 'bg-amber-500/10 border border-amber-500/30 text-amber-50 rounded-tr-none shadow-sm shadow-amber-500/5'
                                    : 'bg-neutral-800 border border-neutral-700 text-neutral-200 rounded-tl-none shadow-sm shadow-black/20'
                                }`}>
                                <div className="space-y-4">
                                    {msg.content.split('\n').map((line, lIdx) => {
                                        if (!line.trim()) return null;
                                        // Simple markdown parsing for bold text before passing to MathText
                                        const processedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-amber-400 font-bold">$1</strong>');
                                        return (
                                            <div key={lIdx} className={line.trim().startsWith('- ') || line.trim().startsWith('• ') ? "pl-4" : ""}>
                                                <MathText>{processedLine}</MathText>
                                            </div>
                                        );
                                    })}
                                </div>
                                {msg.role === 'model' && msg.content && !isLoading && (
                                    <div className="mt-3 flex justify-end">
                                        <button
                                            onClick={() => handleCopy(msg.content, idx)}
                                            className="text-neutral-500 hover:text-neutral-300 transition-colors"
                                        >
                                            {copiedIdx === idx ? <CheckIcon sx={{ fontSize: '1rem' }} className="text-emerald-400" /> : <CopyIcon sx={{ fontSize: '1rem' }} />}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="max-w-[85%] p-3 rounded-2xl bg-neutral-800 border border-neutral-700 text-neutral-400 rounded-tl-none flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-neutral-800 bg-neutral-900/50 flex gap-3">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about the solution..."
                    className="flex-1 bg-[#151515] text-white placeholder-neutral-500 text-[15px] rounded-xl px-5 py-3 outline-none focus:ring-1 focus:ring-violet-500/50 border border-neutral-700/50 transition-all"
                    disabled={isLoading}
                />
                <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
