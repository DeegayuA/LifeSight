{`import React from 'react';
    import { Type } from 'lucide-react';

    interface TextInputProps {
      inputText: string;
      setInputText: (text: string) => void;
      handleTextSubmit: (e: React.FormEvent) => void;
      triggerHapticFeedback: () => void;
    }

    const TextInput: React.FC<TextInputProps> = ({ inputText, setInputText, handleTextSubmit, triggerHapticFeedback }) => {
      return (
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
      );
    };

    export default TextInput;
    `}
