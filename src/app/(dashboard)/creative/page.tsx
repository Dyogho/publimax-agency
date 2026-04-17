import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { CalendarGrid } from "@/components/calendar/calendar-grid";
import { MyTasks } from "@/components/creative/my-tasks";

export default async function CreativeDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) return null;

  const tasks = await prisma.deliverable.findMany({
    where: {
      teams: {
        some: {
          members: {
            some: { email: user.email }
          }
        }
      }
    },
    include: {
      campaign: true
    },
    orderBy: { endDate: 'asc' }
  });

  return (
    <div className="space-y-12">
      <div>
        <CalendarGrid role="CREATIVE" />
      </div>
      
      <div className="pb-12 px-6">
        <MyTasks tasks={tasks} />
      </div>
    </div>
  );
}
