import React, { useState, useEffect, useRef } from 'react';
import {
  PrototypeScreen,
  TestTask,
  TestSession,
  TelemetryEvent,
  Language,
  Field
} from '../../types/clinic';
import {
  computeTelemetryMetrics,
  evaluateSessionAccuracy
} from '../../utils/scoring';
import {
  Smartphone,
  Languages,
  Clock,
  Activity,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  ChevronRight,
  Star,
  RefreshCw,
  Sparkles,
  Info
} from 'lucide-react';

interface DoctorTestRunnerProps {
  prototype: PrototypeScreen;
  task: TestTask;
  onSessionComplete: (session: TestSession) => void;
  onNavigateToScorecard: () => void;
}

export const DoctorTestRunner: React.FC<DoctorTestRunnerProps> = ({
  prototype,
  task,
  onSessionComplete,
  onNavigateToScorecard
}) => {
  // Device & Language Settings
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('hi');
  const [codeMixed, setCodeMixed] = useState<boolean>(true);
  const [simulatedDevice, setSimulatedDevice] = useState<'redmi' | 'galaxy' | 'desktop'>('redmi');
  const [textScale, setTextScale] = useState<number>(1.0);

  // Task & Telemetry State
  const [taskStarted, setTaskStarted] = useState<boolean>(false);
  const [taskStartTime, setTaskStartTime] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [formResponses, setFormResponses] = useState<Record<string, any>>({});
  const [telemetryEvents, setTelemetryEvents] = useState<TelemetryEvent[]>([]);
  const [activeTooltipFieldId, setActiveTooltipFieldId] = useState<string | null>(null);

  // Post-Task Feedback Modal State
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [completedSession, setCompletedSession] = useState<TestSession | null>(null);
  const [confusingFieldIds, setConfusingFieldIds] = useState<string[]>([]);
  const [confusingTermsText, setConfusingTermsText] = useState<string>('');
  const [easeOfUseRating, setEaseOfUseRating] = useState<number>(4);
  const [doctorComments, setDoctorComments] = useState<string>('');
  const [doctorRole, setDoctorRole] = useState<string>('Medical Officer (PHC)');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize form default values
  useEffect(() => {
    const defaults: Record<string, any> = {};
    prototype.fields.forEach((f) => {
      if (f.type === 'checkbox') defaults[f.fieldId] = false;
      else defaults[f.fieldId] = '';
    });
    setFormResponses(defaults);
    setTaskStarted(false);
    setElapsedSeconds(0);
    setTelemetryEvents([]);
    setShowFeedbackModal(false);
    setCompletedSession(null);
  }, [prototype, task]);

  // Timer interval for elapsed task time
  useEffect(() => {
    if (taskStarted && !showFeedbackModal && !completedSession) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [taskStarted, showFeedbackModal, completedSession]);

  const handleStartTask = () => {
    const now = Date.now();
    setTaskStartTime(now);
    setTaskStarted(true);
    setElapsedSeconds(0);
    setTelemetryEvents([]);
  };

  const recordTelemetry = (
    fieldId: string,
    eventType: 'focus' | 'blur' | 'change' | 'help_click' | 'submit',
    extra?: Record<string, unknown>
  ) => {
    const ev: TelemetryEvent = {
      id: `te_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      sessionId: `sess_${taskStartTime}`,
      fieldId,
      eventType,
      timestamp: Date.now(),
      extra
    };
    setTelemetryEvents((prev) => [...prev, ev]);
  };

  const handleFieldFocus = (fieldId: string) => {
    recordTelemetry(fieldId, 'focus');
  };

  const handleFieldBlur = (fieldId: string) => {
    recordTelemetry(fieldId, 'blur');
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormResponses((prev) => ({ ...prev, [fieldId]: value }));
    recordTelemetry(fieldId, 'change', {
      valueLength: typeof value === 'string' ? value.length : 1
    });
  };

  const handleHelpClick = (fieldId: string) => {
    setActiveTooltipFieldId((prev) => (prev === fieldId ? null : fieldId));
    recordTelemetry(fieldId, 'help_click');
  };

  const handleSubmitScreen = (e: React.FormEvent) => {
    e.preventDefault();
    const endTime = Date.now();
    recordTelemetry('screen', 'submit');

    // Compute telemetry & accuracy
    const telemetry = computeTelemetryMetrics(
      telemetryEvents,
      taskStartTime,
      prototype.fields
    );
    const accuracy = evaluateSessionAccuracy(
      formResponses,
      task.expectedAnswers,
      prototype.fields
    );

    const session: TestSession = {
      id: `sess_${Date.now()}`,
      prototypeId: prototype.id,
      taskId: task.id,
      language: selectedLanguage,
      codeMixed,
      doctorIdentifier: `PHC Doctor (${doctorRole})`,
      deviceInfo: {
        userAgent: navigator.userAgent,
        screenWidth:
          simulatedDevice === 'redmi'
            ? 390
            : simulatedDevice === 'galaxy'
            ? 360
            : window.innerWidth,
        simulatedDevice:
          simulatedDevice === 'redmi'
            ? 'Xiaomi Redmi 9A (Android 10)'
            : simulatedDevice === 'galaxy'
            ? 'Samsung Galaxy J6 (Android 9)'
            : 'Desktop Responsive Browser',
        textScale
      },
      startedAt: taskStartTime,
      endedAt: endTime,
      durationSeconds: Math.max(1, Math.round((endTime - taskStartTime) / 1000)),
      responses: formResponses,
      accuracy,
      telemetry
    };

    setCompletedSession(session);
    setShowFeedbackModal(true);
  };

  const handleFeedbackSubmit = () => {
    if (!completedSession) return;

    const finalizedSession: TestSession = {
      ...completedSession,
      feedback: {
        id: `fb_${Date.now()}`,
        sessionId: completedSession.id,
        language: selectedLanguage,
        confusingFieldIds,
        confusingTermsFreeText: confusingTermsText,
        easeOfUseRating,
        additionalComments: doctorComments,
        doctorRole
      }
    };

    onSessionComplete(finalizedSession);
    setShowFeedbackModal(false);
  };

  // Resolve localized text for labels based on code-mixed preference
  const resolveFieldLabel = (field: Field): string => {
    let text = field.labels[selectedLanguage] || field.labels.en;
    if (codeMixed && selectedLanguage !== 'en' && field.glossaryKey) {
      // Ensure abbreviations like BP or Sugar are present
      if (field.glossaryKey === 'blood_pressure' && !text.includes('BP')) {
        text = `${text} (BP)`;
      } else if (field.glossaryKey === 'blood_sugar' && !text.includes('Sugar')) {
        text = `${text} (Sugar)`;
      } else if (field.glossaryKey === 'pulse_rate' && !text.includes('Pulse')) {
        text = `${text} (Pulse)`;
      } else if (field.glossaryKey === 'respiratory_rate' && !text.includes('RR')) {
        text = `${text} (RR)`;
      }
    }
    return text;
  };

  const resolvePlaceholder = (field: Field): string => {
    return field.placeholders[selectedLanguage] || field.placeholders.en || '';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Control Strip: Language, Code-Mixing, Device Emulator, Font Scale */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Languages className="w-3.5 h-3.5 text-teal-600" />
              Doctor Language:
            </span>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setSelectedLanguage('hi')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  selectedLanguage === 'hi'
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिन्दी (Hindi)
              </button>
              <button
                type="button"
                onClick={() => setSelectedLanguage('te')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  selectedLanguage === 'te'
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                తెలుగు (Telugu)
              </button>
              <button
                type="button"
                onClick={() => setSelectedLanguage('mr')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  selectedLanguage === 'mr'
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                मराठी (Marathi)
              </button>
              <button
                type="button"
                onClick={() => setSelectedLanguage('en')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  selectedLanguage === 'en'
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Code-mixing toggle */}
          <div className="flex items-center gap-2">
            <label htmlFor="code-mixed-toggle" className="text-xs font-medium text-slate-700 flex items-center gap-1.5 cursor-pointer">
              <input
                id="code-mixed-toggle"
                type="checkbox"
                checked={codeMixed}
                onChange={(e) => setCodeMixed(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
              />
              <span>Code-mix with English abbreviations (BP, Sugar, ANC, OD)</span>
            </label>
          </div>

          {/* Device & Font Scaling Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-slate-400" />
              <label htmlFor="device-select" className="sr-only">Simulated Device</label>
              <select
                id="device-select"
                value={simulatedDevice}
                onChange={(e) => setSimulatedDevice(e.target.value as any)}
                className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5"
              >
                <option value="redmi">Redmi 9A (390px, Android 10)</option>
                <option value="galaxy">Galaxy J6 (360px, Android 9)</option>
                <option value="desktop">Full Screen Responsive</option>
              </select>
            </div>

            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400">Font:</span>
              <button
                type="button"
                onClick={() => setTextScale(1.0)}
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  textScale === 1.0 ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                100%
              </button>
              <button
                type="button"
                onClick={() => setTextScale(1.15)}
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  textScale === 1.15 ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                115%
              </button>
              <button
                type="button"
                onClick={() => setTextScale(1.25)}
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  textScale === 1.25 ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                125%
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Test Arena Split: Instructions / Telemetry Banner on Top, Screen Viewport in Center */}
      <div className="flex flex-col items-center">
        {/* Clinical Scenario Banner */}
        <div className="w-full max-w-3xl bg-amber-50/70 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded">
                  Clinical Scenario
                </span>
                <span className="text-xs font-semibold text-slate-800">
                  {task.scenarioTitle[selectedLanguage] || task.scenarioTitle.en}
                </span>
              </div>
              <p className="text-xs text-amber-950 font-medium leading-relaxed">
                {task.clinicalInstructions[selectedLanguage] || task.clinicalInstructions.en}
              </p>
              <div className="mt-2 text-[11px] text-amber-800 flex items-center gap-3">
                <span>Patient: <strong>{task.patient.name}</strong> ({task.patient.age}y / {task.patient.gender})</span>
                <span aria-hidden="true">·</span>
                <span>UHID: {task.patient.uhid}</span>
                <span aria-hidden="true">·</span>
                <span>Benchmark: ≤ {task.targetTimeSeconds}s</span>
              </div>
            </div>

            {/* Live Timer & Hesitation Telemetry Status */}
            <div className="shrink-0 flex flex-col items-end">
              <div className="flex items-center gap-1.5 bg-white border border-amber-300 px-3 py-1.5 rounded-lg shadow-2xs font-mono font-bold text-amber-900 text-sm">
                <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                <span>{elapsedSeconds}s</span>
              </div>
              <span className="text-[10px] text-amber-700 mt-1 flex items-center gap-1">
                <Activity className="w-3 h-3 text-teal-600" />
                Hesitation Telemetry Active
              </span>
            </div>
          </div>
        </div>

        {/* Start Task Gate or Form Body */}
        {!taskStarted ? (
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
            <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Activity className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-slate-900 mb-2">
              Ready to Begin Doctor Usability Test?
            </h2>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              You will complete this clinical record in{' '}
              <strong>
                {selectedLanguage === 'hi'
                  ? 'हिन्दी (Hindi)'
                  : selectedLanguage === 'te'
                  ? 'తెలుగు (Telugu)'
                  : selectedLanguage === 'mr'
                  ? 'मराठी (Marathi)'
                  : 'English'}
              </strong>
              . The sandbox tracks task completion speed, dwell times, and cognitive hesitation to compute the Localization Fit Score.
            </p>

            <button
              type="button"
              onClick={handleStartTask}
              className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>Start Doctor Test</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Phone/Device Shell Viewport */
          <div
            className={`transition-all duration-200 bg-white border border-slate-300 rounded-3xl shadow-xl overflow-hidden ${
              simulatedDevice === 'redmi'
                ? 'w-[390px] min-h-[640px]'
                : simulatedDevice === 'galaxy'
                ? 'w-[360px] min-h-[600px]'
                : 'w-full max-w-2xl min-h-[500px]'
            }`}
            style={{ fontSize: `${textScale * 100}%` }}
          >
            {/* Simulated Android Status Bar */}
            <div className="bg-slate-900 text-white px-4 py-1.5 flex items-center justify-between text-[11px] font-mono">
              <span>09:41</span>
              <span>PHC e-Health (Android 10)</span>
              <span>4G ● 98%</span>
            </div>

            {/* App Header inside Emulator */}
            <div className="bg-teal-700 text-white px-4 py-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold truncate">
                  {prototype.name}
                </h3>
                <span className="text-[11px] text-teal-100">
                  {prototype.type === 'OPD'
                    ? 'OPD Consultation Slip'
                    : prototype.type === 'PRESCRIPTION'
                    ? 'e-Prescription Slip'
                    : 'Referral Slip'}
                </span>
              </div>
              <span className="text-[10px] bg-teal-800/80 px-2 py-0.5 rounded font-mono uppercase">
                {selectedLanguage}
              </span>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmitScreen} className="p-4 space-y-4">
              {prototype.fields.map((field) => {
                const label = resolveFieldLabel(field);
                const placeholder = resolvePlaceholder(field);
                const isTooltipOpen = activeTooltipFieldId === field.fieldId;

                if (field.type === 'section') {
                  return (
                    <div
                      key={field.fieldId}
                      className="pt-2 pb-1 border-b border-teal-100"
                    >
                      <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                        {label}
                      </span>
                    </div>
                  );
                }

                return (
                  <div key={field.fieldId} className="space-y-1">
                    {/* Field Label & Help Tooltip */}
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor={field.fieldId}
                        className={`text-xs font-semibold text-slate-800 flex items-center gap-1.5 ${
                          selectedLanguage === 'te'
                            ? 'font-indic-te'
                            : selectedLanguage === 'hi' || selectedLanguage === 'mr'
                            ? 'font-indic-hi'
                            : ''
                        }`}
                      >
                        <span>{label}</span>
                        {field.isCritical && (
                          <span className="text-rose-600 font-bold" title="Critical Field">*</span>
                        )}
                        {field.unit && (
                          <span className="text-[11px] font-normal text-slate-400">
                            ({field.unit})
                          </span>
                        )}
                      </label>

                      {field.tooltip && (
                        <button
                          type="button"
                          aria-label={`Show help for ${label}`}
                          onClick={() => handleHelpClick(field.fieldId)}
                          className="text-slate-400 hover:text-teal-600 transition-colors"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Tooltip Content if toggled */}
                    {isTooltipOpen && field.tooltip && (
                      <div className="p-2 bg-teal-50 border border-teal-200 rounded-md text-[11px] text-teal-900 leading-snug">
                        {field.tooltip[selectedLanguage] || field.tooltip.en}
                      </div>
                    )}

                    {/* Input Element based on type */}
                    {field.type === 'text' ? (
                      <input
                        id={field.fieldId}
                        type="text"
                        placeholder={placeholder}
                        value={formResponses[field.fieldId] || ''}
                        onFocus={() => handleFieldFocus(field.fieldId)}
                        onBlur={() => handleFieldBlur(field.fieldId)}
                        onChange={(e) => handleFieldChange(field.fieldId, e.target.value)}
                        className="w-full min-h-[44px] px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    ) : field.type === 'numeric' ? (
                      <input
                        id={field.fieldId}
                        type="number"
                        step="any"
                        placeholder={placeholder}
                        value={formResponses[field.fieldId] ?? ''}
                        onFocus={() => handleFieldFocus(field.fieldId)}
                        onBlur={() => handleFieldBlur(field.fieldId)}
                        onChange={(e) =>
                          handleFieldChange(
                            field.fieldId,
                            e.target.value === '' ? '' : Number(e.target.value)
                          )
                        }
                        className="w-full min-h-[44px] px-3 py-2 text-sm font-mono text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    ) : field.type === 'dropdown' ? (
                      <select
                        id={field.fieldId}
                        value={formResponses[field.fieldId] || ''}
                        onFocus={() => handleFieldFocus(field.fieldId)}
                        onBlur={() => handleFieldBlur(field.fieldId)}
                        onChange={(e) => handleFieldChange(field.fieldId, e.target.value)}
                        className="w-full min-h-[44px] px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      >
                        <option value="">
                          {placeholder || '-- Select --'}
                        </option>
                        {(field.options || []).map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.labels[selectedLanguage] || opt.labels.en}
                          </option>
                        ))}
                      </select>
                    ) : field.type === 'checkbox' ? (
                      <label
                        htmlFor={field.fieldId}
                        className="flex items-center gap-2.5 min-h-[44px] cursor-pointer text-xs font-medium text-slate-800"
                      >
                        <input
                          id={field.fieldId}
                          type="checkbox"
                          checked={!!formResponses[field.fieldId]}
                          onFocus={() => handleFieldFocus(field.fieldId)}
                          onBlur={() => handleFieldBlur(field.fieldId)}
                          onChange={(e) => handleFieldChange(field.fieldId, e.target.checked)}
                          className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
                        />
                        <span>{placeholder || 'Confirm & Enroll'}</span>
                      </label>
                    ) : (
                      <textarea
                        id={field.fieldId}
                        rows={3}
                        placeholder={placeholder}
                        value={formResponses[field.fieldId] || ''}
                        onFocus={() => handleFieldFocus(field.fieldId)}
                        onBlur={() => handleFieldBlur(field.fieldId)}
                        onChange={(e) => handleFieldChange(field.fieldId, e.target.value)}
                        className="w-full min-h-[72px] px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none"
                      />
                    )}
                  </div>
                );
              })}

              {/* Submit CTA (Natural Thumb Zone) */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full min-h-[48px] px-4 py-3 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 active:scale-[0.98] rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {selectedLanguage === 'hi'
                      ? 'रिकॉर्ड सुरक्षित करें (Save OPD Record)'
                      : selectedLanguage === 'te'
                      ? 'రికార్డ్ సేవ్ చేయండి (Save Record)'
                      : selectedLanguage === 'mr'
                      ? 'नोंद सुरक्षित करा (Save Record)'
                      : 'Save & Submit Record'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Post-Task Doctor Feedback Modal */}
      {showFeedbackModal && completedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center gap-2 text-teal-700 font-bold text-base mb-1">
              <CheckCircle2 className="w-5 h-5 text-teal-600" />
              <span>Session Complete – Doctor Usability Survey</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Your task execution time was{' '}
              <strong className="text-slate-900 font-mono">
                {completedSession.durationSeconds}s
              </strong>{' '}
              (Target: ≤ {task.targetTimeSeconds}s). Accuracy score:{' '}
              <strong className="text-slate-900 font-mono">
                {completedSession.accuracy.criticalAccuracy}%
              </strong>.
            </p>

            {/* Question 1: Confusing Terms Checklist */}
            <div className="mb-4">
              <label className="text-xs font-bold text-slate-800 block mb-1">
                1. Which terms or labels on this screen caused hesitation or confusion?
              </label>
              <span className="text-[11px] text-slate-500 block mb-2">
                Select any field where phrasing felt non-local or overly complex:
              </span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                {prototype.fields
                  .filter((f) => f.type !== 'section')
                  .map((f) => {
                    const isChecked = confusingFieldIds.includes(f.fieldId);
                    return (
                      <label
                        key={f.fieldId}
                        className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 p-1 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setConfusingFieldIds([...confusingFieldIds, f.fieldId]);
                            } else {
                              setConfusingFieldIds(
                                confusingFieldIds.filter((id) => id !== f.fieldId)
                              );
                            }
                          }}
                          className="w-4 h-4 text-teal-600 rounded"
                        />
                        <span className="text-slate-800 font-medium">
                          {f.labels[selectedLanguage] || f.labels.en}
                        </span>
                        <span className="text-slate-400 text-[10px]">({f.labels.en})</span>
                      </label>
                    );
                  })}
              </div>
            </div>

            {/* Question 2: Specific Medical Terms Free Text */}
            <div className="mb-4">
              <label htmlFor="confusing-terms-input" className="text-xs font-bold text-slate-800 block mb-1">
                2. Were there any English words or medical terms that should be simplified?
              </label>
              <input
                id="confusing-terms-input"
                type="text"
                placeholder="e.g. 'Respiratory Rate' should be 'साँस दर', or keep 'BP' abbreviation"
                value={confusingTermsText}
                onChange={(e) => setConfusingTermsText(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Question 3: Ease of Use Rating (1-5 Stars) */}
            <div className="mb-4">
              <label className="text-xs font-bold text-slate-800 block mb-1">
                3. Rate the ease of using this screen for your PHC workflow:
              </label>
              <div className="flex items-center gap-2 mt-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setEaseOfUseRating(rating)}
                    className="p-1.5 focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        rating <= easeOfUseRating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-semibold text-slate-700 ml-2">
                  {easeOfUseRating === 5
                    ? 'Excellent – Very familiar'
                    : easeOfUseRating === 4
                    ? 'Good – Usable in OPD'
                    : easeOfUseRating === 3
                    ? 'Average – Minor confusion'
                    : 'Difficult – Needs revision'}
                </span>
              </div>
            </div>

            {/* Doctor Role */}
            <div className="mb-5">
              <label htmlFor="doctor-role-select" className="text-xs font-bold text-slate-800 block mb-1">
                Doctor / Clinical Staff Designation:
              </label>
              <select
                id="doctor-role-select"
                value={doctorRole}
                onChange={(e) => setDoctorRole(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none"
              >
                <option value="Medical Officer (PHC)">Medical Officer (MBBS - PHC)</option>
                <option value="Ayush Medical Officer">AYUSH Medical Officer (BAMS / BHMS)</option>
                <option value="Community Health Officer (CHO)">Community Health Officer (CHO / HWC)</option>
                <option value="Staff Nurse / ANM">Staff Nurse / ANM</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleFeedbackSubmit}
                className="px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors"
              >
                Submit Feedback &amp; View Scorecard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
