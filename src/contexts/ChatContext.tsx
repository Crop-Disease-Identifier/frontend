import { createContext, useContext, useState, ReactNode } from 'react';
import { uploadImage } from '../api';

export interface Message {
  id: string;
  type: 'user' | 'ai';
  text?: string;
  image?: string;
  diagnosis?: {
    disease: string;
    symptoms: string[];
    treatment: string[];
  };
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  messages: Message[];
  thumbnail?: string;
  date: Date;
}

interface ChatContextType {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  createNewSession: () => void;
  addMessage: (message: Message) => void;
  loadSession: (sessionId: string) => void;
  analyzeImage: (imageUrl: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      messages: [],
      date: new Date(),
    };
    setCurrentSession(newSession);
  };

  const addMessage = (message: Message) => {
    if (!currentSession) {
      createNewSession();
    }
    
    setCurrentSession(prev => {
      if (!prev) return null;
      const updated = {
        ...prev,
        messages: [...prev.messages, message],
        thumbnail: message.image || prev.thumbnail,
      };
      
      // Update sessions list
      setSessions(prevSessions => {
        const existingIndex = prevSessions.findIndex(s => s.id === prev.id);
        if (existingIndex >= 0) {
          const newSessions = [...prevSessions];
          newSessions[existingIndex] = updated;
          return newSessions;
        }
        return [...prevSessions, updated];
      });
      
      return updated;
    });
  };

  const loadSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSession(session);
    }
  };

  const analyzeImage = async (imageUrl: string) => {
    try {
      // Convert base64 to File object
      const arr = imageUrl.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const file = new File([u8arr], "image.jpg", { type: mime });

      const formData = new FormData();
      formData.append('image', file);

      console.log("Sending image to backend for analysis...");
      const response = await uploadImage(formData);
      console.log("Backend analysis result:", response.data);

      const aiMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        diagnosis: {
          disease: response.data.predicted_class || 'Unknown Condition',
          symptoms: response.data.symptoms || ['Analysis complete'],
          treatment: response.data.treatment || ['Consult an expert'],
        },
        timestamp: new Date(),
      };
      addMessage(aiMessage);

    } catch (error) {
      console.error("Analysis failed:", error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        text: "Sorry, I couldn't analyze the image. Please try again.",
        timestamp: new Date(),
      };
      addMessage(errorMessage);
    }
  };

  return (
    <ChatContext.Provider value={{
      sessions,
      currentSession,
      createNewSession,
      addMessage,
      loadSession,
      analyzeImage,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
