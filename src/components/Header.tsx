{`import React from 'react';
    import { Eye, Moon, Sun } from 'lucide-react';

    interface HeaderProps {
      selectedLanguage: string;
      allLanguages: { code: string; name: string }[];
      handleLanguageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
      darkMode: boolean;
      toggleTheme: () => void;
      theme: any;
    }

    const Header: React.FC<HeaderProps> = ({ selectedLanguage, allLanguages, handleLanguageChange, darkMode, toggleTheme, theme }) => {
      return (
        <header className={\`shadow-sm \${theme.headerBg}\`}>
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Eye className="h-8 w-8 text-blue-600 dark:text-white" />
              <h1 className={\`text-2xl font-bold \${theme.headerText}\`}> LifeSight - AI Vision Assistant</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun className="h-5 w-5 text-white" /> : <Moon className="h-5 w-5 text-gray-700 dark:text-white" />}
              </button>
              <select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                className={\`rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 \${theme.selectBg} \${theme.selectText} \${theme.selectBorder}\`}
              >
                {allLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>
      );
    };

    export default Header;
    `}
