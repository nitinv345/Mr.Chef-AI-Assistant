import React, { useState, useEffect } from 'react';
import { Search, Mic, Heart, Bell, Clock } from 'lucide-react';
import { Recipe, UserSettings } from '../types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface HomeProps {
  recipes: Recipe[];
  userSettings: UserSettings;
  onRecipeClick: (recipe: Recipe) => void;
  onToggleLike: (id: string) => void;
  onToggleReminder: (id: string) => void;
}

const Home: React.FC<HomeProps> = ({ recipes, userSettings, onRecipeClick, onToggleLike, onToggleReminder }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { isListening, transcript, startListening, setTranscript } = useSpeechRecognition();
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(recipes);

  // Sync transcript to search query
  useEffect(() => {
    if (transcript) {
      let cleanTranscript = transcript.toLowerCase().replace('search for', '').replace('recipe', '').trim();
      setSearchQuery(cleanTranscript);
      setTranscript(''); // Clear buffer
    }
  }, [transcript, setTranscript]);

  // Filter logic
  useEffect(() => {
    if (!searchQuery) {
      setFilteredRecipes(recipes);
    } else {
      const lowerQ = searchQuery.toLowerCase();
      const filtered = recipes.filter(r => 
        r.title.toLowerCase().includes(lowerQ) || 
        r.tags?.some(t => t.toLowerCase().includes(lowerQ))
      );
      setFilteredRecipes(filtered);
    }
  }, [searchQuery, recipes]);

  return (
    <div className="pt-20 pb-24 px-4 max-w-7xl mx-auto min-h-screen">
      
      {/* Header with DP */}
      <div className="flex justify-between items-center mb-8">
        <div>
            <h2 className="text-3xl font-bold text-gray-900">Hello, {userSettings.name.split(' ')[0]}!</h2>
            <p className="text-gray-500">What are we cooking today?</p>
        </div>
        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-orange-500 shadow-lg bg-white transition-transform hover:scale-110 hover:rotate-3">
            <img src={userSettings.profilePicture} alt="Profile" className="w-full h-full object-cover animate-bounce-subtle" />
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="mb-8 relative max-w-2xl mx-auto">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-full shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:shadow-md"
            placeholder="Search recipes (e.g., 'Paneer', 'Biryani')"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={startListening}
            className={`absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-orange-500'}`}
          >
            <Mic className="h-5 w-5" />
          </button>
        </div>
        {isListening && <p className="text-center text-xs text-orange-500 mt-2">Listening...</p>}
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRecipes.map((recipe) => (
          <div 
            key={recipe.id} 
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden transform hover:-translate-y-1"
          >
            <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => onRecipeClick(recipe)}>
              <img 
                src={recipe.image} 
                alt={recipe.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              
              {/* Badges */}
              {recipe.isLiked && (
                <div className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg">
                    <Heart size={14} fill="currentColor" />
                </div>
              )}
               {recipe.hasReminder && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-white p-1.5 rounded-full shadow-lg">
                    <Bell size={14} fill="currentColor" />
                </div>
              )}
            </div>

            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 
                    className="text-lg font-bold text-gray-800 hover:text-orange-600 transition-colors cursor-pointer"
                    onClick={() => onRecipeClick(recipe)}
                >
                    {recipe.title}
                </h3>
              </div>

              <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
                <div className="flex items-center">
                  <Clock size={14} className="mr-1" />
                  {recipe.time}
                </div>
                <div className="font-semibold text-orange-600">
                  {recipe.difficulty}
                </div>
                <div>
                  {recipe.calories} kcal
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); onToggleLike(recipe.id); }}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${recipe.isLiked ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                >
                  <Heart size={16} fill={recipe.isLiked ? "currentColor" : "none"} />
                  <span>{recipe.likesCount + (recipe.isLiked ? 1 : 0)}</span>
                </button>

                <button 
                   onClick={(e) => { e.stopPropagation(); onToggleReminder(recipe.id); }}
                   className={`p-2 rounded-full transition-colors ${recipe.hasReminder ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'}`}
                   title="Set Reminder"
                >
                  <Bell size={18} fill={recipe.hasReminder ? "currentColor" : "none"} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No recipes found based on your search.</p>
          <p className="text-sm text-gray-400 mt-2">Try searching for ingredients or generic terms like 'Veg'.</p>
        </div>
      )}
    </div>
  );
};

export default Home;
