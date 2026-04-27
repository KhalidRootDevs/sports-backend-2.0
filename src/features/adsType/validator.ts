import { z } from "zod";

// Define the schema for validating AdsType data
export const adsTypeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  id: z.number().int().positive("ID must be a positive integer"),
  status: z.string().default("1"),
  position: z.number().int().nonnegative("Position must be a non-negative integer")
});

// Define a type for the validated AdsType data
export type AdsTypeInput = z.infer<typeof adsTypeSchema>;
