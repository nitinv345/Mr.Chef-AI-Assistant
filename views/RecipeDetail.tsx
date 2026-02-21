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
  const { isListening, transcript, startListening, setTranscript } = useSpeechRecognition();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [feedback, setFeedback] = useState('');

  // Voice Command Processor
  useEffect(() => {
    if (!transcript || !videoRef.current) return;

    const cmd = transcript.toLowerCase();
    let actionTaken = false;

    if (cmd.includes('play from')) {
        // Parse time like "02:30" or "2 minutes 30 seconds"
        // Simple parser for "play from MM:SS"
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
    } else if (cmd.includes('play')) {
        videoRef.current.play();
        setIsPlaying(true);
        setFeedback('Playing');
        actionTaken = true;
    } else if (cmd.includes('stop') || cmd.includes('pause')) {
        videoRef.current.pause();
        setIsPlaying(false);
        setFeedback('Paused');
        actionTaken = true;
    } else if (cmd.includes('mute') && !cmd.includes('unmute')) {
        videoRef.current.muted = true;
        setIsMuted(true);
        setFeedback('Muted');
        actionTaken = true;
    } else if (cmd.includes('unmute')) {
        videoRef.current.muted = false;
        setIsMuted(false);
        setFeedback('Unmuted');
        actionTaken = true;
    } else if (cmd.includes('forward')) {
        videoRef.current.currentTime += 10;
        setFeedback('Forward 10s');
        actionTaken = true;
    } else if (cmd.includes('backward') || cmd.includes('rewind')) {
        videoRef.current.currentTime -= 10;
        setFeedback('Backward 10s');
        actionTaken = true;
    }

    if (actionTaken) {
        setTranscript(''); // Clear
        setTimeout(() => setFeedback(''), 2000);
    }

  }, [transcript, setTranscript]);

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

        {/* Voice Control Indicator */}
        <div className="absolute top-4 right-4 flex flex-col items-end">
             <button 
                onClick={startListening}
                className={`p-2 rounded-full bg-black/50 text-white hover:bg-orange-500 transition-colors ${isListening ? 'animate-pulse bg-red-500' : ''}`}
                title="Voice Control"
            >
                {isListening ? "Listening..." : "Voice Control"}
            </button>
            {feedback && <div className="mt-2 px-3 py-1 bg-black/70 text-white text-xs rounded-lg backdrop-blur-md">{feedback}</div>}
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
