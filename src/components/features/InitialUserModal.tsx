"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Stars, User } from "lucide-react";
import { useUser } from "@/lib/context/UserContext";
import { FAMILY_MEMBERS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

export function InitialUserModal() {
    const { currentUser, setCurrentUser } = useUser();
    const [isVisible, setIsVisible] = useState(false);
    const [hasChecked, setHasChecked] = useState(false);

    useEffect(() => {
        // Wait for context to load from localStorage
        const timer = setTimeout(() => {
            if (!currentUser) {
                setIsVisible(true);
            }
            setHasChecked(true);
        }, 800);
        return () => clearTimeout(timer);
    }, [currentUser]);

    if (!hasChecked || !isVisible || currentUser) return null;

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-pink-deep/20 backdrop-blur-xl"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-[0_32px_120px_rgba(0,0,0,0.15)] overflow-hidden"
            >
                {/* Decorative background */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-pink-soft/30 to-peach/20" />

                <div className="relative p-10 flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-8 rotate-3 border-2 border-pink-50 relative">
                        <Heart className="w-12 h-12 text-pink-deep fill-pink-deep animate-pulse" />
                        <div className="absolute -top-4 -right-4 w-8 h-8 bg-peach rounded-full flex items-center justify-center">
                            <Stars className="w-4 h-4 text-white" />
                        </div>
                    </div>

                    <div className="space-y-3 mb-10">
                        <h2 className="text-4xl font-serif font-black text-gray-800 leading-tight">
                            Namaste! 🍼
                        </h2>
                        <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
                            Welcome to Pinky's naming journey. To start suggesting and voting, please tell us who you are!
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-h-[40vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-pink-100 p-1">
                        {FAMILY_MEMBERS.map((member) => (
                            <button
                                key={member}
                                onClick={() => {
                                    setCurrentUser(member);
                                    setIsVisible(false);
                                }}
                                className="group flex flex-col items-center justify-center gap-3 p-4 rounded-[2rem] bg-gray-50 border border-gray-100 transition-all hover:bg-white hover:border-pink-soft hover:shadow-xl hover:shadow-pink-100/50 hover:-translate-y-1 active:scale-95"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:bg-pink-soft/20">
                                    <User className="w-6 h-6 text-gray-400 group-hover:text-pink-deep" />
                                </div>
                                <span className="font-bold text-gray-700 group-hover:text-pink-deep transition-colors">
                                    {member}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="mt-10 text-gray-400 text-xs flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-deep animate-pulse" />
                        Selected picker will be remembered for your next visit
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
