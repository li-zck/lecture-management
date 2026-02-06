"use client";

import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries";

import en from "@/dictionaries/en.json";
import vi from "@/dictionaries/vi.json";

const dicts: Record<Locale, Dictionary> = {
  en: en as Dictionary,
  vi: vi as Dictionary,
};

export function getClientDictionary(locale: Locale): Dictionary {
  return dicts[locale] ?? dicts.en;
}
