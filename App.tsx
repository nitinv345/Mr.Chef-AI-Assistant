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
    const fetchRecipes = async () => {
      try {
        const response = await fetch('/api/recipes');
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setRecipes(data);
          } else {
            // Seed initial recipes if DB is empty
            const seedPromises = INITIAL_RECIPES.map(recipe => 
              fetch('/api/recipes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(recipe)
              })
            );
            await Promise.all(seedPromises);
            
            // Re-fetch to confirm
            const retryResponse = await fetch('/api/recipes');
            if (retryResponse.ok) {
              const retryData = await retryResponse.json();
              setRecipes(retryData.length > 0 ? retryData : INITIAL_RECIPES);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch recipes:", err);
      }
    };

    const savedSettings = localStorage.getItem('the_chief_settings');
    
    fetchRecipes();
    if (savedSettings) setUserSettings(JSON.parse(savedSettings));
  }, []);

  // Save persistence (Settings still in localStorage for now, recipes in DB)
  useEffect(() => {
    localStorage.setItem('the_chief_settings', JSON.stringify(userSettings));
  }, [userSettings]);

  const handleRecipeClick = (recipe: Recipe) => {
    setActiveRecipe(recipe);
    setCurrentView('RECIPE_DETAIL');
  };

  const handleToggleLike = async (id: string) => {
    const recipe = recipes.find(r => r.id === id);
    if (!recipe) return;

    const updatedStatus = !recipe.isLiked;
    
    setRecipes(prev => prev.map(r => {
        if (r.id === id) {
            return { ...r, isLiked: updatedStatus };
        }
        return r;
    }));

    try {
      await fetch(`/api/recipes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isLiked: updatedStatus })
      });
    } catch (err) {
      console.error("Failed to update like status:", err);
    }
  };

  const handleToggleReminder = async (id: string) => {
    const recipe = recipes.find(r => r.id === id);
    if (!recipe) return;

    const updatedStatus = !recipe.hasReminder;

    setRecipes(prev => prev.map(r => {
        if (r.id === id) {
            return { ...r, hasReminder: updatedStatus };
        }
        return r;
    }));

    try {
      await fetch(`/api/recipes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hasReminder: updatedStatus })
      });
    } catch (err) {
      console.error("Failed to update reminder status:", err);
    }
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
