import { useState, useRef, useEffect } from 'react';

    export const useSpeechRecognition = () => {
      const [isListening, setIsListening] = useState(false);
      const recognitionRef = useRef<SpeechRecognition | null>(null);

      useEffect(() => {
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = true;
          recognitionRef.current.interimResults = false;
          recognitionRef.current.lang = 'en-US';

          recognitionRef.current.onend = () => {
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
        }

        return () => {
          if (recognitionRef.current) {
            recognitionRef.current.abort();
          }
        };
      }, []);

      const handleVoiceCommand = (command: string) => {
        console.log('Received command:', command);
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

      return { isListening, recognitionRef, handleVoiceCommand, startListening, stopListening };
    };
