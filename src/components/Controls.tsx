{`import React from 'react';
    import { Camera, Volume2, Mic } from 'lucide-react';

    interface ControlsProps {
      isRecording: boolean;
      isSpeaking: boolean;
      isListening: boolean;
      startCamera: () => void;
      stopCamera: () => void;
      speakDescription: () => void;
      startListening: () => void;
      stopListening: () => void;
      triggerHapticFeedback: () => void;
    }

    const Controls: React.FC<ControlsProps> = ({
      isRecording,
      isSpeaking,
      isListening,
      startCamera,
      stopCamera,
      speakDescription,
      startListening,
      stopListening,
      triggerHapticFeedback,
    }) => {
      return (
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => {
              triggerHapticFeedback();
              isRecording ? stopCamera() : startCamera();
            }}
            className={\`p-4 rounded-full \${
              isRecording
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
            } text-white transition-colors\`}
            aria-label="Stop camera"
          >
            <Camera className={\`h-8 w-8 \${isRecording ? 'text-white' : 'text-gray-700 dark:text-white'}\`} />
          </button>
          <button
            onClick={() => {
              triggerHapticFeedback();
              speakDescription();
            }}
            className={\`p-4 rounded-full transition-colors \${
              isSpeaking
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
            }\`}
            aria-label="Toggle speech output"
          >
            <Volume2 className={\`h-8 w-8 \${isSpeaking ? 'text-white' : 'text-gray-700 dark:text-white'}\`} />
          </button>
          <button
            onClick={() => {
              triggerHapticFeedback();
              isListening ? stopListening() : startListening();
            }}
            className={\`p-4 rounded-full transition-colors \${
              isListening
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
            }\`}
            aria-label="Toggle voice input"
          >
            <Mic className={\`h-8 w-8 \${isListening ? 'text-white' : 'text-gray-700 dark:text-white'}\`} />
          </button>
        </div>
      );
    };

    export default Controls;
    `}
