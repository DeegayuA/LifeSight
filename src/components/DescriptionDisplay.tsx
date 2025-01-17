{`import React from 'react';

    interface DescriptionDisplayProps {
      description: string;
    }

    const DescriptionDisplay: React.FC<DescriptionDisplayProps> = ({ description }) => {
      if (!description) return null;

      return (
        <div className="bg-white rounded-lg p-6 shadow-md dark:bg-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">AI Description:</h2>
          <p className="text-gray-700 dark:text-gray-300">{description}</p>
        </div>
      );
    };

    export default DescriptionDisplay;
    `}
