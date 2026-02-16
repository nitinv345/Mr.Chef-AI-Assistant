import { useState, useEffect, useCallback } from 'react';

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  // Basic browser compatibility check
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
  }

  const startListening = useCallback(() => {
    if (!recognition) return;
    try {
        recognition.start();
        setIsListening(true);
    } catch (e) {
        console.warn("Recognition already started or error:", e);
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (!recognition) return;
    recognition.stop();
    setIsListening(false);
  }, [recognition]);

  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const result = event.results[current][0].transcript;
      setTranscript(result);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };
    
    recognition.onend = () => {
        setIsListening(false);
    }

  }, [recognition]);

  return { isListening, transcript, startListening, stopListening, setTranscript };
};
