import React, { useState, useRef, useEffect } from 'react';
    import { Camera, Volume2, Settings, Eye, Mic, Type } from 'lucide-react';
    import { generateDescription } from './gemini';

    function App() {
      const [isRecording, setIsRecording] = useState(false);
      const [description, setDescription] = useState('');
      const [isListening, setIsListening] = useState(false);
      const [isSpeaking, setIsSpeaking] = useState(false);
      const [inputText, setInputText] = useState('');
      const [capturedImage, setCapturedImage] = useState<string | null>(null);
      const [lastSpokenResponse, setLastSpokenResponse] = useState<string | null>(null);
      const [prompt, setPrompt] = useState<string>('');
      const videoRef = useRef<HTMLVideoElement>(null);
      const audioRef = useRef<HTMLAudioElement>(null);
      const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
      const recognitionRef = useRef<SpeechRecognition | null>(null);
      const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
      const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
      const features = [
        {
          title: "Voice Commands",
          description: "Control the app hands-free with voice commands. The microphone is always listening for your commands.",
        },
        {
          title: "Audio Feedback",
          description: "Receive clear audio descriptions of your surroundings. Say 'Read' or click the speaker button to hear the description.",
        },
        {
          title: "Text Input",
          description: "Enter text and ask questions about it. Click the type button to submit your text.",
        },
      ];

      useEffect(() => {
        // Initialize speech synthesis
        speechSynthesisRef.current = window.speechSynthesis;

        // Initialize speech recognition
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = true;
          recognitionRef.current.interimResults = false;

          recognitionRef.current.onresult = (event) => {
            const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
            handleVoiceCommand(command);
          };

          recognitionRef.current.onend = () => {
            // Automatically restart recognition when it ends
            if (isListening) {
              try {
                recognitionRef.current?.start();
              } catch (error) {
                console.error('Error restarting recognition:', error);
              }
            }
          };

          recognitionRef.current.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            // Attempt to restart on error after a short delay
            if (isListening) {
              setTimeout(() => {
                try {
                  recognitionRef.current?.start();
                } catch (error) {
                  console.error('Error restarting recognition after error:', error);
                }
              }, 1000);
            }
          };

          // Start listening immediately
          try {
            setIsListening(true);
            recognitionRef.current.start();
          } catch (error) {
            console.error('Error starting initial recognition:', error);
          }
        }

        // Start camera automatically
        startCamera();

        const intervalId = setInterval(() => {
          setCurrentFeatureIndex((prevIndex) => (prevIndex + 1) % features.length);
        }, 5000);

        return () => {
          if (speechSynthesisRef.current) {
            speechSynthesisRef.current.cancel();
          }
          if (recognitionRef.current) {
            recognitionRef.current.abort();
          }
          setIsListening(false);
          clearInterval(intervalId);
        };
      }, [features.length]);

      const handleVoiceCommand = async (command: string) => {
        console.log('Received command:', command);
        if (command.includes('stop camera')) {
          stopCamera();
        } else if (command.includes('start camera')) {
          startCamera();
        } else if (command.includes('read') || command.includes('describe')) {
          speakDescription();
        } else if (command.includes('start mic')) {
          startListening();
        } else if (command.includes('stop mic')) {
          stopListening();
        } else if (command.includes('again')) {
          replayLastResponse();
        } else if (command.includes('what') || command.includes('how') || command.includes('where') || command.includes('who') || command.includes('this') || command.includes('it') || command.includes('find')) {
          await processInput(command, true);
        } else {
          await processInput(command, false);
        }
      };

      const speakDescription = () => {
        if (!speechSynthesisRef.current) {
          alert('Speech synthesis is not supported in your browser');
          return;
        }

        if (isSpeaking) {
          speechSynthesisRef.current.cancel();
          setIsSpeaking(false);
          return;
        }

        if (description) {
          setIsSpeaking(true);
          const utterance = new SpeechSynthesisUtterance(description);
          currentUtteranceRef.current = utterance;
          utterance.onstart = () => {
            if (recognitionRef.current) {
              recognitionRef.current.abort();
              setIsListening(false);
            }
          };
          utterance.onend = () => {
            setIsSpeaking(false);
            if (recognitionRef.current) {
              recognitionRef.current.start();
              setIsListening(true);
            }
          };
          speechSynthesisRef.current.speak(utterance);
          setLastSpokenResponse(description);
        }
      };

      const replayLastResponse = () => {
        if (lastSpokenResponse) {
          const utterance = new SpeechSynthesisUtterance(lastSpokenResponse);
          currentUtteranceRef.current = utterance;
          utterance.onstart = () => {
            if (recognitionRef.current) {
              recognitionRef.current.abort();
              setIsListening(false);
            }
          };
          utterance.onend = () => {
            if (recognitionRef.current) {
              recognitionRef.current.start();
              setIsListening(true);
            }
          };
          speechSynthesisRef.current?.speak(utterance);
        }
      };

      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setIsRecording(true);
          }
        } catch (err) {
          console.error("Error accessing camera:", err);
          const errorMessage = "Sorry, I couldn't access the camera. Please make sure you've granted camera permissions.";
          setDescription(errorMessage);
          const utterance = new SpeechSynthesisUtterance(errorMessage);
          speechSynthesisRef.current?.speak(utterance);
        }
      };

      const stopCamera = () => {
        if (videoRef.current?.srcObject) {
          const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
          tracks.forEach(track => track.stop());
          setIsRecording(false);
        }
      };

      const handleTextSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await processInput(inputText, false);
      };

      const startListening = () => {
        if (recognitionRef.current && !isListening) {
          try {
            setIsListening(true);
            recognitionRef.current.start();
          } catch (error) {
            console.error('Error starting recognition:', error);
          }
        }
      };

      const stopListening = () => {
        if (recognitionRef.current && isListening) {
          recognitionRef.current.abort();
          setIsListening(false);
        }
      };

      const processInput = async (input: string, isVoice: boolean) => {
        let currentPrompt = ``;
        let imageToSend = null;

        if (isVoice && (input.includes('what') || input.includes('how') || input.includes('where') || input.includes('who') || input.includes('this') || input.includes('it') || input.includes('find'))) {
          currentPrompt = ` "${input}" for visually impaired or blind people. use conversational mode but do not mention about any disability.`;
          if (capturedImage) {
            currentPrompt += `Image: `;
            imageToSend = capturedImage;
          }
        } else if (!isVoice) {
          currentPrompt = `"${input}" for visually impaired or blind people. use conversational mode but do not mention about any disability.`;
          if (capturedImage && (input.includes('what') || input.includes('how') || input.includes('where') || input.includes('who') || input.includes('picture') || input.includes('image'))) {
            currentPrompt += ` Also consider this image: `;
            imageToSend = capturedImage;
          }
        } else {
          currentPrompt = `Describe the following input: "${input}"`;
        }
        
        if (!isVoice) {
          currentPrompt += `${inputText}`;
        }
        setPrompt(currentPrompt);
        console.log('Prompt:', currentPrompt);
        
        if (isSpeaking && speechSynthesisRef.current && currentUtteranceRef.current) {
          speechSynthesisRef.current.cancel();
          setIsSpeaking(false);
        }

        if (isListening && recognitionRef.current) {
          recognitionRef.current.abort();
          setIsListening(false);
        }

        if (isRecording && videoRef.current) {
          const canvas = document.createElement('canvas');
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const imageDataURL = canvas.toDataURL('image/jpeg');
            setCapturedImage(imageDataURL);
            const newDescription = await generateDescription(currentPrompt, imageDataURL);
            setDescription(newDescription);
            const utterance = new SpeechSynthesisUtterance(newDescription);
            currentUtteranceRef.current = utterance;
            utterance.onstart = () => {
              if (recognitionRef.current) {
                recognitionRef.current.abort();
                setIsListening(false);
              }
            };
            utterance.onend = () => {
              setIsSpeaking(false);
              if (recognitionRef.current) {
                recognitionRef.current.start();
                setIsListening(true);
              }
            };
            speechSynthesisRef.current?.speak(utterance);
            setLastSpokenResponse(newDescription);
            setIsSpeaking(true);
          }
        } else {
          const newDescription = await generateDescription(currentPrompt, imageToSend);
          setDescription(newDescription);
          const utterance = new SpeechSynthesisUtterance(newDescription);
          currentUtteranceRef.current = utterance;
          utterance.onstart = () => {
            if (recognitionRef.current) {
              recognitionRef.current.abort();
              setIsListening(false);
            }
          };
          utterance.onend = () => {
            setIsSpeaking(false);
            if (recognitionRef.current) {
              recognitionRef.current.start();
              setIsListening(true);
            }
          };
          speechSynthesisRef.current?.speak(utterance);
          setLastSpokenResponse(newDescription);
          setIsSpeaking(true);
        }
        setInputText('');
        setCapturedImage(null);
      };

      return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
          {/* Header */}
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Eye className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">AI Vision Assistant</h1>
              </div>
              <Settings className="h-6 w-6 text-gray-600 cursor-pointer hover:text-blue-600" />
            </div>
          </header>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">

              {/* Camera Preview */}
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-lg mb-6">
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
                  onClick={isRecording ? stopCamera : startCamera}
                  className={`p-4 rounded-full ${
                    isRecording
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-gray-100 hover:bg-gray-200'
                  } text-white transition-colors`}
                  aria-label="Stop camera"
                >
                  <Camera className={`h-8 w-8 ${isRecording ? 'text-white' : 'text-gray-700'}`} />
                </button>
                <button
                  onClick={speakDescription}
                  className={`p-4 rounded-full transition-colors ${
                    isSpeaking
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  aria-label="Toggle speech output"
                >
                  <Volume2 className={`h-8 w-8 ${isSpeaking ? 'text-white' : 'text-gray-700'}`} />
                </button>
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`p-4 rounded-full transition-colors ${
                    isListening
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  aria-label="Toggle voice input"
                >
                  <Mic className={`h-8 w-8 ${isListening ? 'text-white' : 'text-gray-700'}`} />
                </button>
              </div>

              {/* Text Input */}
              <form onSubmit={handleTextSubmit} className="mb-8">
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 block w-full rounded-none rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter text here..."
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    <Type className="h-5 w-5" />
                  </button>
                </div>
              </form>

              {/* Status Indicators */}
              <div className="flex justify-center space-x-4 mb-8">
                <span className={`text-sm ${isListening ? 'text-green-600' : 'text-red-600'}`}>
                  {isListening ? 'Voice commands are active' : 'Voice recognition inactive'}
                </span>
                {isSpeaking && (
                  <span className="text-sm text-green-600">
                    Speaking...
                  </span>
                )}
              </div>

              {/* Description */}
              {description && (
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">AI Description:</h2>
                  <p className="text-gray-700">{description}</p>
                </div>
              )}

							{/* Voice Commands Guide */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h2 className="text-sm font-semibold text-blue-800 mb-2">Voice Commands:</h2>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>"Start camera" - Start camera</li>
                  <li>"Stop camera" - Stop camera</li>
                  <li>"Read" or "Describe" - Read current description</li>
                  <li>"Start mic" - Start voice recognition</li>
                  <li>"Stop mic" - Stop voice recognition</li>
                  <li>"Again" - Replay last spoken response</li>
                  <li>"What is this?", "How do I do this?", "Where is this?", "Who is this?", "this", "it", "find" - Ask questions about the input</li>
                </ul>
              </div>

              {/* Features */}
              <div className="mt-12">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{features[currentFeatureIndex].title}</h3>
                  <p className="text-gray-600">{features[currentFeatureIndex].description}</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      );
    }

    export default App;
