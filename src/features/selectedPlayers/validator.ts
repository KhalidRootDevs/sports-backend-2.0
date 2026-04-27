import { z } from "zod";

export const selectedPlayerSchema = z.object({
  id: z.number(),
  name: z.string(),
  logo: z.string(),
  team_logo: z.string().optional(),
  nationality_logo: z.string().optional(),
  player_position: z.string(),
  status: z.string().default("1"),
  newsUrl: z.string().optional(),
  channelId: z.string(),
  position: z.number().default(9999999)
});
