{`import React from 'react';

    interface FeaturesDisplayProps {
      features: { title: string; description: string }[];
      currentFeatureIndex: number;
    }

    const FeaturesDisplay: React.FC<FeaturesDisplayProps> = ({ features, currentFeatureIndex }) => {
      return (
        <div className="mt-6">
          <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{features[currentFeatureIndex].title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{features[currentFeatureIndex].description}</p>
          </div>
        </div>
      );
    };

    export default FeaturesDisplay;
    `}
