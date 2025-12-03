import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";
import { ChatMessage, LearningResource } from "../types";
import { generateSimulatedResources } from "./mockData";

// Helper to safely get the API key
const getApiKey = (): string | undefined => {
  return process.env.API_KEY;
};

let chatSession: Chat | null = null;
let aiClient: GoogleGenAI | null = null;

const initializeAI = () => {
  const apiKey = getApiKey();
  if (!apiKey && !aiClient) {
    console.warn("Gemini API Key not found. App will use simulated responses where possible.");
    return null;
  }
  if (!aiClient && apiKey) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

export const startChatSession = (topic: string) => {
  const client = initializeAI();
  if (!client) return null;

  try {
    chatSession = client.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `You are an expert academic tutor specializing in ${topic}. 
        Keep answers concise, educational, and encouraging. 
        Use bullet points for complex concepts. 
        If asked about code, provide clean snippets.
        Limit responses to under 200 words unless asked for detail.`
      }
    });
    return chatSession;
  } catch (error) {
    console.error("Failed to start chat session", error);
    return null;
  }
};

export const sendMessageToAI = async (message: string): Promise<string> => {
  if (!chatSession) {
    // Fallback simulation if no API key
    await new Promise(resolve => setTimeout(resolve, 1000));
    return "I'm currently running in demo mode (no API key detected). I would normally explain this concept in depth using Gemini 2.5 Flash models. Please configure an API key to unlock full tutoring capabilities!";
  }

  try {
    const response: GenerateContentResponse = await chatSession.sendMessage({ message });
    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Error sending message to AI", error);
    return "Sorry, I encountered an error connecting to the AI tutor service.";
  }
};

export const generateResourceSummary = async (title: string, context: string): Promise<string[]> => {
  const client = initializeAI();
  if (!client) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return [
      "Simulated AI summary point 1.",
      "Simulated AI summary point 2.",
      "Simulated AI summary point 3."
    ];
  }

  try {
    const prompt = `Provide a 3-bullet point summary for an educational resource titled "${title}" about "${context}". 
    Format the output as a JSON array of strings. Example: ["Point 1", "Point 2", "Point 3"]`;
    
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || "";
    // Simple parsing logic
    const jsonMatch = text.match(/\[.*\]/s);
    if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
    }
    return [text.slice(0, 100) + "..."];
  } catch (error) {
    console.error("Summary generation failed", error);
    return ["Summary unavailable in demo mode."];
  }
};

export const fetchResourcesForTopic = async (topic: string): Promise<LearningResource[]> => {
  const client = initializeAI();
  
  // 1. Simulation fallback if no key
  if (!client) {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network latency
    return generateSimulatedResources(topic);
  }

  // 2. Real AI Generation
  try {
    const prompt = `Generate 6 high-quality educational resources for the topic "${topic}". 
    Include a mix of 'video', 'article', and 'pdf' types.
    Ensure strict JSON output matching the following schema array:
    [{
      "id": "string",
      "title": "string",
      "source": "string (e.g. YouTube Channel, Blog Name, University)",
      "type": "video" | "article" | "pdf",
      "qualityScore": number (1.0 to 5.0),
      "duration": "string (e.g. '10 min' or '15 min read')",
      "difficulty": "Beginner" | "Intermediate" | "Advanced",
      "summary": ["string", "string", "string"],
      "url": "string (placeholder '#')",
      "views": "string (optional, e.g. '1.2M')",
      "date": "string (e.g. '1 year ago')",
      "tags": ["string"]
    }]`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No text response");
    
    const resources = JSON.parse(text);
    // Add IDs if missing or ensure uniqueness
    return resources.map((r: any, i: number) => ({
        ...r, 
        id: r.id || `ai-${Date.now()}-${i}`
    }));

  } catch (error) {
    console.error("Failed to fetch AI resources, falling back to simulation", error);
    return generateSimulatedResources(topic);
  }
};
