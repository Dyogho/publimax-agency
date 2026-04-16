"use server";

import prisma from "@/lib/prisma";
import { campaignSchema, type CampaignInput } from "@/lib/validations/campaign";
import { revalidatePath } from "next/cache";

export async function createCampaign(data: CampaignInput & { teamIds?: string[] }) {
  const result = campaignSchema.safeParse(data);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  const { teamIds, ...campaignData } = data;

  try {
    const campaign = await prisma.campaign.create({
      data: {
        ...result.data,
        teams: teamIds ? {
          connect: teamIds.map(id => ({ id }))
        } : undefined
      },
    });
    revalidatePath("/dashboard");
    revalidatePath("/campaigns");
    return { success: true, data: campaign };
  } catch (e) {
    console.error("Error creating campaign:", e);
    return { error: "Failed to create campaign." };
  }
}

export async function updateCampaign(id: string, data: CampaignInput & { teamIds?: string[] }) {
  const result = campaignSchema.safeParse(data);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  const { teamIds, ...campaignData } = data;

  try {
    const campaign = await prisma.campaign.update({
      where: { id },
      data: {
        ...result.data,
        teams: teamIds ? {
          set: teamIds.map(id => ({ id }))
        } : undefined
      },
    });
    revalidatePath("/dashboard");
    revalidatePath("/campaigns");
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
    revalidatePath("/dashboard");
    revalidatePath("/campaigns");
    return { success: true };
  } catch (e) {
    console.error("Error deleting campaign:", e);
    return { error: "Failed to delete campaign." };
  }
}
