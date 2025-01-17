import React from 'react';

    interface FeaturesProps {
      features: any[];
      currentFeatureIndex: number;
      theme: any;
    }

    const Features: React.FC<FeaturesProps> = ({ features, currentFeatureIndex, theme }) => {
      return (
        <div className="mt-6">
          <div className={`p-6 rounded-lg shadow-md ${theme.featureBg}`}>
            <h3 className={`text-lg font-semibold ${theme.headerText} mb-2`}>{features[currentFeatureIndex].title}</h3>
            <p className={`text-gray-600 dark:text-gray-300`}>{features[currentFeatureIndex].description}</p>
          </div>
        </div>
      );
    };

    export default Features;
