import { z } from "zod";

export const UserValidator = z.object({
  name: z.string().min(1, "Name is required").trim(),
  email: z.string().email("Invalid email format").trim(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  image: z.string().optional().nullable(),
  role: z.enum(["admin", "user", "moderator"]).default("user"),
  permissions: z
    .object({
      canRead: z.boolean().default(true),
      canWrite: z.boolean().default(false),
      canDelete: z.boolean().default(false)
    })
    .default({
      canRead: true,
      canWrite: false,
      canDelete: false
    }),
  isActive: z.boolean().default(true)
});

export const UserUpdateValidator = UserValidator.partial().omit({
  password: true
});

export type UserCreateInput = z.infer<typeof UserValidator>;
export type UserUpdateInput = z.infer<typeof UserUpdateValidator>;
