import { GoogleGenAI, Type } from "@google/genai";
import { Recipe, UserSettings } from "../types";

const apiKey = process.env.API_KEY;
// Initialize securely - assumes API_KEY is available in environment
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateRecipeFromIngredients = async (
  ingredients: string[],
  dietType: string,
  userSettings: UserSettings
): Promise<Partial<Recipe> | null> => {
  if (!ai) {
    console.error("API Key missing");
    return null;
  }

  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Create a detailed cooking recipe based on these ingredients: ${ingredients.join(', ')}.
    Dietary Preference: ${dietType}.
    User Settings:
    - Cuisine: ${userSettings.cuisinePreferences.join(', ')}
    - Skill Level: ${userSettings.skillLevel}
    - Allergies: ${userSettings.allergies.join(', ')}
    
    The recipe should be safe for the allergies listed.
    Provide a creative title, a list of additional basic ingredients if needed, step-by-step instructions, and serving size.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
            servings: { type: Type.NUMBER },
          },
          required: ["title", "ingredients", "instructions", "servings"]
        }
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
    return null;
  } catch (error) {
    console.error("Error generating recipe:", error);
    return null;
  }
};
