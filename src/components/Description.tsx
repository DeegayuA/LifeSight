import React from 'react';

    interface DescriptionProps {
      description: string;
      theme: any;
    }

    const Description: React.FC<DescriptionProps> = ({ description, theme }) => {
      return (
        <>
          {description && (
            <div className={`rounded-lg p-6 shadow-md ${theme.descriptionBg}`}>
              <h2 className={`text-lg font-semibold ${theme.headerText} mb-2`}>AI Description:</h2>
              <p className={`text-gray-700 dark:text-gray-300`}>{description}</p>
            </div>
          )}
        </>
      );
    };

    export default Description;
