import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
    import { generateDescription } from './gemini';
    import translate from 'google-translate-api';
    import Header from './components/Header';
    import MainContent from './components/MainContent';

    // Theme context
    const ThemeContext = createContext({
      theme: 'light',
      toggleTheme: () => {},
    });

    // Define color palettes
    const lightPalette = {
      background: 'bg-gradient-to-b from-blue-100 to-white',
      headerBg: 'bg-white',
      headerText: 'text-gray-900',
      buttonBg: 'bg-gray-100',
      buttonHoverBg: 'hover:bg-gray-200',
      buttonText: 'text-gray-700',
      descriptionBg: 'bg-white',
      descriptionText: 'text-gray-700',
      voiceGuideBg: 'bg-blue-50',
      voiceGuideText: 'text-blue-700',
      featureBg: 'bg-white',
      featureText: 'text-gray-600',
      selectBg: 'bg-gray-100',
      selectText: 'text-gray-700',
      selectBorder: 'border-gray-300',
    };

    const darkPalette = {
      background: 'bg-gradient-to-b from-gray-900 to-gray-800',
      headerBg: 'bg-gray-800',
      headerText: 'text-white',
      buttonBg: 'bg-gray-700',
      buttonHoverBg: 'hover:bg-gray-600',
      buttonText: 'text-white',
      descriptionBg: 'bg-gray-800',
      descriptionText: 'text-gray-300',
      voiceGuideBg: 'bg-gray-700',
      voiceGuideText: 'text-blue-200',
      featureBg: 'bg-gray-800',
      featureText: 'text-gray-300',
      selectBg: 'bg-gray-700',
      selectText: 'text-white',
      selectBorder: 'border-gray-500',
    };

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
      const [darkMode, setDarkMode] = useState(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
          return storedTheme === 'dark';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      });
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
        
        if (isVoice) {
          currentPrompt = `Based on the following voice input, answer any questions if asked: "${input}" for visually impaired or blind people. Do not mention about disabilities in answer. Use conversation mode.`;
        } else {
          currentPrompt = `Based on the following text, answer any questions if asked: "${input}" for visually impaired or blind people. Do not mention about disabilities in answer. Use conversation mode.`;
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

      const theme = darkMode ? darkPalette : lightPalette;

      return (
        <ThemeContext.Provider value={{ theme: darkMode ? 'dark' : 'light', toggleTheme }}>
          <div className={`min-h-screen {theme.background}`}>
            <Header
              selectedLanguage={selectedLanguage}
              allLanguages={allLanguages}
              handleLanguageChange={handleLanguageChange}
              darkMode={darkMode}
              toggleTheme={toggleTheme}
              theme={theme}
            />
            <MainContent
              videoRef={videoRef}
              isRecording={isRecording}
              description={description}
              availableCameras={availableCameras}
              selectedCameraId={selectedCameraId}
              setSelectedCameraId={setSelectedCameraId}
              isSpeaking={isSpeaking}
              isListening={isListening}
              startCamera={startCamera}
              stopCamera={stopCamera}
              speakDescription={speakDescription}
              startListening={startListening}
              stopListening={stopListening}
              triggerHapticFeedback={triggerHapticFeedback}
              inputText={inputText}
              setInputText={setInputText}
              handleTextSubmit={handleTextSubmit}
              features={features}
              currentFeatureIndex={currentFeatureIndex}
              theme={theme}
            />
          </div>
        </ThemeContext.Provider>
      );
    }

    export default App;
