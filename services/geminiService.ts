
import { GoogleGenAI } from "@google/genai";

export async function generateBirthdayWish(name: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `为“${name}”生成一段简短、神奇且温馨的生日祝福语。要求使用中文，字数在20字以内。`,
      config: {
        temperature: 0.8,
      },
    });
    return response.text || "祝你生日快乐！愿你度过奇妙的一天！";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "祝你生日快乐！愿你梦想成真！";
  }
}
