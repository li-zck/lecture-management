"use client";

import { useParams } from "next/navigation";
import type { Locale } from "./config";
import { isLocale } from "./config";

export function useLocale(): Locale {
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  return isLocale(lang) ? lang : "en";
}

/** Path without leading slash for current locale, e.g. "en" + "/courses" => "/en/courses" */
export function useLocalePath(): (path: string) => string {
  const locale = useLocale();
  return (path: string) => {
    const p = path.startsWith("/") ? path : `/${path}`;
    return `/${locale}${p === "/" ? "" : p}`;
  };
}
