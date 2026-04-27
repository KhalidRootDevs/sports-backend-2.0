import { z } from "zod";

// Define the schema for creating and updating highlights
export const highlightSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  league_id: z.number().optional(),
  league_image: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  short_description: z.string().optional(),
  video_type: z.string().min(1, "Video type is required"),
  youtube_url: z.string().optional(),
  thumbnail_type: z.string().optional(),
  highlight_image: z.string().optional(),
  fixture_id: z.string().optional(),
  videos: z.array(z.string()).optional(),
  status: z.string().default("1")
});
