import { z } from "zod";

export const newsSchema = z.object({
  title: z.string().optional(),
  category: z.string().optional(),
  source_name: z.string().optional(),
  news: z.string().optional(),
  league_id: z.number().optional(),
  league_image: z.string().optional(),
  slug: z.string().optional(),
  url: z.string().optional(),
  image: z.string().optional(),
  description: z.string().optional(),
  publish_date: z.string().optional(),
  status: z.string().default("1")
});
