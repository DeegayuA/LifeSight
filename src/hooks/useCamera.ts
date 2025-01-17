import { useState, useRef, useEffect } from 'react';

    export const useCamera = () => {
      const [isRecording, setIsRecording] = useState(false);
      const videoRef = useRef<HTMLVideoElement>(null);
      const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
      const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);

      useEffect(() => {
        const getCameras = async () => {
          try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter((device) => device.kind === 'videoinput');
            setAvailableCameras(videoDevices);
            if (videoDevices.length > 0) {
              setSelectedCameraId(videoDevices[0].deviceId);
            }
          } catch (error) {
            console.error('Error enumerating devices:', error);
          }
        };

        getCameras();
      }, []);

      useEffect(() => {
        if (selectedCameraId) {
          startCamera();
        }
      }, [selectedCameraId]);

      const startCamera = async () => {
        try {
          const constraints: MediaStreamConstraints = {
            video: selectedCameraId
              ? { deviceId: { exact: selectedCameraId },
                  width: { ideal: 1920 },
                  height: { ideal: 1080 },
                  facingMode: 'environment'
                }
              : {
                  facingMode: 'environment',
                  width: { ideal: 1920 },
                  height: { ideal: 1080 },
                },
          };
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setIsRecording(true);
          }
        } catch (err) {
          console.error("Error accessing camera:", err);
        }
      };

      const stopCamera = () => {
        if (videoRef.current?.srcObject) {
          const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
          tracks.forEach(track => track.stop());
          setIsRecording(false);
        }
      };

      return { videoRef, isRecording, startCamera, stopCamera, availableCameras, selectedCameraId, setSelectedCameraId };
    };
