"use server";

import prisma from "@/lib/prisma";

export async function getGlobalROIReport() {
  try {
    const campaigns = await prisma.campaign.findMany({
      select: {
        name: true,
        budget: true,
        estimatedRoi: true,
        targetAudience: true,
        expectedReach: true,
      },
      orderBy: { budget: 'desc' }
    });

    return campaigns.map(c => ({
      name: c.name,
      budget: c.budget,
      expectedReturn: c.budget * (c.estimatedRoi || 0),
      reachPercent: c.targetAudience && c.targetAudience > 0 
        ? ((c.expectedReach || 0) / c.targetAudience) * 100 
        : 0
    }));
  } catch (e) {
    console.error("Error fetching ROI report:", e);
    return [];
  }
}

export async function getAdsTypeDistribution() {
  try {
    const results = await prisma.campaign.groupBy({
      by: ['adsType'],
      _sum: {
        budget: true
      }
    });

    return results.map(r => ({
      name: r.adsType,
      value: r._sum.budget || 0
    }));
  } catch (e) {
    console.error("Error fetching Ads Type distribution:", e);
    return [];
  }
}
