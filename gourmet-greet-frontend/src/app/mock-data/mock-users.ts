import { User } from "../interfaces/user.interface";


export const mockUsers: User[] = [
  {
    id: 1,
    email: "alice@example.com",
    firstName: "Alice",
    lastName: "Johnson",
    phoneNumber: "+1234567890",
    favoriteRecipes: [1, 2, 3, 4],
    ownedRecipes: [],
    userRole: "USER"
  },
  {
    id: 2,
    email: "bob@example.com",
    firstName: "Bob",
    lastName: "Smith",
    phoneNumber: "+1987654321",
    favoriteRecipes: [5],
    ownedRecipes: [1, 3],
    userRole: "CHEF"
  },
  {
    id: 3,
    email: "carla@example.com",
    firstName: "Carla",
    lastName: "Martinez",
    phoneNumber: "+1123456789",
    favoriteRecipes: [],
    ownedRecipes: [],
    userRole: "ADMIN"
  },
];
