import React from 'react';

    export const ThemeContext = React.createContext({
      theme: 'light',
      toggleTheme: () => {},
    });

    // Define color palettes
    export const lightPalette = {
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

    export const darkPalette = {
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
