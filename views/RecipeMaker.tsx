import React, { useState } from 'react';
import { ChefHat, Plus, Mic, Sparkles, AlertCircle, Languages, Globe, Search } from 'lucide-react';
import { UserSettings, Recipe } from '../types';
import { VEG_INGREDIENTS, SPICES, MEATS } from '../constants';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { generateRecipeFromIngredients, translateRecipe } from '../services/geminiService';


interface RecipeMakerProps {
  userSettings: UserSettings;
}

const RecipeMaker: React.FC<RecipeMakerProps> = ({ userSettings }) => {
  const [dietType, setDietType] = useState<'Veg' | 'Non-Veg'>('Veg');
  const [recipeName, setRecipeName] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [customIngredient, setCustomIngredient] = useState('');
  const [ingredientSearch, setIngredientSearch] = useState('');
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [displayRecipe, setDisplayRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState('');
  const [currentLang, setCurrentLang] = useState('English');

  const languages = ['English', 'Hindi', 'Marathi'];

  const { isListening, transcript, startListening, setTranscript } = useSpeechRecognition();

  const handleTranslate = async (lang: string) => {
    if (!generatedRecipe || lang === currentLang) return;
    
    if (lang === 'English') {
        setDisplayRecipe(generatedRecipe);
        setCurrentLang('English');
        return;
    }

    setTranslating(true);
    const translated = await translateRecipe(generatedRecipe, lang);
    if (translated) {
        setDisplayRecipe({
            ...generatedRecipe,
            ...translated
        } as Recipe);
        setCurrentLang(lang);
    } else {
        setError(`Failed to translate to ${lang}`);
    }
    setTranslating(false);
  };

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
    if (selectedIngredients.length === 0 && !recipeName) {
        setError("Please provide a recipe name or select ingredients.");
        return;
    }
    setError('');
    setLoading(true);
    setGeneratedRecipe(null);
    setDisplayRecipe(null);
    setCurrentLang('English');
    
    const recipeData = await generateRecipeFromIngredients(selectedIngredients, dietType, userSettings, recipeName);
    
    if (recipeData) {
        const normalizeDifficulty = (diff: string): "Easy" | "Medium" | "Hard" => {
            const d = diff.toLowerCase();
            if (d.includes('easy')) return 'Easy';
            if (d.includes('hard')) return 'Hard';
            return 'Medium';
        };

        const newRecipe: Recipe = {
            id: Math.random().toString(36).substr(2, 9),
            title: recipeData.title || recipeName || 'Untitled Recipe',
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
                setDisplayRecipe(newRecipe);
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

  const filterList = (list: string[]) => {
    if (!ingredientSearch) return list;
    return list.filter(item => item.toLowerCase().includes(ingredientSearch.toLowerCase()));
  };

  return (
    <div className="pt-20 pb-24 px-4 max-w-4xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Chef Recipe Maker</h1>
            <p className="text-gray-500">Create your perfect Indian meal with Mr. Chief.</p>
        </div>
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-orange-500 shadow-lg bg-white transition-transform hover:scale-110 hover:rotate-3">
            <img src={userSettings.profilePicture} alt="Profile" className="w-full h-full object-cover animate-bounce-subtle" />
        </div>
      </div>

      {/* Option 1: Diet Type */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
            <span className="w-7 h-7 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm mr-3">1</span>
            Choose Preference
        </h2>
        <div className="flex space-x-4">
            {['Veg', 'Non-Veg'].map((type) => (
                <button
                    key={type}
                    onClick={() => {
                        setDietType(type as any);
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

      {/* Option 2: Recipe Name */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
            <span className="w-7 h-7 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm mr-3">2</span>
            Recipe Name (Optional)
        </h2>
        <input 
            type="text" 
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            placeholder="e.g., Butter Chicken, Paneer Tikka..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
        />
      </div>

      {/* Option 3: Ingredients */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center">
                <span className="w-7 h-7 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm mr-3">3</span>
                Select Ingredients
            </h2>
            <button onClick={startListening} className={`p-2 rounded-full ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-600'}`}>
                <Mic size={20} />
            </button>
        </div>

        <div className="mb-6">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text"
                    value={ingredientSearch}
                    onChange={(e) => setIngredientSearch(e.target.value)}
                    placeholder="Search for vegetables or spices..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
            </div>
        </div>

        <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {/* Veggies */}
            <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Vegetables</h3>
                <div className="flex flex-wrap gap-2">
                    {filterList(VEG_INGREDIENTS).map(ing => (
                        <button 
                            key={ing}
                            onClick={() => toggleIngredient(ing)}
                            className={`px-3 py-1.5 rounded-full text-xs transition-all border ${
                                selectedIngredients.includes(ing) ? 'bg-green-500 text-white border-green-500 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
                            }`}
                        >
                            {ing}
                        </button>
                    ))}
                    {filterList(VEG_INGREDIENTS).length === 0 && <p className="text-xs text-gray-400 italic">No vegetables match your search.</p>}
                </div>
            </div>

            {/* Meat (Conditional) */}
            {dietType === 'Non-Veg' && (
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Proteins</h3>
                    <div className="flex flex-wrap gap-2">
                        {filterList(MEATS).map(ing => (
                            <button 
                                key={ing}
                                onClick={() => toggleIngredient(ing)}
                                className={`px-3 py-1.5 rounded-full text-xs transition-all border ${
                                    selectedIngredients.includes(ing) ? 'bg-red-500 text-white border-red-500 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-red-400'
                                }`}
                            >
                                {ing}
                            </button>
                        ))}
                        {filterList(MEATS).length === 0 && <p className="text-xs text-gray-400 italic">No proteins match your search.</p>}
                    </div>
                </div>
            )}

            {/* Spices */}
            <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Spices</h3>
                <div className="flex flex-wrap gap-2">
                    {filterList(SPICES).map(ing => (
                        <button 
                            key={ing}
                            onClick={() => toggleIngredient(ing)}
                            className={`px-3 py-1.5 rounded-full text-xs transition-all border ${
                                selectedIngredients.includes(ing) ? 'bg-orange-500 text-white border-orange-500 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-400'
                            }`}
                        >
                            {ing}
                        </button>
                    ))}
                    {filterList(SPICES).length === 0 && <p className="text-xs text-gray-400 italic">No spices match your search.</p>}
                </div>
            </div>

            {/* Custom Input */}
            <div className="flex gap-2 pt-2 border-t border-gray-50">
                <input 
                    type="text" 
                    value={customIngredient}
                    onChange={(e) => setCustomIngredient(e.target.value)}
                    placeholder="Add other ingredient..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && addCustomIngredient()}
                />
                <button onClick={addCustomIngredient} className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                    <Plus size={18} />
                </button>
            </div>
            
            {/* Selected Summary */}
            {selectedIngredients.length > 0 && (
                <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-100">
                    <p className="text-xs font-bold text-orange-800 mb-2 uppercase tracking-wider">Selected Ingredients:</p>
                    <div className="flex flex-wrap gap-2">
                        {selectedIngredients.map(ing => (
                            <span key={ing} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-white border border-orange-200 text-orange-900 shadow-sm">
                                {ing}
                                <button onClick={() => toggleIngredient(ing)} className="ml-1.5 text-orange-300 hover:text-red-500">×</button>
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
      {displayRecipe && (
        <div className="mt-10 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-fade-in-up">
            <div className="bg-orange-50 p-6 border-b border-orange-100">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">{displayRecipe.title}</h2>
                    
                    {/* Language Selector */}
                    <div className="flex items-center space-x-2 bg-white/50 p-1 rounded-lg border border-orange-200">
                        <Globe size={16} className="text-orange-600 ml-2" />
                        <div className="flex space-x-1">
                            {languages.map(lang => (
                                <button
                                    key={lang}
                                    onClick={() => handleTranslate(lang)}
                                    disabled={translating}
                                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                                        currentLang === lang 
                                        ? 'bg-orange-500 text-white shadow-sm' 
                                        : 'text-gray-600 hover:bg-orange-100'
                                    } disabled:opacity-50`}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 mt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-orange-600 shadow-sm">
                        {displayRecipe.servings} People
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-gray-600 shadow-sm">
                       {translating ? 'Translating...' : `Language: ${currentLang}`}
                    </span>
                </div>
            </div>
            
            <div className={`p-6 transition-opacity duration-300 ${translating ? 'opacity-50' : 'opacity-100'}`}>
                 <p className="text-gray-600 italic mb-6">"{displayRecipe.description}"</p>

                 <h3 className="font-bold text-gray-800 mb-3 uppercase tracking-wide text-sm">Ingredients</h3>
                 <ul className="list-disc list-inside space-y-1 text-gray-700 mb-6 pl-2">
                    {displayRecipe.ingredients?.map((ing, i) => (
                        <li key={i}>{ing}</li>
                    ))}
                 </ul>

                 <h3 className="font-bold text-gray-800 mb-3 uppercase tracking-wide text-sm">Preparation</h3>
                 <div className="space-y-4">
                    {displayRecipe.instructions?.map((step, i) => (
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
