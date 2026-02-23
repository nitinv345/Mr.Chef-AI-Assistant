import express from "express";
import * as recipeStore from "../recipeStore";

const router = express.Router();

// GET all recipes
router.get("/", async (req, res) => {
  try {
    const recipes = await recipeStore.getRecipes();
    res.json(recipes);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new recipe
router.post("/", async (req, res) => {
  try {
    const newRecipe = await recipeStore.addRecipe(req.body);
    res.status(201).json(newRecipe);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH a recipe (toggle like/reminder)
router.patch("/:id", async (req, res) => {
  try {
    const updatedRecipe = await recipeStore.updateRecipe(req.params.id, req.body);
    if (!updatedRecipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(updatedRecipe);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a recipe
router.delete("/:id", async (req, res) => {
  try {
    const result = await recipeStore.deleteRecipe(req.params.id);
    if (!result) return res.status(404).json({ message: "Recipe not found" });
    res.json({ message: "Recipe deleted" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
