import React, { useState, useRef, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { generateDescription } from './gemini';
import { GoogleGenerativeAI } from '@google/generative-ai';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [description, setDescription] = useState('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [prompt, setPrompt] = useState<string>('Analyze this product image and return a JSON object with only the brand name. Format: {"brand": "brand_name"}');
  const [attempts, setAttempts] = useState<number>(5);
  const [accuracy, setAccuracy] = useState<number | undefined>(undefined);

  const processInput = async (input: string, isVoice: boolean) => {
    let responses: string[] = [];

    // Generate 5 responses and collect them
    for (let i = 0; i < 5; i++) {
      const newDescription = await generateDescription(prompt, capturedImage ?? undefined, undefined, isVoice, "en");
      responses.push(newDescription);
      console.log(`Attempt ${i + 1}:`, newDescription);
    }

    // Calculate accuracy
    const uniqueResponses = Array.from(new Set(responses)); // Removing duplicates
    const calculatedAccuracy = (uniqueResponses.length === 1) ? 100 : Math.floor((5 - uniqueResponses.length) / 5 * 100);
    setAccuracy(calculatedAccuracy); // Store the accuracy

    // Display result
    setDescription(responses[0]); // Use the first response for display
  };


  useEffect(() => {
    // Start camera automatically
    startCamera();
  }, []);



  const startCamera = async () => {
    try {
      const constraints: MediaStreamConstraints = {
        video:
        {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: 'environment'
        }
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsRecording(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      const errorMessage = "Sorry, I couldn't access the camera. Please make sure you've granted camera permissions.";
      setDescription(errorMessage);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      setIsRecording(false);
    }
  };
  
  const processImage = async () => {
    let imagesToSend: string[] = [];
    let currentPrompt = 'Analyze the product images and return a JSON object with all the brands found in the images. Format: {"brands": ["brand1", "brand2"]}, Remove any hands or other objects from the images when processing. Try OCR if possible.';

    // Capture 5 images from the video stream
    if (isRecording && videoRef.current) {
      for (let i = 0; i < 5; i++) {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Draw the full frame from the video feed onto the canvas
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const imageDataURL = canvas.toDataURL('image/jpeg');
          imagesToSend.push(imageDataURL); // Store the captured image
        }
      }

      // Convert images to base64 and send them to the AI for processing
      const imageRequests = imagesToSend.map((image, index) => ({
        inlineData: {
          data: image.split(',')[1], // Remove the base64 header part
          mimeType: 'image/jpeg',
        },
      }));

      try {
        // Send multiple images to the AI model
        const result = await generateMultipleImages(imageRequests, currentPrompt);
        console.log(result); // Process the AI response
        setDescription(result); // Display the AI response
      } catch (error) {
        console.error("Error processing multiple images:", error);
        setDescription("Sorry, there was an issue processing the images.");
      }
    }
  };

  const generateMultipleImages = async (imageRequests: any[], prompt: string) => {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-pro' });
  
    try {
      const result = await model.generateContent([
        ...imageRequests,
        prompt
      ]);
      return result.response.text();
    } catch (error: any) {
      console.error("Error generating content with multiple images:", error);
      // Show the detailed error message
      setDescription(`Error: ${error.message || "An unknown error occurred."}`);
      return `Error: ${error.message || "An unknown error occurred."}`;
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Camera Preview */}
          <div className="relative aspect-auto bg-gray-900 rounded-lg overflow-hidden shadow-lg mb-6">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              {!isRecording && !description && (
                <p className="text-white text-lg">Camera is active</p>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => {
                isRecording ? stopCamera() : startCamera();
              }}
              className={`p-4 rounded-full ${isRecording
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-gray-100 hover:bg-gray-200'
                } text-white transition-colors`}
              aria-label="Stop camera"
            >
              <Camera className={`h-8 w-8 ${isRecording ? 'text-white' : 'text-gray-700'}`} />
            </button>

            <button
              onClick={processImage} 
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
            >
              Capture and Analyze
            </button>
          </div>


          {/* Description and Accuracy */}
          {description && (
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">AI Description:</h2>
              <p className="text-gray-700">{description}</p>
              {accuracy !== undefined && (
                <p className="text-sm text-gray-500 mt-2">Accuracy: {accuracy}%</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
