"use client";

import { Calendar } from "@/components/ui/shadcn/calendar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/shadcn/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";
import { CalendarIcon } from "lucide-react";
import * as React from "react";

function formatDate(date: Date | undefined): string {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isValidDate(date: Date | undefined): boolean {
  if (!date) return false;
  return !Number.isNaN(date.getTime());
}

/** Normalize API date (ISO or YYYY-MM-DD) to YYYY-MM-DD for parsing */
function normalizeToYYYYMMDD(s: string): string {
  if (!s || s.trim() === "") return "";
  const trimmed = s.trim();
  if (trimmed.includes("T")) return trimmed.split("T")[0];
  return trimmed;
}

/** Parse YYYY-MM-DD to Date (local); returns undefined if invalid or empty */
function parseYYYYMMDD(s: string): Date | undefined {
  const normalized = normalizeToYYYYMMDD(s);
  if (!normalized) return undefined;
  const parts = normalized.split("-").map(Number);
  if (parts.length !== 3) return undefined;
  const [y, m, d] = parts;
  if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return undefined;
  const date = new Date(y, m - 1, d);
  return isValidDate(date) ? date : undefined;
}

/** Format Date to YYYY-MM-DD for form/API */
function toYYYYMMDD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export interface DatePickerInputProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  "aria-invalid"?: boolean;
  className?: string;
}

export function DatePickerInput({
  value,
  onChange,
  id,
  placeholder = "Select date",
  disabled = false,
  "aria-invalid": ariaInvalid,
  className,
}: DatePickerInputProps) {
  const [open, setOpen] = React.useState(false);
  const normalizedValue = React.useMemo(
    () => normalizeToYYYYMMDD(value),
    [value],
  );
  const date = React.useMemo(
    () => parseYYYYMMDD(normalizedValue),
    [normalizedValue],
  );
  const [inputValue, setInputValue] = React.useState(() => formatDate(date));
  const [month, setMonth] = React.useState<Date | undefined>(date ?? undefined);

  React.useEffect(() => {
    const nextDate = parseYYYYMMDD(normalizedValue);
    setInputValue(formatDate(nextDate));
    if (nextDate) setMonth(nextDate);
  }, [normalizedValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInputValue(raw);
    const parsed = new Date(raw);
    if (isValidDate(parsed)) {
      onChange(toYYYYMMDD(parsed));
    }
  };

  const handleSelect = (selected: Date | undefined) => {
    if (!selected) return;
    onChange(toYYYYMMDD(selected));
    setInputValue(formatDate(selected));
    setOpen(false);
  };

  return (
    <InputGroup className={className}>
      <InputGroupInput
        id={id}
        value={inputValue}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={ariaInvalid}
        onChange={handleInputChange}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      />
      <InputGroupAddon align="inline-end">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <InputGroupButton
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label="Select date"
              disabled={disabled}
            >
              <CalendarIcon />
              <span className="sr-only">Select date</span>
            </InputGroupButton>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={date}
              month={month}
              onMonthChange={setMonth}
              onSelect={handleSelect}
            />
          </PopoverContent>
        </Popover>
      </InputGroupAddon>
    </InputGroup>
  );
}
