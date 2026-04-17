import { DeliverableStatus } from "@prisma/client";

export interface CalendarTask {
  id: string;
  title: string;
  status: DeliverableStatus;
  description: string | null;
  campaignColor: string | null;
  teams: { id: string; name: string }[];
}

export interface CalendarDay {
  day: number | null;
  campaigns: { id: string; color: string | null }[];
  tasks: CalendarTask[];
}
