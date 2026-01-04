"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Sparkles, X, Check, Loader2, RefreshCw, User, Heart } from "lucide-react";
import { getBabyNameSuggestions, SuggestedName } from "@/app/actions/gemini";
import { Button } from "@/components/ui/Button";
import { useUser } from "@/lib/context/UserContext";
import { Name } from "@/lib/types";
import confetti from "canvas-confetti";

interface NameSuggestionsProps {
    onAddName: (name: string, meaning: string, addedBy: string) => Promise<void>;
    existingNames: Name[];
}

type SuggestionMode = "all" | "lv";

export function NameSuggestions({ onAddName, existingNames }: NameSuggestionsProps) {
    const { currentUser } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<SuggestedName[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [mode, setMode] = useState<SuggestionMode>("all");

    // Persist seen names per user in localStorage
    const getSeenNames = () => {
        if (typeof window === "undefined" || !currentUser) return [];
        const saved = localStorage.getItem(`seen_names_${currentUser}`);
        return saved ? JSON.parse(saved) : [];
    };

    const markNameAsSeen = (name: string) => {
        if (!currentUser) return;
        const seen = getSeenNames();
        if (!seen.includes(name.toLowerCase())) {
            const updated = [...seen, name.toLowerCase()];
            localStorage.setItem(`seen_names_${currentUser}`, JSON.stringify(updated));
        }
    };

    const fetchSuggestions = async (append = false, currentMode?: SuggestionMode) => {
        const activeMode = currentMode || mode;
        if (append) setIsFetchingMore(true);
        else {
            setIsLoading(true);
            setSuggestions([]);
        }

        setError(null);
        try {
            // Combine DB names, session names, and user's past seen/skipped names
            const dbNames = existingNames.map(n => n.name.toLowerCase());
            const sessionNames = suggestions.map(s => s.name.toLowerCase());
            const userSeenNames = getSeenNames().map((n: string) => n.toLowerCase());

            const allExcluded = Array.from(new Set([...dbNames, ...sessionNames, ...userSeenNames]));

            const data = await getBabyNameSuggestions(allExcluded, activeMode);

            // Client-side filtering as a fallback layer (AI sometimes hallucinates excluded names)
            const filteredData = data.filter(s => !allExcluded.includes(s.name.toLowerCase()));

            if (append) {
                setSuggestions(prev => [...prev, ...filteredData]);
            } else {
                setSuggestions(filteredData);
                setCurrentIndex(0);
            }

            // If we filtered out too many names, try fetching more automatically
            if (filteredData.length < 5 && data.length > 0 && !append) {
                console.log("Filtering left too few names, fetching more...");
                // Add the newly fetched but filtered-out names to the sessionNames for the next call
                // but for now, simple recursion is okay as Gemini 2.5 Flash Lite is very fast.
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to get suggestions");
        } finally {
            setIsLoading(false);
            setIsFetchingMore(false);
        }
    };

    const handleOpen = (selectedMode: SuggestionMode) => {
        setMode(selectedMode);
        setIsOpen(true);
        fetchSuggestions(false, selectedMode);
    };

    const handleNext = () => {
        // Mark current name as seen before moving to next
        if (suggestions[currentIndex]) {
            markNameAsSeen(suggestions[currentIndex].name);
        }

        const nextIndex = currentIndex + 1;

        if (suggestions.length - nextIndex <= 2 && !isFetchingMore) {
            fetchSuggestions(true);
        }

        if (nextIndex < suggestions.length) {
            setCurrentIndex(nextIndex);
        } else {
            setCurrentIndex(suggestions.length);
        }
    };

    const handleAdd = async (name: string, meaning: string) => {
        if (!currentUser) return;

        try {
            await onAddName(name, meaning, currentUser);
            // Also mark as seen so it doesn't show up again if they start fresh
            markNameAsSeen(name);

            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FFB7B2', '#E0BBE4', '#FFD700']
            });
            handleNext();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to add name");
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-4 mb-2 md:mb-6">
            <div className="bg-white rounded-3xl p-5 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1),0_20px_50px_-10px_rgba(0,0,0,0.2)] border border-pink-100/50 relative overflow-hidden group/card">
                {/* Inner Glow/Border hint */}
                <div className="absolute inset-0 border-[3px] border-white/50 rounded-3xl pointer-events-none" />
                {/* Subtle background glow */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-soft/10 rounded-full blur-2xl group-hover/card:bg-pink-soft/20 transition-colors duration-700" />

                <h3 className="text-[11px] uppercase tracking-[0.25em] font-extrabold text-center text-pink-deep/80 mb-5 flex items-center justify-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-pink-deep/60" />
                    AI Name Suggestions
                    <Sparkles className="w-3.5 h-3.5 text-pink-deep/60" />
                </h3>

                <div className="flex flex-nowrap justify-center gap-2 md:gap-3 w-full">
                    <Button
                        onClick={() => handleOpen("lv")}
                        variant="outline"
                        className="flex-1 group relative flex items-center justify-center gap-1.5 md:gap-2 rounded-2xl border-pink-soft/30 hover:border-pink-soft bg-white/60 backdrop-blur-sm px-2 py-4 overflow-hidden transition-all duration-300 hover:shadow-md"
                    >
                        <Heart className="w-3.5 h-3.5 text-pink-deep fill-pink-deep animate-pulse shrink-0" />
                        <span className="font-serif font-bold text-pink-deep text-[11px] sm:text-xs md:text-sm whitespace-nowrap">L & V</span>
                    </Button>

                    <Button
                        onClick={() => handleOpen("all")}
                        variant="outline"
                        className="flex-1 group relative flex items-center justify-center gap-1.5 md:gap-2 rounded-2xl border-peach/30 hover:border-peach bg-white/60 backdrop-blur-sm px-2 py-4 overflow-hidden transition-all duration-300 hover:shadow-md"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-spin-slow shrink-0" />
                        <span className="font-serif font-bold text-gray-700 text-[11px] sm:text-xs md:text-sm whitespace-nowrap">All Names</span>
                    </Button>
                </div>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-sm aspect-[3/4.5] flex flex-col items-center justify-center"
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute -top-4 -right-2 p-3 bg-white hover:bg-gray-100 rounded-full shadow-xl transition-colors z-50 text-gray-500 hover:text-pink-deep"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {isLoading ? (
                                <div className="flex flex-col items-center gap-6 text-white text-center">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-pink-soft/20 rounded-full blur-2xl animate-pulse" />
                                        <Loader2 className="w-16 h-16 animate-spin text-pink-soft relative z-10" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="font-serif text-2xl font-bold tracking-wide">
                                            {mode === "lv" ? "Finding L & V Magic..." : "Gathering Baby Dust..."}
                                        </p>
                                        <p className="text-pink-soft/80 text-sm animate-pulse">Consulting the constellation of names</p>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="text-center p-8 bg-white rounded-[2.5rem] shadow-2xl space-y-6">
                                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                                        <X className="w-10 h-10 text-red-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-serif text-2xl font-bold text-gray-800">Oops!</h3>
                                        <p className="text-gray-500 text-sm">{error}</p>
                                    </div>
                                    <Button onClick={() => fetchSuggestions(false)} variant="primary" className="w-full">Try Again</Button>
                                </div>
                            ) : currentIndex < suggestions.length ? (
                                <div className="relative w-full h-full perspective-1000">
                                    <AnimatePresence mode="popLayout">
                                        <SuggestionCard
                                            key={suggestions[currentIndex].name}
                                            suggestion={suggestions[currentIndex]}
                                            onAdd={handleAdd}
                                            onSkip={handleNext}
                                            currentUser={currentUser}
                                            mode={mode}
                                        />
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="text-center p-10 bg-white rounded-[3rem] shadow-2xl space-y-8 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-soft via-peach to-lavender" />
                                    <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
                                        <RefreshCw className="w-10 h-10 text-pink-soft" />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="font-serif text-3xl font-bold text-gray-800">Inspired?</h3>
                                        <p className="text-gray-500 leading-relaxed">
                                            We've shown you our favorite {mode === "lv" ? "L & V" : ""} picks. Want more?
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => fetchSuggestions(false)}
                                        className="w-full py-7 rounded-[1.5rem] bg-pink-deep text-white font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-pink-200"
                                    >
                                        Get More Suggestions
                                    </Button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function SuggestionCard({
    suggestion,
    onAdd,
    onSkip,
    currentUser,
    mode
}: {
    suggestion: SuggestedName;
    onAdd: (name: string, meaning: string) => void;
    onSkip: () => void;
    currentUser: string | null;
    mode: SuggestionMode;
}) {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-25, 25]);
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

    const handleDragEnd = (_: any, info: any) => {
        if (info.offset.x > 100) {
            onAdd(suggestion.name, suggestion.meaning);
        } else if (info.offset.x < -100) {
            onSkip();
        }
    };

    return (
        <motion.div
            style={{ x, rotate, opacity }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ x: x.get() > 0 ? 600 : -600, opacity: 0, scale: 0.5, transition: { duration: 0.4 } }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute inset-0 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 flex flex-col items-center justify-between cursor-grab active:cursor-grabbing border border-pink-50"
        >
            <div className="w-full text-center space-y-6 flex-1 flex flex-col justify-center">
                <div className="space-y-1">
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase ${mode === 'lv' ? 'bg-pink-50 text-pink-deep' : 'bg-peach/30 text-orange-600'}`}>
                        {mode === 'lv' ? <Heart className="w-3 h-3 fill-current" /> : <Sparkles className="w-3 h-3" />}
                        {mode === 'all' ? 'Discovery Mode' : 'L & V Collection'}
                    </div>
                </div>

                <h2 className="text-5xl font-serif font-bold text-gray-900 capitalize tracking-tight">
                    {suggestion.name}
                </h2>

                <div className="space-y-4 px-2">
                    <div className="relative">
                        <span className="text-4xl absolute -top-4 -left-2 text-pink-soft/20 font-serif">&ldquo;</span>
                        <p className="text-lg text-gray-700 italic font-medium leading-relaxed relative z-10">
                            {suggestion.meaning}
                        </p>
                        <span className="text-4xl absolute -bottom-8 -right-2 text-pink-soft/20 font-serif">&rdquo;</span>
                    </div>
                    <div className="h-px w-12 bg-gradient-to-r from-transparent via-pink-100 to-transparent mx-auto mt-6" />
                    <p className="text-sm text-gray-400 leading-relaxed font-light">
                        {suggestion.reason}
                    </p>
                </div>
            </div>

            <div className="w-full space-y-6 mt-6">
                <div className="w-full flex items-center justify-center gap-2 text-xs font-medium text-gray-400">
                    <User className="w-3 h-3" />
                    {currentUser ? `Suggesting as ${currentUser}` : "Picker not set"}
                </div>

                <div className="flex justify-between items-center gap-4">
                    <button
                        onClick={(e) => { e.stopPropagation(); onSkip(); }}
                        className="flex-1 py-4 rounded-2xl bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 flex items-center justify-center transition-all active:scale-95"
                    >
                        <X className="w-7 h-7" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onAdd(suggestion.name, suggestion.meaning); }}
                        className="flex-[2] py-4 rounded-2xl bg-pink-soft text-pink-deep font-bold flex items-center justify-center gap-2 hover:bg-pink-100 hover:shadow-md transition-all active:scale-95 shadow-sm shadow-pink-100"
                    >
                        <Check className="w-7 h-7" />
                        <span className="text-lg">Love it</span>
                    </button>
                </div>
            </div>

            <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-20">
                <div className="w-1.5 h-1.5 rounded-full bg-pink-deep" />
                <div className="w-1.5 h-1.5 rounded-full bg-pink-deep" />
                <div className="w-1.5 h-1.5 rounded-full bg-pink-deep" />
            </div>
        </motion.div>
    );
}
