import mongoose from 'mongoose';
import RecipeModel from './server/models/Recipe';
import dotenv from 'dotenv';

dotenv.config();

async function updateRecipeImage() {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/mr_chef";
    const clientOptions = { serverApi: { version: '1' as const, strict: true, deprecationErrors: true } };

    try {
        await mongoose.connect(mongoUri, clientOptions);
        console.log("Connected to MongoDB");

        const recipeId = '2';
        const newImageUrl = 'https://res.cloudinary.com/dvkfhijxs/image/upload/v1772007443/images_hbiu5q.jpg';

        const result = await RecipeModel.findOneAndUpdate(
            { id: recipeId },
            { image: newImageUrl },
            { new: true }
        );

        if (result) {
            console.log('Recipe updated successfully:');
            console.log(`ID: ${result.id}`);
            console.log(`Title: ${result.title}`);
            console.log(`New Image: ${result.image}`);
        } else {
            console.log(`Recipe with ID ${recipeId} not found in database.`);
        }

    } catch (err) {
        console.error("Update failed:", err);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
}

updateRecipeImage();
