import type { Locale } from "./config";

export type HomeFeature = { title: string; description: string };
export type HomeStatKey = "activeStudents" | "courses" | "departments" | "uptime";
export type AboutFeature = { title: string; description: string };
export type AboutBenefit = { title: string; body: string };

export type Dictionary = {
  nav: {
    home: string;
    about: string;
    courses: string;
    signIn: string;
    signOut: string;
    dashboard: string;
    myCourses: string;
    browseCourses: string;
    settings: string;
    loading: string;
  };
  locale: {
    english: string;
    vietnamese: string;
  };
  home: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    getStarted: string;
    learnMore: string;
    trustItems: string[];
    stats: Record<HomeStatKey, string>;
    featuresSection: { title: string; subtitle: string };
    features: HomeFeature[];
    studentSection: { badge: string; title: string; subtitle: string };
    studentFeatures: HomeFeature[];
    lecturerSection: { badge: string; title: string; subtitle: string };
    lecturerFeatures: HomeFeature[];
    benefitsSection: { title: string; subtitle: string };
    benefits: HomeFeature[];
    cta: { title: string; subtitle: string };
  };
  about: {
    version: string;
    title: string;
    titleBrand: string;
    intro: string;
    missionTitle: string;
    missionBody: string;
    coreFeaturesTitle: string;
    coreFeaturesSubtitle: string;
    features: AboutFeature[];
    techStackTitle: string;
    techStackSubtitle: string;
    techStack: string[];
    whyChooseTitle: string;
    benefits: AboutBenefit[];
    ctaTitle: string;
    ctaSubtitle: string;
  };
};

const dictionaries: Record<Locale, () => Promise<{ default: Dictionary }>> = {
  en: () =>
    import("@/dictionaries/en.json").then((m) => ({
      default: m.default as Dictionary,
    })),
  vi: () =>
    import("@/dictionaries/vi.json").then((m) => ({
      default: m.default as Dictionary,
    })),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const loader = dictionaries[locale] ?? dictionaries.en;
  const mod = await loader();
  return mod.default;
}
