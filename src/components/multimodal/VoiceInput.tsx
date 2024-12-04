import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';
import { Player } from '@lottiefiles/react-lottie-player';

interface VoiceInputProps {
  onResult: (transcript: string) => void;
  isListening: boolean;
  toggleListening: () => void;
}

export function VoiceInput({ onResult, isListening, toggleListening }: VoiceInputProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<any>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');

        onResult(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMessage('Please allow microphone access');
          setHasPermission(false);
        } else {
          setErrorMessage('Please check your microphone and try again');
        }
        toggleListening();
      };

      recognition.onend = () => {
        if (isListening) {
          toggleListening();
        }
      };

      setRecognition(recognition);

      // Check for microphone permission
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          setHasPermission(true);
          setErrorMessage(null);
        })
        .catch(() => {
          setHasPermission(false);
          setErrorMessage('Please allow microphone access');
        });
    } else {
      setErrorMessage('Voice input is not supported in your browser');
    }

    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, []);

  useEffect(() => {
    if (recognition && hasPermission) {
      try {
        if (isListening) {
          recognition.start();
        } else {
          recognition.stop();
        }
      } catch (error) {
        console.error('Speech recognition error:', error);
      }
    }
  }, [isListening, recognition, hasPermission]);

  const handleClick = useCallback(() => {
    if (!hasPermission) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          setHasPermission(true);
          setErrorMessage(null);
          toggleListening();
        })
        .catch(() => {
          setHasPermission(false);
          setErrorMessage('Please allow microphone access');
        });
    } else {
      setErrorMessage(null);
      toggleListening();
    }
  }, [hasPermission, toggleListening]);

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleClick}
        disabled={!hasPermission && isListening}
        className={`p-2 rounded-full ${
          isListening 
            ? 'bg-gradient-to-r from-red-500 to-pink-500' 
            : 'bg-gradient-to-r from-blue-500 to-indigo-500'
        } text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200`}
      >
        {isListening ? (
          <MicOff className="w-5 h-5 animate-pulse" />
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </motion.button>

      <AnimatePresence>
        {isListening && (
          <motion.div
            key="voice-wave"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white rounded-lg shadow-lg p-2"
          >
            <Player
              autoplay
              loop
              src="/animations/voice-wave.json"
              style={{ width: '100px', height: '50px' }}
            />
          </motion.div>
        )}

        {errorMessage && (
          <motion.div
            key="error-message"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-sm text-red-500 bg-white rounded-lg shadow-lg p-2 whitespace-nowrap"
          >
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}