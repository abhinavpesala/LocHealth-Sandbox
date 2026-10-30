import React, { useState, useEffect } from 'react';
import { TopNav, ActiveTab } from './components/TopNav';
import { ScreenBuilder } from './components/Builder/ScreenBuilder';
import { DoctorTestRunner } from './components/DoctorTesting/DoctorTestRunner';
import { ScorecardDashboard } from './components/Scorecard/ScorecardDashboard';
import { RfpReportView } from './components/RfpReport/RfpReportView';
import { GlossaryExplorer } from './components/Glossary/GlossaryExplorer';
import {
  INITIAL_PROTOTYPES,
  INITIAL_TASKS,
  INITIAL_TEST_SESSIONS
} from './data/seedData';
import { PrototypeScreen, TestSession, TestTask } from './types/clinic';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  // Load persistent state from localStorage or fall back to seed data
  const [prototypes, setPrototypes] = useState<PrototypeScreen[]>(() => {
    try {
      const saved = localStorage.getItem('clinicscreen_prototypes');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load saved prototypes', e);
    }
    return INITIAL_PROTOTYPES;
  });

  const [currentPrototypeId, setCurrentPrototypeId] = useState<string>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlProto = urlParams.get('proto');
      if (urlProto && INITIAL_PROTOTYPES.some((p) => p.id === urlProto)) {
        return urlProto;
      }
    } catch (e) {
      // ignore
    }
    return INITIAL_PROTOTYPES[0].id;
  });

  const [tasks] = useState<TestTask[]>(INITIAL_TASKS);

  const [sessions, setSessions] = useState<TestSession[]>(() => {
    try {
      const saved = localStorage.getItem('clinicscreen_sessions');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load saved sessions', e);
    }
    return INITIAL_TEST_SESSIONS;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const mode = urlParams.get('mode');
      if (mode === 'doctor-test') return 'testing';
      if (urlParams.get('autostart') === '1') return 'scorecard';
    } catch (e) {
      // ignore
    }
    return 'scorecard';
  });

  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'info';
  } | null>(null);

  // Sync prototypes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('clinicscreen_prototypes', JSON.stringify(prototypes));
    } catch (e) {
      console.error('Failed to persist prototypes', e);
    }
  }, [prototypes]);

  // Sync sessions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('clinicscreen_sessions', JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to persist sessions', e);
    }
  }, [sessions]);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const currentPrototype =
    prototypes.find((p) => p.id === currentPrototypeId) || prototypes[0];

  const currentTask =
    tasks.find((t) => t.prototypeId === currentPrototype.id) || tasks[0];

  const handleSavePrototype = (updated: PrototypeScreen) => {
    setPrototypes((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    showToast(`Saved changes to "${updated.name}"`);
  };

  const handleNewPrototype = () => {
    const newId = `proto_custom_${Date.now()}`;
    const newProto: PrototypeScreen = {
      id: newId,
      name: `New PHC Prototype ${prototypes.length + 1}`,
      type: 'OPD',
      description: 'Custom outpatient prototype for primary health care clinical localization testing.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fields: [
        {
          fieldId: 'vitals_sec',
          type: 'section',
          labels: {
            en: 'Vitals & General Examination',
            hi: 'विटल्स एवं सामान्य जांच',
            te: 'ముఖ్య లక్షణాలు & సాధారణ పరీక్ష',
            mr: 'शारीरिक तपासणी व लक्षणे'
          },
          placeholders: { en: '', hi: '', te: '', mr: '' },
          isCritical: false
        },
        {
          fieldId: 'bp_check',
          type: 'numeric',
          labels: {
            en: 'Blood Pressure - Systolic (BP)',
            hi: 'रक्तचाप - सिस्टोलिक (BP)',
            te: 'రక్తపోటు - సిస్టోలిక్ (BP)',
            mr: 'रक्तदाब - सिस्टॉलिक (BP)'
          },
          placeholders: {
            en: 'e.g. 130',
            hi: 'उदा. 130',
            te: 'ఉదా. 130',
            mr: 'उदा. 130'
          },
          unit: 'mmHg',
          isCritical: true,
          glossaryKey: 'blood_pressure'
        },
        {
          fieldId: 'symptom_notes',
          type: 'notes',
          labels: {
            en: 'Chief Complaints',
            hi: 'मुख्य लक्षण व शिकायत',
            te: 'ప్రధాన లక్షణాలు',
            mr: 'मुख्य तक्रार'
          },
          placeholders: {
            en: 'Enter patient complaint...',
            hi: 'मरीज की शिकायत दर्ज करें...',
            te: 'రోగి సమస్యను నమోదు చేయండి...',
            mr: 'रुग्णाची तक्रार नोंदवा...'
          },
          isCritical: false
        }
      ]
    };

    setPrototypes((prev) => [...prev, newProto]);
    setCurrentPrototypeId(newId);
    setActiveTab('builder');
    showToast(`Created new prototype "${newProto.name}"`);
  };

  const handleSessionComplete = (newSession: TestSession) => {
    setSessions((prev) => [newSession, ...prev]);
    showToast(
      `Doctor usability test recorded! Localization Health Score updated with telemetry.`,
      'success'
    );
    setActiveTab('scorecard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Top Bar Navigation */}
      <TopNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onQuickTest={() => setActiveTab('testing')}
        onNewPrototype={handleNewPrototype}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-blue-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Main Viewport Content based on activeTab */}
      <main className="flex-1 pb-16">
        {activeTab === 'builder' && (
          <ScreenBuilder
            prototypes={prototypes}
            currentPrototypeId={currentPrototypeId}
            onSelectPrototype={(id) => setCurrentPrototypeId(id)}
            onSavePrototype={handleSavePrototype}
            onLaunchTest={(id) => {
              setCurrentPrototypeId(id);
              setActiveTab('testing');
            }}
          />
        )}

        {activeTab === 'testing' && (
          <DoctorTestRunner
            prototype={currentPrototype}
            task={currentTask}
            onSessionComplete={handleSessionComplete}
            onNavigateToScorecard={() => setActiveTab('scorecard')}
          />
        )}

        {activeTab === 'scorecard' && (
          <ScorecardDashboard
            prototypes={prototypes}
            currentPrototypeId={currentPrototypeId}
            onSelectPrototype={(id) => setCurrentPrototypeId(id)}
            sessions={sessions}
            onNavigateToReport={() => setActiveTab('rfp-report')}
            onNavigateToTesting={() => setActiveTab('testing')}
          />
        )}

        {activeTab === 'rfp-report' && (
          <RfpReportView
            prototype={currentPrototype}
            sessions={sessions}
            onBackToScorecard={() => setActiveTab('scorecard')}
          />
        )}

        {activeTab === 'glossary' && <GlossaryExplorer />}
      </main>

      {/* Clean quiet footer */}
      <footer className="no-print border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ClinicScreen Sandbox · Digital Health Localization Testing for Indian PHCs</span>
          <div className="flex items-center gap-3 text-slate-400">
            <span>ABDM &amp; NHM Standard Compliance</span>
            <span aria-hidden="true">·</span>
            <span>Hindi · Telugu · Marathi</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
