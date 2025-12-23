"use client";

const STORAGE_KEY = "pinky_voted_names";

export const getVotedNames = (): string[] => {
    if (typeof window === "undefined") return [];
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error("Failed to parse voted names", e);
        return [];
    }
};

export const hasVotedFor = (nameId: string): boolean => {
    const voted = getVotedNames();
    return voted.includes(nameId);
};

export const markAsVoted = (nameId: string) => {
    const voted = getVotedNames();
    if (!voted.includes(nameId)) {
        const updated = [...voted, nameId];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
};
