"use client";

import { useState, useEffect } from "react";
import {
    collection,
    query,
    onSnapshot,
    addDoc,
    doc,
    runTransaction,
    serverTimestamp,
    orderBy,
    where,
    getDocs
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Name } from "@/lib/types";
import { markAsVoted, hasVotedFor, getVotedNames, removeVote, getSubmittedNames, markAsSubmitted } from "@/lib/utils/storage";

export function useNames() {
    const [names, setNames] = useState<Name[]>([]);
    const [loading, setLoading] = useState(true);
    const [votedIds, setVotedIds] = useState<string[]>([]);
    const [submittedIds, setSubmittedIds] = useState<string[]>([]);

    // Initial load of voted IDs from local storage
    useEffect(() => {
        setVotedIds(getVotedNames());
        setSubmittedIds(getSubmittedNames());
    }, []);

    // Real-time listener
    useEffect(() => {
        const q = query(collection(db, "names"), orderBy("votes", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const namesData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                // Convert timestamp to simple number if needed or handle as is
                // createdAt: doc.data().createdAt?.toMillis() || Date.now() 
            })) as Name[];
            setNames(namesData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const addName = async (name: string, meaning: string, addedBy: string) => {
        const cleanName = name.trim();
        const cleanNameLower = cleanName.toLowerCase();

        // Check for duplicates (case-insensitive)
        // Note: In production with many names, this should be done differently (e.g. ID as name or cloud function)
        // For this size, client-side check or simple query check is fine.
        const q = query(collection(db, "names"), where("name", "==", cleanNameLower));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            throw new Error(`The name "${cleanName}" has already been suggested! Go vote for it!`);
        }

        const docRef = await addDoc(collection(db, "names"), {
            name: cleanNameLower,
            displayName: cleanName,
            meaning: meaning.trim(),
            addedBy: addedBy,
            votes: 0,
            createdAt: serverTimestamp(),
        });

        // Add to local submissions
        markAsSubmitted(docRef.id);
        setSubmittedIds(prev => [...prev, docRef.id]);
    };

    const voteName = async (id: string) => {
        const isVoted = hasVotedFor(id); // Check specific to this user/device
        const nameRef = doc(db, "names", id);

        try {
            await runTransaction(db, async (transaction) => {
                const sfDoc = await transaction.get(nameRef);
                if (!sfDoc.exists()) {
                    throw new Error("Name does not exist!");
                }

                const currentVotes = sfDoc.data().votes || 0;
                const newVotes = isVoted ? Math.max(0, currentVotes - 1) : currentVotes + 1;

                transaction.update(nameRef, { votes: newVotes });
            });

            // Update local state and storage
            if (isVoted) {
                removeVote(id);
                setVotedIds((prev) => prev.filter(vid => vid !== id));
            } else {
                markAsVoted(id);
                setVotedIds((prev) => [...prev, id]);
            }
        } catch (e) {
            console.error("Vote failed: ", e);
            throw e;
        }
    };

    return {
        names,
        loading,
        votedIds,
        submittedIds,
        addName,
        voteName
    };
}
