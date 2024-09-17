import { z } from "zod";

export const productItemSchema = z.object({
  name: z.string().min(1, "Food item name is required"),
  imageName: z.string().min(1, "Image name is required"),
  price: z.number().min(0, "Price must be a positive number"),
  cuisine: z.string().min(1, "Cuisine is required"),
  repas: z.string().min(1, "Repas is required"),
  repasType: z.string().min(1, "Repas type is required"),
  description: z.string().optional(),
  isActive: z.boolean(),
  rating: z.number().min(0).max(5).optional(),
  reviews: z.number().min(0).optional(),
});

export type ProductItemFormData = z.infer<typeof productItemSchema>;
