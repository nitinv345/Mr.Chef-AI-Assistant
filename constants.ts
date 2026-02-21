import { Recipe, UserSettings } from './types';

export const INITIAL_SETTINGS: UserSettings = {
  name: 'Chef User',
  profilePicture: 'https://picsum.photos/200',
  language: 'English',
  dietType: 'Non-Veg',
  allergies: [],
  cuisinePreferences: ['Indian', 'Italian'],
  skillLevel: 'Intermediate',
  notifications: true,
};

// Mock data for 5 recipes as requested
export const INITIAL_RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Classic Paneer Butter Masala',
    image: 'https://picsum.photos/800/600?random=1',
    videoUrl: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
    time: '30 mins',
    difficulty: 'Medium',
    rating: 4.8,
    calories: 450,
    description: 'A rich and creamy Indian classic made with paneer cubes in a tomato-based gravy.',
    ingredients: ['200g Paneer', '2 Onions', '3 Tomatoes', '1 tsp Butter', '1 tsp Garam Masala', '1/2 cup Cream'],
    instructions: [
      'Sauté onions and tomatoes until soft.',
      'Blend into a smooth paste.',
      'Heat butter, add spices and the paste.',
      'Cook until oil separates.',
      'Add paneer cubes and cream. Simmer for 5 mins.'
    ],
    servings: 2,
    isLiked: false,
    hasReminder: false,
    likesCount: 120,
    tags: ['Veg', 'Indian']
  },
  {
    id: '2',
    title: 'Spicy Chicken Biryani',
    image: 'https://picsum.photos/800/600?random=2',
    videoUrl: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
    time: '45 mins',
    difficulty: 'Hard',
    rating: 4.9,
    calories: 650,
    description: 'Fragrant basmati rice layered with marinated chicken and aromatic spices.',
    ingredients: ['500g Chicken', '2 cups Basmati Rice', 'Yogurt', 'Biryani Masala', 'Fried Onions', 'Saffron'],
    instructions: [
      'Marinate chicken with yogurt and spices for 1 hour.',
      'Par-boil rice with whole spices.',
      'Layer chicken and rice in a pot.',
      'Top with fried onions and saffron milk.',
      'Cook on low heat (dum) for 20 minutes.'
    ],
    servings: 4,
    isLiked: false,
    hasReminder: false,
    likesCount: 340,
    tags: ['Non-Veg', 'Indian']
  },
  {
    id: '3',
    title: 'Creamy Mushroom Pasta',
    image: 'https://picsum.photos/800/600?random=3',
    videoUrl: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
    time: '20 mins',
    difficulty: 'Easy',
    rating: 4.6,
    calories: 400,
    description: 'A simple yet elegant pasta dish with a creamy mushroom and garlic sauce.',
    ingredients: ['200g Pasta', '1 cup Mushrooms', '2 cloves Garlic', '1 cup Heavy Cream', 'Parmesan Cheese'],
    instructions: [
      'Boil pasta al dente.',
      'Sauté garlic and mushrooms in olive oil.',
      'Add cream and simmer until slightly thickened.',
      'Toss pasta in sauce and finish with parmesan.'
    ],
    servings: 2,
    isLiked: false,
    hasReminder: false,
    likesCount: 85,
    tags: ['Veg', 'Italian']
  },
  {
    id: '4',
    title: 'Vegan Tofu Stir Fry',
    image: 'https://picsum.photos/800/600?random=4',
    videoUrl: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
    time: '15 mins',
    difficulty: 'Easy',
    rating: 4.4,
    calories: 300,
    description: 'Healthy and quick vegan stir fry with crispy tofu and fresh vegetables.',
    ingredients: ['1 block Tofu', 'Broccoli', 'Bell Peppers', 'Soy Sauce', 'Ginger', 'Sesame Oil'],
    instructions: [
      'Press tofu and cut into cubes.',
      'Pan fry tofu until golden.',
      'Stir fry vegetables in sesame oil.',
      'Mix soy sauce, ginger, and garlic.',
      'Combine everything and toss well.'
    ],
    servings: 3,
    isLiked: false,
    hasReminder: false,
    likesCount: 45,
    tags: ['Vegan', 'Asian']
  },
  {
    id: '5',
    title: 'Chocolate Lava Cake',
    image: 'https://picsum.photos/800/600?random=5',
    videoUrl: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
    time: '25 mins',
    difficulty: 'Medium',
    rating: 5.0,
    calories: 550,
    description: 'Indulgent chocolate cakes with a gooey, molten center.',
    ingredients: ['100g Dark Chocolate', '50g Butter', '2 Eggs', '2 tbsp Sugar', '1 tbsp Flour'],
    instructions: [
      'Melt chocolate and butter together.',
      'Whisk eggs and sugar until pale.',
      'Fold in chocolate mixture and flour.',
      'Pour into greased ramekins.',
      'Bake at 200°C for 10-12 minutes.'
    ],
    servings: 2,
    isLiked: false,
    hasReminder: false,
    likesCount: 890,
    tags: ['Veg', 'Dessert']
  }
];

export const VEG_INGREDIENTS = ['Paneer', 'Potato', 'Tomato', 'Onion', 'Spinach', 'Mushroom', 'Cauliflower', 'Peas', 'Carrot'];
export const SPICES = ['Turmeric', 'Cumin', 'Chili Powder', 'Garam Masala', 'Coriander', 'Salt', 'Pepper'];
export const MEATS = ['Chicken', 'Mutton', 'Fish', 'Prawns', 'Egg'];
