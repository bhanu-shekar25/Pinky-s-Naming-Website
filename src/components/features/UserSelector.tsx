"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, ChevronDown, Check } from "lucide-react";
import { useUser } from "@/lib/context/UserContext";
import { FAMILY_MEMBERS } from "@/lib/constants";

export function UserSelector() {
    const { currentUser, setCurrentUser } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md transition-all duration-300 border
                    ${currentUser
                        ? 'bg-pink-soft/20 border-pink-soft/30 text-pink-deep'
                        : 'bg-white/50 border-gray-200 text-gray-500 hover:border-pink-200'
                    }
                `}
            >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm overflow-hidden bg-white`}>
                    <User className={`w-4 h-4 ${currentUser ? 'text-pink-deep' : 'text-gray-400'}`} />
                </div>
                <div className="flex flex-col items-start leading-tight">
                    <span className="text-[10px] uppercase tracking-widest font-bold opacity-60">User</span>
                    <span className="text-sm font-semibold truncate max-w-[100px]">
                        {currentUser || "Select User"}
                    </span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 top-full mt-3 w-56 bg-white/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/40 overflow-hidden z-[1000] py-2"
                    >
                        <div className="px-4 py-2 border-b border-gray-100 mb-1">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Select your name</span>
                        </div>
                        <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-pink-100 px-2">
                            {FAMILY_MEMBERS.map((member) => (
                                <button
                                    key={member}
                                    onClick={() => {
                                        setCurrentUser(member);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all mb-1
                                        ${currentUser === member
                                            ? 'bg-pink-deep text-white shadow-lg shadow-pink-200/50'
                                            : 'text-gray-600 hover:bg-pink-50 hover:text-pink-deep'
                                        }
                                    `}
                                >
                                    <span className="font-medium">{member}</span>
                                    {currentUser === member && <Check className="w-4 h-4" />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
