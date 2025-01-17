import React from 'react';

    interface CameraViewProps {
      videoRef: React.RefObject<HTMLVideoElement>;
      isRecording: boolean;
      description: string;
    }

    const CameraView: React.FC<CameraViewProps> = ({ videoRef, isRecording, description }) => {
      return (
        <div className="relative aspect-auto bg-gray-900 rounded-lg overflow-hidden shadow-lg mb-6">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            {!isRecording && !description && (
              <p className="text-white text-lg">Camera is active</p>
            )}
          </div>
        </div>
      );
    };

    export default CameraView;
