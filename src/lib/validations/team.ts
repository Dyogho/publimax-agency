import { z } from "zod";

export const memberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Job role is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  systemRole: z.enum(["ADMIN", "CREATIVE"]),
});

export type MemberInput = z.infer<typeof memberSchema>;

export const teamSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  description: z.string().optional().or(z.literal("")),
});

export type TeamInput = z.infer<typeof teamSchema>;
