"use client";

import { motion } from "framer-motion";
import { Crown, Sparkles } from "lucide-react";
import { Name } from "@/lib/types";

interface PodiumProps {
    topNames: Name[];
}

export function Podium({ topNames }: PodiumProps) {
    if (topNames.length === 0) return null;

    // Ensure we have 3 spots
    const podiumOrder = [
        topNames[1] ?? null, // Silver (Left)
        topNames[0] ?? null, // Gold (Center)
        topNames[2] ?? null, // Bronze (Right)
    ];

    return (
        <div className="w-full max-w-4xl mx-auto mb-1 mt-6 px-2 md:px-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-20"
            >
                <h2 className="text-3xl md:text-4xl font-serif text-foreground font-bold flex items-center justify-center gap-3">
                    <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
                    <span>Fan Favorites</span>
                    <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
                </h2>
                <div className="h-1 w-24 bg-gradient-to-r from-transparent via-pink-deep to-transparent mx-auto mt-2 opacity-50 rounded-full" />
            </motion.div>

            <div className="flex items-end justify-center gap-2 md:gap-6 min-h-[220px]">
                {podiumOrder.map((name, index) => {
                    // Spacer for empty slots
                    if (!name && index !== 1) return <div key={index} className="flex-1 max-w-[140px] md:max-w-[200px]" />;
                    if (!name) return null;

                    const rank = index === 1 ? 1 : index === 0 ? 2 : 3;

                    // Dynamic Styles based on rank
                    const isWinner = rank === 1;
                    const scale = isWinner ? "scale-100 z-20" : "scale-90 z-10 opacity-90 hover:opacity-100 hover:scale-95 transition-all";
                    const yOffset = isWinner ? "mb-6" : "mb-0";

                    const borderColor = isWinner
                        ? "border-yellow-200 ring-4 ring-yellow-100/50"
                        : rank === 2
                            ? "border-slate-200"
                            : "border-orange-200";

                    const gradient = isWinner
                        ? "bg-gradient-to-b from-yellow-50 to-white"
                        : "bg-gradient-to-b from-white to-gray-50";

                    const badgeColor = isWinner ? "bg-yellow-400 text-yellow-900" : rank === 2 ? "bg-slate-300 text-slate-700" : "bg-orange-300 text-orange-800";
                    const initial = name.displayName.charAt(0).toUpperCase();

                    return (
                        <motion.div
                            key={name.id}
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.2, type: "spring", stiffness: 100, damping: 15 }}
                            className={`flex-1 max-w-[140px] md:max-w-[200px] flex flex-col items-center relative group ${yOffset} ${scale}`}
                        >
                            {/* Crown for Winner */}
                            {isWinner && (
                                <motion.div
                                    initial={{ scale: 0, rotate: -20 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: 0.6, type: "spring" }}
                                    className="absolute -top-10 z-30"
                                >
                                    <Crown className="w-12 h-12 text-yellow-500 fill-yellow-200 drop-shadow-lg" />
                                </motion.div>
                            )}

                            {/* Main Card */}
                            <div className={`w-full relative aspect-[3/4] rounded-[2rem] shadow-xl border-2 flex flex-col items-center justify-between p-4 ${gradient} ${borderColor}`}>

                                {/* Rank Badge */}
                                <div className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-inner ${badgeColor}`}>
                                    #{rank}
                                </div>

                                {/* Avatar Circle */}
                                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-3xl md:text-4xl font-serif font-black shadow-inner mt-4 md:mt-6
                                    ${isWinner ? 'bg-yellow-100 text-yellow-600' : rank === 2 ? 'bg-slate-100 text-slate-500' : 'bg-orange-100 text-orange-600'}
                                `}>
                                    {initial}
                                </div>

                                <div className="text-center w-full mt-2">
                                    <h3 className="font-serif font-bold text-foreground text-lg md:text-xl leading-tight truncate px-1">
                                        {name.displayName}
                                    </h3>
                                    <p className="text-xs md:text-sm text-foreground/50 font-medium uppercase tracking-wider mt-1">
                                        {name.votes} Votes
                                    </p>
                                </div>

                                {/* Bottom Decorative Line */}
                                <div className={`w-12 h-1 rounded-full ${isWinner ? 'bg-yellow-200' : rank === 2 ? 'bg-slate-200' : 'bg-orange-200'}`} />
                            </div>

                            {/* Reflection/Pedestal Effect */}
                            <div className="w-[80%] h-4 bg-black/5 blur-md rounded-full mt-4" />
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
