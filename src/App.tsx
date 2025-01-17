import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
    import { Camera, Volume2, Settings, Eye, Mic, Type, Moon, Sun } from 'lucide-react';
    import { generateDescription } from './gemini';
    import translate from 'google-translate-api';

    // Theme context
    const ThemeContext = createContext({
      theme: 'light',
      toggleTheme: () => {},
    });

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
      const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
      const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);
      const [selectedLanguage, setSelectedLanguage] = useState('en');
      const [darkMode, setDarkMode] = useState(false);
      const [promptHistory, setPromptHistory] = useState<string[]>([]);
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

      const allLanguages = [
        { code: 'af', name: 'Afrikaans' },
        { code: 'sq', name: 'Albanian' },
        { code: 'am', name: 'Amharic' },
        { code: 'ar', name: 'Arabic' },
        { code: 'hy', name: 'Armenian' },
        { code: 'az', name: 'Azerbaijani' },
        { code: 'eu', name: 'Basque' },
        { code: 'be', name: 'Belarusian' },
        { code: 'bn', name: 'Bengali' },
        { code: 'bs', name: 'Bosnian' },
        { code: 'bg', name: 'Bulgarian' },
        { code: 'ca', name: 'Catalan' },
        { code: 'ceb', name: 'Cebuano' },
        { code: 'zh-CN', name: 'Chinese Simplified' },
        { code: 'zh-TW', name: 'Chinese Traditional' },
        { code: 'co', name: 'Corsican' },
        { code: 'hr', name: 'Croatian' },
        { code: 'cs', name: 'Czech' },
        { code: 'da', name: 'Danish' },
        { code: 'nl', name: 'Dutch' },
        { code: 'en', name: 'English' },
        { code: 'eo', name: 'Esperanto' },
        { code: 'et', name: 'Estonian' },
        { code: 'fi', name: 'Finnish' },
        { code: 'fr', name: 'French' },
        { code: 'fy', name: 'Frisian' },
        { code: 'gl', name: 'Galician' },
        { code: 'ka', name: 'Georgian' },
        { code: 'de', name: 'German' },
        { code: 'el', name: 'Greek' },
        { code: 'gu', name: 'Gujarati' },
        { code: 'ht', name: 'Haitian Creole' },
        { code: 'ha', name: 'Hausa' },
        { code: 'haw', name: 'Hawaiian' },
        { code: 'he', name: 'Hebrew' },
        { code: 'hi', name: 'Hindi' },
        { code: 'hmn', name: 'Hmong' },
        { code: 'hu', name: 'Hungarian' },
        { code: 'is', name: 'Icelandic' },
        { code: 'ig', name: 'Igbo' },
        { code: 'id', name: 'Indonesian' },
        { code: 'ga', name: 'Irish' },
        { code: 'it', name: 'Italian' },
        { code: 'ja', name: 'Japanese' },
        { code: 'jw', name: 'Javanese' },
        { code: 'kn', name: 'Kannada' },
        { code: 'kk', name: 'Kazakh' },
        { code: 'km', name: 'Khmer' },
        { code: 'ko', name: 'Korean' },
        { code: 'ku', name: 'Kurdish' },
        { code: 'ky', name: 'Kyrgyz' },
        { code: 'lo', name: 'Lao' },
        { code: 'la', name: 'Latin' },
        { code: 'lv', name: 'Latvian' },
        { code: 'lt', name: 'Lithuanian' },
        { code: 'lb', name: 'Luxembourgish' },
        { code: 'mk', name: 'Macedonian' },
        { code: 'mg', name: 'Malagasy' },
        { code: 'ms', name: 'Malay' },
        { code: 'ml', name: 'Malayalam' },
        { code: 'mt', name: 'Maltese' },
        { code: 'mi', name: 'Maori' },
        { code: 'mr', name: 'Marathi' },
        { code: 'mn', name: 'Mongolian' },
        { code: 'my', name: 'Myanmar (Burmese)' },
        { code: 'ne', name: 'Nepali' },
        { code: 'no', name: 'Norwegian' },
        { code: 'ny', name: 'Nyanja (Chichewa)' },
        { code: 'ps', name: 'Pashto' },
        { code: 'fa', name: 'Persian' },
        { code: 'pl', name: 'Polish' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'pa', name: 'Punjabi' },
        { code: 'ro', name: 'Romanian' },
        { code: 'ru', name: 'Russian' },
        { code: 'sm', name: 'Samoan' },
        { code: 'gd', name: 'Scots Gaelic' },
        { code: 'sr', name: 'Serbian' },
        { code: 'st', name: 'Sesotho' },
        { code: 'sn', name: 'Shona' },
        { code: 'sd', name: 'Sindhi' },
        { code: 'si', name: 'Sinhala (Sinhalese)' },
        { code: 'sk', name: 'Slovak' },
        { code: 'sl', name: 'Slovenian' },
        { code: 'so', name: 'Somali' },
        { code: 'es', name: 'Spanish' },
        { code: 'su', name: 'Sundanese' },
        { code: 'sw', name: 'Swahili' },
        { code: 'sv', name: 'Swedish' },
        { code: 'tl', name: 'Tagalog (Filipino)' },
        { code: 'tg', name: 'Tajik' },
        { code: 'ta', name: 'Tamil' },
        { code: 'te', name: 'Telugu' },
        { code: 'th', name: 'Thai' },
        { code: 'tr', name: 'Turkish' },
        { code: 'uk', name: 'Ukrainian' },
        { code: 'ur', name: 'Urdu' },
        { code: 'uz', name: 'Uzbek' },
        { code: 'vi', name: 'Vietnamese' },
        { code: 'cy', name: 'Welsh' },
        { code: 'xh', name: 'Xhosa' },
        { code: 'yi', name: 'Yiddish' },
        { code: 'yo', name: 'Yoruba' },
        { code: 'zu', name: 'Zulu' },
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
          recognitionRef.current.lang = 'en-US';

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

        const getCameras = async () => {
          try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter((device) => device.kind === 'videoinput');
            setAvailableCameras(videoDevices);
            if (videoDevices.length > 0) {
              setSelectedCameraId(videoDevices[0].deviceId);
            }
          } catch (error) {
            console.error('Error enumerating devices:', error);
          }
        };

        getCameras();

        // Theme setup
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
          setDarkMode(storedTheme === 'dark');
        } else {
          setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
        }

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

      useEffect(() => {
        if (selectedCameraId) {
          startCamera();
        }
      }, [selectedCameraId]);

      useEffect(() => {
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
        if (darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }, [darkMode]);

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
        } else if (command.includes('what') || command.includes('how') || command.includes('where') || command.includes('who') || command.includes('this') || command.includes('it') || command.includes('find') || command.includes('picture') || command.includes('image')) {
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
          const constraints: MediaStreamConstraints = {
            video: selectedCameraId
              ? { deviceId: { exact: selectedCameraId },
                  width: { ideal: 1920 },
                  height: { ideal: 1080 },
                  facingMode: 'environment'
                }
              : {
                  facingMode: 'environment',
                  width: { ideal: 1920 },
                  height: { ideal: 1080 },
                },
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
        let currentPrompt = '';
        let imageToSend = null;
        let videoToSend = null;
        
      	currentPrompt = `You are an AI assistant helping a blind person do thier work on thier own, with help of you see (using the camera view) and hear (from user input). The user ask: "${input}". Help the user, Do not mention about disabilities in answer. Use helpful friendly conversation mode. DO NOT LIE.`;
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
				  // Use the full camera sensor resolution
				  canvas.width = videoRef.current.videoWidth;
				  canvas.height = videoRef.current.videoHeight;
				
				  const ctx = canvas.getContext('2d');
				  if (ctx) {
				    // Draw the full frame from the video feed onto the canvas
				    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
				    const imageDataURL = canvas.toDataURL('image/jpeg');
				    setCapturedImage(imageDataURL);
				    imageToSend = imageDataURL;
				  }
				}
      
        const newDescription = await generateDescription(currentPrompt, imageToSend, videoToSend, isVoice, selectedLanguage);
        console.log('Gemini Response:', newDescription);
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
        setInputText('');
        setCapturedImage(null);

        // Update prompt history
        setPromptHistory((prevHistory) => {
          const updatedHistory = [input, ...prevHistory];
          return updatedHistory.slice(0, 5);
        });
      };

      const triggerHapticFeedback = () => {
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
      };

      // Translation function
      const translateContent = async (text: string, targetLang: string) => {
        try {
          const response = await fetch('https://translation.googleapis.com/language/translate/v2', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY}`,
            },
            body: JSON.stringify({
              q: text,
              target: targetLang,
            }),
          });
          
          const data = await response.json();
          return data.data.translations[0].translatedText;
        } catch (error) {
          console.error('Translation error:', error);
          return text;
        }
      };

      // Handle language change with translation
      const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLanguage = e.target.value;
        setSelectedLanguage(newLanguage);
        
        if (description && speechSynthesisRef.current) {
          const translatedDescription = await translateContent(description, newLanguage);
          setDescription(translatedDescription);
          
          const utterance = new SpeechSynthesisUtterance(translatedDescription);
          utterance.lang = newLanguage;
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
          setLastSpokenResponse(translatedDescription);
          setIsSpeaking(true);
        }
      };

      const toggleTheme = () => {
        setDarkMode((prevMode) => !prevMode);
      };

      return (
        <ThemeContext.Provider value={{ theme: darkMode ? 'dark' : 'light', toggleTheme }}>
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
          {/* Header */}
          <header className="bg-white shadow-sm dark:bg-gray-700">
            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Eye className="h-8 w-8 text-blue-600 dark:text-white" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white"> LifeSight - AI Vision Assistant</h1>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                  className="bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md px-2 py-1 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  {allLanguages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  aria-label="Toggle theme"
                >
                  {darkMode ? <Sun className="h-5 w-5 text-white" /> : <Moon className="h-5 w-5 text-gray-700 dark:text-white" />}
                </button>
              </div>
            </div>
          </header>

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

              {/* Camera Selection */}
              {availableCameras.length > 1 && (
                <div className="mb-4">
                  <label htmlFor="cameraSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Camera:
                  </label>
                  <div className="mt-1 flex space-x-2">
                    {availableCameras.map((camera) => (
                      <button
                        key={camera.deviceId}
                        onClick={() => setSelectedCameraId(camera.deviceId)}
                        className={`px-4 py-2 rounded-md border ${
                          selectedCameraId === camera.deviceId
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                      >
                        {camera.label || `Camera ${availableCameras.indexOf(camera) + 1}`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="flex justify-center space-x-4 mb-8">
                <button
                  onClick={() => {
                    triggerHapticFeedback();
                    isRecording ? stopCamera() : startCamera();
                  }}
                  className={`p-4 rounded-full ${
                    isRecording
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
                  } text-white transition-colors`}
                  aria-label="Stop camera"
                >
                  <Camera className={`h-8 w-8 ${isRecording ? 'text-white' : 'text-gray-700 dark:text-white'}`} />
                </button>
                <button
                  onClick={() => {
                    triggerHapticFeedback();
                    speakDescription();
                  }}
                  className={`p-4 rounded-full transition-colors ${
                    isSpeaking
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
                  }`}
                  aria-label="Toggle speech output"
                >
                  <Volume2 className={`h-8 w-8 ${isSpeaking ? 'text-white' : 'text-gray-700 dark:text-white'}`} />
                </button>
                <button
                  onClick={() => {
                    triggerHapticFeedback();
                    isListening ? stopListening() : startListening();
                  }}
                  className={`p-4 rounded-full transition-colors ${
                    isListening
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
                  }`}
                  aria-label="Toggle voice input"
                >
                  <Mic className={`h-8 w-8 ${isListening ? 'text-white' : 'text-gray-700 dark:text-white'}`} />
                </button>
              </div>

              {/* Text Input */}
              <form onSubmit={handleTextSubmit} className="mb-8">
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 block w-full rounded-md border-gray-300 dark:border-gray-500 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter text here..."
                  />
                  <button
                    type="submit"
                    onClick={triggerHapticFeedback}
                    className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    <Type className="h-5 w-5" />
                  </button>
                </div>
              </form>

              {/* Status Indicators */}
              <div className="flex justify-center space-x-4 mb-8">
                <span className={`text-sm ${isListening ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {isListening ? 'Voice commands are active' : 'Voice recognition inactive'}
                </span>
                {isSpeaking && (
                  <span className="text-sm text-green-600 dark:text-green-400">
                    Speaking...
                  </span>
                )}
              </div>

              {/* Description */}
              {description && (
                <div className="bg-white rounded-lg p-6 shadow-md dark:bg-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">AI Description:</h2>
                  <p className="text-gray-700 dark:text-gray-300">{description}</p>
                </div>
              )}

							{/* Voice Commands Guide */}
              <div className="bg-blue-50 rounded-lg p-4 mt-6 dark:bg-gray-700">
                <h2 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">Voice Commands:</h2>
                <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-1">
                  <li>"Start camera" - Start camera</li>
                  <li>"Stop camera" - Stop camera</li>
                  <li>"Read" or "Describe" - Read current description</li>
                  <li>"Start mic" - Start voice recognition</li>
                  <li>"Stop mic" - Stop voice recognition</li>
                  <li>"Again" - Replay last spoken response</li>
                  <li>"What is this?", "How do I do this?", "Where is this?", "Who is this?", "this", "it", "find", "picture", "image" - Ask questions about the input</li>
                </ul>
              </div>

              {/* Features */}
              <div className="mt-6">
                <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{features[currentFeatureIndex].title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{features[currentFeatureIndex].description}</p>
                </div>
              </div>

              {/* Prompt History */}
              {promptHistory.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Last Prompts:</h2>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                    {promptHistory.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </main>
        </div>
        </ThemeContext.Provider>
      );
    }

    export default App;
