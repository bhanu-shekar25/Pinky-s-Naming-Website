"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export interface SuggestedName {
    name: string;
    meaning: string;
    reason: string;
}

export async function getBabyNameSuggestions(excludeNames: string[] = [], mode: "all" | "lv" = "all"): Promise<SuggestedName[]> {
    const apiKey = "AIzaSyA6bvdxwaaD4hG-A_IK5r6cRIKkB9a8Mak";

    if (!apiKey) {
        throw new Error("Gemini API key is missing.");
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // Using gemini-2.5-flash-lite for maximum speed as confirmed by manual check
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const lvConstraint = mode === "lv"
            ? "MUST start with 'L' or 'V'."
            : "Any letter.";

        const prompt = `Task: Suggest 10 modern Indian baby girl names.
Constraint: ${lvConstraint}
CRITICAL: DO NOT SUGGEST ANY OF THESE NAMES (Case-Insensitive): ${excludeNames.join(", ")}.
Format: JSON array of objects: [{"name": "...", "meaning": "...", "reason": "..."}]
Style: Modern & Meaningful.
Limit: Keep "meaning" and "reason" under 8 words each for speed.
No preamble, no markdown, no thinking tokens. Just the JSON.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean the text in case Gemini includes markdown code blocks
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        try {
            const suggestions = JSON.parse(cleanedText);
            return suggestions;
        } catch (parseError) {
            console.error("Failed to parse Gemini response as JSON:", text);
            // Fallback: try to find anything that looks like a JSON array
            const match = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
            if (match) {
                return JSON.parse(match[0]);
            }
            throw new Error("Failed to parse suggestions from AI response.");
        }
    } catch (error: any) {
        console.error("Error calling Gemini API:", error);

        let errorMessage = "AI Suggestion service is temporarily unavailable.";
        if (error.message?.includes("403")) {
            errorMessage = "Google AI is not supported in your current location or the API key is restricted.";
        } else if (error.message?.includes("429")) {
            errorMessage = "We've run out of magic dust (rate limit)! Please wait a minute and try again.";
        } else if (error.message?.includes("404")) {
            errorMessage = "The AI model (Gemini 2.5 Flash) was not found. Please check your API settings.";
        }

        throw new Error(errorMessage);
    }
}
