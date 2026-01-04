"use client";

import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { UserSelector } from "@/components/features/UserSelector";

export function Header() {
    return (
        <header className="flex flex-col items-center w-full">
            {/* Top Bar for User Selector */}
            <div className="w-full bg-white/40 backdrop-blur-md border-b border-gray-100/50 z-[110]">
                <div className="max-w-4xl mx-auto w-full flex justify-end px-4 py-2">
                    <UserSelector />
                </div>
            </div>

            {/* Family Notice Banner */}
            <div className="w-full bg-lavender/30 text-foreground py-3 px-4 text-center border-b border-lavender/50">
                <p className="text-sm md:text-base font-medium flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span>
                        Family Note: The priest has suggested the letters <strong className="text-purple-700">L</strong> and <strong className="text-purple-700">V</strong> for Pinky’s name.
                    </span>
                    <Sparkles className="w-4 h-4 text-purple-500" />
                </p>
            </div>

            {/* Main Title */}
            <div className="pt-8 pb-4 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-serif text-pink-deep drop-shadow-sm"
                >
                    Pinky's Name Picker
                </motion.h1>
                <p className="text-foreground/70 mt-2 font-sans">
                    Help us choose the perfect name for our pinky
                </p>
            </div>
        </header>
    );
}
