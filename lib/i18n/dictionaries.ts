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
  admin: {
    dashboard: {
      title: string;
      subtitle: string;
      viewAllManagement: string;
      totalStudents: string;
      totalLecturers: string;
      departments: string;
      activeStudentsEnrolled: string;
      facultyMembers: string;
      academicDepartments: string;
      availableCourses: string;
      academicTerms: string;
      quickActions: string;
      quickActionsDesc: string;
      addStudent: string;
      addLecturer: string;
      addDepartment: string;
      manageCourses: string;
      manageSemesters: string;
      manageSchedule: string;
      go: string;
      welcomeTitle: string;
      welcomeDesc: string;
      sidebarHint: string;
      manageStudents: string;
      manageLecturers: string;
      configureDepartments: string;
      organizeCourses: string;
      scheduleSemesters: string;
    };
    signIn: {
      title: string;
      subtitle: string;
      username: string;
      password: string;
      signIn: string;
      signUp: string;
      noAccount: string;
      success: string;
      invalidCredentials: string;
      accountDisabled: string;
      tooManyAttempts: string;
      checkCredentials: string;
      failed: string;
    };
    signUp: {
      title: string;
      subtitle: string;
      createAccount: string;
      alreadyHave: string;
      signIn: string;
      confirmPassword: string;
      usernameMin: string;
      passwordMin: string;
      confirmRequired: string;
      passwordsDontMatch: string;
      success: string;
      checkInfo: string;
      usernameExists: string;
      invalidRegistration: string;
      failed: string;
    };
    sidebar: {
      adminPanel: string;
      managementSystem: string;
      navigation: string;
      dashboard: string;
      management: string;
      allEntities: string;
      quickAccess: string;
      students: string;
      lecturers: string;
      departments: string;
      courses: string;
      semesters: string;
      courseSemesters: string;
      enrollmentSessions: string;
      enrollments: string;
      requests: string;
    };
    management: {
      overview: string;
      editStudents: string;
      editLecturers: string;
      editDepartments: string;
      editCourses: string;
      editSemesters: string;
      editSchedules: string;
      editSessions: string;
      allEnrollments: string;
      bulkCreate: string;
      createNew: string;
    };
  };
  myCourses: {
    unauthorized: string;
    signInToView: string;
    signIn: string;
    adminAccess: string;
    useAdminDashboard: string;
    goToAdmin: string;
    unknownRole: string;
    roleNoView: string;
  };
  studentDashboard: {
    title: string;
    welcomeBack: string;
    profileInfo: string;
    studentId: string;
    fullName: string;
    email: string;
    department: string;
    phone: string;
    address: string;
    myCourses: string;
    enrollment: string;
    grades: string;
    schedule: string;
    noEnrolledCourses: string;
    lecturer: string;
    notAssigned: string;
    location: string;
    grade: string;
    notGraded: string;
    viewDocuments: string;
    withdraw: string;
    documents: string;
    noDocuments: string;
    noGrades: string;
    generateAI: string;
    exportTimetable: string;
  };
  lecturerDashboard: {
    title: string;
    welcomeBack: string;
    profileInfo: string;
    lecturerId: string;
    departmentHead: string;
    notDeptHead: string;
    myCourses: string;
    schedule: string;
    noAssignedCourses: string;
    enrolled: string;
    students: string;
    inputGrades: string;
    saveGrades: string;
    gradesSaved: string;
    generateAI: string;
    exportTimetable: string;
  };
  myCoursesList: {
    title: string;
    subtitle: string;
    totalCourses: string;
    totalStudents: string;
    semesters: string;
    totalCredits: string;
    noAssignedCourses: string;
    noAssignedDesc: string;
    viewDetails: string;
    students: string;
    credits: string;
    schedule: string;
    status: string;
    active: string;
    upcoming: string;
    completed: string;
  };
  notifications: {
    title: string;
    subtitle: string;
    subtitleUnread: string;
    subtitleUnreadPlural: string;
    allCaughtUp: string;
    noNotifications: string;
    noNotificationsDesc: string;
    markAllRead: string;
    deleteAll: string;
    delete: string;
    deleted: string;
    deletedAll: string;
    failedDelete: string;
    failedDeleteAll: string;
    signInRequired: string;
    deleteSrOnly: string;
  };
  privacy: {
    title: string;
    subtitle: string;
    lastUpdated: string;
    intro: string;
    sections: {
      collect: string;
      use: string;
      sharing: string;
      security: string;
      rights: string;
      retention: string;
    };
    collectContent: string[];
    useContent: string[];
    sharingContent: string[];
    securityContent: string[];
    rightsContent: string[];
    retentionContent: string[];
    contactTitle: string;
    contactDesc: string;
    contactSupport: string;
    footerNote: string;
  };
  success: {
    settingsTitle: string;
    settingsDesc: string;
    supportTitle: string;
    supportDesc: string;
    supportTicketNumber: string;
    saveForRecords: string;
    whatHappensNext: string;
    returnHome: string;
    submitAnother: string;
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
