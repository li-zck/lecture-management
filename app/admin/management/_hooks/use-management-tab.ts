"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export type ManagementTabId = "chart" | "table";

const TAB_OVERVIEW = "overview";

/**
 * Syncs the Overview / Edit tab state with the URL query param `tab`.
 * - overview -> Overview tab (chart)
 * - edit-<entity> -> Edit tab (table)
 * So when the admin navigates away and back, the same tab is restored.
 */
export function useManagementTab(
  editTabSlug: string,
): [ManagementTabId, (tab: ManagementTabId) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTab: ManagementTabId = useMemo(() => {
    const tab = searchParams.get("tab");
    if (tab === TAB_OVERVIEW) return "chart";
    if (tab === editTabSlug) return "table";
    return "chart";
  }, [searchParams, editTabSlug]);

  const setActiveTab = useCallback(
    (tab: ManagementTabId) => {
      const params = new URLSearchParams(searchParams.toString());
      if (tab === "chart") {
        params.set("tab", TAB_OVERVIEW);
      } else {
        params.set("tab", editTabSlug);
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, editTabSlug, router, searchParams],
  );

  return [activeTab, setActiveTab];
}
