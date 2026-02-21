import express from "express";
import mongoose from "mongoose";
import Recipe from "../models/Recipe";

const router = express.Router();

// GET all recipes
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new recipe
router.post("/", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: "Database not connected. Please check your MONGO_URI." });
  }
  const recipe = new Recipe(req.body);
  try {
    const newRecipe = await recipe.save();
    res.status(201).json(newRecipe);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH a recipe (toggle like/reminder)
router.patch("/:id", async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updatedRecipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(updatedRecipe);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a recipe
router.delete("/:id", async (req, res) => {
  try {
    const deletedRecipe = await Recipe.findOneAndDelete({ id: req.params.id });
    if (!deletedRecipe) return res.status(404).json({ message: "Recipe not found" });
    res.json({ message: "Recipe deleted" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
