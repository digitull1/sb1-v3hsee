import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { ChatContainer } from './ChatContainer';
import { ChatInput } from './ChatInput';
import { ProgressHeader } from '../gamification/ProgressHeader';
import { LevelUpNotification } from '../gamification/LevelUpNotification';
import { useChatHandlers } from './hooks/useChatHandlers';

export function Chat() {
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpData, setLevelUpData] = useState({ level: 1, points: 0 });
  
  const { user, messages } = useStore();
  
  const {
    handleSend,
    handleQuizComplete,
    handleBlockClick,
    handleVoiceResult,
    handleImageUpload,
    getInputPlaceholder
  } = useChatHandlers({
    setIsLoading,
    setLevelUpData,
    setShowLevelUp,
    setIsListening,
    userName: user?.name
  });

  return (
    <div className="h-screen flex flex-col">
      <ProgressHeader />
      
      <main className="flex-1 overflow-hidden">
        <ChatContainer
          messages={messages}
          isLoading={isLoading}
          onQuizComplete={handleQuizComplete}
          onBlockClick={handleBlockClick}
        />
      </main>

      <ChatInput
        onSend={handleSend}
        onImageUpload={handleImageUpload}
        isLoading={isLoading}
        isListening={isListening}
        onVoiceResult={handleVoiceResult}
        toggleListening={() => setIsListening(!isListening)}
        placeholder={getInputPlaceholder()}
      />

      <LevelUpNotification
        level={levelUpData.level}
        points={levelUpData.points}
        isVisible={showLevelUp}
        onClose={() => setShowLevelUp(false)}
      />
    </div>
  );
}