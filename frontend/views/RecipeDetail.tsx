import React, { useRef, useEffect, useState } from 'react';
import { ArrowLeft, Clock, Users, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Recipe } from '../types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [lang, setLang] = useState('en-US');
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const { isListening, transcript, stopListening, startListening, setTranscript, isWakeupWordDetected, setIsWakeupWordDetected } = useSpeechRecognition({ continuous: true, lang });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [feedback, setFeedback] = useState('');

  // Voice Command Processor
  useEffect(() => {
    if (!transcript || !videoRef.current) return;

    const cmd = transcript.toLowerCase();
    let actionTaken = false;

    // English Commands
    if (cmd.includes('play from')) {
        const timeMatch = cmd.match(/(\d{1,2})[:\s](\d{2})/);
        if (timeMatch) {
            const mins = parseInt(timeMatch[1]);
            const secs = parseInt(timeMatch[2]);
            const time = mins * 60 + secs;
            videoRef.current.currentTime = time;
            videoRef.current.play();
            setIsPlaying(true);
            setFeedback(`Playing from ${mins}:${secs}`);
            actionTaken = true;
        }
    } else if (cmd.includes('play at 2x') || cmd.includes('play 2x') || cmd.includes('वेग वाढवा')) {
        videoRef.current.playbackRate = 2.0;
        videoRef.current.play();
        setIsPlaying(true);
        setFeedback(lang === 'mr-IN' ? 'वेग २ पट' : 'Playing at 2x');
        actionTaken = true;
    } else if (cmd.includes('play at 1.5x') || cmd.includes('play 1.5x')) {
        videoRef.current.playbackRate = 1.5;
        videoRef.current.play();
        setIsPlaying(true);
        setFeedback('Playing at 1.5x');
        actionTaken = true;
    } else if (cmd.includes('play at normal') || cmd.includes('normal speed') || cmd.includes('सामान्य वेग') || cmd.includes('नॉर्मल')) {
        videoRef.current.playbackRate = 1.0;
        videoRef.current.play();
        setIsPlaying(true);
        setFeedback(lang === 'mr-IN' ? 'सामान्य वेग' : 'Normal speed');
        actionTaken = true;
    } else if (cmd.includes('play') || cmd.includes('सुरू करा') || cmd.includes('प्ले') || cmd.includes('चालू करा')) {
        videoRef.current.play();
        setIsPlaying(true);
        setFeedback(lang === 'mr-IN' ? 'सुरू झाले' : 'Playing');
        actionTaken = true;
    } else if (cmd.includes('stop') || cmd.includes('pause') || cmd.includes('थांबवा') || cmd.includes('पॉज') || cmd.includes('बंद करा')) {
        videoRef.current.pause();
        setIsPlaying(false);
        setFeedback(lang === 'mr-IN' ? 'थांबवले' : 'Paused');
        actionTaken = true;
    } else if ((cmd.includes('mute') && !cmd.includes('unmute')) || cmd.includes('आवाज बंद') || cmd.includes('म्यूट')) {
        videoRef.current.muted = true;
        setIsMuted(true);
        setFeedback(lang === 'mr-IN' ? 'आवाज बंद' : 'Muted');
        actionTaken = true;
    } else if (cmd.includes('unmute') || cmd.includes('आवाज सुरू') || cmd.includes('अनम्यूट')) {
        videoRef.current.muted = false;
        setIsMuted(false);
        setFeedback(lang === 'mr-IN' ? 'आवाज सुरू' : 'Unmuted');
        actionTaken = true;
    } else if (cmd.includes('forward') || cmd.includes('पुढे') || cmd.includes('पुढचा')) {
        videoRef.current.currentTime += 10;
        setFeedback(lang === 'mr-IN' ? '१० सेकंद पुढे' : 'Forward 10s');
        actionTaken = true;
    } else if (cmd.includes('backward') || cmd.includes('rewind') || cmd.includes('मागे') || cmd.includes('मागचा')) {
        videoRef.current.currentTime -= 10;
        setFeedback(lang === 'mr-IN' ? '१० सेकंद मागे' : 'Backward 10s');
        actionTaken = true;
    } else if (cmd.includes('stop listening') || cmd.includes('आवाज नियंत्रण बंद करा') || cmd.includes('आवाज बंद करा')) {
        stopListening();
        setFeedback(lang === 'mr-IN' ? 'आवाज नियंत्रण बंद' : 'Voice control stopped');
        actionTaken = true;
    }

    if (actionTaken) {
        setTranscript(''); // Clear
        setIsWakeupWordDetected(false);
        setTimeout(() => setFeedback(''), 2000);
    }

  }, [transcript, setTranscript, setIsWakeupWordDetected, lang]);

  // Auto-start listening for wakeup word
  useEffect(() => {
    // We still try to auto-start, but browsers might block it
    startListening();
    return () => {
        stopListening();
    };
  }, [startListening, stopListening]);

  const [micError, setMicError] = useState(false);
  
  // Handle permission errors
  useEffect(() => {
    const checkPermission = async () => {
        try {
            const result = await navigator.permissions.query({ name: 'microphone' as any });
            if (result.state === 'denied') {
                setMicError(true);
            }
        } catch (e) {
            // Ignore
        }
    };
    checkPermission();
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    }
  };

  return (
    <div className="pt-20 pb-10 px-4 max-w-4xl mx-auto min-h-screen bg-white">
      <button onClick={onBack} className="flex items-center text-gray-500 hover:text-orange-600 mb-6 transition-colors">
        <ArrowLeft className="mr-2" size={20} /> Back to Home
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">{recipe.title}</h1>
      <p className="text-gray-600 mb-6 leading-relaxed">{recipe.description}</p>

      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
          <Clock size={18} className="text-orange-500" />
          <span className="text-sm font-medium text-gray-700">{recipe.time}</span>
        </div>
        <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
          <Users size={18} className="text-orange-500" />
          <span className="text-sm font-medium text-gray-700">{recipe.servings} Servings</span>
        </div>
        <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
          <span className="text-sm font-bold text-orange-500">{recipe.difficulty}</span>
          <span className="text-sm font-medium text-gray-700">Level</span>
        </div>
        <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
          <span className="text-sm font-bold text-orange-500">{recipe.calories}</span>
          <span className="text-sm font-medium text-gray-700">kcal</span>
        </div>
      </div>
      
      {/* Video Player */}
      <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-lg mb-8 group">
        {recipe.videoUrl ? (
          <>
            <video 
                ref={videoRef}
                src={recipe.videoUrl}
                className="w-full h-full object-cover"
                onClick={togglePlay}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />
            
            {/* Controls Overlay */}
            <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                <button onClick={togglePlay} className="p-4 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all transform hover:scale-110">
                    {isPlaying ? <Pause size={32} /> : <Play size={32} fill="currentColor" />}
                </button>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white bg-gray-900 p-6 text-center">
            <Play size={48} className="text-gray-700 mb-4" />
            <p className="text-lg font-bold">No Video Available</p>
            <p className="text-sm text-gray-500 mt-2">This recipe was generated by AI and doesn't have a video tutorial yet.</p>
          </div>
        )}

        {/* Voice Control Indicator */}
        <div className="absolute top-4 right-4 flex flex-col items-end space-y-2">
             <div className="flex items-center space-x-2 mb-2">
                <button 
                    onClick={() => setLang('en-US')}
                    className={`px-2 py-1 text-[10px] font-bold rounded border transition-all ${lang === 'en-US' ? 'bg-orange-500 text-white border-orange-500' : 'bg-black/30 text-white border-white/20'}`}
                >
                    EN
                </button>
                <button 
                    onClick={() => setLang('mr-IN')}
                    className={`px-2 py-1 text-[10px] font-bold rounded border transition-all ${lang === 'mr-IN' ? 'bg-orange-500 text-white border-orange-500' : 'bg-black/30 text-white border-white/20'}`}
                >
                    मराठी
                </button>
             </div>
             <button 
                onClick={startListening}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full backdrop-blur-md border transition-all ${
                    isListening 
                    ? 'bg-orange-500/90 text-white border-orange-400 shadow-lg scale-105' 
                    : 'bg-black/50 text-white border-white/20 hover:bg-black/70'
                }`}
            >
                <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-white animate-pulse' : 'bg-gray-400'}`} />
                <span className="text-xs font-bold uppercase tracking-wider">
                    {isListening ? (isWakeupWordDetected ? (lang === 'mr-IN' ? 'ऐकत आहे...' : 'Listening...') : (lang === 'mr-IN' ? 'बोला "हे"' : 'Say "Hey"')) : (lang === 'mr-IN' ? 'आवाज सुरू करा' : 'Enable Voice')}
                </span>
            </button>
            
            {micError && (
                <div className="px-3 py-2 bg-red-500 text-white text-[10px] font-bold rounded-lg shadow-lg max-w-[150px] text-center">
                    Mic Access Denied. Please enable it in your browser settings.
                </div>
            )}

            {!SpeechRecognition && (
                <div className="px-3 py-2 bg-gray-500 text-white text-[10px] font-bold rounded-lg shadow-lg max-w-[150px] text-center">
                    Speech Recognition not supported in this browser.
                </div>
            )}

            {feedback && (
                <div className="px-4 py-2 bg-white text-orange-600 text-sm font-black rounded-xl shadow-2xl animate-bounce border-2 border-orange-500">
                    {feedback}
                </div>
            )}
            
            {isWakeupWordDetected && !feedback && (
                <div className="px-3 py-1 bg-green-500 text-white text-[10px] font-bold rounded-lg animate-pulse">
                    Wakeup Word Detected!
                </div>
            )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
            <div className="bg-orange-50 rounded-xl p-6 border border-orange-100 sticky top-24">
                <div className="flex items-center space-x-2 text-orange-600 mb-4">
                    <Users size={18} />
                    <span className="font-semibold">{recipe.servings} Servings</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800 border-b border-orange-200 pb-2">Ingredients</h3>
                <ul className="space-y-3">
                    {recipe.ingredients.map((ing, idx) => (
                        <li key={idx} className="flex items-start text-gray-700 text-sm">
                            <span className="w-2 h-2 mt-1.5 mr-3 bg-orange-400 rounded-full flex-shrink-0" />
                            {ing}
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Instructions</h3>
            <div className="space-y-6">
                {recipe.instructions.map((step, idx) => (
                    <div key={idx} className="flex">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm mr-4 mt-1">
                            {idx + 1}
                        </div>
                        <p className="text-gray-700 leading-relaxed pt-1">{step}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
