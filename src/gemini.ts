import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import { GoogleAIFileManager, FileState } from "@google/generative-ai/server";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);
const fileManager = new GoogleAIFileManager(API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
const videoModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

async function uploadVideo(stream: MediaStream): Promise<string | null> {
  try {
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    const chunks: BlobPart[] = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    recorder.start();

    await new Promise((resolve) => {
      recorder.onstop = resolve;
      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
        }
      }, 5000);
    });

    const videoBlob = new Blob(chunks, { type: 'video/webm' });
    const videoFile = new File([videoBlob], 'temp_video.webm', { type: 'video/webm' });

    const uploadResponse = await fileManager.uploadFile(videoFile, {
      mimeType: 'video/webm',
      displayName: 'User Video',
    });

    const name = uploadResponse.file.name;
    let file = await fileManager.getFile(name);
    while (file.state === FileState.PROCESSING) {
      console.log("Video processing...")
      await new Promise((resolve) => setTimeout(resolve, 10_000));
      file = await fileManager.getFile(name);
    }

    if (file.state === FileState.FAILED) {
      throw new Error("Video processing failed.");
    }

    return file.uri;
  } catch (error) {
    console.error("Error uploading video:", error);
    return null;
  }
}

export async function generateDescription(
  prompt: string,
  image?: string,
  videoUri?: string | null,
  isVoice?: boolean
): Promise<string> {
  try {
    const parts: Part[] = [];
    parts.push({ text: prompt });

    if (videoUri && isVoice) {
      parts.push({
        fileData: {
          mimeType: "video/webm",
          fileUri: videoUri,
        },
      });
      const result = await videoModel.generateContent({ contents: [{ parts }] });
      const response = await result.response;
      const text = response.text();
      return text;
    } else if (image) {
      const imageData = image.split(",")[1];
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: imageData,
        },
      });
      const result = await model.generateContent({ contents: [{ parts }] });
      const response = await result.response;
      const text = response.text();
      return text;
    } else {
      const result = await model.generateContent({ contents: [{ parts }] });
      const response = await result.response;
      const text = response.text();
      return text;
    }
  } catch (error) {
    console.error("Error generating description:", error);
    return "Sorry, I couldn't generate a description.";
  }
}
