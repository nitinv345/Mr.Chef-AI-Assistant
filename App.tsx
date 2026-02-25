import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './views/Home';
import RecipeDetail from './views/RecipeDetail';
import RecipeMaker from './views/RecipeMaker';
import Favorites from './views/Favorites';
import Settings from './views/Settings';
import Login from './views/Login';
import PrivateRoute from './components/PrivateRoute';
import { ViewState, Recipe, UserSettings } from './types';
import { INITIAL_RECIPES, INITIAL_SETTINGS } from './constants';

const App: React.FC = () => {
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

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <PrivateRoute>
              <>
                <Home 
                  recipes={recipes} 
                  userSettings={userSettings}
                  onRecipeClick={handleRecipeClick}
                  onToggleLike={handleToggleLike}
                  onToggleReminder={handleToggleReminder}
                />
                <Navbar currentView="HOME" />
              </>
            </PrivateRoute>
          } />

          <Route path="/favourite" element={
            <PrivateRoute>
              <>
                <Favorites 
                  recipes={recipes} 
                  userSettings={userSettings} 
                  onRecipeClick={handleRecipeClick} 
                />
                <Navbar currentView="FAVOURITE" />
              </>
            </PrivateRoute>
          } />

          <Route path="/maker" element={
            <PrivateRoute>
              <>
                <RecipeMaker userSettings={userSettings} />
                <Navbar currentView="MAKER" />
              </>
            </PrivateRoute>
          } />

          <Route path="/settings" element={
            <PrivateRoute>
              <>
                <Settings settings={userSettings} onSave={setUserSettings} />
                <Navbar currentView="SETTINGS" />
              </>
            </PrivateRoute>
          } />

          <Route path="/recipe-detail" element={
            <PrivateRoute>
              {activeRecipe ? (
                <RecipeDetail recipe={activeRecipe} onBack={() => {}} />
              ) : (
                <Navigate to="/" replace />
              )}
            </PrivateRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
