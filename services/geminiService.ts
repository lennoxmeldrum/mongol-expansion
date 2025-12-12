import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { ImageSize } from '../types';

// Helper to ensure API key availability for features that require manual selection
const ensureApiKey = async () => {
  if (window.aistudio && window.aistudio.hasSelectedApiKey) {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await window.aistudio.openSelectKey();
      // Assume success after opening dialog as per instructions
    }
  }
};

export const createChatSession = async (systemInstruction: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.7,
    },
  });
};

export const sendMessageToChat = async (chat: Chat, message: string): Promise<string> => {
  try {
    const result = await chat.sendMessage({ message });
    return result.text || "I remain silent.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "The spirits are quiet (API Error).";
  }
};

export const generateHistoricalImage = async (prompt: string, size: ImageSize): Promise<string> => {
  // Ensure we have a user-selected key for this premium model
  await ensureApiKey();

  // Re-initialize client to pick up the potentially newly selected key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          imageSize: size,
          aspectRatio: "16:9" // Cinematic aspect ratio suitable for history
        }
      }
    });

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned");
  } catch (error) {
    console.error("Image Gen Error:", error);
    throw error;
  }
};