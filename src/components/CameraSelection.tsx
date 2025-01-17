{`import React from 'react';

    interface CameraSelectionProps {
      availableCameras: MediaDeviceInfo[];
      selectedCameraId: string | null;
      setSelectedCameraId: (id: string) => void;
    }

    const CameraSelection: React.FC<CameraSelectionProps> = ({ availableCameras, selectedCameraId, setSelectedCameraId }) => {
      if (availableCameras.length <= 1) return null;

      return (
        <div className="mb-4">
          <label htmlFor="cameraSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Select Camera:
          </label>
          <div className="mt-1 flex space-x-2">
            {availableCameras.map((camera) => (
              <button
                key={camera.deviceId}
                onClick={() => setSelectedCameraId(camera.deviceId)}
                className={\`px-4 py-2 rounded-md border \${
                  selectedCameraId === camera.deviceId
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50\`}
              >
                {camera.label || \`Camera \${availableCameras.indexOf(camera) + 1}\`}
              </button>
            ))}
          </div>
        </div>
      );
    };

    export default CameraSelection;
    `}
