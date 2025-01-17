import { useState, useRef } from 'react';

    export const useSpeechSynthesis = () => {
      const [isSpeaking, setIsSpeaking] = useState(false);
      const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
      const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
      const [lastSpokenResponse, setLastSpokenResponse] = useState<string | null>(null);

      speechSynthesisRef.current = window.speechSynthesis;

      const speakDescription = (description: string, recognitionRef: any, setIsListening: any) => {
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

      const replayLastResponse = (recognitionRef: any, setIsListening: any, lastSpokenResponse: string | null) => {
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

      return { isSpeaking, speechSynthesisRef, speakDescription, replayLastResponse, setLastSpokenResponse, lastSpokenResponse };
    };
