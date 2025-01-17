{`import React from 'react';
    import CameraPreview from './CameraPreview';
    import CameraSelection from './CameraSelection';
    import Controls from './Controls';
    import TextInput from './TextInput';
    import StatusIndicators from './StatusIndicators';
    import DescriptionDisplay from './DescriptionDisplay';
    import VoiceCommandsGuide from './VoiceCommandsGuide';
    import FeaturesDisplay from './FeaturesDisplay';

    interface MainContentProps {
      videoRef: React.RefObject<HTMLVideoElement>;
      isRecording: boolean;
      description: string;
      availableCameras: MediaDeviceInfo[];
      selectedCameraId: string | null;
      setSelectedCameraId: (id: string) => void;
      isSpeaking: boolean;
      isListening: boolean;
      startCamera: () => void;
      stopCamera: () => void;
      speakDescription: () => void;
      startListening: () => void;
      stopListening: () => void;
      triggerHapticFeedback: () => void;
      inputText: string;
      setInputText: (text: string) => void;
      handleTextSubmit: (e: React.FormEvent) => void;
      features: { title: string; description: string }[];
      currentFeatureIndex: number;
      theme: any;
    }

    const MainContent: React.FC<MainContentProps> = ({
      videoRef,
      isRecording,
      description,
      availableCameras,
      selectedCameraId,
      setSelectedCameraId,
      isSpeaking,
      isListening,
      startCamera,
      stopCamera,
      speakDescription,
      startListening,
      stopListening,
      triggerHapticFeedback,
      inputText,
      setInputText,
      handleTextSubmit,
      features,
      currentFeatureIndex,
      theme,
    }) => {
      return (
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <CameraPreview videoRef={videoRef} isRecording={isRecording} description={description} />
            <CameraSelection
              availableCameras={availableCameras}
              selectedCameraId={selectedCameraId}
              setSelectedCameraId={setSelectedCameraId}
            />
            <Controls
              isRecording={isRecording}
              isSpeaking={isSpeaking}
              isListening={isListening}
              startCamera={startCamera}
              stopCamera={stopCamera}
              speakDescription={speakDescription}
              startListening={startListening}
              stopListening={stopListening}
              triggerHapticFeedback={triggerHapticFeedback}
            />
            <TextInput
              inputText={inputText}
              setInputText={setInputText}
              handleTextSubmit={handleTextSubmit}
              triggerHapticFeedback={triggerHapticFeedback}
            />
            <StatusIndicators isListening={isListening} isSpeaking={isSpeaking} />
            <DescriptionDisplay description={description} />
            <VoiceCommandsGuide />
            <FeaturesDisplay features={features} currentFeatureIndex={currentFeatureIndex} />
          </div>
        </main>
      );
    };

    export default MainContent;
    `}
