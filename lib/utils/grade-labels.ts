/**
 * Mapping of backend grade types (1, 2, 3) to user-facing labels and weights.
 * Backend: type 1 = 10%, type 2 = 30%, type 3 = 60% of total grading.
 */
export const GRADE_TYPE_1 = "gradeType1" as const;
export const GRADE_TYPE_2 = "gradeType2" as const;
export const GRADE_TYPE_3 = "gradeType3" as const;

export type GradeTypeKey =
  | typeof GRADE_TYPE_1
  | typeof GRADE_TYPE_2
  | typeof GRADE_TYPE_3;

export interface GradeTypeOption {
  key: GradeTypeKey;
  /** Display label (e.g. "Attendance score") */
  label: string;
  /** Weight as percentage of total (10, 30, 60) */
  weightPercent: number;
  /** Backend index 1-based */
  typeIndex: 1 | 2 | 3;
}

export const GRADE_TYPE_OPTIONS: GradeTypeOption[] = [
  {
    key: GRADE_TYPE_1,
    label: "Attendance score",
    weightPercent: 10,
    typeIndex: 1,
  },
  { key: GRADE_TYPE_2, label: "Midterm exam", weightPercent: 30, typeIndex: 2 },
  { key: GRADE_TYPE_3, label: "Final exam", weightPercent: 60, typeIndex: 3 },
];

const BY_KEY: Record<GradeTypeKey, GradeTypeOption> = {
  [GRADE_TYPE_1]: GRADE_TYPE_OPTIONS[0],
  [GRADE_TYPE_2]: GRADE_TYPE_OPTIONS[1],
  [GRADE_TYPE_3]: GRADE_TYPE_OPTIONS[2],
};

const BY_INDEX: Record<1 | 2 | 3, GradeTypeOption> = {
  1: GRADE_TYPE_OPTIONS[0],
  2: GRADE_TYPE_OPTIONS[1],
  3: GRADE_TYPE_OPTIONS[2],
};

/** Get display label for a grade type key (e.g. "Attendance score") */
export function getGradeTypeLabel(key: GradeTypeKey): string {
  return BY_KEY[key].label;
}

/** Get display label with weight (e.g. "Attendance score (10%)") */
export function getGradeTypeLabelWithWeight(key: GradeTypeKey): string {
  const opt = BY_KEY[key];
  return `${opt.label} (${opt.weightPercent}%)`;
}

/** Get weight percentage for a grade type key */
export function getGradeTypeWeight(key: GradeTypeKey): number {
  return BY_KEY[key].weightPercent;
}

/** Get grade type option by 1-based index */
export function getGradeTypeByIndex(index: 1 | 2 | 3): GradeTypeOption {
  return BY_INDEX[index];
}
