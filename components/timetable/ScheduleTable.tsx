"use client";

import { Badge } from "@/components/ui/shadcn/badge";
import type { ScheduleSlot } from "@/lib/ai";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

const DEFAULT_DAY_NAMES: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

function formatTime(minutes: number | null): string {
  if (minutes === null) return "–";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

export type ScheduleTableProps = {
  schedule: Record<number, ScheduleSlot[]>;
  /** Optional localized day names indexed by dayOfWeek (0–6). */
  dayNames?: string[];
  /** Optional localized empty-state message. */
  emptyMessage?: string;
  /** Optional labels for mode badges */
  modeLabels?: { online: string; onCampus: string; hybrid: string };
  /** Show lecturer column (e.g. true for student, false for lecturer) */
  includeLecturer?: boolean;
  /** Column header labels from dict.scheduleTable */
  columnLabels?: {
    courseName: string;
    day: string;
    schedule: string;
    type: string;
    location: string;
    lecturer: string;
  };
  joinMeetingLabel?: string;
  className?: string;
};

export function ScheduleTable({
  schedule,
  dayNames,
  emptyMessage,
  modeLabels = { online: "Online", onCampus: "On campus", hybrid: "Hybrid" },
  includeLecturer = true,
  columnLabels = {
    courseName: "Course Name",
    day: "Day",
    schedule: "Schedule",
    type: "Type",
    location: "Location",
    lecturer: "Lecturer",
  },
  joinMeetingLabel = "Join meeting",
  className,
}: ScheduleTableProps) {
  const sortedDays = Object.keys(schedule)
    .map(Number)
    .sort((a, b) => a - b);

  const rows: { day: number; dayName: string; slot: ScheduleSlot }[] = [];
  for (const day of sortedDays) {
    const slots = (schedule[day] ?? []).sort(
      (a, b) => (a.startTime ?? 0) - (b.startTime ?? 0),
    );
    const dayName = dayNames?.[day] ?? DEFAULT_DAY_NAMES[day];
    for (const slot of slots) {
      rows.push({ day, dayName, slot });
    }
  }

  if (rows.length === 0) {
    return (
      <div
        className={cn(
          "rounded-lg border bg-muted/30 p-6 text-center text-muted-foreground",
          className,
        )}
      >
        {emptyMessage ?? "No scheduled classes for the selected period."}
      </div>
    );
  }

  const getTypeLabel = (mode: ScheduleSlot["mode"]) => {
    if (!mode || mode === "ON_CAMPUS") return modeLabels.onCampus;
    if (mode === "ONLINE") return modeLabels.online;
    return modeLabels.hybrid;
  };

  return (
    <div className={cn("overflow-x-auto rounded-lg border", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left font-medium">
              {columnLabels.courseName}
            </th>
            <th className="px-4 py-3 text-left font-medium">
              {columnLabels.day}
            </th>
            <th className="px-4 py-3 text-left font-medium">
              {columnLabels.schedule}
            </th>
            <th className="px-4 py-3 text-left font-medium">
              {columnLabels.type}
            </th>
            <th className="px-4 py-3 text-left font-medium">
              {columnLabels.location}
            </th>
            {includeLecturer && (
              <th className="px-4 py-3 text-left font-medium">
                {columnLabels.lecturer}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ day, dayName, slot }, idx) => (
            <tr
              key={`${day}-${slot.courseName}-${slot.startTime ?? "tba"}-${idx}`}
              className="border-b last:border-b-0 even:bg-muted/20"
            >
              <td className="px-4 py-3 font-medium">{slot.courseName}</td>
              <td className="px-4 py-3 text-muted-foreground">{dayName}</td>
              <td className="px-4 py-3">
                {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
              </td>
              <td className="px-4 py-3">
                <Badge
                  variant={
                    slot.mode === "ONLINE"
                      ? "secondary"
                      : slot.mode === "HYBRID"
                        ? "outline"
                        : "outline"
                  }
                  className="text-xs"
                >
                  {getTypeLabel(slot.mode)}
                </Badge>
              </td>
              <td className="px-4 py-3">
                {(slot.mode === "ONLINE" || slot.mode === "HYBRID") &&
                slot.meetingUrl ? (
                  <a
                    href={slot.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    {slot.location ? `${slot.location} · ` : ""}
                    <ExternalLink className="h-3 w-3 shrink-0" />
                    {joinMeetingLabel}
                  </a>
                ) : (
                  <span className="text-muted-foreground">
                    {slot.location ?? "TBA"}
                  </span>
                )}
              </td>
              {includeLecturer && (
                <td className="px-4 py-3 text-muted-foreground">
                  {slot.lecturer ?? "–"}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
