{`import React from 'react';

    interface StatusIndicatorsProps {
      isListening: boolean;
      isSpeaking: boolean;
    }

    const StatusIndicators: React.FC<StatusIndicatorsProps> = ({ isListening, isSpeaking }) => {
      return (
        <div className="flex justify-center space-x-4 mb-8">
          <span className={\`text-sm \${isListening ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}\`}>
            {isListening ? 'Voice commands are active' : 'Voice recognition inactive'}
          </span>
          {isSpeaking && (
            <span className="text-sm text-green-600 dark:text-green-400">
              Speaking...
            </span>
          )}
        </div>
      );
    };

    export default StatusIndicators;
    `}
