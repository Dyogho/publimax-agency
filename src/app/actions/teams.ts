"use server";

import prisma from "@/lib/prisma";
import { memberSchema, teamSchema, type MemberInput, type TeamInput } from "@/lib/validations/team";
import { revalidatePath } from "next/cache";
import { formatActionError } from "@/lib/utils/errors";

/* --- Team Members Actions --- */

export async function createMember(data: MemberInput) {
  const result = memberSchema.safeParse(data);
  if (!result.success) {
    return formatActionError(result.error);
  }

  try {
    const member = await prisma.teamMember.create({ data: result.data });
    revalidatePath("/team");
    return { success: true, data: member };
  } catch (e) {
    console.error(e);
    return { error: "Failed to create member." };
  }
}

export async function deleteMember(id: string) {
  try {
    await prisma.teamMember.delete({ where: { id } });
    revalidatePath("/team");
    revalidatePath("/teams");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Failed to delete member." };
  }
}

/* --- Teams Actions --- */

export async function createTeam(data: TeamInput) {
  const result = teamSchema.safeParse(data);
  if (!result.success) {
    return formatActionError(result.error);
  }

  try {
    const team = await prisma.team.create({
      data: {
        name: result.data.name,
        description: result.data.description || null,
      }
    });
    revalidatePath("/teams");
    return { success: true, data: team };
  } catch (e) {
    console.error(e);
    return { error: "Failed to create team." };
  }
}

export async function updateTeam(id: string, data: TeamInput) {
  const result = teamSchema.safeParse(data);
  if (!result.success) {
    return formatActionError(result.error);
  }

  try {
    const team = await prisma.team.update({
      where: { id },
      data: {
        name: result.data.name,
        description: result.data.description || null,
      },
    });
    revalidatePath("/teams");
    return { success: true, data: team };
  } catch (e) {
    console.error(e);
    return { error: "Failed to update team." };
  }
}

export async function deleteTeam(id: string) {
  try {
    await prisma.team.delete({ where: { id } });
    revalidatePath("/teams");
    revalidatePath("/campaigns");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Failed to delete team." };
  }
}

/* --- Membership Logic --- */

export async function addMemberToTeam(teamId: string, memberId: string) {
  try {
    await prisma.team.update({
      where: { id: teamId },
      data: {
        members: {
          connect: { id: memberId }
        }
      }
    });
    revalidatePath("/teams");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Failed to add member to team." };
  }
}

export async function removeMemberFromTeam(teamId: string, memberId: string) {
  try {
    await prisma.team.update({
      where: { id: teamId },
      data: {
        members: {
          disconnect: { id: memberId }
        }
      }
    });
    revalidatePath("/teams");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Failed to remove member from team." };
  }
}
