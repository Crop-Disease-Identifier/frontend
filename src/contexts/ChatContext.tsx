import { createContext, useContext, useState, ReactNode } from 'react';

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
    // Mock AI analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockDiagnoses = [
      {
        disease: 'Early Blight',
        symptoms: [
          'Dark brown spots with concentric rings on older leaves',
          'Yellowing around the spots',
          'Premature leaf drop'
        ],
        treatment: [
          'Remove and destroy infected plant parts',
          'Apply copper-based fungicide every 7-10 days',
          'Ensure proper spacing for air circulation',
          'Water plants at the base to keep foliage dry'
        ]
      },
      {
        disease: 'Powdery Mildew',
        symptoms: [
          'White powdery coating on leaves and stems',
          'Distorted or stunted growth',
          'Yellowing and browning of affected areas'
        ],
        treatment: [
          'Apply sulfur or neem oil spray',
          'Improve air circulation around plants',
          'Remove severely infected leaves',
          'Avoid overhead watering'
        ]
      },
      {
        disease: 'Leaf Spot Disease',
        symptoms: [
          'Circular brown or black spots on leaves',
          'Yellow halo around spots',
          'Leaf wilting and premature drop'
        ],
        treatment: [
          'Prune infected leaves immediately',
          'Apply organic fungicide',
          'Maintain proper plant spacing',
          'Water in the morning to allow leaves to dry'
        ]
      }
    ];

    const randomDiagnosis = mockDiagnoses[Math.floor(Math.random() * mockDiagnoses.length)];

    const aiMessage: Message = {
      id: Date.now().toString(),
      type: 'ai',
      diagnosis: randomDiagnosis,
      timestamp: new Date(),
    };

    addMessage(aiMessage);
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
