import mongoose from 'mongoose';
import RecipeModel from './server/models/Recipe';
import dotenv from 'dotenv';

dotenv.config();

async function verifyRecipeImage() {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/mr_chef";
    const clientOptions = { serverApi: { version: '1' as const, strict: true, deprecationErrors: true } };

    try {
        await mongoose.connect(mongoUri, clientOptions);
        const recipeId = '2';
        const recipe = await RecipeModel.findOne({ id: recipeId });

        if (recipe) {
            console.log(`VERIFICATION_SUCCESS: ID ${recipe.id} image is ${recipe.image}`);
        } else {
            console.log(`VERIFICATION_FAILURE: Recipe with ID ${recipeId} not found.`);
        }
    } catch (err) {
        console.error("Verification failed:", err);
    } finally {
        await mongoose.disconnect();
    }
}

verifyRecipeImage();
