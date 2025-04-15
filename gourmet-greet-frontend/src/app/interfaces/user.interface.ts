import { Recipe } from "./recipe.interface"

export interface User {
    id: number,
    email: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    favoritesIds: number[] | null,
    ownedRecipeIds: number[] | null,
    userRole: "ADMIN" | "CHEF" | "USER"
}