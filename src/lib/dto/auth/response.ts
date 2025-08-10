import { z } from "zod";

import { userSchema } from "../user";

export const authResponseSchema = z.object({
  status: z.enum(["authenticated", "2fa_required"]),
  user: userSchema,
});

export type AuthResponseDto = z.infer<typeof authResponseSchema>;
