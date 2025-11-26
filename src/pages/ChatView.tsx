import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Image as ImageIcon, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import Header from '../components/layout/Header';
import { ChatProvider, useChat, Message } from '../contexts/ChatContext';
import { sendChat } from '../api';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useEffect, useState, useRef } from 'react';
import CameraCapture from '../components/CameraCapture';

function ChatViewContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sessions, loadSession, currentSession, addMessage } = useChat();
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      loadSession(id);
    }
  }, [id, loadSession]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedImage && !inputText.trim()) return;
    setLoading(true);
    setError('');
    try {
      let payload: any = {};
      if (inputText.trim()) payload.message = inputText;
      if (selectedImage) {
        // Convert base64 to File object if needed
        const arr = selectedImage.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const file = new File([u8arr], 'chat-image.png', { type: mime });
        const formData = new FormData();
        formData.append('image', file);
        if (inputText.trim()) formData.append('message', inputText);
        const res = await sendChat(formData);
        addMessage({
          id: Date.now().toString(),
          type: 'user',
          text: inputText,
          image: selectedImage,
          timestamp: new Date(),
        });
        addMessage(res.data);
        setInputText('');
        // Don't clear the image - keep it visible
      } else {
        const res = await sendChat(payload);
        addMessage({
          id: Date.now().toString(),
          type: 'user',
          text: inputText,
          timestamp: new Date(),
        });
        addMessage(res.data);
        setInputText('');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  if (!currentSession) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <Card className="p-8 border-green-100 text-center">
            <h3 className="text-green-900 mb-2">Chat Not Found</h3>
            <p className="text-neutral-600 mb-6">
              This chat session doesn't exist or has been deleted.
            </p>
            <Button onClick={() => navigate('/chat-history')} className="bg-green-600 hover:bg-green-700">
              Back to History
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col max-w-4xl">
        {/* Back Button */}
        <div className="mb-4">
          <Button variant="ghost" onClick={() => navigate('/chat-history')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to History
          </Button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {currentSession.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'user' ? (
                <Card className="max-w-[80%] p-4 bg-green-600 border-green-600 text-white">
                  {message.text && <p className="text-sm">{message.text}</p>}
                  {message.image && (
                    <div className="mt-2 rounded-lg overflow-hidden">
                      <ImageWithFallback
                        src={message.image}
                        alt="Uploaded plant"
                        className="w-full h-auto max-w-xs"
                      />
                    </div>
                  )}
                </Card>
              ) : (
                <Card className="max-w-[85%] p-5 border-green-100 bg-white">
                  {message.diagnosis && (
                    <div className="space-y-4">
                      <div>
                        <div className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm mb-3">
                          Disease Detected
                        </div>
                        <h3 className="text-green-900 mb-1">{message.diagnosis.disease}</h3>
                      </div>

                      <div>
                        <h4 className="text-sm text-neutral-700 mb-2">Symptoms:</h4>
                        <ul className="space-y-1">
                          {message.diagnosis.symptoms.map((symptom, idx) => (
                            <li key={idx} className="text-sm text-neutral-600 flex items-start">
                              <span className="text-green-600 mr-2">•</span>
                              {symptom}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-sm text-neutral-700 mb-2">Recommended Treatment:</h4>
                        <ul className="space-y-1">
                          {message.diagnosis.treatment.map((step, idx) => (
                            <li key={idx} className="text-sm text-neutral-600 flex items-start">
                              <span className="text-green-600 mr-2">{idx + 1}.</span>
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </Card>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Continue Chat Input */}
        <Card className="border-green-100 shadow-lg">
          {selectedImage && (
            <div className="p-4 border-b border-green-100">
              <div className="relative inline-block">
                <ImageWithFallback
                  src={selectedImage}
                  alt="Selected"
                  className="h-20 w-20 object-cover rounded-lg"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <div className="p-4 flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/jpeg,image/png,image/jpg"
              className="hidden"
            />

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/jpeg,image/png,image/jpg"
              capture="environment"
              className="hidden"
            />

            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="flex-shrink-0 border-green-200 hover:bg-green-50"
            >
              <ImageIcon className="h-5 w-5 text-green-600" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowCamera(true)}
              className="flex-shrink-0 border-green-200 hover:bg-green-50"
            >
              <Camera className="h-5 w-5 text-green-600" />
            </Button>

            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Continue the conversation..."
              className="flex-1 min-h-[44px] max-h-32 resize-none border-green-200 focus:border-green-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />

            <Button
              onClick={handleSendMessage}
              disabled={!selectedImage && !inputText.trim()}
              className="flex-shrink-0 bg-green-600 hover:bg-green-700"
              size="icon"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </Card>

        {showCamera && (
          <CameraCapture
            onClose={() => setShowCamera(false)}
            onCapture={(image) => {
              setSelectedImage(image);
              setShowCamera(false);
            }}
          />
        )}
      </main>
    </div>
  );
}

export default function ChatView() {
  return (
    <ChatProvider>
      <ChatViewContent />
    </ChatProvider>
  );
}