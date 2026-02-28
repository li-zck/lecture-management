"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import type { Table } from "@tanstack/react-table";
import { Settings2 } from "lucide-react";

import { Button } from "@/components/ui/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/shadcn/dropdown-menu";
import { getClientDictionary } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/use-locale";

/** User-friendly label for toggle; prefers meta.label, else humanizes column id */
function getColumnToggleLabel(column: {
  id: string;
  columnDef: { meta?: { label?: string } };
}): string {
  const label = column.columnDef.meta?.label;
  if (label) return label;
  const id = column.id;
  if (id.includes(".")) {
    const parts = id.split(".");
    return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
  }
  return (
    id.charAt(0).toUpperCase() +
    id
      .slice(1)
      .replace(/([A-Z])/g, " $1")
      .trim()
  );
}

export function DataTableViewOptions<TData>({
  table,
}: {
  table: Table<TData>;
}) {
  const locale = useLocale();
  const dict = getClientDictionary(locale);
  const t = dict.admin.table;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <Settings2 />
          {t.view}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuLabel>{t.toggleColumns}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              {getColumnToggleLabel(column)}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
