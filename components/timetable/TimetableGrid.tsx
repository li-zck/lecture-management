"use client";

import type { ScheduleSlot } from "@/lib/ai";
import { cn } from "@/lib/utils";

const DAY_NAMES: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

/** Backend stores time as minutes since midnight (e.g. 8:00 = 480) */
function formatTime(minutes: number | null): string {
  if (minutes === null) return "–";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

export type TimetableGridProps = {
  schedule: Record<number, ScheduleSlot[]>;
  /** Days to show (default: Mon–Fri) */
  days?: number[];
  className?: string;
};

export function TimetableGrid({
  schedule,
  days = [1, 2, 3, 4, 5],
  className,
}: TimetableGridProps) {
  const slotsByDay = days
    .map((d) => ({
      day: d,
      name: DAY_NAMES[d],
      slots: (schedule[d] ?? []).sort(
        (a, b) => (a.startTime ?? 0) - (b.startTime ?? 0),
      ),
    }))
    .filter((d) => d.slots.length > 0);

  if (slotsByDay.length === 0) {
    return (
      <div
        className={cn(
          "rounded-lg border bg-muted/30 p-6 text-center text-muted-foreground",
          className,
        )}
      >
        No scheduled classes for the selected period.
      </div>
    );
  }

  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {slotsByDay.map(({ day, name, slots }) => (
        <div
          key={day}
          className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
        >
          <h3 className="mb-3 font-semibold">{name}</h3>
          <div className="space-y-2">
            {slots.map((slot) => (
              <div
                key={`${day}-${slot.courseName}-${slot.startTime ?? "tba"}`}
                className="rounded-md border bg-primary/5 p-3"
              >
                <p className="font-medium">{slot.courseName}</p>
                <p className="text-sm text-muted-foreground">
                  {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                  {slot.location ? ` • ${slot.location}` : ""}
                </p>
                {slot.lecturer && (
                  <p className="text-xs text-muted-foreground">
                    {slot.lecturer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
