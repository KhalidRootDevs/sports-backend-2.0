import { z } from "zod";

export const selectedTeamSchema = z.object({
  id: z.number(),
  name: z.string(),
  logo: z.string(),
  seasonId: z.string(),
  status: z.string().default("1"),
  newsUrl: z.string().optional(),
  channelId: z.string(),
  position: z.number().default(9999999)
});
