import type { Locale } from "./config";

export type HomeFeature = { title: string; description: string };
export type HomeStatKey =
  | "activeStudents"
  | "courses"
  | "departments"
  | "uptime";
export type AboutFeature = { title: string; description: string };
export type AboutBenefit = { title: string; body: string };

export type Dictionary = {
  nav: {
    home: string;
    about: string;
    sitePolicy: string;
    support: string;
    courses: string;
    signIn: string;
    signOut: string;
    dashboard: string;
    myCourses: string;
    browseCourses: string;
    settings: string;
    loading: string;
  };
  common: {
    cancel: string;
    save: string;
    error: string;
    submit: string;
    back: string;
    refresh: string;
    other: string;
    tba: string;
    students: string;
    credits: string;
    location: string;
    schedule: string;
    lecturer: string;
    enrollment: string;
    recommendedFor: string;
    unknownCourse: string;
  };
  footer: {
    copyright: string;
  };
  dashboard: {
    unauthorized: string;
    signInToView: string;
    unknownRole: string;
    roleNoDashboard: string;
  };
  courses: {
    title: string;
    subtitle: string;
    signInRequired: string;
    signInToBrowse: string;
    searchPlaceholder: string;
    allSemesters: string;
    offerings: string;
    departments: string;
    refreshTitle: string;
    hintStudent: string;
    hintLecturer: string;
    hintOther: string;
    noCoursesFound: string;
    noMatchCriteria: string;
    noOfferingsAvailable: string;
    enrolled: string;
    teaching: string;
    full: string;
    enrollInCourse: string;
    enrolling: string;
    requestToTeach: string;
    submitting: string;
    requestSent: string;
    enrollSuccess: string;
    enrollFailed: string;
    requestFailed: string;
    capacityFullWarning: string;
    tableCourse: string;
    tableSemester: string;
    tableDepartment: string;
    viewCards: string;
    viewTable: string;
    filterMyCoursesOnly: string;
  };
  signIn: {
    welcomeTitle: string;
    welcomeSubtitle: string;
    courseManagement: string;
    courseManagementDesc: string;
    collaboration: string;
    collaborationDesc: string;
    welcomeBack: string;
    signInStudent: string;
    signInLecturer: string;
    studentId: string;
    lecturerId: string;
    username: string;
    password: string;
    enterStudentId: string;
    enterLecturerId: string;
    enterUsername: string;
    signInWithUsername: string;
    signInWithStudentId: string;
    signInWithLecturerId: string;
    needHelp: string;
    contactSupport: string;
  };
  roleSelector: {
    selectRole: string;
    student: string;
    lecturer: string;
  };
  support: {
    title: string;
    subtitle: string;
    formTitle: string;
    formDescription: string;
    fullName: string;
    email: string;
    yourRole: string;
    selectRole: string;
    issueCategory: string;
    selectCategory: string;
    subject: string;
    subjectPlaceholder: string;
    message: string;
    messagePlaceholder: string;
    messageHint: string;
    submitRequest: string;
    submitting: string;
    successTitle: string;
    successDescription: string;
    needImmediate: string;
    roles: { student: string; lecturer: string; admin: string; other: string };
    categories: {
      login: string;
      enrollment: string;
      grades: string;
      schedule: string;
      technical: string;
      account: string;
      other: string;
    };
  };
  settings: {
    title: string;
    subtitle: string;
    warning: string;
    unauthorized: string;
    signInRequired: string;
    currentInfo: string;
    currentInfoDesc: string;
    updateImmediate: string;
    updateImmediateDesc: string;
    requestUpdate: string;
    requestUpdateDesc: string;
    updateProfile: string;
    updateProfileDesc: string;
    fullName: string;
    username: string;
    email: string;
    emailReadOnly: string;
    phone: string;
    address: string;
    department: string;
    headOfDepartment: string;
    gender: string;
    genderMale: string;
    genderFemale: string;
    birthDate: string;
    citizenId: string;
    passwordChange: string;
    passwordChangeDesc: string;
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
    saveChanges: string;
    saving: string;
    successTitle: string;
    successDescription: string;
    requestUpdateTitle: string;
    requestUpdateConfirm: string;
    submitRequest: string;
    requestSuccessTitle: string;
    requestSuccessDescription: string;
    notSet: string;
    notAssigned: string;
    needHelpElse: string;
    contactSupport: string;
    webhooks: string;
    webhooksDesc: string;
    webhookUrl: string;
    addWebhook: string;
    active: string;
    inactive: string;
    noWebhooks: string;
  };
  daysOfWeek: string[];
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
  sitePolicy: {
    title: string;
    subtitle: string;
    lastUpdated: string;
    termsOfUse: { title: string; paragraphs: string[] };
    privacy: { title: string; paragraphs: string[] };
    acceptableUse: {
      title: string;
      intro: string;
      items: string[];
      outro: string;
    };
    lmsSpecific: {
      title: string;
      sections: { title: string; body: string }[];
    };
    faq: { title: string; items: { question: string; answer: string }[] };
    cta: { text: string; supportLink: string };
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
