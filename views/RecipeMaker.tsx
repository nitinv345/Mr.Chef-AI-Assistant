import React, { useState } from 'react';
import { ChefHat, Plus, Mic, Sparkles, AlertCircle } from 'lucide-react';
import { UserSettings, Recipe } from '../types';
import { VEG_INGREDIENTS, SPICES, MEATS } from '../constants';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { generateRecipeFromIngredients } from '../services/geminiService';

interface RecipeMakerProps {
  userSettings: UserSettings;
}

const RecipeMaker: React.FC<RecipeMakerProps> = ({ userSettings }) => {
  const [dietType, setDietType] = useState<'Veg' | 'Non-Veg'>('Veg');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [customIngredient, setCustomIngredient] = useState('');
  const [generatedRecipe, setGeneratedRecipe] = useState<Partial<Recipe> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { isListening, transcript, startListening, setTranscript } = useSpeechRecognition();

  // Handle voice input for adding ingredients
  React.useEffect(() => {
    if (transcript) {
        const ing = transcript.replace('.', '');
        if (ing && !selectedIngredients.includes(ing)) {
            setSelectedIngredients(prev => [...prev, ing]);
        }
        setTranscript('');
    }
  }, [transcript, selectedIngredients, setTranscript]);

  const toggleIngredient = (ing: string) => {
    if (selectedIngredients.includes(ing)) {
        setSelectedIngredients(prev => prev.filter(i => i !== ing));
    } else {
        setSelectedIngredients(prev => [...prev, ing]);
    }
  };

  const addCustomIngredient = () => {
    if (customIngredient && !selectedIngredients.includes(customIngredient)) {
        setSelectedIngredients(prev => [...prev, customIngredient]);
        setCustomIngredient('');
    }
  };

  const handleGenerate = async () => {
    if (selectedIngredients.length === 0) {
        setError("Please select at least one ingredient.");
        return;
    }
    setError('');
    setLoading(true);
    setGeneratedRecipe(null);
    
    const recipeData = await generateRecipeFromIngredients(selectedIngredients, dietType, userSettings);
    
    if (recipeData) {
        const normalizeDifficulty = (diff: string): "Easy" | "Medium" | "Hard" => {
            const d = diff.toLowerCase();
            if (d.includes('easy')) return 'Easy';
            if (d.includes('hard')) return 'Hard';
            return 'Medium';
        };

        const newRecipe: Recipe = {
            id: Math.random().toString(36).substr(2, 9),
            title: recipeData.title || 'Untitled Recipe',
            image: `https://picsum.photos/seed/${Math.random()}/800/600`,
            time: recipeData.time || '30 mins',
            difficulty: normalizeDifficulty(recipeData.difficulty || 'Medium'),
            rating: 4.5,
            calories: recipeData.calories || 350,
            description: recipeData.description || '',
            ingredients: recipeData.ingredients || [],
            instructions: recipeData.instructions || [],
            servings: recipeData.servings || 2,
            isLiked: false,
            hasReminder: false,
            likesCount: 0
        };

        try {
            const response = await fetch('/api/recipes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRecipe)
            });
            if (response.ok) {
                setGeneratedRecipe(newRecipe);
            } else {
                const errorData = await response.json();
                setError(`Failed to save: ${errorData.message || "Unknown error"}`);
            }
        } catch (err) {
            console.error("Error saving recipe:", err);
            setError("Error connecting to backend.");
        }
    } else {
        setError("Could not generate recipe. Please check API key or try again.");
    }
    setLoading(false);
  };

  return (
    <div className="pt-20 pb-24 px-4 max-w-4xl mx-auto min-h-screen">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Chef Recipe Maker</h1>
        <p className="text-gray-500">Select ingredients and let Mr. Chief create a masterpiece.</p>
      </div>

      {/* Block 1: Diet Type */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-lg font-semibold mb-4">1. Choose Preference</h2>
        <div className="flex space-x-4">
            {['Veg', 'Non-Veg'].map((type) => (
                <button
                    key={type}
                    onClick={() => {
                        setDietType(type as any);
                        // Clear meat if switching to veg
                        if (type === 'Veg') {
                            setSelectedIngredients(prev => prev.filter(i => !MEATS.includes(i)));
                        }
                    }}
                    className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                        dietType === type 
                        ? (type === 'Veg' ? 'bg-green-100 text-green-700 border-green-200 border' : 'bg-red-100 text-red-700 border-red-200 border') 
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                >
                    {type === 'Veg' ? '🥬 Vegetarian' : '🍗 Non-Vegetarian'}
                </button>
            ))}
        </div>
      </div>

      {/* Block 2: Ingredients */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">2. Select Ingredients</h2>
            <button onClick={startListening} className={`p-2 rounded-full ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-600'}`}>
                <Mic size={20} />
            </button>
        </div>

        <div className="space-y-6">
            {/* Veggies */}
            <div>
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Vegetables</h3>
                <div className="flex flex-wrap gap-2">
                    {VEG_INGREDIENTS.map(ing => (
                        <button 
                            key={ing}
                            onClick={() => toggleIngredient(ing)}
                            className={`px-3 py-1.5 rounded-full text-sm transition-colors border ${
                                selectedIngredients.includes(ing) ? 'bg-green-500 text-white border-green-500 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
                            }`}
                        >
                            {ing}
                        </button>
                    ))}
                </div>
            </div>

            {/* Meat (Conditional) */}
            {dietType === 'Non-Veg' && (
                <div>
                    <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Proteins</h3>
                    <div className="flex flex-wrap gap-2">
                        {MEATS.map(ing => (
                            <button 
                                key={ing}
                                onClick={() => toggleIngredient(ing)}
                                className={`px-3 py-1.5 rounded-full text-sm transition-colors border ${
                                    selectedIngredients.includes(ing) ? 'bg-red-500 text-white border-red-500 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-red-400'
                                }`}
                            >
                                {ing}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Spices */}
            <div>
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Spices</h3>
                <div className="flex flex-wrap gap-2">
                    {SPICES.map(ing => (
                        <button 
                            key={ing}
                            onClick={() => toggleIngredient(ing)}
                            className={`px-3 py-1.5 rounded-full text-sm transition-colors border ${
                                selectedIngredients.includes(ing) ? 'bg-orange-500 text-white border-orange-500 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-400'
                            }`}
                        >
                            {ing}
                        </button>
                    ))}
                </div>
            </div>

            {/* Custom Input */}
            <div className="flex gap-2 pt-2">
                <input 
                    type="text" 
                    value={customIngredient}
                    onChange={(e) => setCustomIngredient(e.target.value)}
                    placeholder="Add specific ingredient..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    onKeyDown={(e) => e.key === 'Enter' && addCustomIngredient()}
                />
                <button onClick={addCustomIngredient} className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                    <Plus size={20} />
                </button>
            </div>
            
            {/* Selected Summary */}
            {selectedIngredients.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-2">Selected:</p>
                    <div className="flex flex-wrap gap-2">
                        {selectedIngredients.map(ing => (
                            <span key={ing} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-white border border-gray-200 text-gray-800">
                                {ing}
                                <button onClick={() => toggleIngredient(ing)} className="ml-1.5 text-gray-400 hover:text-red-500">×</button>
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>

      <button 
        onClick={handleGenerate}
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {loading ? (
            <span>Thinking...</span>
        ) : (
            <>
                <Sparkles size={20} />
                <span>Generate Recipe</span>
            </>
        )}
      </button>

      {error && (
        <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center">
            <AlertCircle size={20} className="mr-2" />
            {error}
        </div>
      )}

      {/* Generated Result */}
      {generatedRecipe && (
        <div className="mt-10 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-fade-in-up">
            <div className="bg-orange-50 p-6 border-b border-orange-100">
                <h2 className="text-2xl font-bold text-gray-900">{generatedRecipe.title}</h2>
                <div className="flex gap-4 mt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-orange-600 shadow-sm">
                        {generatedRecipe.servings} People
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-gray-600 shadow-sm">
                       AI Generated
                    </span>
                </div>
            </div>
            
            <div className="p-6">
                 <h3 className="font-bold text-gray-800 mb-3 uppercase tracking-wide text-sm">Ingredients</h3>
                 <ul className="list-disc list-inside space-y-1 text-gray-700 mb-6 pl-2">
                    {generatedRecipe.ingredients?.map((ing, i) => (
                        <li key={i}>{ing}</li>
                    ))}
                 </ul>

                 <h3 className="font-bold text-gray-800 mb-3 uppercase tracking-wide text-sm">Preparation</h3>
                 <div className="space-y-4">
                    {generatedRecipe.instructions?.map((step, i) => (
                        <div key={i} className="flex">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">{i + 1}</span>
                            <p className="text-gray-700">{step}</p>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default RecipeMaker;
