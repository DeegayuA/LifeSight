{`import React from 'react';

    const VoiceCommandsGuide: React.FC = () => {
      return (
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
      );
    };

    export default VoiceCommandsGuide;
    `}
