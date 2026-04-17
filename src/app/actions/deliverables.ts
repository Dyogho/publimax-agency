"use server";

import prisma from "@/lib/prisma";
import { deliverableSchema, deliverableStatusSchema, deliverableSubmissionSchema, type DeliverableInput } from "@/lib/validations/deliverable";
import { revalidatePath } from "next/cache";
import { formatActionError } from "@/lib/utils/errors";
import { DeliverableStatus } from "@prisma/client";

export async function createDeliverable(data: DeliverableInput) {
  const result = deliverableSchema.safeParse(data);

  if (!result.success) {
    return formatActionError(result.error);
  }

  const { teamIds, ...deliverableData } = result.data;

  try {
    const deliverable = await prisma.deliverable.create({
      data: {
        ...deliverableData,
        teams: {
          connect: teamIds.map(id => ({ id }))
        }
      },
    });

    revalidatePath("/admin/campaigns");
    revalidatePath("/creative");
    return { success: true, data: deliverable };
  } catch (e) {
    console.error("Error creating deliverable:", e);
    return { error: "Error al crear el entregable." };
  }
}

export async function updateDeliverableStatus(id: string, status: DeliverableStatus) {
  const result = deliverableStatusSchema.safeParse({ status });

  if (!result.success) {
    return { error: "Estado inválido." };
  }

  try {
    await prisma.deliverable.update({
      where: { id },
      data: { status: result.data.status },
    });

    revalidatePath("/admin/campaigns");
    revalidatePath("/creative");
    return { success: true };
  } catch (e) {
    console.error("Error updating deliverable status:", e);
    return { error: "Error al actualizar el estado del entregable." };
  }
}

export async function submitDeliverable(id: string, deliveryUrl: string) {
  const result = deliverableSubmissionSchema.safeParse({ deliveryUrl });

  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  try {
    await prisma.deliverable.update({
      where: { id },
      data: { 
        deliveryUrl: result.data.deliveryUrl,
        status: "REVIEW" 
      },
    });

    revalidatePath("/admin/campaigns");
    revalidatePath("/creative");
    return { success: true };
  } catch (e) {
    console.error("Error submitting deliverable:", e);
    return { error: "Error al enviar el entregable." };
  }
}

export async function deleteDeliverable(id: string) {
  try {
    await prisma.deliverable.delete({
      where: { id },
    });
    revalidatePath("/admin/campaigns");
    revalidatePath("/creative");
    return { success: true };
  } catch (e) {
    console.error("Error deleting deliverable:", e);
    return { error: "Error al eliminar el entregable." };
  }
}
