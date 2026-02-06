
import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = "You are a professional YouTube SEO expert. Your goal is to generate high-ranking, relevant search tags to help videos go viral.";

export async function generateYouTubeTags(topic: string): Promise<string[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const userPrompt = `Generate exactly 100 high-traffic YouTube search tags for the topic: ${topic}.

Requirements:
Mix broad keywords, specific long-tail keywords, and trending phrases.
Ensure all tags are highly relevant to the topic.
Format the output as a comma-separated list.
Do not include numbers (like 1, 2, 3) or bullet points.
Only provide the tags, no introductory text like 'Here are your tags'.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    const text = response.text || "";
    // Clean up response: remove whitespace around commas and split
    const tags = text
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
      
    return tags;
  } catch (error) {
    console.error("Error generating tags:", error);
    throw error;
  }
}
