export type Language = 'en' | 'hi' | 'te' | 'mr';

export interface LanguageLabels {
  en: string;
  hi: string;
  te: string;
  mr: string;
}

export type FieldType = 'text' | 'numeric' | 'dropdown' | 'checkbox' | 'notes' | 'section';

export interface DropdownOption {
  value: string;
  labels: LanguageLabels;
}

export interface Field {
  fieldId: string;
  type: FieldType;
  labels: LanguageLabels;
  placeholders: LanguageLabels;
  options?: DropdownOption[];
  isCritical: boolean;
  glossaryKey?: string;
  unit?: string;
  tooltip?: LanguageLabels;
  defaultValue?: string;
  sectionHeader?: string;
}

export interface PrototypeScreen {
  id: string;
  name: string;
  type: 'OPD' | 'PRESCRIPTION' | 'REFERRAL';
  description: string;
  fields: Field[];
  createdAt: string;
  updatedAt: string;
}

export interface PatientInfo {
  name: string;
  age: number;
  gender: string;
  uhid: string;
  complaintSummary: string;
}

export interface TestTask {
  id: string;
  prototypeId: string;
  scenarioTitle: LanguageLabels;
  patient: PatientInfo;
  clinicalInstructions: LanguageLabels;
  expectedAnswers: Record<string, string | number | boolean>;
  targetTimeSeconds: number; // typically 180s benchmark
}

export interface TelemetryEvent {
  id: string;
  sessionId: string;
  fieldId: string;
  eventType: 'focus' | 'blur' | 'change' | 'help_click' | 'submit';
  timestamp: number;
  valueLength?: number;
  backspaceCount?: number;
  extra?: Record<string, unknown>;
}

export interface Feedback {
  id: string;
  sessionId: string;
  language: Language;
  confusingFieldIds: string[];
  confusingTermsFreeText: string;
  easeOfUseRating: number; // 1-5
  additionalComments: string;
  doctorRole?: string;
}

export interface TestSession {
  id: string;
  prototypeId: string;
  taskId: string;
  language: Language;
  codeMixed: boolean;
  doctorIdentifier: string;
  deviceInfo: {
    userAgent: string;
    screenWidth: number;
    simulatedDevice: string;
    textScale: number;
  };
  startedAt: number;
  endedAt: number;
  durationSeconds: number;
  responses: Record<string, string | number | boolean>;
  accuracy: {
    overallAccuracy: number;
    criticalAccuracy: number;
    fieldResults: Record<string, { correct: boolean; userValue: any; expectedValue: any; isCritical: boolean }>;
  };
  telemetry: {
    timeToFirstInteraction: number; // seconds
    fieldDwells: Record<string, number>; // seconds spent focused
    fieldHesitations: Record<string, number>; // seconds from task start to 1st focus
    fieldEdits: Record<string, number>; // keystrokes/backspaces
    helpClicks: Record<string, number>;
    totalEdits: number;
  };
  feedback?: Feedback;
}

export interface GlossaryTerm {
  id: string;
  key: string;
  en: string;
  hi: string;
  te: string;
  mr: string;
  commonEnglishAbbreviation: string;
  category: 'vitals' | 'symptoms' | 'prescription' | 'referral' | 'admin' | 'lab';
  notes: string;
  recommendedDisplay: string;
}

export interface ValidationRuleResult {
  ruleId: string;
  title: string;
  targetThreshold: string;
  actualMetric: string;
  passed: boolean;
  criticalSeverity: boolean;
}

export interface LocalizationHealthBreakdown {
  performanceScore: number; // P: clamp(100 * (targetTime / avgTaskTime), 0, 100)
  accuracyScore: number;    // A: 100 * avgCriticalFieldAccuracy
  hesitationScore: number;  // H: clamp(100 * (targetHesitation / avgHesitation), 0, 100)
  terminologyScore: number; // T: 100 - (fieldsFlaggedByUsers / totalFields) * 100
  userRatingScore: number;  // U: 25 * (avgEaseOfUseRating - 1)
  compositeScore: number;   // 0.25*P + 0.25*A + 0.2*H + 0.2*T + 0.1*U
}

export interface ScorecardMetrics {
  prototypeId: string;
  prototypeName: string;
  prototypeType: string;
  filterLanguage: Language | 'all';
  sampleSize: number;
  avgTaskTimeSeconds: number;
  pctTasksUnderThreshold: number;
  avgCriticalFieldAccuracyPct: number;
  avgOverallAccuracyPct: number;
  avgHesitationPerCriticalFieldSeconds: number;
  avgDwellTimePerFieldSeconds: number;
  fieldsFlaggedCount: number;
  fieldsFlaggedPct: number;
  avgEaseOfUseRating: number;
  healthScore: LocalizationHealthBreakdown;
  clearanceStatus: 'PASS' | 'CONDITIONAL PASS' | 'FAIL';
  validationRules: ValidationRuleResult[];
  topConfusingFields: {
    fieldId: string;
    labelEn: string;
    labelTarget: string;
    flagCount: number;
    avgHesitationSec: number;
    avgDwellSec: number;
    suggestion: string;
  }[];
  languageComparisons?: Record<Language, {
    sampleCount: number;
    healthScore: number;
    avgTimeSec: number;
    accuracyPct: number;
    easeRating: number;
  }>;
}
