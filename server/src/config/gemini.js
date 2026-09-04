import { GoogleGenAI } from '@google/genai';

let genAI = null;

export const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    return null;
  }

  if (!genAI) {
    genAI = new GoogleGenAI({
      apiKey,
    });
  }

  return genAI;
};