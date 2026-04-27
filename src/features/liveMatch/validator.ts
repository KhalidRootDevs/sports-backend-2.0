import { z } from "zod";

// Define the Stream schema
const streamSchema = z.object({
  id: z.number().optional(),
  match_id: z.number().optional(),
  stream_title: z.string(),
  is_premium: z.number().default(0),
  resolution: z.string(),
  stream_status: z.string().default("1"),
  platform: z.enum(["both", "android", "ios"]).default("both"),
  stream_type: z.enum(["root_stream", "restricted", "m3u8", "web"]).default("root_stream"),
  portrait_watermark: z.string().default("{}"),
  landscape_watermark: z.string().default("{}"),
  root_streams: z.array(z.record(z.unknown())).optional().default([]),
  stream_url: z.string().optional(),
  headers: z.array(z.record(z.unknown())).optional().default([]),
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
  is_hot: z.number().default(0),
  status: z.string().default("1"),
  team_one_name: z.string().min(1, "Team one name is required"),
  team_two_name: z.string().min(1, "Team two name is required"),
  team_one_image: z.string().optional(),
  team_two_image: z.string().optional(),
  team_one_id: z.number().optional(),
  team_two_id: z.number().optional(),
  position: z.number().default(999999999),
  streaming_sources: z.array(streamSchema).optional() // Define the streaming_sources field
});
