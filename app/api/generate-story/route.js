import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { characters, relationships, plotHook, spiceLevel } = body;

        // 1. Map the spice level integers to community tropes
        const spiceMapping = {
            1: "👀 Longing Glances & Hand-brushing (Pure Slow Burn Pining)",
            2: "🥺 Mutual Yearning & Deep Emotional Conversations",
            3: "😳 Accidental Proximity & 'There is Only One Bed' Panic",
            4: "❤️‍🔥 Intense Romantic Confessions & Passionate Embraces",
            5: "💥 UNHINGED (Absolute Dramatic Peak, Overwhelming Emotional Intensity)"
        };

        // 2. Build the dynamically mapped character & relationship summaries
        const characterList = characters
            .map(c => `- **${c.name}**: Traits/Archetypes: ${c.traits}`)
            .join('\n');

        const relationshipList = relationships
            .map(r => {
                const charA = characters.find(c => c.id === r.charA)?.name || "Unknown";
                const charB = characters.find(c => c.id === r.charB)?.name || "Unknown";
                return `- Connection between ${charA} and ${charB}: ${r.vibe}`;
            })
            .join('\n');

        // 3. System Instruction for Gemini's persona
        const systemInstruction = `You are "The Sapphic Scribbler," an elite, witty, and deeply insightful Sapphic fanfiction author. 
Your writing style is highly engaging, rich with emotional nuance, character chemistry, and self-aware romance community tropes. 
You masterfully balance humor, dramatic tension, and genuine vulnerability. Write a compelling, stylized short story based on the user's parameters. 
Do not include meta-commentary, introductory remarks, or out-of-character summaries at the end. Deliver pure prose styled with classic fanfiction-ready pacing.`;

        // 4. User Content Prompt
        const userPrompt = `Write a custom WLW story using the following structured configurations:

### CAST OF CHARACTERS:
${characterList || "- No characters defined. Invent an iconic dynamic."}

### RELATIONSHIP MATRIX & TENSION PARAMETERS:
${relationshipList || "- No specific relationships predefined. Focus on magnetic chemistry."}

### PLOT HOOK & SETTING:
"${plotHook || "A cozy, rainy indie bookstore with only one working heater."}"

### SPICE & PINING LEVEL:
Level ${spiceLevel}/5 - ${spiceMapping[spiceLevel] || spiceMapping[1]}

Ensure the narrative directly satisfies the selected dynamic, maintains a thrilling pace, and leans deeply into beloved tropes like intense staring, banter, and profound mutual understanding.`;

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "Gemini API Key is missing on the server environment." }, { status: 500 });
        }

        // 5. Targeting the ultra-fast, free-tier friendly Gemini 2.5 Flash
        const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

        const geminiResponse = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": apiKey
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: userPrompt }]
                    }
                ],
                systemInstruction: {
                    parts: [{ text: systemInstruction }]
                },
                generationConfig: {
                    temperature: 0.9
                }
            })
        });

        if (!geminiResponse.ok) {
            const errorData = await geminiResponse.json().catch(() => ({}));
            const status = geminiResponse.status;

            if (status === 429) {
                return NextResponse.json({ error: "The free tier is breathing heavy! Rate limit hit. Take a breath and click generate again." }, { status: 429 });
            }
            return NextResponse.json({ error: errorData?.error?.message || `Gemini API responded with status ${status}` }, { status });
        }

        const data = await geminiResponse.json();
        const generatedStory = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!generatedStory) {
            return NextResponse.json({ error: "Gemini returned an empty response. Try tweaking your inputs." }, { status: 500 });
        }

        return NextResponse.json({ story: generatedStory });

    } catch (error) {
        console.error("Error in generate-story handler:", error);
        return NextResponse.json({ error: "An unexpected error occurred while spinning the yarn." }, { status: 500 });
    }
}