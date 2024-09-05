import { z } from "zod";

export const userProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be 10 digits")
    .optional(),
  dateOfBirth: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    })
    .optional(),
  gender: z.enum(["male", "female", "other", "prefer not to say"]).optional(),
  bio: z.string().max(500, "Bio must be 500 characters or less").optional(),
  avatarUrl: z.string().url("Invalid URL for avatar").optional(),
});
