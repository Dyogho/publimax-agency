import { z } from "zod";
import { CampaignStatus } from "@prisma/client";

export const campaignSchema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  budget: z.coerce.number().min(0, "Budget must be a positive number"),
  adsType: z.string().min(1, "Ads type is required"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  estimatedRoi: z.coerce.number().optional().or(z.literal(0)),
  status: z.enum(CampaignStatus).default(CampaignStatus.PLANNING),
  color: z.string().optional().default("#3b82f6"),
  clientId: z.string().min(1, "Client is required"),
}).refine((data) => data.endDate >= data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
});

export type CampaignInput = z.infer<typeof campaignSchema>;
