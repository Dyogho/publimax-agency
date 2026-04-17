import prisma from "@/lib/prisma";
import { SystemRole } from "@prisma/client";
import { createClient } from "@/lib/supabase/server";
import { CalendarGridClient } from "./calendar-grid-client";

interface CalendarGridProps {
  role: SystemRole;
}

export async function CalendarGrid({ role }: CalendarGridProps) {
  // 1. Get user context
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) return null;

  // 2. Get current month context
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const totalDaysInMonth = lastDayOfMonth.getDate();

  const monthName = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(now);
  const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  const startDateThreshold = new Date(year, month, 1);
  const endDateThreshold = new Date(year, month + 1, 0);

  // 3. Fetch data based on role
  const isAdmin = role === "ADMIN";

  const campaigns = await prisma.campaign.findMany({
    where: {
      AND: [
        {
          OR: [
            { startDate: { gte: startDateThreshold, lte: endDateThreshold } },
            { endDate: { gte: startDateThreshold, lte: endDateThreshold } },
            {
              AND: [
                { startDate: { lte: startDateThreshold } },
                { endDate: { gte: endDateThreshold } }
              ]
            }
          ]
        },
        !isAdmin ? {
          teams: {
            some: {
              members: {
                some: {
                  email: user.email
                }
              }
            }
          }
        } : {}
      ]
    },
    include: {
      deliverables: {
        where: {
          OR: [
            { startDate: { gte: startDateThreshold, lte: endDateThreshold } },
            { endDate: { gte: startDateThreshold, lte: endDateThreshold } },
            { startDate: null }
          ]
        },
        include: {
          teams: true
        }
      }
    }
  });

  // 4. Generate grid cells
  const days = [];

  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push({ day: null, campaigns: [], tasks: [] });
  }

  for (let d = 1; d <= totalDaysInMonth; d++) {
    const currentDate = new Date(year, month, d);

    const activeCampaigns = campaigns.filter(c => {
      const start = new Date(c.startDate);
      const end = new Date(c.endDate);
      return start.setHours(0, 0, 0, 0) <= currentDate.setHours(0, 0, 0, 0) &&
        end.setHours(23, 59, 59, 999) >= currentDate.setHours(0, 0, 0, 0);
    });

    const dayTasks = campaigns.flatMap(c =>
      c.deliverables.filter(t => {
        if (!t.startDate) return false;
        const tStart = new Date(t.startDate);
        const tEnd = t.endDate ? new Date(t.endDate) : tStart;
        return tStart.setHours(0, 0, 0, 0) <= currentDate.setHours(0, 0, 0, 0) &&
          tEnd.setHours(23, 59, 59, 999) >= currentDate.setHours(0, 0, 0, 0);
      }).map(t => ({
        id: t.id,
        title: t.title,
        status: t.status,
        description: t.description,
        campaignColor: c.color,
        teams: t.teams.map(team => ({ id: team.id, name: team.name }))
      }))
    );

    days.push({
      day: d,
      campaigns: activeCampaigns.map(c => ({ id: c.id, color: c.color })),
      tasks: dayTasks
    });
  }

  while (days.length % 7 !== 0) {
    days.push({ day: null, campaigns: [], tasks: [] });
  }

  return (
    <CalendarGridClient
      days={days}
      now={{ day: now.getDate(), month: month, year: year }}
      monthName={capitalizedMonth}
      year={year}
    />
  );
}
