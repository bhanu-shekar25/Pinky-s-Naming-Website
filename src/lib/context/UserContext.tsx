"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserContextType {
    currentUser: string | null;
    setCurrentUser: (name: string) => void;
    clearUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUserInternal] = useState<string | null>(null);

    // Initialize from localStorage
    useEffect(() => {
        const savedUser = localStorage.getItem('pinky_picker_user');
        if (savedUser) {
            setCurrentUserInternal(savedUser);
        }
    }, []);

    const setCurrentUser = (name: string) => {
        setCurrentUserInternal(name);
        localStorage.setItem('pinky_picker_user', name);
    };

    const clearUser = () => {
        setCurrentUserInternal(null);
        localStorage.removeItem('pinky_picker_user');
    };

    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser, clearUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
