import { Recipe, UserSettings } from './types';

export const INITIAL_SETTINGS: UserSettings = {
  name: 'Prasad',
  profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prasad&backgroundColor=ffdfbf&top=shortHair&hairColor=black&facialHair=moustacheMagnum',
  language: 'English',
  dietType: 'Non-Veg',
  allergies: [],
  cuisinePreferences: ['Indian'],
  skillLevel: 'Intermediate',
  notifications: true,
};

// Mock data for recipes
export const INITIAL_RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Classic Paneer Butter Masala',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://res.cloudinary.com/dvkfhijxs/video/upload/v1771835185/paneer-masala_cqs7jk.mp4',
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
    title: 'Hyderabadi Chicken Biryani',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://res.cloudinary.com/dvkfhijxs/video/upload/v1771835336/chicken-biryani_zksen3.mp4',
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
    title: 'Dal Makhani (Slow Cooked)',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://res.cloudinary.com/dvkfhijxs/video/upload/v1771835488/dal_l45bu3.mp4',
    time: '60 mins',
    difficulty: 'Medium',
    rating: 4.7,
    calories: 380,
    description: 'Black lentils slow-cooked overnight with butter and cream for a velvety texture.',
    ingredients: ['1 cup Black Urad Dal', '1/4 cup Kidney Beans', '2 tbsp Butter', '1/2 cup Cream', 'Ginger-Garlic Paste'],
    instructions: [
      'Soak lentils and beans overnight.',
      'Pressure cook until very soft.',
      'Simmer with tomato puree and spices for 30 mins.',
      'Finish with butter and cream.'
    ],
    servings: 3,
    isLiked: false,
    hasReminder: false,
    likesCount: 210,
    tags: ['Veg', 'Indian']
  },
  {
    id: '4',
    title: 'Goan Fish Curry',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://res.cloudinary.com/dvkfhijxs/video/upload/v1771835567/fried-rice_dlvjyu.mp4',
    time: '25 mins',
    difficulty: 'Easy',
    rating: 4.5,
    calories: 420,
    description: 'A tangy and spicy coconut-based fish curry from the coast of Goa.',
    ingredients: ['500g Fish Fillets', '1 cup Coconut Milk', 'Tamarind Paste', 'Kashmiri Chilies', 'Mustard Seeds'],
    instructions: [
      'Grind coconut, chilies, and tamarind into a paste.',
      'Sauté mustard seeds and curry leaves.',
      'Add the paste and cook for 5 mins.',
      'Add fish and simmer until cooked.'
    ],
    servings: 2,
    isLiked: false,
    hasReminder: false,
    likesCount: 155,
    tags: ['Non-Veg', 'Seafood']
  },
  {
    id: '5',
    title: 'Gulab Jamun (Soft & Juicy)',
    image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://res.cloudinary.com/dvkfhijxs/video/upload/v1771835645/pasta_itxg36.mp4',
    time: '40 mins',
    difficulty: 'Medium',
    rating: 5.0,
    calories: 320,
    description: 'Deep-fried milk solids dumplings soaked in rose-scented sugar syrup.',
    ingredients: ['1 cup Khoya', '2 tbsp Flour', '1 cup Sugar', 'Cardamom', 'Rose Water'],
    instructions: [
      'Knead khoya and flour into a smooth dough.',
      'Make small balls and deep fry on low heat.',
      'Prepare sugar syrup with cardamom and rose water.',
      'Soak the fried balls in warm syrup for 2 hours.'
    ],
    servings: 6,
    isLiked: false,
    hasReminder: false,
    likesCount: 540,
    tags: ['Veg', 'Dessert']
  }
];

export const VEG_INGREDIENTS = [
  'Paneer', 'Potato (Aloo)', 'Tomato', 'Onion', 'Spinach (Palak)', 'Mushroom', 'Cauliflower (Gobi)', 
  'Peas (Matar)', 'Carrot', 'Lady Finger (Bhindi)', 'Eggplant (Baingan)', 'Bottle Gourd (Lauki)', 
  'Bitter Gourd (Karela)', 'Capsicum (Shimla Mirch)', 'Cabbage (Patta Gobi)', 'Fenugreek (Methi)',
  'Radish (Mooli)', 'Pumpkin (Kaddu)', 'Sweet Potato', 'Drumstick', 'Pointed Gourd (Parwal)'
];

export const SPICES = [
  'Turmeric (Haldi)', 'Cumin (Jeera)', 'Chili Powder', 'Garam Masala', 'Coriander (Dhania)', 
  'Salt', 'Black Pepper', 'Cardamom (Elaichi)', 'Cloves (Laung)', 'Cinnamon (Dalchini)', 
  'Asafoetida (Hing)', 'Mustard Seeds (Rai)', 'Fennel Seeds (Saunf)', 'Kashmiri Mirch',
  'Amchur (Mango Powder)', 'Kasuri Methi', 'Bay Leaf (Tej Patta)', 'Star Anise'
];

export const MEATS = ['Chicken', 'Mutton', 'Fish', 'Prawns', 'Egg', 'Crab'];
