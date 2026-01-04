"use server";

export interface SuggestedName {
    name: string;
    meaning: string;
    reason: string;
}

export async function getBabyNameSuggestions(excludeNames: string[] = [], mode: "all" | "lv" = "all"): Promise<SuggestedName[]> {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        throw new Error("Groq API key is missing. Please add GROQ_API_KEY to your .env.local file. If you just added it, you might need to restart 'npm run dev'.");
    }

    try {
        const lvConstraint = mode === "lv"
            ? "MUST start with 'L' or 'V'."
            : "Any letter.";

        const prompt = `Task: Suggest 10 modern Indian baby girl names.
Constraint: ${lvConstraint}
CRITICAL: DO NOT SUGGEST ANY OF THESE NAMES (Case-Insensitive): ${excludeNames.join(", ")}.
Format: JSON array of objects: [{"name": "...", "meaning": "...", "reason": "..."}]
Style: Modern & Meaningful.
IMPORTANT: 
- "meaning" should be a complete sentence explaining what the name means (10-15 words)
- "reason" should be a complete sentence explaining why this name is special (10-15 words)
No preamble, no markdown, no thinking tokens. Just the JSON array.`;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Groq API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content || "";

        // Clean the text in case the model includes markdown code blocks
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        try {
            const suggestions = JSON.parse(cleanedText);
            return suggestions;
        } catch (parseError) {
            console.error("Failed to parse Groq response as JSON:", text);
            // Fallback: try to find anything that looks like a JSON array
            const match = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
            if (match) {
                return JSON.parse(match[0]);
            }
            throw new Error("Failed to parse suggestions from AI response.");
        }
    } catch (error: any) {
        console.error("Error calling Groq API:", error);

        let errorMessage = "AI Suggestion service is temporarily unavailable.";
        if (error.message?.includes("403")) {
            errorMessage = "Groq API access denied (403). Please verify your API key is valid.";
        } else if (error.message?.includes("429")) {
            errorMessage = "We've run out of magic dust (rate limit)! Please wait a minute and try again.";
        } else if (error.message?.includes("404")) {
            errorMessage = "The selected AI model was not found. Please try a different model version.";
        } else if (error.message?.includes("API key") || error.message?.includes("invalid")) {
            errorMessage = "The provided API key is invalid. Please check your .env.local file.";
        }

        throw new Error(errorMessage);
    }
}
