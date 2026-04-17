"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function login(prevState: { error?: string } | null | undefined, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email y contraseña son requeridos" };
  }

  const supabase = await createClient();

  const { error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    console.error("Auth Error:", authError.message);
    return { error: "Credenciales inválidas" };
  }

  // Si el login es exitoso, buscamos el rol
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { error: "Error al obtener perfil de usuario" };
  }

  let redirectPath = "/login";
  try {
    // 1. Check Admin table first
    const admin = await prisma.admin.findUnique({
      where: { supabaseId: user.id },
      select: { id: true }
    });

    if (admin) {
      redirectPath = "/admin";
    } else {
      // 2. Check TeamMember table
      const member = await prisma.teamMember.findUnique({
        where: { supabaseId: user.id },
        select: { systemRole: true }
      });

      if (member) {
        redirectPath = member.systemRole === "CREATIVE" ? "/creative" : "/admin";
      } else {
        // Fallback for email-based legacy or specific cases if needed
        const memberByEmail = await prisma.teamMember.findUnique({
          where: { email: user.email },
          select: { systemRole: true, id: true }
        });

        if (memberByEmail) {
          // Sync supabaseId if missing
          await prisma.teamMember.update({
            where: { id: memberByEmail.id },
            data: { supabaseId: user.id }
          });
          redirectPath = memberByEmail.systemRole === "CREATIVE" ? "/creative" : "/admin";
        } else {
          return { error: "No tienes un perfil asignado en el sistema." };
        }
      }
    }
  } catch (error) {
    console.error("Redirection Error:", error);
    return { error: "Error al verificar permisos" };
  }

  revalidatePath("/", "layout");
  redirect(redirectPath);
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
