import React, { useEffect, useState } from 'react';
import { OnboardingChat } from './components/onboarding/OnboardingChat';
import { Header } from './components/navigation/Header';
import { Chat } from './components/Chat';
import { LoadingScreen } from './components/LoadingScreen';
import { useStore } from './store/useStore';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  const { user, isInitialized, initializeApp, error } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        setIsLoading(true);
        await initializeApp();
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, [initializeApp]);

  if (isLoading || !isInitialized) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <OnboardingChat />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="h-screen flex flex-col">
        <Header />
        <main className="flex-1 overflow-hidden">
          <Chat />
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;