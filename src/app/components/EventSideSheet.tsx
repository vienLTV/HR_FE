"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/app/providers/LanguageProvider";

type Event = {
  id: number;
  titleKey: string;
  dateKey: string;
  timeKey: string;
  descKey: string;
  date: string;
  time: string;
};

const events: Event[] = [
  {
    id: 1,
    titleKey: "home.events.teamMeeting",
    dateKey: "2024-01-15",
    timeKey: "10:00 AM",
    descKey: "home.events.teamMeeting.desc",
    date: "2024-01-15",
    time: "10:00 AM",
  },
  {
    id: 2,
    titleKey: "home.events.clientPresentation",
    dateKey: "2024-01-17",
    timeKey: "2:00 PM",
    descKey: "home.events.clientPresentation.desc",
    date: "2024-01-17",
    time: "2:00 PM",
  },
  {
    id: 3,
    titleKey: "home.events.workshop",
    dateKey: "2024-01-20",
    timeKey: "11:00 AM",
    descKey: "home.events.workshop.desc",
    date: "2024-01-20",
    time: "11:00 AM",
  },
  {
    id: 4,
    titleKey: "home.events.deadline",
    dateKey: "2024-01-25",
    timeKey: "5:00 PM",
    descKey: "home.events.deadline.desc",
    date: "2024-01-25",
    time: "5:00 PM",
  },
  {
    id: 5,
    titleKey: "home.events.teamBuilding",
    dateKey: "2024-01-28",
    timeKey: "3:00 PM",
    descKey: "home.events.teamBuilding.desc",
    date: "2024-01-28",
    time: "3:00 PM",
  },
];

export function EventSideSheet() {
  const { t } = useI18n();

  return (
    <div className="w-80 border-l">
      <div className="p-4 border-b">
        <h2 className="text-primary-md font-semibold">{t("home.events.title")}</h2>
      </div>
      <ScrollArea className="h-[calc(100vh-5rem)] px-4">
        {events.map((event) => (
          <div key={event.id} className="mb-4">
            <h3 className="font-medium">{t(event.titleKey)}</h3>
            <p className="text-sm text-muted-foreground">
              {event.date} at {event.time}
            </p>
            <p className="text-sm mt-1">{t(event.descKey)}</p>
            <Separator className="my-2" />
          </div>
        ))}
      </ScrollArea>
      <div className="p-4 border-t">
        <Button className="w-full button-primary hover:bg-white">{t("home.events.addNew")}</Button>
      </div>
    </div>
  );
}
