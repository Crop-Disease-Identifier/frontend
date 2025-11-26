import { useState, useRef } from 'react';
import { uploadImage } from '../api';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import Header from '../components/layout/Header';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useNavigate } from 'react-router-dom';

export default function UploadImage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      setError('Please upload a JPG or PNG image only');
      return false;
    }

    if (file.size > maxSize) {
      setError('Image size must be less than 5MB');
      return false;
    }

    setError('');
    return true;
  };

  const handleFile = (file: File) => {
    if (!validateFile(file)) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
      setFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setSelectedImage(null);
    setFileName('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage || !fileName) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      // Convert base64 to File object if needed
      const arr = selectedImage.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const file = new File([u8arr], fileName, { type: mime });
      const formData = new FormData();
      formData.append('image', file);
      const res = await uploadImage(formData);
      setResult(res.data);
      // Optionally navigate or show result
    } catch (err: any) {
      setError(err.response?.data?.message || 'Image analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-green-900 mb-2">Upload Plant Image</h1>
          <p className="text-neutral-600">
            Upload a clear photo of the affected plant for accurate diagnosis
          </p>
        </div>

        <Card className="p-8 border-green-100">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept="image/jpeg,image/jpg,image/png"
            className="hidden"
          />

          {!selectedImage ? (
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                dragActive
                  ? 'border-green-500 bg-green-50'
                  : 'border-green-200 hover:border-green-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="rounded-full bg-green-100 w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Upload className="h-10 w-10 text-green-600" />
              </div>

              <h3 className="text-green-900 mb-2">
                Drag and drop your image here
              </h3>
              <p className="text-neutral-600 mb-6">or</p>

              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-green-600 hover:bg-green-700"
              >
                Select File
              </Button>

              <div className="mt-6 pt-6 border-t border-green-100">
                <p className="text-sm text-neutral-600 mb-2">Supported formats:</p>
                <p className="text-sm text-neutral-500">JPG, PNG (max 5MB)</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative rounded-xl overflow-hidden bg-neutral-100">
                <ImageWithFallback
                  src={selectedImage}
                  alt="Selected plant"
                  className="w-full h-auto max-h-96 object-contain mx-auto"
                />
                <button
                  onClick={handleRemove}
                  className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-neutral-100 transition-colors"
                >
                  <X className="h-5 w-5 text-neutral-700" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-4 rounded-lg">
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                <span>
                  <span className="font-medium">{fileName}</span> uploaded successfully
                </span>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900 mb-2">💡 Tips for better results:</p>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Ensure good lighting on the affected area</li>
                  <li>• Focus on the diseased parts of the plant</li>
                  <li>• Avoid blurry or distant shots</li>
                  <li>• Include leaves, stems, or fruits showing symptoms</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleRemove}
                  variant="outline"
                  className="flex-1 border-green-200"
                >
                  Choose Different Image
                </Button>
                <Button
                  onClick={handleAnalyze}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Analyze Image
                </Button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 flex items-center gap-2 text-sm text-red-700 bg-red-50 p-4 rounded-lg border border-red-200">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </Card>

        <Card className="mt-6 p-6 border-green-100 bg-green-50">
          <h3 className="text-green-900 mb-2 text-sm">About Image Processing</h3>
          <p className="text-sm text-neutral-600">
            Large images will be automatically resized and compressed for faster processing while maintaining quality for accurate disease detection.
          </p>
        </Card>
      </main>
    </div>
  );
}
