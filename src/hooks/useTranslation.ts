import { useState } from 'react';
    import translate from 'google-translate-api';

    export const useTranslation = () => {
      const [selectedLanguage, setSelectedLanguage] = useState('en');

      const translateContent = async (text: string, targetLang: string) => {
        try {
          const translated = await translate(text, { to: targetLang });
          return translated.text;
        } catch (error) {
          console.error('Translation error:', error);
          return text;
        }
      };

      const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLanguage(e.target.value);
      };

      return { selectedLanguage, handleLanguageChange, translateContent };
    };
