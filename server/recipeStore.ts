import mongoose from 'mongoose';
import { Recipe } from '../types';
import RecipeModel from './models/Recipe';
import { INITIAL_RECIPES } from '../constants';

let inMemoryRecipes: Recipe[] = [...INITIAL_RECIPES];

const isDbConnected = () => mongoose.connection.readyState === 1;

export const getRecipes = async () => {
  try {
    if (isDbConnected()) {
      return await RecipeModel.find().sort({ createdAt: -1 });
    }
  } catch (err) {
    console.error("DB Error, falling back to in-memory:", err);
  }
  return inMemoryRecipes;
};

export const addRecipe = async (recipe: any) => {
  try {
    if (isDbConnected()) {
      // Use findOneAndUpdate with upsert: true to prevent E11000 duplicate key errors
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
