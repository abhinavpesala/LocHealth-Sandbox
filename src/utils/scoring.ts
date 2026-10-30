import {
  Field,
  Language,
  LocalizationHealthBreakdown,
  ScorecardMetrics,
  TelemetryEvent,
  TestSession,
  ValidationRuleResult
} from '../types/clinic';
import { PHC_GLOSSARY } from './glossary';

/**
 * Computes dwell times, hesitation before first focus, and edit counts from raw telemetry events.
 */
export function computeTelemetryMetrics(
  events: TelemetryEvent[],
  taskStartTime: number,
  fields: Field[]
): {
  timeToFirstInteraction: number;
  fieldDwells: Record<string, number>;
  fieldHesitations: Record<string, number>;
  fieldEdits: Record<string, number>;
  helpClicks: Record<string, number>;
  totalEdits: number;
} {
  const fieldDwells: Record<string, number> = {};
  const fieldHesitations: Record<string, number> = {};
  const fieldEdits: Record<string, number> = {};
  const helpClicks: Record<string, number> = {};
  let totalEdits = 0;
  let firstInteractionTime: number | null = null;

  // Initialize for all fields
  fields.forEach((f) => {
    fieldDwells[f.fieldId] = 0;
    fieldHesitations[f.fieldId] = 0;
    fieldEdits[f.fieldId] = 0;
    helpClicks[f.fieldId] = 0;
  });

  const focusStartTimestamps: Record<string, number> = {};

  // Sort events chronologically
  const sortedEvents = [...events].sort((a, b) => a.timestamp - b.timestamp);

  for (const ev of sortedEvents) {
    if (!firstInteractionTime && ev.timestamp >= taskStartTime) {
      firstInteractionTime = (ev.timestamp - taskStartTime) / 1000;
    }

    if (ev.eventType === 'focus') {
      focusStartTimestamps[ev.fieldId] = ev.timestamp;
      // If this is the first focus for this field, record hesitation from task start
      if (fieldHesitations[ev.fieldId] === 0) {
        fieldHesitations[ev.fieldId] = Math.max(0, (ev.timestamp - taskStartTime) / 1000);
      }
    } else if (ev.eventType === 'blur') {
      const start = focusStartTimestamps[ev.fieldId];
      if (start) {
        const dwellSec = Math.max(0, (ev.timestamp - start) / 1000);
        fieldDwells[ev.fieldId] = (fieldDwells[ev.fieldId] || 0) + dwellSec;
        delete focusStartTimestamps[ev.fieldId];
      }
    } else if (ev.eventType === 'change') {
      const count = (ev.backspaceCount || 0) + 1;
      fieldEdits[ev.fieldId] = (fieldEdits[ev.fieldId] || 0) + count;
      totalEdits += count;
    } else if (ev.eventType === 'help_click') {
      helpClicks[ev.fieldId] = (helpClicks[ev.fieldId] || 0) + 1;
    }
  }

  return {
    timeToFirstInteraction: firstInteractionTime ?? 0,
    fieldDwells,
    fieldHesitations,
    fieldEdits,
    helpClicks,
    totalEdits
  };
}

/**
 * Checks accuracy of doctor responses against expected answers.
 */
export function evaluateSessionAccuracy(
  responses: Record<string, string | number | boolean>,
  expectedAnswers: Record<string, string | number | boolean>,
  fields: Field[]
): {
  overallAccuracy: number;
  criticalAccuracy: number;
  fieldResults: Record<string, { correct: boolean; userValue: any; expectedValue: any; isCritical: boolean }>;
} {
  const fieldResults: Record<string, { correct: boolean; userValue: any; expectedValue: any; isCritical: boolean }> = {};
  let totalChecked = 0;
  let totalCorrect = 0;
  let criticalChecked = 0;
  let criticalCorrect = 0;

  for (const field of fields) {
    if (field.type === 'section') continue;
    const expected = expectedAnswers[field.fieldId];
    if (expected === undefined) continue;

    const actual = responses[field.fieldId];
    totalChecked++;
    if (field.isCritical) {
      criticalChecked++;
    }

    let isMatch = false;
    if (actual !== undefined && actual !== null && actual !== '') {
      if (typeof expected === 'boolean') {
        isMatch = actual === expected;
      } else if (typeof expected === 'number') {
        const numActual = Number(actual);
        isMatch = !isNaN(numActual) && Math.abs(numActual - expected) <= 0.05 * Math.abs(expected);
      } else {
        const strExpected = String(expected).trim().toLowerCase();
        const strActual = String(actual).trim().toLowerCase();
        // Allow exact match or inclusion (e.g. "Amlodipine 5mg" vs "Amlodipine")
        isMatch = strActual === strExpected || strActual.includes(strExpected) || strExpected.includes(strActual);
      }
    }

    if (isMatch) {
      totalCorrect++;
      if (field.isCritical) {
        criticalCorrect++;
      }
    }

    fieldResults[field.fieldId] = {
      correct: isMatch,
      userValue: actual ?? '',
      expectedValue: expected,
      isCritical: field.isCritical
    };
  }

  const overallAccuracy = totalChecked > 0 ? (totalCorrect / totalChecked) * 100 : 100;
  const criticalAccuracy = criticalChecked > 0 ? (criticalCorrect / criticalChecked) * 100 : 100;

  return {
    overallAccuracy: Math.round(overallAccuracy * 10) / 10,
    criticalAccuracy: Math.round(criticalAccuracy * 10) / 10,
    fieldResults
  };
}

/**
 * Calculates Localization Health Score (0 - 100) using the exact build plan formula:
 * P = clamp(100 * (targetTime / avgTaskTime), 0, 100)
 * A = avgCriticalFieldAccuracy (0 - 100)
 * H = clamp(100 * (targetHesitation / avgHesitation), 0, 100)
 * T = 100 - (fieldsFlagged / totalFields) * 100
 * U = 25 * (avgEaseOfUseRating - 1)
 * Score = 0.25*P + 0.25*A + 0.2*H + 0.2*T + 0.1*U
 */
export function calculateLocalizationHealthScore(params: {
  avgTaskTimeSeconds: number;
  targetTimeSeconds?: number;
  avgCriticalFieldAccuracyPct: number;
  avgHesitationSeconds: number;
  targetHesitationSeconds?: number;
  fieldsFlaggedCount: number;
  totalFieldsCount: number;
  avgEaseOfUseRating: number;
}): LocalizationHealthBreakdown {
  const targetTime = params.targetTimeSeconds ?? 180;
  const targetHesitation = params.targetHesitationSeconds ?? 5.0;

  // Performance Score P
  const avgTime = Math.max(1, params.avgTaskTimeSeconds);
  const performanceScore = Math.min(100, Math.max(0, (targetTime / avgTime) * 100));

  // Accuracy Score A
  const accuracyScore = Math.min(100, Math.max(0, params.avgCriticalFieldAccuracyPct));

  // Hesitation Score H
  const avgHesitation = Math.max(0.1, params.avgHesitationSeconds);
  const hesitationScore = Math.min(100, Math.max(0, (targetHesitation / avgHesitation) * 100));

  // Terminology Score T
  const totalFields = Math.max(1, params.totalFieldsCount);
  const flaggedRatio = params.fieldsFlaggedCount / totalFields;
  const terminologyScore = Math.min(100, Math.max(0, (1 - flaggedRatio) * 100));

  // User Rating Score U (1 to 5 mapped to 0 to 100)
  const clampedRating = Math.min(5, Math.max(1, params.avgEaseOfUseRating));
  const userRatingScore = Math.min(100, Math.max(0, 25 * (clampedRating - 1)));

  // Composite weighted score
  const composite = 0.25 * performanceScore +
                    0.25 * accuracyScore +
                    0.20 * hesitationScore +
                    0.20 * terminologyScore +
                    0.10 * userRatingScore;

  return {
    performanceScore: Math.round(performanceScore * 10) / 10,
    accuracyScore: Math.round(accuracyScore * 10) / 10,
    hesitationScore: Math.round(hesitationScore * 10) / 10,
    terminologyScore: Math.round(terminologyScore * 10) / 10,
    userRatingScore: Math.round(userRatingScore * 10) / 10,
    compositeScore: Math.round(composite * 10) / 10
  };
}

/**
 * Validates deployment clearance against the 6 strict government RFP rules from Section 6.4:
 * 1. Task Time <= 180s & >= 80% under threshold
 * 2. Critical Field Accuracy >= 90% (and no critical field < 80%)
 * 3. Hesitation <= 5s
 * 4. Terminology <= 20% fields flagged
 * 5. User Rating >= 3.5 / 5
 * 6. Health Score >= 75
 */
export function evaluateDeploymentClearance(params: {
  avgTaskTimeSeconds: number;
  pctTasksUnderThreshold: number;
  avgCriticalFieldAccuracyPct: number;
  lowestCriticalFieldAccuracyPct: number;
  avgHesitationPerCriticalFieldSeconds: number;
  fieldsFlaggedPct: number;
  avgEaseOfUseRating: number;
  compositeScore: number;
}): {
  status: 'PASS' | 'CONDITIONAL PASS' | 'FAIL';
  rules: ValidationRuleResult[];
} {
  const rules: ValidationRuleResult[] = [
    {
      ruleId: 'RULE-1-TIME',
      title: 'Task Completion Time',
      targetThreshold: 'Avg ≤ 180s & ≥ 80% under 3 mins',
      actualMetric: `${Math.round(params.avgTaskTimeSeconds)}s (${Math.round(params.pctTasksUnderThreshold)}% passed)`,
      passed: params.avgTaskTimeSeconds <= 180 && params.pctTasksUnderThreshold >= 80,
      criticalSeverity: true
    },
    {
      ruleId: 'RULE-2-ACCURACY',
      title: 'Critical Clinical Accuracy',
      targetThreshold: 'Avg ≥ 90% & min field ≥ 80%',
      actualMetric: `Avg ${Math.round(params.avgCriticalFieldAccuracyPct)}% (lowest ${Math.round(params.lowestCriticalFieldAccuracyPct)}%)`,
      passed: params.avgCriticalFieldAccuracyPct >= 90 && params.lowestCriticalFieldAccuracyPct >= 80,
      criticalSeverity: true
    },
    {
      ruleId: 'RULE-3-HESITATION',
      title: 'Field Hesitation & Cognitive Dwell',
      targetThreshold: 'Avg hesitation per critical field ≤ 5.0s',
      actualMetric: `${params.avgHesitationPerCriticalFieldSeconds.toFixed(1)}s avg dwell`,
      passed: params.avgHesitationPerCriticalFieldSeconds <= 5.0,
      criticalSeverity: false
    },
    {
      ruleId: 'RULE-4-TERMINOLOGY',
      title: 'Terminology & Glossary Alignment',
      targetThreshold: '≤ 20% fields flagged as confusing',
      actualMetric: `${Math.round(params.fieldsFlaggedPct)}% fields flagged`,
      passed: params.fieldsFlaggedPct <= 20,
      criticalSeverity: false
    },
    {
      ruleId: 'RULE-5-SATISFACTION',
      title: 'PHC Doctor Usability Rating',
      targetThreshold: 'Avg Ease of Use ≥ 3.5 / 5.0',
      actualMetric: `${params.avgEaseOfUseRating.toFixed(1)} / 5.0`,
      passed: params.avgEaseOfUseRating >= 3.5,
      criticalSeverity: false
    },
    {
      ruleId: 'RULE-6-HEALTH-SCORE',
      title: 'Overall Localization Health Score',
      targetThreshold: 'Composite Health Score ≥ 75 / 100',
      actualMetric: `${params.compositeScore.toFixed(1)} / 100`,
      passed: params.compositeScore >= 75,
      criticalSeverity: true
    }
  ];

  const failedCount = rules.filter((r) => !r.passed).length;
  const criticalFailed = rules.some((r) => r.criticalSeverity && !r.passed);

  let status: 'PASS' | 'CONDITIONAL PASS' | 'FAIL' = 'PASS';
  if (failedCount === 0) {
    status = 'PASS';
  } else if (params.compositeScore >= 75 && failedCount === 1 && !criticalFailed) {
    status = 'CONDITIONAL PASS';
  } else {
    status = 'FAIL';
  }

  return { status, rules };
}

/**
 * Aggregates multiple TestSessions into a complete ScorecardMetrics structure.
 */
export function computeAggregateScorecard(
  sessions: TestSession[],
  fields: Field[],
  prototypeId: string,
  prototypeName: string,
  prototypeType: string,
  filterLanguage: Language | 'all' = 'all'
): ScorecardMetrics {
  const filteredSessions = filterLanguage === 'all'
    ? sessions.filter((s) => s.prototypeId === prototypeId)
    : sessions.filter((s) => s.prototypeId === prototypeId && s.language === filterLanguage);

  if (filteredSessions.length === 0) {
    // Return baseline empty scorecard
    const health = calculateLocalizationHealthScore({
      avgTaskTimeSeconds: 180,
      avgCriticalFieldAccuracyPct: 100,
      avgHesitationSeconds: 3,
      fieldsFlaggedCount: 0,
      totalFieldsCount: fields.length || 1,
      avgEaseOfUseRating: 4.0
    });
    const clearance = evaluateDeploymentClearance({
      avgTaskTimeSeconds: 180,
      pctTasksUnderThreshold: 100,
      avgCriticalFieldAccuracyPct: 100,
      lowestCriticalFieldAccuracyPct: 100,
      avgHesitationPerCriticalFieldSeconds: 3,
      fieldsFlaggedPct: 0,
      avgEaseOfUseRating: 4.0,
      compositeScore: health.compositeScore
    });

    return {
      prototypeId,
      prototypeName,
      prototypeType,
      filterLanguage,
      sampleSize: 0,
      avgTaskTimeSeconds: 0,
      pctTasksUnderThreshold: 0,
      avgCriticalFieldAccuracyPct: 0,
      avgOverallAccuracyPct: 0,
      avgHesitationPerCriticalFieldSeconds: 0,
      avgDwellTimePerFieldSeconds: 0,
      fieldsFlaggedCount: 0,
      fieldsFlaggedPct: 0,
      avgEaseOfUseRating: 0,
      healthScore: health,
      clearanceStatus: clearance.status,
      validationRules: clearance.rules,
      topConfusingFields: []
    };
  }

  const sampleSize = filteredSessions.length;
  const totalDuration = filteredSessions.reduce((acc, s) => acc + s.durationSeconds, 0);
  const avgTaskTimeSeconds = totalDuration / sampleSize;
  const underThresholdCount = filteredSessions.filter((s) => s.durationSeconds <= 180).length;
  const pctTasksUnderThreshold = (underThresholdCount / sampleSize) * 100;

  const avgCriticalFieldAccuracyPct =
    filteredSessions.reduce((acc, s) => acc + s.accuracy.criticalAccuracy, 0) / sampleSize;
  const avgOverallAccuracyPct =
    filteredSessions.reduce((acc, s) => acc + s.accuracy.overallAccuracy, 0) / sampleSize;

  // Compute per-field accuracy to find lowest critical field accuracy
  const criticalFields = fields.filter((f) => f.isCritical);
  let lowestCriticalFieldAccuracyPct = 100;
  for (const cf of criticalFields) {
    let fieldCorrectCount = 0;
    let fieldTestedCount = 0;
    for (const session of filteredSessions) {
      const res = session.accuracy.fieldResults[cf.fieldId];
      if (res) {
        fieldTestedCount++;
        if (res.correct) fieldCorrectCount++;
      }
    }
    if (fieldTestedCount > 0) {
      const fieldAcc = (fieldCorrectCount / fieldTestedCount) * 100;
      if (fieldAcc < lowestCriticalFieldAccuracyPct) {
        lowestCriticalFieldAccuracyPct = fieldAcc;
      }
    }
  }

  // Hesitation per critical field
  let totalCritHesitation = 0;
  let critHesitationCount = 0;
  let totalDwell = 0;
  let dwellCount = 0;

  filteredSessions.forEach((s) => {
    criticalFields.forEach((cf) => {
      const h = s.telemetry.fieldHesitations[cf.fieldId];
      if (h !== undefined) {
        totalCritHesitation += h;
        critHesitationCount++;
      }
    });

    Object.values(s.telemetry.fieldDwells).forEach((d) => {
      totalDwell += d;
      dwellCount++;
    });
  });

  const avgHesitationPerCriticalFieldSeconds =
    critHesitationCount > 0 ? totalCritHesitation / critHesitationCount : 3.0;
  const avgDwellTimePerFieldSeconds =
    dwellCount > 0 ? totalDwell / dwellCount : 4.0;

  // Confusing fields analysis
  const flaggedCounts: Record<string, number> = {};
  let totalRatings = 0;
  let ratingCount = 0;

  filteredSessions.forEach((s) => {
    if (s.feedback) {
      s.feedback.confusingFieldIds.forEach((fid) => {
        flaggedCounts[fid] = (flaggedCounts[fid] || 0) + 1;
      });
      if (s.feedback.easeOfUseRating > 0) {
        totalRatings += s.feedback.easeOfUseRating;
        ratingCount++;
      }
    }
  });

  const nonSectionFields = fields.filter((f) => f.type !== 'section');
  const distinctFlaggedFields = Object.keys(flaggedCounts).length;
  const fieldsFlaggedPct = nonSectionFields.length > 0
    ? (distinctFlaggedFields / nonSectionFields.length) * 100
    : 0;

  const avgEaseOfUseRating = ratingCount > 0 ? totalRatings / ratingCount : 4.0;

  // Calculate health breakdown
  const healthScore = calculateLocalizationHealthScore({
    avgTaskTimeSeconds,
    avgCriticalFieldAccuracyPct,
    avgHesitationSeconds: avgHesitationPerCriticalFieldSeconds,
    fieldsFlaggedCount: distinctFlaggedFields,
    totalFieldsCount: nonSectionFields.length,
    avgEaseOfUseRating
  });

  const clearance = evaluateDeploymentClearance({
    avgTaskTimeSeconds,
    pctTasksUnderThreshold,
    avgCriticalFieldAccuracyPct,
    lowestCriticalFieldAccuracyPct,
    avgHesitationPerCriticalFieldSeconds,
    fieldsFlaggedPct,
    avgEaseOfUseRating,
    compositeScore: healthScore.compositeScore
  });

  // Top confusing fields ranking with glossary suggestions
  const topConfusingFields = Object.entries(flaggedCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([fid, count]) => {
      const f = fields.find((item) => item.fieldId === fid);
      const labelEn = f ? f.labels.en : fid;
      const labelTarget = f ? (filterLanguage === 'all' ? f.labels.hi : f.labels[filterLanguage]) : fid;

      // Calculate avg hesitation for this field
      let fieldHesSum = 0;
      let fieldDwellSum = 0;
      let fieldSessCount = 0;
      filteredSessions.forEach((s) => {
        if (s.telemetry.fieldHesitations[fid] !== undefined) {
          fieldHesSum += s.telemetry.fieldHesitations[fid];
          fieldDwellSum += s.telemetry.fieldDwells[fid] || 0;
          fieldSessCount++;
        }
      });

      // Glossary suggestion
      const matchingGloss = PHC_GLOSSARY.find(
        (g) => g.key === f?.glossaryKey || g.en.toLowerCase().includes(labelEn.toLowerCase())
      );
      const suggestion = matchingGloss
        ? `Adopt glossary standard: "${matchingGloss.recommendedDisplay}" with token "${matchingGloss.commonEnglishAbbreviation}". ${matchingGloss.notes}`
        : 'Simplify phrasing and add code-mixed English abbreviation for instant doctor recognition.';

      return {
        fieldId: fid,
        labelEn,
        labelTarget,
        flagCount: count,
        avgHesitationSec: fieldSessCount > 0 ? Math.round((fieldHesSum / fieldSessCount) * 10) / 10 : 0,
        avgDwellSec: fieldSessCount > 0 ? Math.round((fieldDwellSum / fieldSessCount) * 10) / 10 : 0,
        suggestion
      };
    });

  // Language comparison breakdown
  const langs: Language[] = ['en', 'hi', 'te', 'mr'];
  const languageComparisons: Record<Language, {
    sampleCount: number;
    healthScore: number;
    avgTimeSec: number;
    accuracyPct: number;
    easeRating: number;
  }> = {} as any;

  langs.forEach((lng) => {
    const langSessions = sessions.filter((s) => s.prototypeId === prototypeId && s.language === lng);
    if (langSessions.length > 0) {
      const lTotalTime = langSessions.reduce((acc, s) => acc + s.durationSeconds, 0) / langSessions.length;
      const lAcc = langSessions.reduce((acc, s) => acc + s.accuracy.criticalAccuracy, 0) / langSessions.length;
      let lRatingSum = 0;
      let lRatingCount = 0;
      langSessions.forEach((s) => {
        if (s.feedback) {
          lRatingSum += s.feedback.easeOfUseRating;
          lRatingCount++;
        }
      });
      const lRating = lRatingCount > 0 ? lRatingSum / lRatingCount : 4.0;
      const lHealth = calculateLocalizationHealthScore({
        avgTaskTimeSeconds: lTotalTime,
        avgCriticalFieldAccuracyPct: lAcc,
        avgHesitationSeconds: 3.5,
        fieldsFlaggedCount: 1,
        totalFieldsCount: nonSectionFields.length,
        avgEaseOfUseRating: lRating
      });

      languageComparisons[lng] = {
        sampleCount: langSessions.length,
        healthScore: lHealth.compositeScore,
        avgTimeSec: Math.round(lTotalTime),
        accuracyPct: Math.round(lAcc * 10) / 10,
        easeRating: Math.round(lRating * 10) / 10
      };
    } else {
      languageComparisons[lng] = {
        sampleCount: 0,
        healthScore: 0,
        avgTimeSec: 0,
        accuracyPct: 0,
        easeRating: 0
      };
    }
  });

  return {
    prototypeId,
    prototypeName,
    prototypeType,
    filterLanguage,
    sampleSize,
    avgTaskTimeSeconds: Math.round(avgTaskTimeSeconds * 10) / 10,
    pctTasksUnderThreshold: Math.round(pctTasksUnderThreshold * 10) / 10,
    avgCriticalFieldAccuracyPct: Math.round(avgCriticalFieldAccuracyPct * 10) / 10,
    avgOverallAccuracyPct: Math.round(avgOverallAccuracyPct * 10) / 10,
    avgHesitationPerCriticalFieldSeconds: Math.round(avgHesitationPerCriticalFieldSeconds * 10) / 10,
    avgDwellTimePerFieldSeconds: Math.round(avgDwellTimePerFieldSeconds * 10) / 10,
    fieldsFlaggedCount: distinctFlaggedFields,
    fieldsFlaggedPct: Math.round(fieldsFlaggedPct * 10) / 10,
    avgEaseOfUseRating: Math.round(avgEaseOfUseRating * 10) / 10,
    healthScore,
    clearanceStatus: clearance.status,
    validationRules: clearance.rules,
    topConfusingFields,
    languageComparisons
  };
}
