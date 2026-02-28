"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import {
  courseSemesterApi,
  type ScheduleChange,
} from "@/lib/api/course-semester";
import { getClientDictionary, useLocale } from "@/lib/i18n";
import { format } from "date-fns";
import { useEffect, useState } from "react";

export type ScheduleChangesListProps = {
  courseOnSemesterIds: string[];
  courseNames?: Record<string, string>;
  limitPerCourse?: number;
  emptyMessage?: string;
};

type ScheduleChangesListLabels = {
  dayLabel: string;
  timeLabel: string;
  locationLabel: string;
  modeLabel: string;
  meetingLinkUpdated: string;
  scheduleUpdated: string;
};

function formatChangeDescription(
  change: ScheduleChange,
  labels: ScheduleChangesListLabels,
  dayNames: string[],
): string {
  const parts: string[] = [];
  if (
    change.oldDayOfWeek !== change.newDayOfWeek &&
    change.newDayOfWeek != null
  ) {
    parts.push(
      `${labels.dayLabel}: ${dayNames[change.oldDayOfWeek ?? 0]} → ${dayNames[change.newDayOfWeek]}`,
    );
  }
  if (
    change.oldStartTime !== change.newStartTime &&
    change.newStartTime != null
  ) {
    const fmt = (m: number) => {
      const h = Math.floor(m / 60);
      const min = m % 60;
      return `${h.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
    };
    parts.push(
      `${labels.timeLabel}: ${fmt(change.oldStartTime ?? 0)}–${fmt(change.oldEndTime ?? 0)} → ${fmt(change.newStartTime)}–${fmt(change.newEndTime ?? 0)}`,
    );
  }
  if (change.oldLocation !== change.newLocation && change.newLocation != null) {
    parts.push(
      `${labels.locationLabel}: ${change.oldLocation ?? "—"} → ${change.newLocation}`,
    );
  }
  if (change.oldMode !== change.newMode && change.newMode != null) {
    parts.push(
      `${labels.modeLabel}: ${change.oldMode ?? "—"} → ${change.newMode}`,
    );
  }
  if (
    change.oldMeetingUrl !== change.newMeetingUrl &&
    change.newMeetingUrl != null
  ) {
    parts.push(labels.meetingLinkUpdated);
  }
  return parts.length > 0 ? parts.join("; ") : labels.scheduleUpdated;
}

export function ScheduleChangesList({
  courseOnSemesterIds,
  courseNames = {},
  limitPerCourse = 5,
  emptyMessage,
}: ScheduleChangesListProps) {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const sc = dict.scheduleChangesList;
  const dayNames = dict.daysOfWeek ?? [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  const [changes, setChanges] = useState<
    Array<ScheduleChange & { courseName?: string }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseOnSemesterIds.length === 0) {
      setChanges([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all(
      courseOnSemesterIds.map((id) =>
        courseSemesterApi.getScheduleChanges(id, limitPerCourse),
      ),
    )
      .then((results) => {
        const flat: Array<ScheduleChange & { courseName?: string }> = [];
        results.forEach((list, i) => {
          const cosId = courseOnSemesterIds[i];
          const courseName = courseNames[cosId];
          for (const c of list) {
            flat.push({ ...c, courseName });
          }
        });
        flat.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setChanges(flat.slice(0, 20)); // Show at most 20 recent
      })
      .catch(() => setChanges([]))
      .finally(() => setLoading(false));
  }, [courseOnSemesterIds, limitPerCourse, courseNames]);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-6 text-center text-muted-foreground">
          {sc.loading}
        </CardContent>
      </Card>
    );
  }

  if (changes.length === 0) {
    return (
      <Card>
        <CardContent className="py-6 text-center text-muted-foreground">
          {emptyMessage ?? sc.noChanges}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{sc.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{sc.description}</p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {changes.map((c) => (
            <li key={c.id} className="rounded-lg border p-3 text-sm">
              {c.courseName && (
                <p className="font-medium text-foreground">{c.courseName}</p>
              )}
              <p className="text-muted-foreground mt-1">
                {formatChangeDescription(c, sc, dayNames)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {format(new Date(c.createdAt), "MMM d, yyyy HH:mm")}
              </p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
