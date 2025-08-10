import { z } from "zod";

const authProvidersSchema = z.array(z.enum(["email", "github", "google", "openid"]));

export type AuthProvidersDto = z.infer<typeof authProvidersSchema>;
