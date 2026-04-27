import { z } from "zod";

export interface UserQuery {
  email?: RegExp;
  name?: RegExp;
}

export const querySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  search: z.string().optional()
});
