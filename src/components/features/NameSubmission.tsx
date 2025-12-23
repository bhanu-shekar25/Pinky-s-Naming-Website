"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface NameSubmissionProps {
    onSubmit: (name: string, meaning: string) => Promise<void>;
    isSubmitting?: boolean;
}

export function NameSubmission({ onSubmit }: NameSubmissionProps) {
    const [name, setName] = useState("");
    const [meaning, setMeaning] = useState("");
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setStatus("submitting");
        setErrorMsg("");

        try {
            await onSubmit(name, meaning);
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
            <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/60">
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
                    />

                    <Input
                        placeholder="e.g. Goddess of wealth (Optional)"
                        label="Meaning"
                        value={meaning}
                        onChange={(e) => setMeaning(e.target.value)}
                        maxLength={100}
                    />

                    <Button
                        type="submit"
                        className="w-full mt-4 text-lg font-serif"
                        size="lg"
                        variant="primary"
                        disabled={status === "submitting" || !name.trim()}
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
