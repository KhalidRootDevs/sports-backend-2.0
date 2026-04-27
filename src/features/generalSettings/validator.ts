import { z } from "zod";

// Define the schema for GeneralSettings validation
export const generalSettingsSchema = z.object({
  company_name: z.string().optional(),
  site_title: z.string().optional(),
  timezone: z.record(z.string(), z.unknown()).optional(),
  language: z.record(z.string(), z.unknown()).optional(),
  terms: z.string().optional(),
  policy: z.string().optional(),
  contact_us: z.string().optional(),
  facebook: z.string().default(""),
  youtube: z.string().default(""),
  instagram: z.string().default(""),
  site_logo: z.string().default(""),
  site_icon: z.string().default("")
});

// TypeScript type for the validated data
export type GeneralSettingsType = z.infer<typeof generalSettingsSchema>;
