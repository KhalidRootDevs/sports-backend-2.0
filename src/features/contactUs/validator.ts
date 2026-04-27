import { z } from "zod";

// Define the schema for ContactUs validation
export const contactUsSchema = z.object({
  email: z.string().email("Invalid email format").trim(),
  name: z.string().min(1, "Name is required").trim(),
  subject: z.string().min(1, "Subject is required").trim(),
  message: z.string().min(1, "Message is required").trim()
});

// Type for validation result
export type ContactUsInput = z.infer<typeof contactUsSchema>;
