"use server";

import prisma from "@/lib/prisma";
import { invoiceSchema, type InvoiceInput } from "@/lib/validations/billing";
import { revalidatePath } from "next/cache";
import { formatActionError } from "@/lib/utils/errors";
import { BillingType } from "@prisma/client";

export async function createInvoice(data: InvoiceInput) {
  // 1. Fetch campaign dates if not provided to enforce duration rule server-side
  const campaign = await prisma.campaign.findUnique({
    where: { id: data.campaignId },
    select: { startDate: true, endDate: true }
  });

  if (!campaign) {
    return { error: "Campaign not found" };
  }

  // Inject campaign dates for validation if missing
  const validationData = {
    ...data,
    campaignStartDate: data.campaignStartDate || campaign.startDate,
    campaignEndDate: data.campaignEndDate || campaign.endDate,
  };

  const result = invoiceSchema.safeParse(validationData);

  if (!result.success) {
    return formatActionError(result.error);
  }

  // 2. Persist
  try {
    const { campaignStartDate, campaignEndDate, ...cleanData } = result.data;
    
    const invoice = await prisma.invoice.create({
      data: {
        ...cleanData,
        deliverableId: cleanData.deliverableId || null,
      },
    });

    revalidatePath("/admin/billing");
    revalidatePath(`/admin/campaigns`); // Simplified revalidation
    return { success: true, data: invoice };
  } catch (e) {
    console.error("Error creating invoice:", e);
    return { error: "Failed to create invoice." };
  }
}

export async function updateInvoiceStatus(id: string, status: any) {
  try {
    await prisma.invoice.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/admin/billing");
    return { success: true };
  } catch (e) {
    console.error("Error updating invoice:", e);
    return { error: "Failed to update invoice." };
  }
}

export async function deleteInvoice(id: string) {
  try {
    await prisma.invoice.delete({
      where: { id },
    });
    revalidatePath("/admin/billing");
    return { success: true };
  } catch (e) {
    console.error("Error deleting invoice:", e);
    return { error: "Failed to delete invoice." };
  }
}

export async function getBillingSummary() {
  try {
    const invoices = await prisma.invoice.findMany({
      select: { amount: true, status: true }
    });

    const paid = invoices
      .filter(i => i.status === "PAID")
      .reduce((sum, i) => sum + i.amount, 0);
    
    const pending = invoices
      .filter(i => i.status === "PENDING")
      .reduce((sum, i) => sum + i.amount, 0);

    return { paid, pending, total: paid + pending };
  } catch (e) {
    console.error("Error fetching summary:", e);
    return { paid: 0, pending: 0, total: 0 };
  }
}
