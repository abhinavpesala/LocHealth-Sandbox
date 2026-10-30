import React, { useState } from 'react';
import {
  PrototypeScreen,
  TestSession,
  Language,
  ScorecardMetrics
} from '../../types/clinic';
import { computeAggregateScorecard } from '../../utils/scoring';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Target,
  Activity,
  BookOpen,
  Star,
  FileText,
  Languages,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Smartphone
} from 'lucide-react';

interface ScorecardDashboardProps {
  prototypes: PrototypeScreen[];
  currentPrototypeId: string;
  onSelectPrototype: (id: string) => void;
  sessions: TestSession[];
  onNavigateToReport: () => void;
  onNavigateToTesting: () => void;
}

export const ScorecardDashboard: React.FC<ScorecardDashboardProps> = ({
  prototypes,
  currentPrototypeId,
  onSelectPrototype,
  sessions,
  onNavigateToReport,
  onNavigateToTesting
}) => {
  const [filterLanguage, setFilterLanguage] = useState<Language | 'all'>('all');

  const currentProto =
    prototypes.find((p) => p.id === currentPrototypeId) || prototypes[0];

  const scorecard: ScorecardMetrics = computeAggregateScorecard(
    sessions,
    currentProto.fields,
    currentProto.id,
    currentProto.name,
    currentProto.type,
    filterLanguage
  );

  const getStatusBadge = (status: 'PASS' | 'CONDITIONAL PASS' | 'FAIL') => {
    switch (status) {
      case 'PASS':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            PASS – CLEARED FOR STATEWIDE PILOT
          </span>
        );
      case 'CONDITIONAL PASS':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            CONDITIONAL PASS – MINOR REMEDIATION
          </span>
        );
      case 'FAIL':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-4 h-4 text-rose-700" />
            FAIL – LOCALIZATION DEFECTS DETECTED
          </span>
        );
    }
  };

  const protoSessions = sessions.filter((s) => s.prototypeId === currentProto.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <label htmlFor="scorecard-proto" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Prototype Under Evaluation:
            </label>
            <select
              id="scorecard-proto"
              value={currentProto.id}
              onChange={(e) => onSelectPrototype(e.target.value)}
              className="text-sm font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {prototypes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Evaluated across {scorecard.sampleSize} PHC doctor testing sessions on Android 9/10 hardware.
          </p>
        </div>

        {/* Language Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Cohort:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setFilterLanguage('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                filterLanguage === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Combined Cohort
            </button>
            <button
              type="button"
              onClick={() => setFilterLanguage('hi')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                filterLanguage === 'hi'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिन्दी (Hindi)
            </button>
            <button
              type="button"
              onClick={() => setFilterLanguage('te')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                filterLanguage === 'te'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              తెలుగు (Telugu)
            </button>
            <button
              type="button"
              onClick={() => setFilterLanguage('mr')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                filterLanguage === 'mr'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              मराठी (Marathi)
            </button>
          </div>

          <button
            type="button"
            onClick={onNavigateToReport}
            className="ml-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate RFP Report</span>
          </button>
        </div>
      </div>

      {/* Prominent Hero: Localization Health Score & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Card: 0-100 Overall Score & Deployment Clearance (col-span-5) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Composite Localization Metric
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Benchmark Target ≥ 75.0
              </span>
            </div>

            <div className="flex items-baseline gap-2 my-2">
              <span className="text-6xl font-black tracking-tight text-slate-900 tabular-nums">
                {scorecard.healthScore.compositeScore.toFixed(1)}
              </span>
              <span className="text-xl font-bold text-slate-400">/ 100</span>
            </div>

            <div className="mt-4 mb-5">
              {getStatusBadge(scorecard.clearanceStatus)}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Calculated using the standard Indian Health IT formula:{' '}
              <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                0.25P + 0.25A + 0.20H + 0.20T + 0.10U
              </span>
              . Measures task completion speed, clinical field accuracy, cognitive hesitation dwell, and terminology alignment.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-xs text-slate-500 text-center">
            <div className="p-1.5 bg-slate-50 rounded-lg">
              <span className="block text-[10px] text-slate-400 uppercase">Sessions</span>
              <strong className="text-slate-800">{scorecard.sampleSize}</strong>
            </div>
            <div className="p-1.5 bg-slate-50 rounded-lg">
              <span className="block text-[10px] text-slate-400 uppercase">Avg Time</span>
              <strong className="text-slate-800">{scorecard.avgTaskTimeSeconds}s</strong>
            </div>
            <div className="p-1.5 bg-slate-50 rounded-lg">
              <span className="block text-[10px] text-slate-400 uppercase">Rating</span>
              <strong className="text-slate-800">{scorecard.avgEaseOfUseRating} / 5</strong>
            </div>
          </div>
        </div>

        {/* Right Card: 5 Component Score Breakdown (col-span-7) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Score Component Breakdown
            </span>
            <span className="text-xs text-slate-400">Weighted Mathematical Index</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Component P */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  Task Speed (P - 25%)
                </span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {scorecard.healthScore.performanceScore} / 100
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                <div
                  className="bg-blue-600 h-1.5 rounded-full"
                  style={{ width: `${scorecard.healthScore.performanceScore}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1.5 block">
                Avg {scorecard.avgTaskTimeSeconds}s vs 180s benchmark
              </span>
            </div>

            {/* Component A */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-emerald-600" />
                  Accuracy (A - 25%)
                </span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {scorecard.healthScore.accuracyScore} / 100
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                <div
                  className="bg-emerald-600 h-1.5 rounded-full"
                  style={{ width: `${scorecard.healthScore.accuracyScore}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1.5 block">
                {scorecard.avgCriticalFieldAccuracyPct}% critical clinical accuracy
              </span>
            </div>

            {/* Component H */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-purple-600" />
                  Hesitation (H - 20%)
                </span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {scorecard.healthScore.hesitationScore} / 100
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                <div
                  className="bg-purple-600 h-1.5 rounded-full"
                  style={{ width: `${scorecard.healthScore.hesitationScore}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1.5 block">
                {scorecard.avgHesitationPerCriticalFieldSeconds}s avg hesitation before focus
              </span>
            </div>

            {/* Component T */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                  Glossary Fit (T - 20%)
                </span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {scorecard.healthScore.terminologyScore} / 100
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                <div
                  className="bg-amber-600 h-1.5 rounded-full"
                  style={{ width: `${scorecard.healthScore.terminologyScore}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1.5 block">
                {scorecard.fieldsFlaggedPct}% fields flagged by doctors
              </span>
            </div>

            {/* Component U (full width) */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl sm:col-span-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-teal-600" />
                  Doctor Satisfaction (U - 10%)
                </span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {scorecard.healthScore.userRatingScore} / 100
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                <div
                  className="bg-teal-600 h-1.5 rounded-full"
                  style={{ width: `${scorecard.healthScore.userRatingScore}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1.5 block">
                {scorecard.avgEaseOfUseRating} / 5.0 Doctor Ease-of-Use Rating
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Government RFP Validation Rules Checklist Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              State Health Procurement &amp; RFP Clearance Rules
            </h3>
            <p className="text-xs text-slate-500">
              Evaluates mandatory thresholds required for statewide PHC deployment clearance.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Rule ID &amp; Verification Criterion</th>
                <th className="py-2.5 px-3">Target Threshold</th>
                <th className="py-2.5 px-3">Actual Achieved Metric</th>
                <th className="py-2.5 px-3 text-right">Clearance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {scorecard.validationRules.map((rule) => (
                <tr key={rule.ruleId} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-mono text-[11px] text-slate-400 block">
                      {rule.ruleId}
                    </span>
                    <span className="font-semibold text-slate-800">
                      {rule.title}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-medium">
                    {rule.targetThreshold}
                  </td>
                  <td className="py-3 px-3 font-mono font-medium text-slate-900 tabular-nums">
                    {rule.actualMetric}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {rule.passed ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        PASSED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded text-[11px]">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        FAILED
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Confusing Terms & Glossary Recommendations */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Doctor Hesitation &amp; Terminology Improvement Analysis
            </h3>
            <p className="text-xs text-slate-500">
              Fields with highest cognitive pause time and doctor flags, with automated glossary replacement suggestions.
            </p>
          </div>
        </div>

        {scorecard.topConfusingFields.length > 0 ? (
          <div className="space-y-3">
            {scorecard.topConfusingFields.map((field, idx) => (
              <div
                key={field.fieldId}
                className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col md:flex-row md:items-start justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-900">
                      #{idx + 1}. {field.labelTarget}
                    </span>
                    <span className="text-xs text-slate-400">({field.labelEn})</span>
                    <span className="text-[10px] font-mono bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded border border-rose-200">
                      {field.flagCount} doctor flags
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mt-2 font-medium bg-white p-2.5 rounded-lg border border-slate-200 leading-relaxed">
                    💡 <strong>Remediation Recommendation:</strong> {field.suggestion}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-3 text-right">
                  <div className="text-xs">
                    <span className="text-slate-400 block text-[10px]">Avg Dwell Time</span>
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      {field.avgDwellSec}s
                    </span>
                  </div>
                  <div className="text-xs">
                    <span className="text-slate-400 block text-[10px]">Hesitation</span>
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      {field.avgHesitationSec}s
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
            No severe terminology confusion flagged yet. Terminology score is currently nominal.
          </div>
        )}
      </div>

      {/* Language-Wise Comparison Matrix */}
      {scorecard.languageComparisons && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
            <Languages className="w-4 h-4 text-teal-600" />
            Language Cohort Comparison Matrix
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Cross-script performance metrics to evaluate state-specific localization parity.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { id: 'hi', label: 'हिन्दी (Hindi)' },
              { id: 'te', label: 'తెలుగు (Telugu)' },
              { id: 'mr', label: 'मराठी (Marathi)' },
              { id: 'en', label: 'English' }
            ].map((cohort) => {
              const data = scorecard.languageComparisons![cohort.id as Language];
              return (
                <div
                  key={cohort.id}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <span className="text-xs font-bold text-slate-900 block mb-2">
                    {cohort.label}
                  </span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Health Score:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {data.healthScore} / 100
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Avg Speed:</span>
                      <span className="font-mono text-slate-700">{data.avgTimeSec}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Accuracy:</span>
                      <span className="font-mono text-slate-700">{data.accuracyPct}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Doctor Rating:</span>
                      <span className="font-mono text-slate-700">{data.easeRating} / 5</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200">
                      <span>Doctor Tests:</span>
                      <span>{data.sampleCount}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Doctor Sessions Feed */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900">
            Recent PHC Doctor Test Logs
          </h3>
          <button
            type="button"
            onClick={onNavigateToTesting}
            className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
          >
            <span>Run New Test Session</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {protoSessions.map((session) => (
            <div
              key={session.id}
              className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">
                    {session.doctorIdentifier}
                  </span>
                  <span className="font-mono text-[10px] uppercase bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                    {session.language}
                  </span>
                  {session.codeMixed && (
                    <span className="text-[10px] text-teal-700 font-medium">
                      Code-Mixed
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                  <Smartphone className="w-3 h-3 text-slate-400" />
                  <span>{session.deviceInfo.simulatedDevice}</span>
                  <span aria-hidden="true">·</span>
                  <span>{new Date(session.startedAt).toLocaleDateString()}</span>
                </div>
                {session.feedback?.confusingTermsFreeText && (
                  <p className="mt-1.5 text-slate-700 italic bg-white p-2 rounded border border-slate-100 text-[11px]">
                    "{session.feedback.confusingTermsFreeText}"
                  </p>
                )}
              </div>

              <div className="shrink-0 flex items-center gap-4 text-right">
                <div>
                  <span className="text-slate-400 block text-[10px]">Time Taken</span>
                  <span className="font-mono font-bold text-slate-900">
                    {session.durationSeconds}s
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Accuracy</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {session.accuracy.criticalAccuracy}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Rating</span>
                  <span className="font-mono font-bold text-amber-600">
                    {session.feedback?.easeOfUseRating || 4} ★
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
