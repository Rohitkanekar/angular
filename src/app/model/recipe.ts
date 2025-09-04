export interface Recipe {
  id: number;
  userId: number;
  name: string;
  cuisine: string;
  caloriesPerServing: number;
  cookTimeMinutes: number;
  prepTimeMinutes: number;
  difficulty: string;
  servings: number;
  tags?: string[] | string;
  image?: string | null;
  rating?: number;
  reviewCount?: number;
  isPending: boolean;
  ingredients?: string[];
  instructions?: string[];
}