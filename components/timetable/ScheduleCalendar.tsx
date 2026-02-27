"use client";

import {
  CalendarBody,
  CalendarDate,
  CalendarDatePagination,
  CalendarDatePicker,
  CalendarHeader,
  CalendarItem,
  CalendarMonthPicker,
  CalendarProvider,
  CalendarYearPicker,
  type Feature,
  type Status,
  useCalendarMonth,
  useCalendarYear,
} from "@/components/ui/calendar";
import { Badge } from "@/components/ui/shadcn/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/shadcn/tooltip";
import type { ScheduleSlot } from "@/lib/ai";
import type { PublicExamSchedule } from "@/lib/api/exam-schedule";
import {
  addDays,
  addMonths,
  format,
  getDay,
  parseISO,
  startOfMonth,
} from "date-fns";
import { useEffect, useMemo } from "react";

export type ScheduleCalendarProps = {
  schedule: Record<number, ScheduleSlot[]>;
  exams?: PublicExamSchedule[];
  semesterStart: string;
  semesterEnd: string;
  dayNames?: string[];
  modeLabels?: { online: string; onCampus: string; hybrid: string };
  joinMeetingLabel?: string;
  emptyMessage?: string;
};

function formatTime(minutes: number | null): string {
  if (minutes === null) return "–";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

const CLASS_STATUS: Status = { id: "class", name: "Class", color: "#3b82f6" };
const EXAM_STATUS: Status = { id: "exam", name: "Exam", color: "#ef4444" };

type CalendarEvent = {
  type: "class" | "exam";
  date: Date;
  title: string;
  time?: string;
  location?: string;
  mode?: string;
  meetingUrl?: string | null;
};

function CalendarInitializer({
  semesterStart,
  semesterEnd,
}: {
  semesterStart: string;
  semesterEnd: string;
}) {
  const [, setMonth] = useCalendarMonth();
  const [, setYear] = useCalendarYear();

  useEffect(() => {
    const start = parseISO(semesterStart);
    const end = parseISO(semesterEnd);
    const today = new Date();
    const target = today < start || today > end ? start : today;
    setMonth(
      target.getMonth() as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11,
    );
    setYear(target.getFullYear());
  }, [semesterStart, semesterEnd, setMonth, setYear]);

  return null;
}

export function ScheduleCalendar({
  schedule,
  exams = [],
  semesterStart,
  semesterEnd,
  modeLabels = { online: "Online", onCampus: "On campus", hybrid: "Hybrid" },
  joinMeetingLabel = "Join meeting",
  emptyMessage = "No scheduled classes or exams for this period.",
}: ScheduleCalendarProps) {
  const start = parseISO(semesterStart);
  const end = parseISO(semesterEnd);

  const startYear = start.getFullYear();
  const endYear = end.getFullYear();

  const allEvents = useMemo(() => {
    const events: CalendarEvent[] = [];

    for (let d = new Date(start); d <= end; d = addDays(d, 1)) {
      const dayOfWeek = getDay(d);
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

    for (const exam of exams) {
      if (!exam.examDate) continue;
      const examDate = parseISO(exam.examDate);
      if (examDate >= start && examDate <= end) {
        const courseName = exam.courseOnSemester?.course?.name ?? "Exam";
        let timeStr: string | undefined;
        if (exam.startTime && exam.endTime) {
          const s = parseISO(exam.startTime);
          const e = parseISO(exam.endTime);
          timeStr = `${format(s, "HH:mm")} – ${format(e, "HH:mm")}`;
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
  }, [schedule, exams, start, end]);

  const features: Feature[] = useMemo(
    () =>
      allEvents.map((e, i) => ({
        id: `${e.type}-${i}`,
        name: e.title,
        startAt: e.date,
        endAt: e.date,
        status: e.type === "exam" ? EXAM_STATUS : CLASS_STATUS,
      })),
    [allEvents],
  );

  const featureEvents = useMemo(() => {
    const map = new Map<string, CalendarEvent>();
    allEvents.forEach((e, i) => {
      const id = `${e.type}-${i}`;
      map.set(id, e);
    });
    return map;
  }, [allEvents]);

  const [month] = useCalendarMonth();
  const [year] = useCalendarYear();

  const eventsForMonth = useMemo(() => {
    const monthStart = startOfMonth(new Date(year, month, 1));
    const monthEnd = addMonths(monthStart, 1);
    return allEvents.filter((e) => e.date >= monthStart && e.date < monthEnd);
  }, [allEvents, month, year]);

  return (
    <div className="space-y-4">
      <CalendarProvider className="border rounded-lg">
        <CalendarInitializer
          semesterStart={semesterStart}
          semesterEnd={semesterEnd}
        />
        <CalendarDate>
          <CalendarDatePicker>
            <CalendarMonthPicker />
            <CalendarYearPicker
              start={Math.min(startYear, endYear)}
              end={Math.max(startYear, endYear) + 1}
            />
          </CalendarDatePicker>
          <CalendarDatePagination />
        </CalendarDate>
        <CalendarHeader />
        <CalendarBody features={features}>
          {({ feature }) => {
            const event = featureEvents.get(feature.id);

            return (
              <Tooltip key={feature.id}>
                <TooltipTrigger asChild>
                  <div className="cursor-pointer">
                    <CalendarItem feature={feature} className="py-1" />
                  </div>
                </TooltipTrigger>
                {event && (
                  <TooltipContent side="top">
                    <div className="space-y-1">
                      <p className="font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(event.date, "EEE, MMM d")}
                        {event.time ? ` • ${event.time}` : ""}
                        {event.location ? ` • ${event.location}` : ""}
                      </p>
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>
            );
          }}
        </CalendarBody>
      </CalendarProvider>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Events in {format(new Date(year, month, 1), "MMMM yyyy")}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            All classes and exams this month
          </p>
        </CardHeader>
        <CardContent>
          {eventsForMonth.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">
              {emptyMessage}
            </p>
          ) : (
            <ul className="space-y-3">
              {eventsForMonth.map((event, i) => (
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
