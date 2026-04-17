import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { Sidebar } from "./sidebar";
import { redirect } from "next/navigation";

export async function SidebarWrapper() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 1. Check Admin
  const admin = await prisma.admin.findUnique({
    where: { supabaseId: user.id },
    select: { id: true }
  });

  if (admin) {
    return <Sidebar role="ADMIN" />;
  }

  // 2. Check TeamMember
  const member = await prisma.teamMember.findUnique({
    where: { supabaseId: user.id },
    select: { systemRole: true }
  });

  if (!member) {
    // Fallback to email for transition period or legacy sync
    const memberByEmail = await prisma.teamMember.findUnique({
      where: { email: user.email },
      select: { systemRole: true, id: true }
    });

    if (memberByEmail) {
      return <Sidebar role={memberByEmail.systemRole} />;
    }
    
    redirect("/login");
  }

  return <Sidebar role={member.systemRole} />;
}
