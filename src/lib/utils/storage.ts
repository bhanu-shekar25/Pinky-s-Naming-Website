"use client";

const STORAGE_KEY = "pinky_voted_names";
const SUBMITTED_KEY = "pinky_submitted_names";

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

export const removeVote = (nameId: string) => {
    const voted = getVotedNames();
    const updated = voted.filter(id => id !== nameId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getSubmittedNames = (): string[] => {
    if (typeof window === "undefined") return [];
    try {
        const stored = localStorage.getItem(SUBMITTED_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error("Failed to parse submitted names", e);
        return [];
    }
};

export const markAsSubmitted = (nameId: string) => {
    const submitted = getSubmittedNames();
    if (!submitted.includes(nameId)) {
        const updated = [...submitted, nameId];
        localStorage.setItem(SUBMITTED_KEY, JSON.stringify(updated));
    }
};
