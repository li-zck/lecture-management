import type { AssignedCourse, LecturerSchedule } from "@/lib/api/lecturer";
import type { EnrolledCourse, WeeklySchedule } from "@/lib/api/student";

/**
 * Derive weekly schedule from student enrollments.
 * Used when backend getSchedule is not available.
 */
export function enrollmentsToWeeklySchedule(
  enrollments: EnrolledCourse[],
): WeeklySchedule {
  const schedule: WeeklySchedule = {};

  for (const e of enrollments) {
    const day = e.schedule.dayOfWeek;
    if (day === null) continue;

    if (!schedule[day]) schedule[day] = [];
    schedule[day].push({
      courseName: e.course.name,
      startTime: e.schedule.startTime,
      endTime: e.schedule.endTime,
      location: e.schedule.location,
      lecturer: e.lecturer?.fullName ?? null,
      mode: e.schedule.mode,
      meetingUrl: e.schedule.meetingUrl,
      courseOnSemesterId: e.courseOnSemesterId,
    });
  }

  // Sort each day's classes by start time
  for (const day of Object.keys(schedule)) {
    const d = Number(day);
    schedule[d].sort((a, b) => {
      const aStart = a.startTime ?? 0;
      const bStart = b.startTime ?? 0;
      return aStart - bStart;
    });
  }

  return schedule;
}

/**
 * Derive lecturer schedule from assigned courses.
 * Used when backend getSchedule is not available.
 */
export function coursesToLecturerSchedule(
  courses: AssignedCourse[],
): LecturerSchedule {
  const schedule: LecturerSchedule = {};

  for (const c of courses) {
    const day = c.schedule.dayOfWeek;
    if (day === null) continue;

    if (!schedule[day]) schedule[day] = [];
    schedule[day].push({
      courseName: c.course.name,
      startTime: c.schedule.startTime,
      endTime: c.schedule.endTime,
      location: c.schedule.location,
      lecturer: null, // Lecturer viewing own schedule
      mode: c.schedule.mode,
      meetingUrl: c.schedule.meetingUrl,
      courseOnSemesterId: c.courseOnSemesterId,
    });
  }

  for (const day of Object.keys(schedule)) {
    const d = Number(day);
    schedule[d].sort((a, b) => {
      const aStart = a.startTime ?? 0;
      const bStart = b.startTime ?? 0;
      return aStart - bStart;
    });
  }

  return schedule;
}
