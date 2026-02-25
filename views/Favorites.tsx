import React from 'react';
import { Recipe, UserSettings } from '../types';
import { Play, Heart, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FavoritesProps {
  recipes: Recipe[];
  userSettings: UserSettings;
  onRecipeClick: (recipe: Recipe) => void;
}

const Favorites: React.FC<FavoritesProps> = ({ recipes, userSettings, onRecipeClick }) => {
  const navigate = useNavigate();
  const favorites = recipes.filter(r => r.isLiked);

  if (favorites.length === 0) {
    return (
        <div className="pt-20 flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <Heart size={48} className="text-gray-200 mb-4" />
            <h2 className="text-xl font-bold text-gray-800">No Favorites Yet</h2>
            <p className="text-gray-500 mt-2">Like recipes on the home screen to save them here.</p>
        </div>
    );
  }

  return (
    <div className="pt-20 pb-24 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Favorites</h1>
        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-orange-500 shadow-lg bg-white transition-transform hover:scale-110 hover:rotate-3">
            <img src={userSettings.profilePicture} alt="Profile" className="w-full h-full object-cover animate-bounce-subtle" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((recipe) => (
          <div key={recipe.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex gap-4 transition-all hover:shadow-md">
            <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden group cursor-pointer" onClick={() => { onRecipeClick(recipe); navigate('/recipe-detail'); }}>
                <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play size={20} className="text-white" fill="currentColor" />
                </div>
                {/* Reminder Badge */}
                {recipe.hasReminder && (
                    <div className="absolute top-1 left-1 bg-yellow-500 w-3 h-3 rounded-full border border-white"></div>
                )}
            </div>
            
            <div className="flex-1 flex flex-col justify-center">
                <h3 className="font-bold text-gray-800 mb-1 line-clamp-2">{recipe.title}</h3>
                <div className="text-[10px] text-gray-400 mb-2 flex gap-2">
                    <span>{recipe.time}</span>
                    <span className="text-orange-500 font-semibold">{recipe.difficulty}</span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center text-xs text-red-500 bg-red-50 px-2 py-1 rounded-full">
                        <Heart size={10} fill="currentColor" className="mr-1" />
                        {recipe.likesCount + 1}
                    </span>
                    {recipe.hasReminder && (
                        <span className="flex items-center text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                            <Bell size={10} fill="currentColor" className="mr-1" />
                            Reminder
                        </span>
                    )}
                </div>
                <button 
                    onClick={() => { onRecipeClick(recipe); navigate('/recipe-detail'); }}
                    className="text-xs text-orange-600 font-medium mt-3 hover:underline text-left"
                >
                    Watch & Cook &rarr;
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
