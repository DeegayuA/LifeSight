{`import React, { useState, useEffect } from 'react';
import { Moon, Sun, Accessibility, Contrast, Volume2, Type, TextCursor, Font, ArrowLeft, ArrowRight } from 'lucide-react';

interface AccessibilitySettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({ isOpen, onClose }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [lineSpace, setLineSpace] = useState(1.5);
  const [letterSpace, setLetterSpace] = useState(0);
  const [fontFamily, setFontFamily] = useState('sans-serif');
  const [availableFonts, setAvailableFonts] = useState([
    'sans-serif',
    'serif',
    'monospace',
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Courier New',
  ]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFontSize(Number(e.target.value));
    document.documentElement.style.fontSize = \`\${e.target.value}px\`;
  };

  const handleLineSpaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLineSpace(Number(e.target.value));
    document.documentElement.style.lineHeight = \`\${e.target.value}\`;
  };

  const handleLetterSpaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLetterSpace(Number(e.target.value));
    document.documentElement.style.letterSpacing = \`\${e.target.value}px\`;
  };

  const handleFontChange = (font: string) => {
    setFontFamily(font);
    document.documentElement.style.fontFamily = font;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Accessibility Settings</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-gray-700 dark:text-gray-300">Dark Mode</label>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={\`p-2 rounded-full transition-colors \${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}\`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="h-5 w-5 text-white" /> : <Moon className="h-5 w-5 text-gray-700" />}
            </button>
          </div>

          {/* Reduce Motion Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-gray-700 dark:text-gray-300">Reduce Motion</label>
            <input
              type="checkbox"
              checked={reduceMotion}
              onChange={() => setReduceMotion(!reduceMotion)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500"
            />
          </div>

          {/* High Contrast Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-gray-700 dark:text-gray-300">High Contrast</label>
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={\`p-2 rounded-full transition-colors \${highContrast ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-100 hover:bg-gray-200'}\`}
              aria-label="Toggle high contrast"
            >
              <Contrast className={\`h-5 w-5 \${highContrast ? 'text-white' : 'text-gray-700'}\`} />
            </button>
          </div>

          {/* Screen Reader Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-gray-700 dark:text-gray-300">Screen Reader</label>
            <button
              onClick={() => setScreenReader(!screenReader)}
              className={\`p-2 rounded-full transition-colors \${screenReader ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-100 hover:bg-gray-200'}\`}
              aria-label="Toggle screen reader"
            >
              <Volume2 className={\`h-5 w-5 \${screenReader ? 'text-white' : 'text-gray-700'}\`} />
            </button>
          </div>

          {/* Font Size Slider */}
          <div className="flex items-center justify-between">
            <label htmlFor="fontSize" className="text-gray-700 dark:text-gray-300">Font Size</label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                id="fontSize"
                min="12"
                max="24"
                value={fontSize}
                onChange={handleFontSizeChange}
                className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">{fontSize}px</span>
            </div>
          </div>

          {/* Line Space Slider */}
          <div className="flex items-center justify-between">
            <label htmlFor="lineSpace" className="text-gray-700 dark:text-gray-300">Line Space</label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                id="lineSpace"
                min="1"
                max="2"
                step="0.1"
                value={lineSpace}
                onChange={handleLineSpaceChange}
                className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">{lineSpace}</span>
            </div>
          </div>

          {/* Letter Space Slider */}
          <div className="flex items-center justify-between">
            <label htmlFor="letterSpace" className="text-gray-700 dark:text-gray-300">Letter Space</label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                id="letterSpace"
                min="-2"
                max="2"
                step="1"
                value={letterSpace}
                onChange={handleLetterSpaceChange}
                className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">{letterSpace}px</span>
            </div>
          </div>

          {/* Font Changer */}
          <div className="flex items-center justify-between">
            <label className="text-gray-700 dark:text-gray-300">Font Family</label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  const currentIndex = availableFonts.indexOf(fontFamily);
                  const newIndex = (currentIndex - 1 + availableFonts.length) % availableFonts.length;
                  handleFontChange(availableFonts[newIndex]);
                }}
                className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                aria-label="Previous font"
              >
                <ArrowLeft className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              </button>
              <span className="text-sm text-gray-500 dark:text-gray-400">{fontFamily}</span>
              <button
                onClick={() => {
                  const currentIndex = availableFonts.indexOf(fontFamily);
                  const newIndex = (currentIndex + 1) % availableFonts.length;
                  handleFontChange(availableFonts[newIndex]);
                }}
                className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                aria-label="Next font"
              >
                <ArrowRight className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilitySettings;
`}
