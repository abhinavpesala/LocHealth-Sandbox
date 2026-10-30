import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateLocalizationHealthScore,
  evaluateDeploymentClearance,
  evaluateSessionAccuracy,
  computeTelemetryMetrics
} from './scoring';
import { Field } from '../types/clinic';

test('calculateLocalizationHealthScore computes expected weighted composite score', () => {
  // P: target 180s / avg 150s = 100 * (180/150) = clamped to 100
  // A: 95% = 95
  // H: target 5s / avg 4s = 100 * (5/4) = clamped to 100
  // T: 1 flagged out of 10 fields = 10% flagged => T = 90
  // U: rating 4.2 => 25 * (4.2 - 1) = 25 * 3.2 = 80
  // Score = 0.25*100 + 0.25*95 + 0.2*100 + 0.2*90 + 0.1*80
  //       = 25 + 23.75 + 20 + 18 + 8 = 94.75 -> rounded to 94.8
  const result = calculateLocalizationHealthScore({
    avgTaskTimeSeconds: 150,
    targetTimeSeconds: 180,
    avgCriticalFieldAccuracyPct: 95,
    avgHesitationSeconds: 4,
    targetHesitationSeconds: 5,
    fieldsFlaggedCount: 1,
    totalFieldsCount: 10,
    avgEaseOfUseRating: 4.2
  });

  assert.equal(result.performanceScore, 100);
  assert.equal(result.accuracyScore, 95);
  assert.equal(result.hesitationScore, 100);
  assert.equal(result.terminologyScore, 90);
  assert.equal(result.userRatingScore, 80);
  assert.equal(result.compositeScore, 94.8);
});

test('calculateLocalizationHealthScore penalizes slow task time and high hesitation', () => {
  // P: target 180s / avg 360s = 50
  // A: 80% = 80
  // H: target 5s / avg 10s = 50
  // T: 4 out of 10 flagged = 40% flagged => T = 60
  // U: rating 2.5 => 25 * 1.5 = 37.5
  // Score = 0.25*50 + 0.25*80 + 0.2*50 + 0.2*60 + 0.1*37.5
  //       = 12.5 + 20 + 10 + 12 + 3.75 = 58.25 -> 58.3
  const result = calculateLocalizationHealthScore({
    avgTaskTimeSeconds: 360,
    targetTimeSeconds: 180,
    avgCriticalFieldAccuracyPct: 80,
    avgHesitationSeconds: 10,
    targetHesitationSeconds: 5,
    fieldsFlaggedCount: 4,
    totalFieldsCount: 10,
    avgEaseOfUseRating: 2.5
  });

  assert.equal(result.performanceScore, 50);
  assert.equal(result.accuracyScore, 80);
  assert.equal(result.hesitationScore, 50);
  assert.equal(result.terminologyScore, 60);
  assert.equal(result.userRatingScore, 37.5);
  assert.equal(result.compositeScore, 58.3);
});

test('evaluateDeploymentClearance correctly awards PASS when all 6 criteria are met', () => {
  const clearance = evaluateDeploymentClearance({
    avgTaskTimeSeconds: 140,
    pctTasksUnderThreshold: 90,
    avgCriticalFieldAccuracyPct: 96,
    lowestCriticalFieldAccuracyPct: 92,
    avgHesitationPerCriticalFieldSeconds: 3.2,
    fieldsFlaggedPct: 10,
    avgEaseOfUseRating: 4.4,
    compositeScore: 88
  });

  assert.equal(clearance.status, 'PASS');
  assert.equal(clearance.rules.every((r) => r.passed), true);
});

test('evaluateDeploymentClearance fails when critical accuracy is below 90%', () => {
  const clearance = evaluateDeploymentClearance({
    avgTaskTimeSeconds: 140,
    pctTasksUnderThreshold: 90,
    avgCriticalFieldAccuracyPct: 84, // Fails critical rule
    lowestCriticalFieldAccuracyPct: 75,
    avgHesitationPerCriticalFieldSeconds: 3.2,
    fieldsFlaggedPct: 10,
    avgEaseOfUseRating: 4.4,
    compositeScore: 78
  });

  assert.equal(clearance.status, 'FAIL');
  const accuracyRule = clearance.rules.find((r) => r.ruleId === 'RULE-2-ACCURACY');
  assert.equal(accuracyRule?.passed, false);
});

test('evaluateDeploymentClearance yields CONDITIONAL PASS when only one non-critical rule misses and score >= 75', () => {
  const clearance = evaluateDeploymentClearance({
    avgTaskTimeSeconds: 150,
    pctTasksUnderThreshold: 88,
    avgCriticalFieldAccuracyPct: 94,
    lowestCriticalFieldAccuracyPct: 90,
    avgHesitationPerCriticalFieldSeconds: 5.4, // Non-critical rule slightly exceeded
    fieldsFlaggedPct: 12,
    avgEaseOfUseRating: 4.1,
    compositeScore: 82
  });

  assert.equal(clearance.status, 'CONDITIONAL PASS');
});

test('evaluateSessionAccuracy matches numbers within tolerance and case-insensitive strings', () => {
  const fields: Field[] = [
    {
      fieldId: 'bp_systolic',
      type: 'numeric',
      labels: { en: 'BP Systolic', hi: '', te: '', mr: '' },
      placeholders: { en: '', hi: '', te: '', mr: '' },
      isCritical: true
    },
    {
      fieldId: 'drug_name',
      type: 'text',
      labels: { en: 'Drug Name', hi: '', te: '', mr: '' },
      placeholders: { en: '', hi: '', te: '', mr: '' },
      isCritical: true
    },
    {
      fieldId: 'is_emergency',
      type: 'checkbox',
      labels: { en: 'Emergency', hi: '', te: '', mr: '' },
      placeholders: { en: '', hi: '', te: '', mr: '' },
      isCritical: false
    }
  ];

  const expected = {
    bp_systolic: 140,
    drug_name: 'Amlodipine',
    is_emergency: false
  };

  const correctResponses = {
    bp_systolic: 142, // within 5% tolerance
    drug_name: 'amlodipine 5mg', // contains expected
    is_emergency: false
  };

  const evalResult = evaluateSessionAccuracy(correctResponses, expected, fields);
  assert.equal(evalResult.overallAccuracy, 100);
  assert.equal(evalResult.criticalAccuracy, 100);
  assert.equal(evalResult.fieldResults['bp_systolic'].correct, true);
  assert.equal(evalResult.fieldResults['drug_name'].correct, true);
});

test('computeTelemetryMetrics calculates dwell and hesitation from timestamp events', () => {
  const fields: Field[] = [
    {
      fieldId: 'f1',
      type: 'text',
      labels: { en: 'Field 1', hi: '', te: '', mr: '' },
      placeholders: { en: '', hi: '', te: '', mr: '' },
      isCritical: true
    }
  ];

  const taskStart = 10000;
  const events = [
    { id: '1', sessionId: 's1', fieldId: 'f1', eventType: 'focus' as const, timestamp: 12000 }, // 2s hesitation
    { id: '2', sessionId: 's1', fieldId: 'f1', eventType: 'change' as const, timestamp: 13000 },
    { id: '3', sessionId: 's1', fieldId: 'f1', eventType: 'blur' as const, timestamp: 15000 }  // 3s dwell
  ];

  const metrics = computeTelemetryMetrics(events, taskStart, fields);
  assert.equal(metrics.timeToFirstInteraction, 2);
  assert.equal(metrics.fieldHesitations['f1'], 2);
  assert.equal(metrics.fieldDwells['f1'], 3);
  assert.equal(metrics.fieldEdits['f1'], 1);
});
