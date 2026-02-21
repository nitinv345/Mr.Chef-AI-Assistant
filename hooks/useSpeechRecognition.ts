import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

export const useSpeechRecognition = (options: { continuous?: boolean; lang?: string } = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isWakeupWordDetected, setIsWakeupWordDetected] = useState(false);
  const isManualStop = useRef(false);
  const isStarted = useRef(false);
  const wakeupDetectedRef = useRef(false);
  
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  
  const recognition = useMemo(() => {
    if (!SpeechRecognition) return null;
    const rec = new SpeechRecognition();
    rec.continuous = options.continuous ?? false;
    rec.lang = options.lang || 'en-US';
    rec.interimResults = true;
    return rec;
  }, [SpeechRecognition, options.continuous, options.lang]);

  const startListening = useCallback(() => {
    if (!recognition || isStarted.current) return;
    try {
        isManualStop.current = false;
        recognition.start();
        isStarted.current = true;
        setIsListening(true);
    } catch (e) {
        // Ignore if already started
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (!recognition) return;
    try {
        isManualStop.current = true;
        recognition.stop();
        isStarted.current = false;
        setIsListening(false);
        wakeupDetectedRef.current = false;
        setIsWakeupWordDetected(false);
    } catch (e) {
        // Ignore
    }
  }, [recognition]);

  useEffect(() => {
    if (!recognition) return;

    const handleResult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const currentText = (finalTranscript || interimTranscript).toLowerCase();
      console.log("Speech detected:", currentText);
      
      // Check for wakeup word 'hey' (English) or 'हे'/'अरे' (Marathi)
      const isWakeup = currentText.includes('hey') || currentText.includes('हे') || currentText.includes('अरे') || currentText.includes('ऐका');
      
      if (isWakeup) {
        console.log("Wakeup word detected!");
        wakeupDetectedRef.current = true;
        setIsWakeupWordDetected(true);
        
        // Extract command after wakeup
        let command = '';
        if (currentText.includes('hey')) command = currentText.split('hey')[1]?.trim();
        else if (currentText.includes('हे')) command = currentText.split('हे')[1]?.trim();
        else if (currentText.includes('अरे')) command = currentText.split('अरे')[1]?.trim();
        else if (currentText.includes('ऐका')) command = currentText.split('ऐका')[1]?.trim();

        if (command) {
          console.log("Command extracted:", command);
          setTranscript(command);
        }
      } else if (wakeupDetectedRef.current && finalTranscript) {
        console.log("Post-wakeup command detected:", finalTranscript);
        setTranscript(finalTranscript.trim().toLowerCase());
      } else if (!options.continuous) {
        setTranscript(finalTranscript);
      }
    };

    const handleError = (event: any) => {
      if (event.error === 'not-allowed') {
        console.error("Microphone access denied");
        setIsListening(false);
        isStarted.current = false;
      }
      // 'aborted' and 'no-speech' are common and usually don't need logging
      if (event.error !== 'no-speech' && event.error !== 'aborted' && event.error !== 'audio-capture') {
        console.warn("Speech recognition error:", event.error);
      }
      
      if (event.error === 'aborted') {
        isStarted.current = false;
      }
    };
    
    const handleEnd = () => {
        isStarted.current = false;
        if (options.continuous && !isManualStop.current) {
            // Small delay to prevent rapid restart loops
            setTimeout(() => {
                if (!isManualStop.current && !isStarted.current) {
                    try {
                        recognition.start();
                        isStarted.current = true;
                        setIsListening(true);
                    } catch (e) {
                        // Ignore
                    }
                }
            }, 300);
        } else {
            setIsListening(false);
        }
    };

    recognition.addEventListener('result', handleResult);
    recognition.addEventListener('error', handleError);
    recognition.addEventListener('end', handleEnd);

    return () => {
        recognition.removeEventListener('result', handleResult);
        recognition.removeEventListener('error', handleError);
        recognition.removeEventListener('end', handleEnd);
    };

  }, [recognition, options.continuous]);

  const setWakeup = useCallback((val: boolean) => {
    wakeupDetectedRef.current = val;
    setIsWakeupWordDetected(val);
  }, []);

  return { isListening, transcript, startListening, stopListening, setTranscript, isWakeupWordDetected, setIsWakeupWordDetected: setWakeup };
};
