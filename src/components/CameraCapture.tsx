import { useEffect, useRef, useState } from 'react';
import { Camera, X, ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

export default function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('camera-not-supported');
        return;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false,
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      // Handle camera access errors gracefully
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError('permission-denied');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setError('no-camera');
        } else {
          setError('generic');
        }
      } else {
        setError('generic');
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        onCapture(imageData);
        stopCamera();
        onClose();
      }
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onCapture(reader.result as string);
        stopCamera();
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  const getErrorMessage = () => {
    switch (error) {
      case 'permission-denied':
        return {
          title: 'Camera Permission Denied',
          message: 'Please allow camera access in your browser settings to take photos. You can also use the "Select Photo" option below to choose an existing image.',
        };
      case 'no-camera':
        return {
          title: 'No Camera Found',
          message: 'No camera device was detected on your device. Please use the "Select Photo" option below to choose an existing image.',
        };
      case 'camera-not-supported':
        return {
          title: 'Camera Not Supported',
          message: 'Your browser does not support camera access. Please use the "Select Photo" option below to choose an existing image.',
        };
      default:
        return {
          title: 'Camera Error',
          message: 'Unable to access the camera. Please use the "Select Photo" option below to choose an existing image.',
        };
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white">
        <div className="p-4 border-b border-green-100 flex items-center justify-between">
          <h3 className="text-green-900">Take Photo</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              stopCamera();
              onClose();
            }}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4">
          {error ? (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="text-yellow-900 mb-2">{getErrorMessage().title}</h4>
                <p className="text-yellow-700 text-sm">{getErrorMessage().message}</p>
              </div>

              <div className="space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/jpeg,image/png,image/jpg"
                  capture="environment"
                  className="hidden"
                />
                
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-green-600 hover:bg-green-700 gap-2"
                >
                  <ImageIcon className="h-5 w-5" />
                  Select Photo Instead
                </Button>

                <Button
                  onClick={() => {
                    stopCamera();
                    onClose();
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              </div>

              <canvas ref={canvasRef} className="hidden" />

              <div className="flex gap-3 justify-center">
                <Button
                  onClick={switchCamera}
                  variant="outline"
                  className="border-green-200"
                >
                  Switch Camera
                </Button>
                <Button
                  onClick={capturePhoto}
                  className="bg-green-600 hover:bg-green-700 gap-2"
                >
                  <Camera className="h-5 w-5" />
                  Capture Photo
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}