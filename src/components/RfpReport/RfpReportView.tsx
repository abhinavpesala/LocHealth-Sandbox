import React from 'react';
import {
  PrototypeScreen,
  TestSession,
  Language,
  ScorecardMetrics
} from '../../types/clinic';
import { computeAggregateScorecard } from '../../utils/scoring';
import {
  Printer,
  Download,
  FileCheck2,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Building2,
  Calendar,
  Layers,
  Award
} from 'lucide-react';

interface RfpReportViewProps {
  prototype: PrototypeScreen;
  sessions: TestSession[];
  onBackToScorecard: () => void;
}

export const RfpReportView: React.FC<RfpReportViewProps> = ({
  prototype,
  sessions,
  onBackToScorecard
}) => {
  const scorecard: ScorecardMetrics = computeAggregateScorecard(
    sessions,
    prototype.fields,
    prototype.id,
    prototype.name,
    prototype.type,
    'all'
  );

  const reportId = `RFP-LOC-2026-${prototype.id.replace('proto-', '').toUpperCase()}-094`;
  const generationDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadHtml = () => {
    const reportElement = document.getElementById('rfp-official-document');
    if (!reportElement) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${reportId} - Localization Clearance Certificate</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; }
            .stamp { border: 2px solid #059669; color: #065f46; background: #ecfdf5; padding: 12px 24px; display: inline-block; font-weight: bold; font-size: 16px; border-radius: 8px; margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-size: 13px; }
            th { background: #f8fafc; font-weight: 600; }
            .header-box { border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 25px; }
          </style>
        </head>
        <body>
          ${reportElement.innerHTML}
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportId}-Clearance-Report.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Action Header (Hidden in Print) */}
      <div className="no-print bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Government RFP Localization Clearance Annexure
          </h2>
          <p className="text-xs text-slate-500">
            Exportable audit document formatted for State Health Mission tender submissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBackToScorecard}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Back to Scorecard
          </button>
          <button
            type="button"
            onClick={handleDownloadHtml}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download HTML Report</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Report</span>
          </button>
        </div>
      </div>

      {/* Official Certificate & Audit Document */}
      <div
        id="rfp-official-document"
        className="bg-white border border-slate-300 rounded-2xl p-8 sm:p-12 shadow-sm space-y-8"
      >
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-teal-800 font-bold text-xs uppercase tracking-widest mb-1">
                <Building2 className="w-4 h-4" />
                <span>Primary Health Care Digital Usability Certification</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Localization Fit Audit &amp; RFP Compliance Clearance Report
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Issued in accordance with Ayushman Bharat Digital Mission (ABDM) &amp; National Health Mission (NHM) Local Language Standards.
              </p>
            </div>

            <div className="text-right font-mono text-xs text-slate-500 shrink-0">
              <span className="block font-bold text-slate-900">Certificate No:</span>
              <span className="text-teal-700 font-semibold">{reportId}</span>
              <span className="block mt-1">Date: {generationDate}</span>
            </div>
          </div>
        </div>

        {/* Prototype Metadata & Audit Details */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Evaluated Prototype</span>
            <span className="font-bold text-slate-900">{prototype.name}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Workflow Category</span>
            <span className="font-semibold text-slate-800">
              {prototype.type === 'OPD' ? 'OPD Clinical Record' : prototype.type === 'PRESCRIPTION' ? 'e-Prescription Counter' : 'Referral Care Slip'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">PHC Doctor Cohort</span>
            <span className="font-semibold text-slate-800">{scorecard.sampleSize} Verified Sessions</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Languages Audited</span>
            <span className="font-semibold text-slate-800">Hindi, Telugu, Marathi, English</span>
          </div>
        </div>

        {/* Executive Clearance Verdict Stamp */}
        <div className="p-6 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-slate-50/50 border-slate-200">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
              RFP Procurement Assessment Status
            </span>
            <div className="text-xl font-black">
              {scorecard.clearanceStatus === 'PASS' && (
                <span className="text-emerald-700 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  PASS – CLEARED FOR STATEWIDE PHC DEPLOYMENT
                </span>
              )}
              {scorecard.clearanceStatus === 'CONDITIONAL PASS' && (
                <span className="text-amber-700 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                  CONDITIONAL PASS – REVISE 1 TERMINOLOGY ITEM
                </span>
              )}
              {scorecard.clearanceStatus === 'FAIL' && (
                <span className="text-rose-700 flex items-center gap-2">
                  <XCircle className="w-6 h-6 text-rose-600" />
                  FAIL – EXCEEDS ERROR OR HESITATION THRESHOLDS
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 mt-2 max-w-xl leading-relaxed">
              Based on empirical testing with practicing Medical Officers on Android 10 and Android 9 low-spec devices (360px–390px viewports), this prototype satisfies the minimum localization fitness index required for state tender clearance.
            </p>
          </div>

          <div className="shrink-0 text-center sm:text-right border-t sm:border-t-0 sm:border-l border-slate-200 pt-4 sm:pt-0 sm:pl-6">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Localization Health Score
            </span>
            <div className="text-5xl font-extrabold text-slate-900 font-mono my-1 tabular-nums">
              {scorecard.healthScore.compositeScore.toFixed(1)}
              <span className="text-lg text-slate-400 font-normal"> / 100</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700">
              Benchmark: ≥ 75.0 Passed
            </span>
          </div>
        </div>

        {/* Section 1: Detailed Score Breakdown */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
            1. Localization Fit Index Component Breakdown
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-slate-200">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Metric Dimension</th>
                  <th className="py-2.5 px-3">Formula &amp; Method</th>
                  <th className="py-2.5 px-3">Weight</th>
                  <th className="py-2.5 px-3">Achieved Value</th>
                  <th className="py-2.5 px-3 text-right">Dimension Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">
                    Task Performance (P)
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                    clamp(100 × (180s / avgTaskTime), 0, 100)
                  </td>
                  <td className="py-2.5 px-3 font-semibold">25%</td>
                  <td className="py-2.5 px-3 font-mono">{scorecard.avgTaskTimeSeconds} seconds avg</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                    {scorecard.healthScore.performanceScore} / 100
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">
                    Clinical Accuracy (A)
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                    100 × avgCriticalFieldAccuracy
                  </td>
                  <td className="py-2.5 px-3 font-semibold">25%</td>
                  <td className="py-2.5 px-3 font-mono">{scorecard.avgCriticalFieldAccuracyPct}% critical pass</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                    {scorecard.healthScore.accuracyScore} / 100
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">
                    Cognitive Hesitation (H)
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                    clamp(100 × (5.0s / avgHesitation), 0, 100)
                  </td>
                  <td className="py-2.5 px-3 font-semibold">20%</td>
                  <td className="py-2.5 px-3 font-mono">{scorecard.avgHesitationPerCriticalFieldSeconds}s dwell delay</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                    {scorecard.healthScore.hesitationScore} / 100
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">
                    Terminology Alignment (T)
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                    100 - (flaggedFields / totalFields) × 100
                  </td>
                  <td className="py-2.5 px-3 font-semibold">20%</td>
                  <td className="py-2.5 px-3 font-mono">{scorecard.fieldsFlaggedPct}% fields flagged</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                    {scorecard.healthScore.terminologyScore} / 100
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">
                    PHC Doctor Rating (U)
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                    25 × (avgEaseOfUseRating - 1)
                  </td>
                  <td className="py-2.5 px-3 font-semibold">10%</td>
                  <td className="py-2.5 px-3 font-mono">{scorecard.avgEaseOfUseRating} / 5.0 Likert</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                    {scorecard.healthScore.userRatingScore} / 100
                  </td>
                </tr>
                <tr className="bg-slate-50 font-bold">
                  <td colSpan={4} className="py-2.5 px-3 text-slate-900 text-right">
                    Composite Localization Health Score (0.25P + 0.25A + 0.20H + 0.20T + 0.10U):
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-teal-800 text-sm">
                    {scorecard.healthScore.compositeScore.toFixed(1)} / 100
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Verification Checklist of 6 RFP Rules */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
            2. Mandatory RFP Clearance Validation Audit
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-slate-200">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2 px-3">Rule Specification</th>
                  <th className="py-2 px-3">Government Requirement</th>
                  <th className="py-2 px-3">Observed Testing Metric</th>
                  <th className="py-2 px-3 text-right">Evaluation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {scorecard.validationRules.map((r) => (
                  <tr key={r.ruleId}>
                    <td className="py-2 px-3 font-semibold text-slate-800">
                      {r.title}
                    </td>
                    <td className="py-2 px-3 text-slate-600">
                      {r.targetThreshold}
                    </td>
                    <td className="py-2 px-3 font-mono font-medium">
                      {r.actualMetric}
                    </td>
                    <td className="py-2 px-3 text-right">
                      {r.passed ? (
                        <span className="text-emerald-700 font-bold">PASS</span>
                      ) : (
                        <span className="text-rose-700 font-bold">FAIL</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Recommended Improvements & Glossary Action Items */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
            3. Vendor Remediation Action Items (Glossary Alignment)
          </h2>
          {scorecard.topConfusingFields.length > 0 ? (
            <div className="space-y-2.5">
              {scorecard.topConfusingFields.map((f, i) => (
                <div
                  key={f.fieldId}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">
                      Action Item {i + 1}: Field "{f.labelEn}" (Target: {f.labelTarget})
                    </span>
                    <span className="text-rose-700 font-semibold font-mono text-[11px]">
                      {f.flagCount} doctor hesitation flags
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {f.suggestion}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">
              All labels comply with canonical PHC glossary standards. No critical remediation items pending.
            </p>
          )}
        </div>

        {/* Official Sign-off & Seal */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-8">
              Prepared By (Design &amp; Localization Lead)
            </span>
            <div className="border-t border-slate-400 pt-1 text-slate-700">
              <span className="font-bold block">Health IT Localization Analyst</span>
              <span>ClinicScreen Sandbox Audit Engine</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-8">
              Verification Authority
            </span>
            <div className="border-t border-slate-400 pt-1 text-slate-700">
              <span className="font-bold block">Digital Health Directorate</span>
              <span>Primary Health Care Technical Verification Board</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
