import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useMemory } from '../hooks/useMemory';
import { useDifficulty } from '../hooks/useDifficulty';
import { generateResponse } from '../lib/api/chat';
import { generateImage, ImageError } from '../lib/api/image';
import { APIError } from '../lib/api/client/error';
import type { Message, Block } from '../types';
import { ChatContainer } from './chat/ChatContainer';
import { ChatInput } from './chat/ChatInput';
import { ProgressHeader } from './gamification/ProgressHeader';
import { LevelUpNotification } from './gamification/LevelUpNotification';

export function Chat() {
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpData, setLevelUpData] = useState({ level: 1, points: 0 });
  
  const { user, messages, addMessage, updatePoints, topicState, setCurrentTopic } = useStore();
  const memory = useMemory();
  const { getDifficulty } = useDifficulty();

  const handleSend = async (content: string) => {
    if (!content.trim() || isLoading || !user) return;

    const userMessage = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'user',
      timestamp: Date.now(),
    } as const;

    await addMessage(userMessage);
    setIsLoading(true);

    try {
      const includeQuiz = topicState.currentTopic && topicState.topicMessageCount % 5 === 0;
      const currentTopic = topicState.currentTopic || 'general';
      const currentDifficulty = getDifficulty(currentTopic);
      const recentContext = memory.getRecentContext();

      let generatedImageUrl: string | undefined;
      if (shouldGenerateImage(content)) {
        try {
          const style = user.age <= 8 ? 'colorful and friendly' : 'detailed and realistic';
          const enhancedPrompt = ['Create a', style, 'educational illustration:', content].join(' ');
          generatedImageUrl = await generateImage(enhancedPrompt);
        } catch (error) {
          console.error('Error generating image:', error);
          if (error instanceof ImageError) {
            await addMessage({
              id: Date.now().toString(),
              content: error.userMessage,
              sender: 'assistant',
              timestamp: Date.now(),
            });
          }
        }
      }

      const response = await generateResponse(
        [...messages, userMessage],
        user.age,
        includeQuiz,
        recentContext,
        currentDifficulty
      );

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        sender: 'assistant',
        blocks: response.blocks,
        quiz: response.quiz,
        difficulty: currentDifficulty,
        timestamp: Date.now(),
        generatedImageUrl,
      } as const;

      await addMessage(assistantMessage);
    } catch (error) {
      if (error instanceof APIError) {
        await addMessage({
          id: Date.now().toString(),
          content: error.userMessage,
          sender: 'assistant',
          timestamp: Date.now(),
        });
      } else {
        await addMessage({
          id: Date.now().toString(),
          content: ['Oops! My magic wand needs a quick recharge.', 'Can you try asking that again?', '✨'].join(' '),
          sender: 'assistant',
          timestamp: Date.now(),
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizComplete = (score: number, total: number) => {
    const success = score / total >= 0.7;
    const points = score * 10;
    const newLevel = Math.floor(Math.sqrt((user?.points || 0) + points) / 10) + 1;
    
    if (newLevel > (user?.level || 1)) {
      setLevelUpData({ level: newLevel, points });
      setShowLevelUp(true);
    }
    
    updatePoints(points);
  };

  const handleVoiceResult = (transcript: string) => {
    setIsListening(false);
    handleSend(transcript);
  };

  const handleBlockClick = (block: Block) => {
    if (block.parentId) {
      setCurrentTopic(block.parentId);
    }
    const message = ['Tell me about', block.title].join(' ');
    handleSend(message);
  };

  const getPlaceholder = () => {
    if (!user?.name) return ['What would you like to learn about?', '✨'].join(' ');
    return ['What would you like to learn about,', user.name + '?', '✨'].join(' ');
  };

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
        isLoading={isLoading}
        isListening={isListening}
        onVoiceResult={handleVoiceResult}
        toggleListening={() => setIsListening(!isListening)}
        placeholder={getPlaceholder()}
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

function shouldGenerateImage(content: string): boolean {
  const imageKeywords = [
    'show me', 'draw', 'create', 'generate', 'picture',
    'image', 'illustration', 'visualize', 'paint'
  ];
  const lowercaseContent = content.toLowerCase();
  return imageKeywords.some(keyword => lowercaseContent.includes(keyword));
}