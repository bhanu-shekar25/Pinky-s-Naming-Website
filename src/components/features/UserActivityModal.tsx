"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, User, Sparkles } from "lucide-react";
import { Name } from "@/lib/types";
import { useEffect, useMemo } from "react";

interface UserActivityModalProps {
    isOpen: boolean;
    onClose: () => void;
    names: Name[];
    votedIds: string[];
    submittedIds: string[];
    onVote: (id: string) => void;
}

export function UserActivityModal({ isOpen, onClose, names, votedIds, submittedIds, onVote }: UserActivityModalProps) {

    const submittedNames = useMemo(() => {
        return names.filter(n => submittedIds.includes(n.id));
    }, [names, submittedIds]);

    const votedNames = useMemo(() => {
        return names.filter(n => votedIds.includes(n.id) && !submittedIds.includes(n.id));
    }, [names, votedIds, submittedIds]);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    const renderNameList = (list: Name[], emptyText: string) => {
        if (list.length === 0) {
            return (
                <div className="py-8 text-center text-foreground/30 italic text-sm">
                    {emptyText}
                </div>
            );
        }

        return (
            <div className="space-y-2">
                {list.map((name, index) => {
                    const isVoted = votedIds.includes(name.id);
                    return (
                        <motion.div
                            key={name.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className={`group flex items-center justify-between p-3 rounded-2xl transition-all bg-white border border-pink-50 hover:border-pink-100 shadow-sm`}
                        >
                            <div className="flex flex-col min-w-0 pr-4">
                                <div className="flex items-baseline gap-2">
                                    <span className="font-serif text-lg font-medium text-foreground truncate">
                                        {name.displayName}
                                    </span>
                                    {name.meaning && (
                                        <span className="text-xs text-foreground/40 truncate max-w-[150px]">
                                            {name.meaning}
                                        </span>
                                    )}
                                </div>
                                {name.addedBy && (
                                    <span className="text-[10px] text-foreground/30 font-medium uppercase tracking-wider">
                                        Added by {name.addedBy}
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={() => onVote(name.id)}
                                className={`
                                    flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm
                                    ${isVoted
                                        ? 'bg-pink-deep text-white shadow-pink-200'
                                        : 'bg-white text-gray-300 hover:text-pink-400 hover:scale-110 hover:shadow-md'
                                    }
                                `}
                            >
                                <Heart className={`w-5 h-5 ${isVoted ? 'fill-current' : ''}`} />
                            </button>
                        </motion.div>
                    );
                })}
            </div>
        );
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-4 md:inset-auto md:top-20 md:bottom-20 md:left-1/2 md:-translate-x-1/2 md:w-[500px] 
                                 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 z-[110] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-pink-100/50 bg-white/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-pink-50 rounded-2xl text-pink-deep">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-serif font-bold text-foreground">Your Activity</h2>
                                    <p className="text-xs text-foreground/50 font-medium">
                                        Tracker for your favorites & suggestions
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-black/5 rounded-full text-foreground/40 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8 relative scroll-smooth bg-gray-50/30">

                            {/* Submitted Section */}
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <Sparkles className="w-4 h-4 text-pink-deep" />
                                    <h3 className="font-serif text-lg font-bold text-foreground">Your Submissions</h3>
                                </div>
                                {renderNameList(submittedNames, "You haven't suggested any names yet.")}
                            </section>

                            {/* Voted Section */}
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <Heart className="w-4 h-4 text-pink-deep fill-pink-deep" />
                                    <h3 className="font-serif text-lg font-bold text-foreground">Your Favorites</h3>
                                </div>
                                {renderNameList(votedNames, "You haven't voted for any names yet.")}
                            </section>
                        </div>

                        {/* Footer Gradient Fade */}
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/90 to-transparent pointer-events-none" />
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
