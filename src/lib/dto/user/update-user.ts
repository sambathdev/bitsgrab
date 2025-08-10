import z from "zod";
import { userSchema } from "./user";

export const updateUserSchema = userSchema.partial().pick({
  name: true,
  locale: true,
  username: true,
  email: true,
  picture: true,
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
