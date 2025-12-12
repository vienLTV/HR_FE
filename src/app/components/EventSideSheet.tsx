"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

type Event = {
  id: number
  title: string
  date: string
  time: string
  description: string
}

const events: Event[] = [
  {
    id: 1,
    title: "Team Meeting",
    date: "2024-01-15",
    time: "10:00 AM",
    description: "Weekly team sync to discuss project progress and upcoming tasks."
  },
  {
    id: 2,
    title: "Client Presentation",
    date: "2024-01-17",
    time: "2:00 PM",
    description: "Present the new product features to our key client."
  },
  {
    id: 3,
    title: "Workshop: Data Visualization",
    date: "2024-01-20",
    time: "11:00 AM",
    description: "Learn advanced techniques for creating impactful data visualizations."
  },
  {
    id: 4,
    title: "Project Deadline",
    date: "2024-01-25",
    time: "5:00 PM",
    description: "Final submission deadline for the Q1 project."
  },
  {
    id: 5,
    title: "Team Building Event",
    date: "2024-01-28",
    time: "3:00 PM",
    description: "Join us for an afternoon of fun activities and team bonding."
  }
]

export function EventSideSheet() {
  return (
    <div className="w-80 border-l">
      <div className="p-4 border-b">
        <h2 className="text-primary-md font-semibold">Upcoming Events</h2>
      </div>
      <ScrollArea className="h-[calc(100vh-5rem)] px-4">
        {events.map((event) => (
          <div key={event.id} className="mb-4">
            <h3 className="font-medium">{event.title}</h3>
            <p className="text-sm text-muted-foreground">
              {event.date} at {event.time}
            </p>
            <p className="text-sm mt-1">{event.description}</p>
            <Separator className="my-2" />
          </div>
        ))}
      </ScrollArea>
      <div className="p-4 border-t">
        <Button className="w-full button-primary hover:bg-white">Add New Event</Button>
      </div>
    </div>
  )
}