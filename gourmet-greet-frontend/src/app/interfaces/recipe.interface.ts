import { Review } from "./review.interface";

export interface Recipe {
  id: number;
  title: string;
  description: string;
  rating: number;
  numberOfReviews: number;
  posterId?: number | null;
  galleryImageIds: number[];
  reviewDtos: Review[];
  categoryIds: number[];
  cookingTime: number;
  servings: number;
  ownerId: number;
  ingredients: string[];
  steps: string[];
}
