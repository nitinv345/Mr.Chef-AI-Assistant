import { GoogleGenAI, Type } from "@google/genai";
import { Recipe, UserSettings } from "../types";

export const generateRecipeFromIngredients = async (
  ingredients: string[],
  dietType: string,
  userSettings: UserSettings,
  recipeName?: string
): Promise<Partial<Recipe> | null> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY missing");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Create a detailed cooking recipe based on these ingredients: ${ingredients.join(', ')}.
    ${recipeName ? `The recipe should be for: ${recipeName}.` : ''}
    Dietary Preference: ${dietType}.
    User Settings:
    - Cuisine: ${userSettings.cuisinePreferences.join(', ')}
    - Skill Level: ${userSettings.skillLevel}
    - Allergies: ${userSettings.allergies.join(', ')}
    
    The recipe should be safe for the allergies listed.
    Provide a creative title, a list of additional basic ingredients if needed, step-by-step instructions, and serving size.
    Difficulty must be one of: "Easy", "Medium", "Hard".
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
            description: { type: Type.STRING },
            time: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            calories: { type: Type.NUMBER },
          },
          required: ["title", "ingredients", "instructions", "servings", "description", "time", "difficulty", "calories"]
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

export const translateRecipe = async (
  recipe: Recipe,
  targetLanguage: string
): Promise<Partial<Recipe> | null> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-3-flash-preview";
  const prompt = `
    Translate the following recipe into ${targetLanguage}.
    Maintain the JSON structure.
    
    Recipe:
    Title: ${recipe.title}
    Description: ${recipe.description}
    Ingredients: ${recipe.ingredients.join(', ')}
    Instructions: ${recipe.instructions.join(' | ')}
    Time: ${recipe.time}
    Difficulty: ${recipe.difficulty}
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
            description: { type: Type.STRING },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
            time: { type: Type.STRING },
            difficulty: { type: Type.STRING },
          },
          required: ["title", "description", "ingredients", "instructions", "time", "difficulty"]
        }
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
    return null;
  } catch (error) {
    console.error("Error translating recipe:", error);
    return null;
  }
};

export const generateRecipeImage = async (prompt: string): Promise<string | null> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-2.5-flash-image";

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [{ text: `A high-quality, professional food photography shot of ${prompt}. Vibrant colors, appetizing presentation, 4k resolution.` }]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating recipe image:", error);
    return null;
  }
};
