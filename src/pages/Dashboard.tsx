import { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Send, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Card } from '../components/ui/card';
import Header from '../components/layout/Header';
import { ChatProvider, useChat, Message } from '../contexts/ChatContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import CameraCapture from '../components/CameraCapture';
import { motion, AnimatePresence } from 'motion/react';

function DashboardContent() {
  const { currentSession, addMessage, analyzeImage, createNewSession } = useChat();
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

    if (!currentSession) {
      createNewSession();
    }

    if (inputText.trim()) {
      const textMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        text: inputText,
        timestamp: new Date(),
      };
      addMessage(textMessage);
      setInputText('');
    }

    if (selectedImage) {
      const imageMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        image: selectedImage,
        timestamp: new Date(),
      };
      addMessage(imageMessage);
      
      setAnalyzing(true);
      await analyzeImage(selectedImage);
      setAnalyzing(false);
      // Don't clear the image - keep it visible
    }

    setTimeout(scrollToBottom, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-950 flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col max-w-4xl">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {!currentSession || currentSession.messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <Card className="p-8 border-green-100 dark:border-green-800 dark:bg-gray-800 text-center max-w-md">
                <div className="rounded-full bg-green-100 dark:bg-green-900/30 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Camera className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-green-900 dark:text-green-100 mb-2">Start a New Diagnosis</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  Upload a photo of your plant to get instant AI-powered disease identification and treatment recommendations.
                </p>
              </Card>
            </div>
          ) : (
            <>
              {currentSession.messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'user' ? (
                    <Card className="max-w-[80%] p-4 bg-green-600 border-green-600 text-white">
                      {message.text && <p className="text-sm">{message.text}</p>}
                      {message.image && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                          className="mt-2 rounded-lg overflow-hidden"
                        >
                          <ImageWithFallback
                            src={message.image}
                            alt="Uploaded plant"
                            className="w-full h-auto max-w-xs"
                          />
                        </motion.div>
                      )}
                    </Card>
                  ) : (
                    <Card className="max-w-[85%] p-5 border-green-100 dark:border-green-800 bg-white dark:bg-gray-800">
                      {message.diagnosis && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          className="space-y-4"
                        >
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                          >
                            <div className="inline-block bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-sm mb-3">
                              Disease Detected
                            </div>
                            <h3 className="text-green-900 dark:text-green-100 mb-1">{message.diagnosis.disease}</h3>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                          >
                            <h4 className="text-sm text-neutral-700 dark:text-neutral-300 mb-2">Symptoms:</h4>
                            <ul className="space-y-1">
                              {message.diagnosis.symptoms.map((symptom, idx) => (
                                <motion.li
                                  key={idx}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: 0.5 + idx * 0.1 }}
                                  className="text-sm text-neutral-600 dark:text-neutral-400 flex items-start"
                                >
                                  <span className="text-green-600 dark:text-green-400 mr-2">•</span>
                                  {symptom}
                                </motion.li>
                              ))}
                            </ul>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.8 }}
                          >
                            <h4 className="text-sm text-neutral-700 dark:text-neutral-300 mb-2">Recommended Treatment:</h4>
                            <ul className="space-y-1">
                              {message.diagnosis.treatment.map((step, idx) => (
                                <motion.li
                                  key={idx}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: 0.9 + idx * 0.1 }}
                                  className="text-sm text-neutral-600 dark:text-neutral-400 flex items-start"
                                >
                                  <span className="text-green-600 dark:text-green-400 mr-2">{idx + 1}.</span>
                                  {step}
                                </motion.li>
                              ))}
                            </ul>
                          </motion.div>
                        </motion.div>
                      )}
                    </Card>
                  )}
                </motion.div>
              ))}

              <AnimatePresence>
                {analyzing && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-start"
                  >
                    <Card className="max-w-[80%] p-5 border-green-100 dark:border-green-800 bg-white dark:bg-gray-800">
                      <div className="flex items-center gap-3">
                        <Loader2 className="h-5 w-5 text-green-600 dark:text-green-400 animate-spin" />
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">Analyzing your plant...</span>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <Card className="border-green-100 dark:border-green-800 dark:bg-gray-800 shadow-lg">
          {selectedImage && (
            <div className="p-4 border-b border-green-100 dark:border-green-800">
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

            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="flex-shrink-0 border-green-200 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
            >
              <ImageIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowCamera(true)}
              className="flex-shrink-0 border-green-200 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
            >
              <Camera className="h-5 w-5 text-green-600 dark:text-green-400" />
            </Button>

            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Describe your plant's condition..."
              className="flex-1 min-h-[44px] max-h-32 resize-none border-green-200 dark:border-green-700 focus:border-green-500 dark:focus:border-green-500 dark:bg-gray-900 dark:text-white"
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

        <AnimatePresence>
          {showCamera && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3 }}
            >
              <CameraCapture
                onClose={() => setShowCamera(false)}
                onCapture={(image) => {
                  setSelectedImage(image);
                  setShowCamera(false);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ChatProvider>
      <DashboardContent />
    </ChatProvider>
  );
}