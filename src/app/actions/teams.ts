"use server";

import prisma from "@/lib/prisma";
import { memberSchema, teamSchema, type MemberInput, type TeamInput } from "@/lib/validations/team";
import { revalidatePath } from "next/cache";
import { formatActionError } from "@/lib/utils/errors";
import { createAdminClient } from "@/lib/supabase/server";

/* --- Team Members Actions --- */

export async function createMember(data: MemberInput) {
  const result = memberSchema.safeParse(data);
  if (!result.success) {
    return formatActionError(result.error);
  }

  const { name, email, password, role, systemRole } = result.data;

  try {
    // 1. Create user in Supabase Auth via Admin API
    const supabaseAdmin = await createAdminClient();
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role: systemRole },
    });

    if (authError) {
      console.error("Supabase Auth Error:", authError);
      return { error: authError.message };
    }

    // 2. Create profile in Prisma
    try {
      const member = await prisma.teamMember.create({
        data: {
          name,
          email,
          password,
          role,
          systemRole,
        },
      });

      revalidatePath("/admin/team");
      revalidatePath("/admin/teams");
      return { success: true, data: member };
    } catch (dbError) {
      console.error("Database Error:", dbError);
      // Cleanup: Delete auth user if DB creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return { error: "Failed to create profile in database." };
    }
  } catch (e) {
    console.error("Unexpected Error:", e);
    return { error: "An unexpected error occurred during creation." };
  }
}

export async function deleteMember(id: string) {
  try {
    await prisma.teamMember.delete({ where: { id } });
    revalidatePath("/team");
    revalidatePath("/admin/teams");
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
    revalidatePath("/admin/teams");
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
    revalidatePath("/admin/teams");
    return { success: true, data: team };
  } catch (e) {
    console.error(e);
    return { error: "Failed to update team." };
  }
}

export async function deleteTeam(id: string) {
  try {
    await prisma.team.delete({ where: { id } });
    revalidatePath("/admin/teams");
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
    revalidatePath("/admin/teams");
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
    revalidatePath("/admin/teams");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Failed to remove member from team." };
  }
}
