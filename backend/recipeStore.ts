import mongoose from 'mongoose';
import RecipeModel from './models/Recipe';

// Minimal Recipe type (duplicated here to avoid frontend dependency)
interface Recipe {
  id: string;
  title: string;
  image: string;
  videoUrl?: string;
  time: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rating: number;
  calories: number;
  description: string;
  ingredients: string[];
  instructions: string[];
  servings: number;
  isLiked: boolean;
  hasReminder: boolean;
  tags?: string[];
  likesCount: number;
}

let inMemoryRecipes: Recipe[] = [];

const isDbConnected = () => mongoose.connection.readyState === 1;

export const getRecipes = async () => {
  try {
    if (isDbConnected()) {
      const recipes = await RecipeModel.find().sort({ createdAt: -1 });
      return recipes;
    }
  } catch (err) {
    console.error("DB Error, falling back to in-memory:", err);
  }
  return inMemoryRecipes;
};

export const addRecipe = async (recipe: any) => {
  try {
    if (isDbConnected()) {
      return await RecipeModel.findOneAndUpdate(
        { id: recipe.id },
        recipe,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
  } catch (err) {
    console.error("DB Error, using in-memory:", err);
  }
  const index = inMemoryRecipes.findIndex(r => r.id === recipe.id);
  if (index !== -1) {
    inMemoryRecipes[index] = { ...recipe };
    return inMemoryRecipes[index];
  }
  const newRecipe = { ...recipe, _id: recipe.id || Date.now().toString() };
  inMemoryRecipes.unshift(newRecipe);
  return newRecipe;
};

export const updateRecipe = async (id: string, updates: any) => {
  try {
    if (isDbConnected()) {
      return await RecipeModel.findOneAndUpdate({ id }, updates, { new: true });
    }
  } catch (err) {
    console.error("DB Error, using in-memory:", err);
  }
  const index = inMemoryRecipes.findIndex(r => r.id === id);
  if (index !== -1) {
    inMemoryRecipes[index] = { ...inMemoryRecipes[index], ...updates };
    return inMemoryRecipes[index];
  }
  return null;
};

export const deleteRecipe = async (id: string) => {
  try {
    if (isDbConnected()) {
      return await RecipeModel.findOneAndDelete({ id });
    }
  } catch (err) {
    console.error("DB Error, using in-memory:", err);
  }
  const index = inMemoryRecipes.findIndex(r => r.id === id);
  if (index !== -1) {
    inMemoryRecipes.splice(index, 1);
    return true;
  }
  return null;
};
