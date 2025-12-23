export interface Name {
    id: string;
    name: string;
    displayName: string;
    meaning?: string;
    votes: number;
    createdAt: number; // Timestamp
}

export interface NameSubmission {
    name: string;
    meaning?: string;
}

export type SortOption = "most-voted" | "newest" | "alphabetical";
