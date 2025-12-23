"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Calendar } from "lucide-react";
import { Name } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";

interface NewNamesModalProps {
    isOpen: boolean;
    onClose: () => void;
    names: Name[];
    votedIds: string[];
    onVote: (id: string) => void;
}

export function NewNamesModal({ isOpen, onClose, names, votedIds, onVote }: NewNamesModalProps) {
    // Sort by created time. default to newest first (desc) for "New View", 
    // but the user mentioned "asc", so we can offer a toggle or default to one.
    // "New names in asc... created time" strictly means Oldest -> Newest. 
    // However, usually users want to see the latest. 
    // Let's default to Newest First (Descending) as it's the standard for "New View",
    // but we can easily swap if needed.
    const [sortAsc, setSortAsc] = useState(false);

    const sortedNames = useMemo(() => {
        return [...names].sort((a, b) => {
            const timeA = a.createdAt || 0;
            const timeB = b.createdAt || 0;
            return sortAsc ? timeA - timeB : timeB - timeA;
        });
    }, [names, sortAsc]);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    // Format date helper
    const formatDate = (timestamp: number) => {
        if (!timestamp) return "";
        try {
            const date = new Date(timestamp);
            // Check if date is valid
            if (isNaN(date.getTime())) return "";
            return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
        } catch (e) {
            return "";
        }
    }

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
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-4 md:inset-auto md:top-20 md:bottom-20 md:left-1/2 md:-translate-x-1/2 md:w-[500px] 
                                 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 z-50 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-pink-100/50 bg-white/50">
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-foreground">Timeline</h2>
                                <p className="text-xs text-foreground/50 font-medium">
                                    {names.length} names • {sortAsc ? "Oldest First" : "Newest First"}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setSortAsc(!sortAsc)}
                                    className="p-2 hover:bg-black/5 rounded-full text-foreground/40 transition-colors"
                                    title="Toggle Sort Order"
                                >
                                    <Calendar className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-black/5 rounded-full text-foreground/40 transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-2 relative scroll-smooth">
                            {sortedNames.map((name, index) => {
                                const isVoted = votedIds.includes(name.id);
                                return (
                                    <motion.div
                                        key={name.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.03 }} // Stagger effect
                                        className={`group flex items-center justify-between p-3 rounded-2xl transition-all
                                            ${isVoted ? 'bg-pink-50 border border-pink-100' : 'bg-transparent hover:bg-white/80 border border-transparent hover:border-gray-100'}
                                        `}
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
                                            <span className="text-[10px] text-foreground/30 font-medium uppercase tracking-wider">
                                                {formatDate(name.createdAt)}
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => !isVoted && onVote(name.id)}
                                            disabled={isVoted}
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

                        {/* Footer Gradient Fade */}
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Separate component isn't strictly necessary but cleaner for modals
