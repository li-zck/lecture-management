"use client";

import { Button } from "@/components/ui/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import type { ScheduleData } from "@/lib/ai";
import {
  downloadBlob,
  exportTimetableAsCsv,
  exportTimetableAsPdf,
  exportTimetableAsText,
} from "@/lib/utils/timetable-export";
import { FileDown, FileSpreadsheet, FileText } from "lucide-react";
import { useState } from "react";

export type ScheduleExportView = "weekly" | "monthly" | "semester";

export type TimetableDownloadProps = {
  schedule: ScheduleData;
  title?: string;
  /** Include lecturer (for student timetable) */
  includeLecturer?: boolean;
  /** Which schedule view is being exported (affects title/filename) */
  view?: ScheduleExportView;
  /** Localized button label (default: \"Download\") */
  buttonLabel?: string;
  /** Localized loading label (default: \"Downloading…\") */
  loadingLabel?: string;
};

const VIEW_SUFFIX: Record<ScheduleExportView, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  semester: "Semester",
};

export function TimetableDownload({
  schedule,
  title = "Timetable",
  includeLecturer = true,
  view,
  buttonLabel = "Download",
  loadingLabel = "Downloading…",
}: TimetableDownloadProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const hasSchedule = Object.values(schedule).some((slots) => slots.length > 0);

  const exportTitle = view != null ? `${title} - ${VIEW_SUFFIX[view]}` : title;
  const baseFilename = `${exportTitle.replace(/\s+/g, "-").toLowerCase()}-${new Date().toISOString().slice(0, 10)}`;

  const handlePdf = async () => {
    setLoading("pdf");
    try {
      const bytes = await exportTimetableAsPdf({
        schedule,
        title: exportTitle,
        includeLecturer,
      });
      downloadBlob(
        new Blob([new Uint8Array(bytes)], { type: "application/pdf" }),
        `${baseFilename}.pdf`,
      );
    } finally {
      setLoading(null);
    }
  };

  const handleTxt = () => {
    const text = exportTimetableAsText({
      schedule,
      title: exportTitle,
      includeLecturer,
    });
    downloadBlob(
      new Blob([text], { type: "text/plain" }),
      `${baseFilename}.txt`,
    );
  };

  const handleCsv = () => {
    const csv = exportTimetableAsCsv({ schedule, includeLecturer });
    downloadBlob(new Blob([csv], { type: "text/csv" }), `${baseFilename}.csv`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={!hasSchedule || loading !== null}
        >
          <FileDown className="size-4" />
          {loading ? loadingLabel : buttonLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handlePdf} disabled={loading !== null}>
          <FileText className="size-4" />
          PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleTxt}>
          <FileText className="size-4" />
          Plain text (.txt)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCsv}>
          <FileSpreadsheet className="size-4" />
          CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
