import { z } from "zod";

export const memberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
});

export type MemberInput = z.infer<typeof memberSchema>;

export const teamSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  description: z.string().optional().or(z.literal("")),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type TeamInput = z.infer<typeof teamSchema>;
