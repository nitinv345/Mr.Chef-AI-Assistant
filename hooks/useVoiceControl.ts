import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { parseVoiceCommand, VoiceCommandAction } from '../utils/voiceCommands';

interface VoiceControlOptions {
  onCommand: (action: VoiceCommandAction) => void;
  wakeWord?: string;
}

/**
 * useVoiceControl Hook
 * Handles continuous speech recognition, wake word detection, and command extraction.
 */
export const useVoiceControl = ({ onCommand, wakeWord = 'hey chef' }: VoiceControlOptions) => {
  const [isListening, setIsListening] = useState(false);
  const [isWakeWordDetected, setIsWakeWordDetected] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const isManualStop = useRef(false);
  const wakeWordDetectedRef = useRef(false);
  const wakeWordTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  const initRecognition = useCallback(() => {
    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser.');
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false; // As per requirements: interimResults = false
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript.toLowerCase().trim();
      
      console.log('Recognized:', transcript);

      // 1. Check for Wake Word
      if (transcript.includes(wakeWord)) {
        console.log('Wake word detected!');
        wakeWordDetectedRef.current = true;
        setIsWakeWordDetected(true);
        
        // Extract command if it was said in the same sentence (e.g. "Hey Chef play")
        const parts = transcript.split(wakeWord);
        const commandAfterWakeWord = parts[parts.length - 1]?.trim();
        
        if (commandAfterWakeWord) {
          handleCommand(commandAfterWakeWord);
        } else {
          // Set a timeout to reset wake word detection if no command follows
          if (wakeWordTimeoutRef.current) clearTimeout(wakeWordTimeoutRef.current);
          wakeWordTimeoutRef.current = setTimeout(() => {
            wakeWordDetectedRef.current = false;
            setIsWakeWordDetected(false);
          }, 5000); // 5 seconds window for command
        }
      } 
      // 2. If wake word was recently detected, process as command
      else if (wakeWordDetectedRef.current) {
        handleCommand(transcript);
      }
    };

    const handleCommand = (text: string) => {
      const action = parseVoiceCommand(text);
      if (action) {
        setLastCommand(text);
        onCommand(action);
        
        // Reset wake word state after successful command
        wakeWordDetectedRef.current = false;
        setIsWakeWordDetected(false);
        if (wakeWordTimeoutRef.current) clearTimeout(wakeWordTimeoutRef.current);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setError('Microphone permission denied.');
        setIsListening(false);
      }
      // Auto-restart logic is handled in onend
    };

    recognition.onend = () => {
      if (!isManualStop.current) {
        // Auto-restart if not manually stopped
        try {
          recognition.start();
        } catch (e) {
          console.error('Failed to restart recognition:', e);
        }
      } else {
        setIsListening(false);
      }
    };

    return recognition;
  }, [SpeechRecognition, wakeWord, onCommand]);

  const start = useCallback(() => {
    isManualStop.current = false;
    if (!recognitionRef.current) {
      recognitionRef.current = initRecognition();
    }
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        // Already started
      }
    }
  }, [initRecognition]);

  const stop = useCallback(() => {
    isManualStop.current = true;
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setIsWakeWordDetected(false);
    wakeWordDetectedRef.current = false;
  }, []);

  useEffect(() => {
    return () => {
      isManualStop.current = true;
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (wakeWordTimeoutRef.current) clearTimeout(wakeWordTimeoutRef.current);
    };
  }, []);

  return {
    isListening,
    isWakeWordDetected,
    lastCommand,
    error,
    start,
    stop,
    supported: !!SpeechRecognition
  };
};
