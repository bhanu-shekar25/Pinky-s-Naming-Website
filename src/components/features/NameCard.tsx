"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Name } from "@/lib/types";
import { Button } from "@/components/ui/Button";

interface NameCardProps {
    nameData: Name;
    onVote: (id: string) => void;
    hasVoted: boolean;
    rank?: number; // For podium/list styling if needed
}

export function NameCard({ nameData, onVote, hasVoted, rank }: NameCardProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative p-4 rounded-3xl shadow-sm border transition-all duration-300
        ${hasVoted ? "bg-pink-soft/10 border-pink-soft/30" : "bg-white border-white hover:shadow-md hover:border-pink-soft/30"}
      `}
        >

            <div className="flex justify-between items-center gap-4">
                <div className="flex-1 min-w-0">
                    <h3 className="text-2xl font-serif text-foreground truncate capitalize">
                        {nameData.displayName}
                    </h3>
                    {nameData.meaning && (
                        <p className="text-sm text-foreground/60 italic truncate">
                            {nameData.meaning}
                        </p>
                    )}
                </div>

                <div className="flex flex-col items-center gap-1">
                    <Button
                        variant={hasVoted ? "secondary" : "primary"}
                        size="icon"
                        onClick={() => !hasVoted && onVote(nameData.id)}
                        disabled={hasVoted}
                        className={`rounded-full shadow-md transition-transform ${hasVoted ? "opacity-70 cursor-default" : "hover:scale-110"}`}
                        aria-label={`Vote for ${nameData.displayName}`}
                    >
                        <Heart
                            className={`w-5 h-5 transition-colors duration-300 ${hasVoted ? "fill-pink-deep text-pink-deep" : "fill-transparent"}`}
                        />
                    </Button>
                    <span className="text-xs font-bold text-foreground/50 tabular-nums">
                        {nameData.votes}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
