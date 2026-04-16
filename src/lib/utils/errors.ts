import { z } from "zod";

export function formatActionError(error: z.ZodError) {
  return { error: z.flattenError(error).fieldErrors };
}
