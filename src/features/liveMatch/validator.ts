import { z } from "zod";

const headerSchema = z.object({
  key: z.string(),
  value: z.string()
});

const rootStreamSchema = z.object({
  root_stream_type: z.string(),
  root_stream_status: z.union([z.string(), z.number()]),
  root_stream_stream_url: z.string(),
  root_stream_stream_key: z.string()
});

export const streamSchema = z.object({
  id: z.number().optional(),
  match_id: z.number().optional(),
  stream_title: z.string(),
  is_premium: z.boolean().default(false),
  resolution: z.string(),
  stream_status: z.boolean().default(true),
  platform: z.enum(["both", "android", "ios"]).default("both"),
  stream_type: z.enum(["root_stream", "restricted", "m3u8", "web"]).default("root_stream"),
  portrait_watermark: z.string().default("{}"),
  landscape_watermark: z.string().default("{}"),
  root_streams: z.array(rootStreamSchema).default([]),
  stream_url: z.string().optional(),
  headers: z.array(headerSchema).default([]),
  stream_key: z.string().optional(),
  position: z.number().default(99999999)
});

// Define the LiveMatch schema
export const liveMatchSchema = z.object({
  id: z.number().int(),
  fixture_id: z.number().optional(),
  match_title: z.string().min(1, "Match title is required"),
  match_time: z.number().min(1, "Match time is required"),
  time: z.string().min(1, "Time is required"),
  is_hot: z.boolean().default(false),
  status: z.boolean().default(true),
  team_one_name: z.string().min(1, "Team one name is required"),
  team_two_name: z.string().min(1, "Team two name is required"),
  team_one_image: z.string().optional(),
  team_two_image: z.string().optional(),
  team_one_id: z.number().optional(),
  team_two_id: z.number().optional(),
  position: z.number().default(999999999),
  streaming_sources: z.array(streamSchema).optional()
});
