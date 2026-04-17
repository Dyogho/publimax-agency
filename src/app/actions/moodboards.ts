"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addReferenceUrl(moodboardId: string, url: string) {
  try {
    const moodboard = await prisma.moodboard.findUnique({
      where: { id: moodboardId },
      select: { isLocked: true, urls: true }
    });

    if (!moodboard) return { error: "Moodboard not found" };
    if (moodboard.isLocked) return { error: "Moodboard is locked and cannot be edited" };

    // Simple URL validation
    if (!url.startsWith('http')) return { error: "Invalid URL" };

    await prisma.moodboard.update({
      where: { id: moodboardId },
      data: {
        urls: {
          set: [...moodboard.urls, url]
        }
      }
    });

    revalidatePath("/admin");
    revalidatePath("/creative");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Failed to add reference" };
  }
}

export async function removeReferenceUrl(moodboardId: string, url: string) {
  try {
    const moodboard = await prisma.moodboard.findUnique({
      where: { id: moodboardId },
      select: { isLocked: true, urls: true }
    });

    if (!moodboard || moodboard.isLocked) return { error: "Action not permitted" };

    await prisma.moodboard.update({
      where: { id: moodboardId },
      data: {
        urls: {
          set: moodboard.urls.filter(u => u !== url)
        }
      }
    });

    revalidatePath("/admin");
    revalidatePath("/creative");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Failed to remove reference" };
  }
}

export async function toggleMoodboardLock(moodboardId: string, isLocked: boolean) {
  try {
    await prisma.moodboard.update({
      where: { id: moodboardId },
      data: { isLocked }
    });

    revalidatePath("/admin");
    revalidatePath("/creative");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Failed to toggle lock state" };
  }
}

export async function setFinalMoodboardImage(moodboardId: string, imageUrl: string) {
  try {
    await prisma.moodboard.update({
      where: { id: moodboardId },
      data: { finalImage: imageUrl }
    });

    revalidatePath("/admin");
    revalidatePath("/creative");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Failed to set final image" };
  }
}

export async function getMoodboardBySlug(slug: string) {
  try {
    const moodboard = await prisma.moodboard.findUnique({
      where: { slug },
      include: { campaign: { select: { name: true } } }
    });

    if (!moodboard) return null;
    
    // Safety check: if not locked, public access is restricted
    if (!moodboard.isLocked) return { restricted: true };

    return moodboard;
  } catch (e) {
    console.error(e);
    return null;
  }
}
