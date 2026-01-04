"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useUser } from "@/lib/context/UserContext";

interface NameSubmissionProps {
    onSubmit: (name: string, meaning: string, addedBy: string) => Promise<void>;
    isSubmitting?: boolean;
}

export function NameSubmission({ onSubmit }: NameSubmissionProps) {
    const { currentUser } = useUser();
    const [name, setName] = useState("");
    const [meaning, setMeaning] = useState("");
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !currentUser) return;

        setStatus("submitting");
        setErrorMsg("");

        try {
            await onSubmit(name, meaning, currentUser);
            setStatus("success");

            // Trigger confetti
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FFB7B2', '#E0BBE4', '#FFD700', '#FF9E99', '#ffffff']
            });

            setName("");
            setMeaning("");

            // Reset success status after a few seconds
            setTimeout(() => setStatus("idle"), 3000);
        } catch (error: any) {
            console.error(error);
            setStatus("error");
            setErrorMsg(error.message || "Something went wrong! Try again.");
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-4">
            <div className="bg-white rounded-3xl p-6 shadow-2xl border border-pink-100/50 relative overflow-hidden group">
                {/* Inner Glow/Border hint */}
                <div className="absolute inset-0 border-[3px] border-white/50 rounded-3xl pointer-events-none" />
                <h2 className="text-2xl font-serif text-center mb-6 text-pink-deep">
                    Suggest a Name
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        placeholder="e.g. Lakshmi"
                        label="Baby Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        maxLength={30}
                        disabled={!currentUser}
                    />

                    <Input
                        placeholder="e.g. Goddess of wealth (Optional)"
                        label="Meaning"
                        value={meaning}
                        onChange={(e) => setMeaning(e.target.value)}
                        maxLength={100}
                        disabled={!currentUser}
                    />

                    {!currentUser && (
                        <div className="bg-pink-50/50 p-4 rounded-xl border border-pink-100 text-center">
                            <p className="text-xs text-pink-deep font-medium italic">
                                Please select your name at the top to suggest names! ✨
                            </p>
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full mt-4 text-lg font-serif"
                        size="lg"
                        variant="primary"
                        disabled={status === "submitting" || !name.trim() || !currentUser}
                    >
                        {status === "submitting" ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1 }}
                            >
                                <Sparkles className="w-5 h-5 ml-2" />
                            </motion.div>
                        ) : status === "success" ? (
                            "Added! ✨"
                        ) : (
                            "Send Suggestion 💖"
                        )}
                    </Button>

                    <AnimatePresence>
                        {status === "success" && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="text-center text-green-600 font-medium text-sm mt-2 flex items-center justify-center gap-2"
                            >
                                <Sparkles className="w-4 h-4" />
                                <span>Thank you! Use the list below to vote.</span>
                            </motion.div>
                        )}

                        {status === "error" && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="text-center text-red-500 font-medium text-sm mt-2"
                            >
                                {errorMsg}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </div>
        </div>
    );
}
