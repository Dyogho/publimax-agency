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

  const member = await prisma.teamMember.findUnique({
    where: { email: user.email },
    select: { systemRole: true }
  });

  if (!member) {
    redirect("/login");
  }

  return <Sidebar role={member.systemRole} />;
}
