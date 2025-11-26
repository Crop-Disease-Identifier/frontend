import { useNavigate } from 'react-router-dom';
import { MessageSquare, Clock } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Header from '../components/layout/Header';
import { ChatProvider } from '../contexts/ChatContext';
import { getHistory } from '../api';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

function ChatHistoryContent() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError('');
    getHistory()
      .then(res => setSessions(res.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to fetch history'))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return new Date(date).toLocaleDateString();
    }
  };

  const handleViewChat = (sessionId: string) => {
    navigate(`/chat/${sessionId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-950 flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-green-900 dark:text-green-100 mb-2">Chat History</h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            View your previous plant disease diagnoses
          </p>
        </div>

        {sessions.length === 0 ? (
          <Card className="p-12 border-green-100 dark:border-green-800 dark:bg-gray-800 text-center">
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-green-900 dark:text-green-100 mb-2">No Chat History</h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              You haven't analyzed any plants yet. Start a new diagnosis to see your history here.
            </p>
            <Button
              onClick={() => navigate('/dashboard')}
              className="bg-green-600 hover:bg-green-700"
            >
              Start New Diagnosis
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {sessions
              .sort((a, b) => b.date.getTime() - a.date.getTime())
              .map((session) => {
                const lastMessage = session.messages[session.messages.length - 1];
                const diagnosis = lastMessage?.diagnosis;

                return (
                  <Card
                    key={session.id}
                    className="p-6 border-green-100 dark:border-green-800 dark:bg-gray-800 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleViewChat(session.id)}
                  >
                    <div className="flex gap-4">
                      {session.thumbnail ? (
                        <div className="flex-shrink-0">
                          <ImageWithFallback
                            src={session.thumbnail}
                            alt="Plant thumbnail"
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                          <MessageSquare className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            {diagnosis ? (
                              <>
                                <h3 className="text-green-900 dark:text-green-100 mb-1">
                                  {diagnosis.disease}
                                </h3>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                                  {diagnosis.symptoms[0]}
                                </p>
                              </>
                            ) : (
                              <h3 className="text-green-900 dark:text-green-100">
                                Diagnosis Session
                              </h3>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400 flex-shrink-0">
                            <Clock className="h-4 w-4" />
                            {formatDate(session.date)}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-3">
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            {session.messages.length} message{session.messages.length !== 1 ? 's' : ''}
                          </span>
                          {diagnosis && (
                            <span className="inline-block bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full text-xs">
                              Disease Detected
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
          </div>
        )}
      </main>
    </div>
  );
}

export default function ChatHistory() {
  return (
    <ChatProvider>
      <ChatHistoryContent />
    </ChatProvider>
  );
}