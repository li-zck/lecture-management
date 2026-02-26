"use client";

import { Badge } from "@/components/ui/shadcn/badge";
import { Calendar } from "@/components/ui/shadcn/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import type { ScheduleSlot } from "@/lib/ai";
import type { PublicExamSchedule } from "@/lib/api/exam-schedule";
import {
  addDays,
  addMonths,
  format,
  getDay,
  isSameDay,
  parseISO,
  startOfMonth,
  subMonths,
} from "date-fns";
import { useMemo, useState } from "react";

export type ScheduleCalendarProps = {
  /** Weekly schedule: dayOfWeek (0-6) -> slots */
  schedule: Record<number, ScheduleSlot[]>;
  /** Exam schedules (with examDate) */
  exams?: PublicExamSchedule[];
  /** Semester start date (ISO string) */
  semesterStart: string;
  /** Semester end date (ISO string) */
  semesterEnd: string;
  /** Optional localized day names */
  dayNames?: string[];
  /** Optional labels */
  modeLabels?: { online: string; onCampus: string; hybrid: string };
  joinMeetingLabel?: string;
  emptyMessage?: string;
};

/** Backend stores time as minutes since midnight */
function formatTime(minutes: number | null): string {
  if (minutes === null) return "–";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

type CalendarEvent = {
  type: "class" | "exam";
  date: Date;
  title: string;
  time?: string;
  location?: string;
  mode?: string;
  meetingUrl?: string | null;
};

export function ScheduleCalendar({
  schedule,
  exams = [],
  semesterStart,
  semesterEnd,
  dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  modeLabels = { online: "Online", onCampus: "On campus", hybrid: "Hybrid" },
  joinMeetingLabel = "Join meeting",
  emptyMessage = "No scheduled classes or exams for this period.",
}: ScheduleCalendarProps) {
  const [selectedMonth, setSelectedMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const start = parseISO(semesterStart);
  const end = parseISO(semesterEnd);

  // Build list of events for the displayed month
  const eventsForMonth = useMemo(() => {
    const events: CalendarEvent[] = [];
    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = addMonths(monthStart, 1);
    const rangeStart = start > monthStart ? start : monthStart;
    const rangeEnd = end < monthEnd ? end : monthEnd;

    // Add weekly class events
    for (let d = new Date(rangeStart); d <= rangeEnd; d = addDays(d, 1)) {
      const dayOfWeek = getDay(d); // 0=Sun, 1=Mon, ...
      const slots = schedule[dayOfWeek] ?? [];
      for (const slot of slots) {
        events.push({
          type: "class",
          date: new Date(d),
          title: slot.courseName,
          time:
            slot.startTime != null
              ? `${formatTime(slot.startTime)} – ${formatTime(slot.endTime)}`
              : undefined,
          location: slot.location ?? undefined,
          mode: slot.mode,
          meetingUrl: slot.meetingUrl,
        });
      }
    }

    // Add exam events
    for (const exam of exams) {
      if (!exam.examDate) continue;
      const examDate = parseISO(exam.examDate);
      if (examDate >= rangeStart && examDate < rangeEnd) {
        const courseName = exam.courseOnSemester?.course?.name ?? "Exam";
        let timeStr: string | undefined;
        if (exam.startTime && exam.endTime) {
          const start = parseISO(exam.startTime);
          const end = parseISO(exam.endTime);
          timeStr = `${format(start, "HH:mm")} – ${format(end, "HH:mm")}`;
        }
        events.push({
          type: "exam",
          date: examDate,
          title: courseName,
          time: timeStr,
          location: exam.location ?? undefined,
        });
      }
    }

    events.sort((a, b) => a.date.getTime() - b.date.getTime());
    return events;
  }, [schedule, exams, start, end, selectedMonth]);

  const eventsForSelectedDate = useMemo(() => {
    if (!selectedDate) return eventsForMonth;
    return eventsForMonth.filter((e) => isSameDay(e.date, selectedDate));
  }, [eventsForMonth, selectedDate]);

  const daysWithEvents = useMemo(() => {
    const set = new Set<string>();
    for (const e of eventsForMonth) {
      set.add(format(e.date, "yyyy-MM-dd"));
    }
    return Array.from(set).map((s) => parseISO(s));
  }, [eventsForMonth]);

  const hasEvents = eventsForMonth.length > 0;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Monthly Schedule</CardTitle>
          <p className="text-sm text-muted-foreground">
            View classes and exams for the semester
          </p>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            month={selectedMonth}
            onMonthChange={setSelectedMonth}
            disabled={(date) =>
              date < subMonths(start, 1) || date > addMonths(end, 1)
            }
            modifiers={{
              hasEvents: daysWithEvents,
            }}
            modifiersClassNames={{
              hasEvents: "bg-primary/10 font-semibold",
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {selectedDate
              ? `Events on ${format(selectedDate, "EEEE, MMM d")}`
              : `Events in ${format(selectedMonth, "MMMM yyyy")}`}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {selectedDate
              ? "Classes and exams on this day"
              : "All classes and exams this month"}
          </p>
        </CardHeader>
        <CardContent>
          {!hasEvents ? (
            <p className="text-center text-muted-foreground py-6">
              {emptyMessage}
            </p>
          ) : eventsForSelectedDate.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">
              No events on this day.
            </p>
          ) : (
            <ul className="space-y-3">
              {eventsForSelectedDate.map((event, i) => (
                <li
                  key={`${event.type}-${event.title}-${event.date.toISOString()}-${i}`}
                  className="rounded-lg border p-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{event.title}</span>
                    <Badge
                      variant={
                        event.type === "exam" ? "destructive" : "secondary"
                      }
                      className="text-xs"
                    >
                      {event.type === "exam" ? "Exam" : "Class"}
                    </Badge>
                    {event.mode && event.mode !== "ON_CAMPUS" && (
                      <Badge variant="outline" className="text-xs">
                        {event.mode === "ONLINE"
                          ? modeLabels.online
                          : modeLabels.hybrid}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {format(event.date, "EEE, MMM d")}
                    {event.time ? ` • ${event.time}` : ""}
                    {event.location ? ` • ${event.location}` : ""}
                  </p>
                  {event.type === "class" &&
                    (event.mode === "ONLINE" || event.mode === "HYBRID") &&
                    event.meetingUrl && (
                      <a
                        href={event.meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-primary hover:underline mt-1 inline-block"
                      >
                        {joinMeetingLabel} →
                      </a>
                    )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
