'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameConfig, GameQuestion, Difficulty, DIFFICULTY_CONFIG } from './games-config';
import { CloseIcon, SpeedIcon, BoltIcon, FlashIcon } from '@/components/icons';
import { useAuth } from '@/contexts/AuthContext';

interface GameModalProps {
    game: GameConfig;
    isOpen: boolean;
    onClose: () => void;
    onScoreUpdate?: () => void;
}

export function GameModal({ game, isOpen, onClose, onScoreUpdate }: GameModalProps) {
    const { user } = useAuth();
    const [question, setQuestion] = useState<GameQuestion | null>(null);
    const [timeLeft, setTimeLeft] = useState(10);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [isNewRecord, setIsNewRecord] = useState(false);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [questionsAnswered, setQuestionsAnswered] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [isEntering, setIsEntering] = useState(true);
    const [showExitConfirm, setShowExitConfirm] = useState(false);

    // Difficulty System
    const [showDifficultySelector, setShowDifficultySelector] = useState(true);
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const gameStartTimeRef = useRef<number | null>(null);
    const TOTAL_QUESTIONS = 10;
    const hasSavedRef = useRef(false);

    // Save score when game is over (apply difficulty multiplier)
    useEffect(() => {
        if (gameOver && !hasSavedRef.current) {
            hasSavedRef.current = true;
            const finalScore = Math.round(score * DIFFICULTY_CONFIG[selectedDifficulty].scoreMultiplier);
            const timeTaken = gameStartTimeRef.current ? Math.round((Date.now() - gameStartTimeRef.current) / 1000) : 0;

            fetch('/api/games/save-score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gameId: game.id,
                    score: finalScore,
                    category: game.category.toUpperCase(),
                    difficulty: selectedDifficulty.toUpperCase(),
                    metrics: {
                        totalQuestions: TOTAL_QUESTIONS,
                        correctAnswers: correctCount,
                        timeTaken: timeTaken
                    }
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        if (data.data.isNewBest) setIsNewRecord(true);
                        if (onScoreUpdate) onScoreUpdate();
                    }
                })
                .catch(err => console.error('Failed to save score:', err));
        }
    }, [gameOver, game, score, selectedDifficulty, onScoreUpdate, correctCount]);

    // Reset state when game starts/restarts
    useEffect(() => {
        if (isOpen && !gameOver && questionsAnswered === 0) {
            hasSavedRef.current = false;
            setShowDifficultySelector(true);
        }
    }, [isOpen, gameOver, questionsAnswered]);

    const nextQuestion = useCallback(() => {
        if (questionsAnswered >= TOTAL_QUESTIONS) {
            setGameOver(true);
            return;
        }

        setIsExiting(true);

        setTimeout(() => {
            setQuestion(game.generateQuestion(selectedDifficulty));
            setTimeLeft(DIFFICULTY_CONFIG[selectedDifficulty].timePerQuestion);
            setSelectedIndex(null);
            setShowResult(false);
            setIsPaused(false);
            setIsExiting(false);
            setIsEntering(true);

            setTimeout(() => setIsEntering(false), 300);
        }, 250);
    }, [game, questionsAnswered, selectedDifficulty]);

    // Initialize first question after difficulty selection
    useEffect(() => {
        if (isOpen && !gameOver && !question && !showDifficultySelector) {
            setQuestion(game.generateQuestion(selectedDifficulty));
            setTimeLeft(DIFFICULTY_CONFIG[selectedDifficulty].timePerQuestion);
            setTimeout(() => setIsEntering(false), 300);
        }
    }, [isOpen, gameOver, game, question, showDifficultySelector, selectedDifficulty]);

    // Timer countdown
    useEffect(() => {
        if (!isOpen || showResult || isPaused || gameOver || isExiting) return;

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleAnswer(-1);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isOpen, showResult, isPaused, gameOver, isExiting]);

    const handleAnswer = useCallback((index: number) => {
        if (showResult || gameOver || isExiting) return;

        if (timerRef.current) clearInterval(timerRef.current);

        setSelectedIndex(index);
        setShowResult(true);

        const correct = question?.correctIndex === index;
        setIsCorrect(correct);

        if (correct) {
            setScore(prev => prev + 10 + (timeLeft * 5) + streak * 2);
            setStreak(prev => prev + 1);
            setCorrectCount(prev => prev + 1);
        } else {
            setStreak(0);
        }

        setIsPaused(true);

        const delay = correct ? 500 : 1200;
        setTimeout(() => {
            const newCount = questionsAnswered + 1;
            setQuestionsAnswered(newCount);

            if (newCount >= TOTAL_QUESTIONS) {
                setGameOver(true);
            } else {
                nextQuestion();
            }
        }, delay);
    }, [showResult, question, streak, questionsAnswered, nextQuestion, gameOver, isExiting]);

    // Keyboard controls
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (showExitConfirm) resumeGame(); // Esc closes confirm if open
                else handleClose();
            } else if (!showResult && !gameOver && !isExiting && !isPaused && !showExitConfirm) {
                if (e.key === '1') handleAnswer(0);
                else if (e.key === '2') handleAnswer(1);
                else if (e.key === '3') handleAnswer(2);
                else if (e.key === '4') handleAnswer(3);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, showResult, gameOver, isExiting, handleAnswer, showExitConfirm, isPaused]);

    const resetGame = () => {
        setScore(0);
        setStreak(0);
        setCorrectCount(0);
        setQuestionsAnswered(0);
        setGameOver(false);
        setIsNewRecord(false);
        setQuestion(null);
        setIsEntering(true);
        setShowExitConfirm(false);
        setIsPaused(false);
        setShowDifficultySelector(true); // Show difficulty selector for new game
        gameStartTimeRef.current = null;
    };

    const handleClose = () => {
        // Intercept close if game is active
        if (!gameOver && questionsAnswered > 0 && !showExitConfirm) {
            setIsPaused(true); // Pause the game
            setShowExitConfirm(true);
            return;
        }
        confirmExit();
    };

    const confirmExit = () => {
        setScore(0);
        setStreak(0);
        setCorrectCount(0);
        setQuestionsAnswered(0);
        setGameOver(false);
        setIsNewRecord(false);
        setQuestion(null);
        setShowExitConfirm(false);
        setIsPaused(false);
        onClose();
    };

    const resumeGame = () => {
        setShowExitConfirm(false);
        setIsPaused(false);
    };

    if (!isOpen) return null;

    // --- DIFFICULTY SELECTOR SCREEN ---
    if (showDifficultySelector) {
        const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
        const icons = {
            easy: <SpeedIcon sx={{ fontSize: 36 }} />,
            medium: <BoltIcon sx={{ fontSize: 36 }} />,
            hard: <FlashIcon sx={{ fontSize: 36 }} />
        };

        return (
            <div className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center z-50 overflow-hidden">
                {/* Subtle background glow */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.08)_0%,_transparent_60%)]" />

                <div className="relative z-10 text-center max-w-2xl w-full px-6">
                    {/* Game Icon */}
                    <div className="text-6xl mb-4 text-white">{game.icon}</div>

                    {/* Game Title */}
                    <h2 className="text-3xl font-black text-white mb-2 tracking-tight">{game.name}</h2>
                    <p className="text-neutral-500 text-sm mb-10">{game.description}</p>

                    {/* Difficulty Label */}
                    <p className="text-[10px] text-neutral-500 uppercase tracking-[0.2em] font-semibold mb-5">Select Difficulty</p>

                    {/* Difficulty Buttons */}
                    <div className="grid grid-cols-3 gap-4 mb-10">
                        {difficulties.map(d => {
                            const cfg = DIFFICULTY_CONFIG[d];
                            const isSelected = selectedDifficulty === d;
                            return (
                                <button
                                    key={d}
                                    onClick={() => setSelectedDifficulty(d)}
                                    className={`group relative p-6 rounded-2xl transition-all duration-200 ${isSelected
                                        ? `bg-gradient-to-br ${cfg.color} scale-[1.06] shadow-xl shadow-current/25 ring-2 ring-white/20`
                                        : 'bg-neutral-900/90 border border-white/[0.08] hover:border-white/15 hover:bg-neutral-800/90'
                                        }`}
                                >
                                    {/* Icon */}
                                    <div className={`mb-3 transition-colors ${isSelected ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-400'
                                        }`}>
                                        {icons[d]}
                                    </div>

                                    {/* Label */}
                                    <div className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-neutral-300'}`}>
                                        {cfg.label}
                                    </div>

                                    {/* Description */}
                                    <div className={`text-xs mt-1 ${isSelected ? 'text-white/70' : 'text-neutral-500'}`}>
                                        {cfg.description}
                                    </div>

                                    {/* Stats */}
                                    <div className={`flex justify-center gap-4 mt-4 text-xs font-medium ${isSelected ? 'text-white/80' : 'text-neutral-500'
                                        }`}>
                                        <span>⏱ {cfg.timePerQuestion}s</span>
                                        <span>× {cfg.scoreMultiplier}x</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Start Button */}
                    <button
                        onClick={() => {
                            setShowDifficultySelector(false);
                            gameStartTimeRef.current = Date.now();
                        }}
                        className="px-12 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-lg rounded-full shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                    >
                        Start Game
                    </button>

                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-0 right-0 p-2 text-neutral-600 hover:text-neutral-400 transition-colors"
                    >
                        <CloseIcon />
                    </button>
                </div>
            </div>
        );
    }

    // Timer glow effect - subtle edge glow when time is low
    const timerGlow = timeLeft <= 3
        ? 'shadow-[inset_0_0_100px_rgba(239,68,68,0.15)]'
        : timeLeft <= 5
            ? 'shadow-[inset_0_0_80px_rgba(245,158,11,0.1)]'
            : '';

    // Determine Result Theme
    const isPerfect = correctCount === 10;
    const isGood = correctCount >= 7;
    const isBad = correctCount < 4;

    const resultTitle = isNewRecord ? "New Personal Best!" : isPerfect ? "Perfection!" : isGood ? "Great Job!" : isBad ? "Keep Training" : "Well Done";
    const resultColor = isNewRecord ? "text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" : isPerfect ? "text-amber-400" : isGood ? "text-emerald-400" : isBad ? "text-neutral-400" : "text-white";
    const bgGlow = isNewRecord ? "from-amber-500/20 via-orange-500/10" : isGood ? "from-emerald-500/20 via-teal-500/10" : isBad ? "from-red-500/10 via-neutral-900" : "from-blue-500/20 via-indigo-500/10";

    if (gameOver) {
        return (
            <div className={`fixed inset-0 bg-[#050505] flex flex-col items-center justify-center z-50 overflow-hidden`}>
                {/* Immersive Background */}
                <div className={`absolute inset-0 bg-gradient-radial ${bgGlow} to-black opacity-50`} />

                {/* Simple Confetti (CSS dots) for New Record */}
                {isNewRecord && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="absolute w-2 h-2 bg-amber-400 rounded-full animate-pulse"
                                style={{
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 2}s`,
                                    opacity: 0.6
                                }}
                            />
                        ))}
                    </div>
                )}

                <div className="relative z-10 text-center animate-fade-in max-w-md w-full px-6">
                    {/* Trophy / Icon - Bouncing */}
                    <div className="text-8xl mb-6 transform -rotate-12 drop-shadow-2xl animate-bounce-slow">
                        {isNewRecord ? "🏆" : isPerfect ? "🌟" : isGood ? "🔥" : isBad ? "💪" : "✨"}
                    </div>

                    {/* Title */}
                    <h2 className={`text-5xl font-black mb-2 tracking-tight ${resultColor}`}>
                        {resultTitle}
                    </h2>

                    {/* Subtitle */}
                    <p className="text-neutral-500 text-lg mb-10 font-medium">
                        {isNewRecord ? "You smashed your previous record!" : isBad ? "Don't give up. Consistency is key." : "Solid performance."}
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-12">
                        <div className="bg-neutral-900/50 backdrop-blur-md border border-white/5 rounded-3xl p-6">
                            <div className="text-4xl font-bold text-white mb-1">{correctCount}<span className="text-neutral-600 text-2xl">/{TOTAL_QUESTIONS}</span></div>
                            <div className="text-xs text-neutral-500 uppercase tracking-widest font-bold">Accuracy</div>
                        </div>
                        <div className="bg-neutral-900/50 backdrop-blur-md border border-white/5 rounded-3xl p-6">
                            <div className="text-4xl font-bold text-amber-500 mb-1">{score}</div>
                            <div className="text-xs text-neutral-500 uppercase tracking-widest font-bold">Points</div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={handleClose}
                            className="px-8 py-4 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white text-base font-bold rounded-2xl transition-all border border-transparent hover:border-neutral-700"
                        >
                            Exit
                        </button>
                        <button
                            onClick={resetGame}
                            className="px-10 py-4 text-white text-lg font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl bg-gradient-to-r from-amber-500 to-orange-600 shadow-orange-500/25"
                        >
                            Play Again
                        </button>
                    </div>
                </div>

                <style jsx>{`
                    @keyframes bounce-slow {
                        0%, 100% { transform: translateY(-5%) rotate(-12deg); }
                        50% { transform: translateY(5%) rotate(-8deg); }
                    }
                    .animate-bounce-slow {
                        animation: bounce-slow 3s infinite ease-in-out;
                    }
                 `}</style>
            </div>
        );
    }

    return (
        <div className={`fixed inset-0 bg-black/95 backdrop-blur-sm flex flex-col z-50 ${timerGlow} transition-shadow duration-500`}>
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900/50 via-black to-black -z-10" />

            {/* Timer Progress Bar - Top of Screen */}
            {!gameOver && (
                <div className="absolute top-0 left-0 w-full h-1.5 z-20">
                    <div
                        className="h-full transition-all duration-1000 ease-linear shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                        style={{
                            width: `${(timeLeft / 10) * 100}%`,
                            backgroundColor: timeLeft > 6 ? '#10b981' : timeLeft > 3 ? '#f59e0b' : '#ef4444',
                            boxShadow: `0 0 10px ${timeLeft > 6 ? '#10b981' : timeLeft > 3 ? '#f59e0b' : '#ef4444'}`
                        }}
                    />
                </div>
            )}

            {/* Exit Confirmation Modal */}
            {/* Exit Confirmation Modal */}
            {showExitConfirm && (
                <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-fade-in p-4">
                    <div className="relative bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-10 max-w-lg w-full text-center shadow-2xl overflow-hidden">
                        {/* Ambient Glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-orange-500/20 blur-[80px] pointer-events-none" />

                        <div className="relative z-10">
                            {/* Emoji with Glow */}
                            <div className="text-8xl mb-8 transform -rotate-6 animate-bounce-slow drop-shadow-2xl">
                                🥺
                            </div>

                            <h3 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
                                Wait, <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">{user?.name?.split(' ')[0] || 'Friend'}</span>!
                            </h3>

                            <p className="text-neutral-400 text-lg mb-10 leading-relaxed font-medium px-4">
                                {streak > 2
                                    ? <span>You're on a <span className="text-orange-400 font-bold">{streak}-streak</span>! 🔥<br />Walking away now breaks your rhythm.</span>
                                    : "You're doing great. Consistency is the definition of mastery. Finish this round?"
                                }
                            </p>

                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={resumeGame}
                                    className="group relative w-full py-5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl font-black text-xl text-white shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                    <span className="relative flex items-center justify-center gap-2">
                                        No, Keep Playing! <span className="text-2xl">🚀</span>
                                    </span>
                                </button>

                                <button
                                    onClick={confirmExit}
                                    className="w-full py-4 text-neutral-600 hover:text-neutral-400 font-bold text-sm tracking-widest uppercase transition-colors"
                                >
                                    I Give Up
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Bar - HUD Style */}
            <div className={`w-full flex items-center justify-between px-8 md:px-12 py-8 relative z-10 transition-opacity duration-500 ${!gameOver && !showResult ? 'opacity-30 hover:opacity-100' : 'opacity-100'}`}>

                {/* Score Capsule */}
                <div className="flex items-center gap-4 bg-neutral-900/60 backdrop-blur-md border border-white/10 rounded-full pl-5 pr-7 py-2.5 shadow-lg shadow-black/20">
                    <div className="text-3xl text-amber-500 flex items-center">{game.icon}</div>
                    <div className="h-8 w-px bg-white/15" />
                    <div className="flex flex-col justify-center">
                        <span className="text-3xl font-black text-white leading-none tracking-tight">{score}</span>
                        <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest leading-none mt-1">Score</span>
                    </div>

                    {streak > 1 && (
                        <>
                            <div className="h-8 w-px bg-white/15 mx-1" />
                            <div className="flex items-center gap-2">
                                <span className="text-xl">🔥</span>
                                <span className="text-xl font-bold text-orange-400">{streak}</span>
                            </div>
                        </>
                    )}
                </div>

                {/* Right Side Controls */}
                <div className="flex items-center gap-4">
                    {/* Progress Capsule */}
                    <div className="flex items-center gap-4 bg-neutral-900/60 backdrop-blur-md border border-white/10 rounded-full px-7 py-2.5 shadow-lg shadow-black/20">
                        <div className="flex flex-col items-end justify-center">
                            <span className="text-xl font-bold text-white leading-none">
                                {Math.min(questionsAnswered + 1, TOTAL_QUESTIONS)} <span className="text-neutral-500 text-lg">/ {TOTAL_QUESTIONS}</span>
                            </span>
                            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest leading-none mt-1">Question</span>
                        </div>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="group w-14 h-14 flex items-center justify-center bg-neutral-900/60 backdrop-blur-md border border-white/10 hover:bg-white/10 text-neutral-400 hover:text-white rounded-full transition-all duration-300 shadow-lg shadow-black/20 hover:scale-105 active:scale-95"
                        title="Press Esc to exit"
                    >
                        <CloseIcon sx={{ fontSize: '1.5rem' }} className="transition-transform duration-300 group-hover:rotate-90" />
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center px-8 pb-12">
                {/* Question Card - Large & Centered */}
                <div
                    className={`w-full max-w-4xl bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-16 mb-16 shadow-2xl shadow-black/80 backdrop-blur-2xl transition-all duration-300 relative overflow-hidden flex flex-col items-center justify-center min-h-[300px] ${isExiting ? 'opacity-0 -translate-y-8 scale-95' :
                        isEntering ? 'opacity-0 translate-y-8 scale-95' :
                            'opacity-100 translate-y-0 scale-100'
                        }`}
                >
                    {/* Glow effect for card (existing) */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    {/* Radial gradient center for focus */}
                    <div className="absolute inset-0 bg-gradient-radial from-white/5 to-transparent opacity-50 pointer-events-none" />

                    <p className="relative z-10 text-5xl md:text-6xl lg:text-7xl font-black text-white text-center leading-tight tracking-tight drop-shadow-lg">
                        {question?.question}
                    </p>
                </div>

                {/* Options Row - Large Buttons */}
                <div
                    className={`w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-300 ${isExiting ? 'opacity-0 -translate-y-8' :
                        isEntering ? 'opacity-0 translate-y-8' :
                            'opacity-100 translate-y-0'
                        }`}
                    style={{ transitionDelay: isEntering ? '50ms' : '0ms' }}
                >
                    {question?.options.map((option, index) => {
                        let styles = {
                            bg: 'bg-white/5 backdrop-blur-sm',
                            border: 'border-white/10',
                            text: 'text-neutral-200',
                            shadow: 'shadow-lg shadow-black/20',
                            scale: '',
                            badge: 'bg-white/5 text-neutral-500',
                        };

                        if (showResult) {
                            if (index === question.correctIndex) {
                                styles = {
                                    bg: 'bg-emerald-500/20',
                                    border: 'border-emerald-500',
                                    text: 'text-emerald-400',
                                    shadow: 'shadow-xl shadow-emerald-500/20',
                                    scale: 'scale-[1.02]',
                                    badge: 'bg-emerald-500/20 text-emerald-300',
                                };
                            } else if (index === selectedIndex && !isCorrect) {
                                styles = {
                                    bg: 'bg-rose-500/20',
                                    border: 'border-rose-500',
                                    text: 'text-rose-400',
                                    shadow: 'shadow-xl shadow-rose-500/20',
                                    scale: 'scale-[0.98]',
                                    badge: 'bg-rose-500/20 text-rose-300',
                                };
                            } else {
                                styles = {
                                    bg: 'bg-black/40',
                                    border: 'border-white/5',
                                    text: 'text-neutral-600',
                                    shadow: '',
                                    scale: 'opacity-50',
                                    badge: 'bg-transparent text-neutral-700',
                                };
                            }
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => handleAnswer(index)}
                                disabled={showResult || isExiting}
                                className={`
                                        group relative
                                        ${styles.bg} ${styles.text} ${styles.shadow} ${styles.scale}
                                        border ${styles.border}
                                        rounded-3xl py-10 px-8
                                        text-3xl md:text-4xl font-bold flex flex-col items-center justify-center gap-4
                                        transition-all duration-200 
                                        ${!showResult && !isExiting ? 'hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-500/5 cursor-pointer active:scale-[0.98]' : ''}
                                    `}
                            >
                                {/* Keyboard hint / Index Badge */}
                                <span className={`
                                    absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center 
                                    text-sm font-bold font-mono transition-colors
                                    ${styles.badge}
                                    ${!showResult ? 'group-hover:bg-white/10 group-hover:text-white' : ''}
                                `}>
                                    {index + 1}
                                </span>

                                {option}
                            </button>
                        );
                    })}
                </div>

                {/* Keyboard hints */}
                <div className="mt-8 text-center text-neutral-600 text-sm">
                    Press <kbd className="px-2 py-1 bg-neutral-800 rounded text-neutral-400 font-mono">1</kbd> - <kbd className="px-2 py-1 bg-neutral-800 rounded text-neutral-400 font-mono">4</kbd> to answer • <kbd className="px-2 py-1 bg-neutral-800 rounded text-neutral-400 font-mono">Esc</kbd> to exit
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fade-in 0.4s ease-out;
                }
            `}</style>
        </div>
    );
}
