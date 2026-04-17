"use server";

import prisma from "@/lib/prisma";
import { campaignSchema, type CampaignInput } from "@/lib/validations/campaign";
import { revalidatePath } from "next/cache";
import { formatActionError } from "@/lib/utils/errors";

import { randomBytes } from "node:crypto";

function generateRandomSlug() {
  return randomBytes(6).toString('hex');
}

export async function createCampaign(data: CampaignInput) {
  const result = campaignSchema.safeParse(data);

  if (!result.success) {
    return formatActionError(result.error);
  }

  try {
    const campaign = await prisma.$transaction(async (tx) => {
      const newCampaign = await tx.campaign.create({
        data: result.data,
      });

      await tx.moodboard.create({
        data: {
          title: `Moodboard: ${newCampaign.name}`,
          slug: generateRandomSlug(),
          campaignId: newCampaign.id,
        },
      });

      return newCampaign;
    });

    revalidatePath("/admin");
    revalidatePath("/admin/campaigns");
    return { success: true, data: campaign };
  } catch (e) {
    console.error("Error creating campaign:", e);
    return { error: "Failed to create campaign." };
  }
}

export async function updateCampaign(id: string, data: CampaignInput) {
  const result = campaignSchema.safeParse(data);

  if (!result.success) {
    return formatActionError(result.error);
  }

  try {
    const campaign = await prisma.campaign.update({
      where: { id },
      data: result.data,
    });
    revalidatePath("/admin");
    revalidatePath("/admin/campaigns");
    return { success: true, data: campaign };
  } catch (e) {
    console.error("Error updating campaign:", e);
    return { error: "Failed to update campaign." };
  }
}

export async function deleteCampaign(id: string) {
  try {
    await prisma.campaign.delete({
      where: { id },
    });
    revalidatePath("/admin");
    revalidatePath("/admin/campaigns");
    return { success: true };
  } catch (e) {
    console.error("Error deleting campaign:", e);
    return { error: "Failed to delete campaign." };
  }
}
