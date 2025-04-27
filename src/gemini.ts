import { GoogleGenerativeAI, Part } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

export async function generateDescription(
  prompt: string,
  image?: string,
  isVoice?: boolean
): Promise<string> {
  try {
    const parts: Part[] = [];
    parts.push({ text: prompt });

    if (image && isVoice) {
      const imageData = image.split(",")[1];
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: imageData,
        },
      });
    } else if (image) {
      const imageData = image.split(",")[1];
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: imageData,
        },
      });
    }

    const result = await model.generateContent({ contents: [{ parts }] });
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error generating description:", error);
    return "Sorry, I couldn't generate a description.";
  }
}
