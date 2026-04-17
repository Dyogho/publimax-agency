import { z } from "zod";
import { BillingType, InvoiceStatus } from "@prisma/client";

export const invoiceSchema = z.object({
  amount: z.coerce.number().min(0.01, "Amount must be greater than zero"),
  dueDate: z.coerce.date(),
  description: z.string().min(1, "Description is required"),
  type: z.nativeEnum(BillingType).default(BillingType.MILESTONE),
  status: z.nativeEnum(InvoiceStatus).default(InvoiceStatus.PENDING),
  campaignId: z.string().min(1, "Campaign ID is required"),
  deliverableId: z.string().optional().nullable(),
  // Add campaign context for cross-field validation
  campaignStartDate: z.coerce.date().optional(),
  campaignEndDate: z.coerce.date().optional(),
}).refine((data) => {
  if (data.type === BillingType.MONTHLY && data.campaignStartDate && data.campaignEndDate) {
    const start = new Date(data.campaignStartDate);
    const end = new Date(data.campaignEndDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays >= 30;
  }
  return true;
}, {
  message: "Monthly billing is only allowed for campaigns lasting 30 days or more",
  path: ["type"],
});

export type InvoiceInput = z.infer<typeof invoiceSchema>;
