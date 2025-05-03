export interface RecipeAddDto {
    title: string,
    description: string,
    ingredients: string[],
    categories: number[],
    cookingTime: number,
    servings: number,
    poster?: number | null,
    images: number[],
    steps: string[],
    ownerId: number;
}