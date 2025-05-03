export interface User {
  id: number,
  email: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
  userRole: string,
  favoriteRecipes: number[],
  ownedRecipes: number []
}
