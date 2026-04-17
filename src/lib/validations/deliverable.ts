import { z } from "zod";
import { DeliverableType, DeliverableStatus } from "@prisma/client";

export const deliverableSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  type: z.nativeEnum(DeliverableType),
  description: z.string().optional().or(z.literal("")),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  campaignId: z.string().min(1, "La campaña es requerida"),
  teamIds: z.array(z.string()).default([]),
  deliveryUrl: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
});

export type DeliverableInput = z.infer<typeof deliverableSchema>;

export const deliverableStatusSchema = z.object({
  status: z.nativeEnum(DeliverableStatus),
});

export const deliverableSubmissionSchema = z.object({
  deliveryUrl: z.string().url("Ingresa un link válido (Figma, Drive, etc.)").min(1, "El link de entrega es requerido"),
});
