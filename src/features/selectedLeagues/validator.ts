import { z } from "zod";

export const selectedLeaguesSchema = z.object({
  id: z.number(),
  seasonId: z.number().optional(),
  name: z.string(),
  logo: z.string(),
  status: z.string().default("1"),
  position: z.number().default(9999999)
});
