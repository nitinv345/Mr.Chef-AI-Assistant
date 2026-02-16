import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './views/Home';
import RecipeDetail from './views/RecipeDetail';
import RecipeMaker from './views/RecipeMaker';
import Favorites from './views/Favorites';
import Settings from './views/Settings';
import { ViewState, Recipe, UserSettings } from './types';
import { INITIAL_RECIPES, INITIAL_SETTINGS } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [recipes, setRecipes] = useState<Recipe[]>(INITIAL_RECIPES);
  const [userSettings, setUserSettings] = useState<UserSettings>(INITIAL_SETTINGS);
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);

  // Load persistence
  useEffect(() => {
    const savedRecipes = localStorage.getItem('the_chief_recipes');
    const savedSettings = localStorage.getItem('the_chief_settings');
    
    if (savedRecipes) setRecipes(JSON.parse(savedRecipes));
    if (savedSettings) setUserSettings(JSON.parse(savedSettings));
  }, []);

  // Save persistence
  useEffect(() => {
    localStorage.setItem('the_chief_recipes', JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem('the_chief_settings', JSON.stringify(userSettings));
  }, [userSettings]);

  const handleRecipeClick = (recipe: Recipe) => {
    setActiveRecipe(recipe);
    setCurrentView('RECIPE_DETAIL');
  };

  const handleToggleLike = (id: string) => {
    setRecipes(prev => prev.map(r => {
        if (r.id === id) {
            return { ...r, isLiked: !r.isLiked };
        }
        return r;
    }));
  };

  const handleToggleReminder = (id: string) => {
    setRecipes(prev => prev.map(r => {
        if (r.id === id) {
            return { ...r, hasReminder: !r.hasReminder };
        }
        return r;
    }));
  };

  const renderView = () => {
    switch (currentView) {
      case 'HOME':
        return (
          <Home 
            recipes={recipes} 
            onRecipeClick={handleRecipeClick}
            onToggleLike={handleToggleLike}
            onToggleReminder={handleToggleReminder}
          />
        );
      case 'RECIPE_DETAIL':
        if (!activeRecipe) return <div onClick={() => setCurrentView('HOME')}>Error: No recipe selected. Click to go home.</div>;
        return <RecipeDetail recipe={activeRecipe} onBack={() => setCurrentView('HOME')} />;
      case 'FAVOURITE':
        return <Favorites recipes={recipes} onRecipeClick={handleRecipeClick} />;
      case 'MAKER':
        return <RecipeMaker userSettings={userSettings} />;
      case 'SETTINGS':
        return <Settings settings={userSettings} onSave={setUserSettings} />;
      default:
        return <Home recipes={recipes} onRecipeClick={handleRecipeClick} onToggleLike={handleToggleLike} onToggleReminder={handleToggleReminder} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {renderView()}
      
      {/* Hide Navbar on Recipe Detail to focus on video/steps, or keep it? Request implies dedicated page. */}
      {currentView !== 'RECIPE_DETAIL' && (
        <Navbar currentView={currentView} setView={setCurrentView} />
      )}
    </div>
  );
};

export default App;
