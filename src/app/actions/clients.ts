"use server";

import prisma from "@/lib/prisma";
import { clientSchema, type ClientInput } from "@/lib/validations/client";
import { revalidatePath } from "next/cache";
import { formatActionError } from "@/lib/utils/errors";

export async function createClient(data: ClientInput) {
  const result = clientSchema.safeParse(data);

  if (!result.success) {
    return formatActionError(result.error);
  }

  try {
    const client = await prisma.client.create({
      data: result.data,
    });
    revalidatePath("/admin");
    revalidatePath("/admin/clients");
    return { success: true, data: client };
  } catch (e) {
    console.error("Error creating client:", e);
    return { error: "Failed to create client. Email might already exist." };
  }
}

export async function updateClient(id: string, data: ClientInput) {
  const result = clientSchema.safeParse(data);

  if (!result.success) {
    return formatActionError(result.error);
  }

  try {
    const client = await prisma.client.update({
      where: { id },
      data: result.data,
    });
    revalidatePath("/admin");
    revalidatePath("/admin/clients");
    return { success: true, data: client };
  } catch (e) {
    console.error("Error updating client:", e);
    return { error: "Failed to update client." };
  }
}

export async function deleteClient(id: string) {
  try {
    await prisma.client.delete({
      where: { id },
    });
    revalidatePath("/admin");
    revalidatePath("/admin/clients");
    return { success: true };
  } catch (e) {
    console.error("Error deleting client:", e);
    return { error: "Failed to delete client." };
  }
}
