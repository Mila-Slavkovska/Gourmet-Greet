import { Recipe } from "../interfaces/recipe.interface";

export const mockRecipes: Recipe[] = [
  {
    id: 1,
    title: "Spaghetti Carbonara",
    description: "A classic Italian pasta dish with eggs, cheese, pancetta, and pepper.",
    rating: 4.5,
    numberOfReviews: 120,
    posterId: 101,
    galleryImageIds: [201, 202, 203],
    reviewDtos: [
      { id: 1, reviewerName: "Alice", comment: "Delicious and easy to make!", rating: 5 },
      { id: 2, reviewerName: "Bob", comment: "A bit too salty for my taste.", rating: 3.5 }
    ],
    categoryIds: [1, 2],
    cookingTime: 30,
    servings: 4,
    ownerId: 10,
    ingredients: ["Spaghetti", "Eggs", "Pancetta", "Parmesan cheese", "Black pepper"],
    steps: [
      "Cook spaghetti according to package instructions.",
      "Fry pancetta in a pan until crispy.",
      "Mix eggs and Parmesan cheese in a bowl.",
      "Combine spaghetti with pancetta and egg mixture.",
      "Serve with freshly ground black pepper."
    ]
  },
  {
    id: 2,
    title: "Chicken Curry",
    description: "A spicy and flavorful Indian chicken curry.",
    rating: 4.8,
    numberOfReviews: 200,
    posterId: 102,
    galleryImageIds: [204, 205],
    reviewDtos: [
      { id: 3, reviewerName: "Charlie", comment: "Authentic taste and very spicy!", rating: 5 },
      { id: 4, reviewerName: "David", comment: "Could use more coconut milk.", rating: 4 }
    ],
    categoryIds: [3, 4],
    cookingTime: 45,
    servings: 6,
    ownerId: 11,
    ingredients: ["Chicken", "Curry powder", "Onions", "Tomatoes", "Garlic", "Ginger"],
    steps: [
      "Heat oil in a pan and sauté onions until golden brown.",
      "Add garlic, ginger, and curry powder, then cook for a minute.",
      "Add chicken pieces and cook until browned.",
      "Pour in tomatoes and let it simmer until chicken is tender.",
      "Serve hot with rice or naan."
    ]
  },
  {
    id: 3,
    title: "Beef Stroganoff",
    description: "A rich and creamy Russian dish with beef and mushrooms.",
    rating: 4.7,
    numberOfReviews: 150,
    posterId: 103,
    galleryImageIds: [206, 207],
    reviewDtos: [],
    categoryIds: [5],
    cookingTime: 40,
    servings: 4,
    ownerId: 12,
    ingredients: ["Beef", "Mushrooms", "Onions", "Sour cream", "Garlic"],
    steps: [
      "Sauté onions and garlic in butter.",
      "Add sliced beef and cook until browned.",
      "Stir in mushrooms and cook until soft.",
      "Add sour cream and simmer for a few minutes.",
      "Serve over egg noodles or rice."
    ]
  },
  {
    id: 4,
    title: "Vegetable Stir Fry",
    description: "A healthy mix of stir-fried vegetables with soy sauce.",
    rating: 4.6,
    numberOfReviews: 100,
    posterId: 104,
    galleryImageIds: [208, 209],
    reviewDtos: [],
    categoryIds: [6, 7],
    cookingTime: 25,
    servings: 2,
    ownerId: 13,
    ingredients: ["Broccoli", "Carrots", "Bell peppers", "Soy sauce", "Garlic"],
    steps: [
      "Heat oil in a wok.",
      "Add garlic and stir-fry for a few seconds.",
      "Toss in vegetables and cook until tender-crisp.",
      "Add soy sauce and stir to combine.",
      "Serve immediately with rice or noodles."
    ]
  },
  {
    id: 5,
    title: "Grilled Salmon",
    description: "Perfectly grilled salmon with a lemon butter sauce.",
    rating: 4.9,
    numberOfReviews: 180,
    posterId: 105,
    galleryImageIds: [210, 211],
    reviewDtos: [],
    categoryIds: [8],
    cookingTime: 20,
    servings: 2,
    ownerId: 14,
    ingredients: ["Salmon", "Lemon", "Butter", "Garlic", "Dill"],
    steps: [
      "Preheat grill to medium heat.",
      "Season salmon with salt, pepper, and lemon juice.",
      "Grill for 4-5 minutes on each side.",
      "Melt butter with garlic and drizzle over salmon.",
      "Garnish with fresh dill and serve."
    ]
  }
];
