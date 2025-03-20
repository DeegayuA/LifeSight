import { GoogleGenerativeAI, Part } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

export async function generateDescription(
  prompt: string,
  image?: string,
  video?: string,
  isVoice?: boolean,
  selectedLanguage?: string
): Promise<string> {
  try {
    const parts: Part[] = [];
    let combinedPrompt = prompt;

    if (image) {
      const imageData = image.split(",")[1];
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: imageData,
        },
      });
    }
    
    parts.push({ text: combinedPrompt });

    const result = await model.generateContent({ contents: [{ role: "user", parts }] });
    const response = await result.response;
    let text = response.text();

    return text;
  } catch (error) {
    console.error("Error generating description:", error);
    return "Sorry, I couldn't generate a description.";
  }
}

