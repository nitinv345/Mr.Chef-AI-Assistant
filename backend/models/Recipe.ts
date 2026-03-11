import mongoose, { Schema, Document } from "mongoose";

export interface IRecipe extends Document {
  id: string;
  title: string;
  image: string;
  videoUrl?: string;
  time: string;
  difficulty: "Easy" | "Medium" | "Hard";
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
  createdAt: Date;
}

const RecipeSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  videoUrl: { type: String },
  time: { type: String, required: true },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
  rating: { type: Number, default: 0 },
  calories: { type: Number, default: 0 },
  description: { type: String },
  ingredients: { type: [String], required: true },
  instructions: { type: [String], required: true },
  servings: { type: Number, required: true },
  isLiked: { type: Boolean, default: false },
  hasReminder: { type: Boolean, default: false },
  tags: { type: [String] },
  likesCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IRecipe>("Recipe", RecipeSchema);
