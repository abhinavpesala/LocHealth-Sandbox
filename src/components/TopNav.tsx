import React from 'react';
import { Stethoscope, Plus, Play, Sparkles } from 'lucide-react';

export type ActiveTab = 'builder' | 'testing' | 'scorecard' | 'rfp-report' | 'glossary';

interface TopNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onQuickTest: () => void;
  onNewPrototype: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onTabChange,
  onQuickTest,
  onNewPrototype
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single element Brand wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold shadow-sm">
              <Stethoscope className="w-5 h-5" />
            </div>
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                onTabChange('scorecard');
              }}
              className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-teal-700 transition-colors"
            >
              ClinicScreen Sandbox
            </a>
          </div>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={() => onTabChange('builder')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                activeTab === 'builder'
                  ? 'border-teal-600 text-teal-700 font-semibold'
                  : 'border-transparent'
              }`}
            >
              Screen Builder
            </button>
            <button
              type="button"
              onClick={() => onTabChange('testing')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                activeTab === 'testing'
                  ? 'border-teal-600 text-teal-700 font-semibold'
                  : 'border-transparent'
              }`}
            >
              Doctor Testing Portal
            </button>
            <button
              type="button"
              onClick={() => onTabChange('scorecard')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                activeTab === 'scorecard'
                  ? 'border-teal-600 text-teal-700 font-semibold'
                  : 'border-transparent'
              }`}
            >
              Localization Fit Scorecard
            </button>
            <button
              type="button"
              onClick={() => onTabChange('rfp-report')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                activeTab === 'rfp-report'
                  ? 'border-teal-600 text-teal-700 font-semibold'
                  : 'border-transparent'
              }`}
            >
              RFP Clearance Report
            </button>
            <button
              type="button"
              onClick={() => onTabChange('glossary')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                activeTab === 'glossary'
                  ? 'border-teal-600 text-teal-700 font-semibold'
                  : 'border-transparent'
              }`}
            >
              PHC Medical Glossary
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-2.5 shrink-0">
            {activeTab !== 'testing' ? (
              <button
                type="button"
                onClick={onQuickTest}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch Doctor Test</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onNewPrototype}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Prototype</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Horizontal Navigation Scroller */}
      <div className="md:hidden border-t border-slate-100 overflow-x-auto py-2 px-4 flex items-center gap-2 bg-slate-50/50">
        <button
          type="button"
          onClick={() => onTabChange('scorecard')}
          className={`px-3 py-1 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 transition-colors ${
            activeTab === 'scorecard'
              ? 'bg-teal-700 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          Scorecard
        </button>
        <button
          type="button"
          onClick={() => onTabChange('builder')}
          className={`px-3 py-1 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 transition-colors ${
            activeTab === 'builder'
              ? 'bg-teal-700 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          Screen Builder
        </button>
        <button
          type="button"
          onClick={() => onTabChange('testing')}
          className={`px-3 py-1 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 transition-colors ${
            activeTab === 'testing'
              ? 'bg-teal-700 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          Doctor Test
        </button>
        <button
          type="button"
          onClick={() => onTabChange('rfp-report')}
          className={`px-3 py-1 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 transition-colors ${
            activeTab === 'rfp-report'
              ? 'bg-teal-700 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          RFP Report
        </button>
        <button
          type="button"
          onClick={() => onTabChange('glossary')}
          className={`px-3 py-1 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 transition-colors ${
            activeTab === 'glossary'
              ? 'bg-teal-700 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          Glossary
        </button>
      </div>
    </header>
  );
};
