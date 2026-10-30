import React, { useState } from 'react';
import {
  PrototypeScreen,
  Field,
  FieldType,
  Language,
  LanguageLabels
} from '../../types/clinic';
import { PHC_GLOSSARY, findGlossaryTermByKey } from '../../utils/glossary';
import {
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Link2,
  Play,
  Save,
  CheckCircle2,
  AlertTriangle,
  MoveVertical
} from 'lucide-react';

interface ScreenBuilderProps {
  prototypes: PrototypeScreen[];
  currentPrototypeId: string;
  onSelectPrototype: (id: string) => void;
  onSavePrototype: (prototype: PrototypeScreen) => void;
  onLaunchTest: (prototypeId: string) => void;
}

export const ScreenBuilder: React.FC<ScreenBuilderProps> = ({
  prototypes,
  currentPrototypeId,
  onSelectPrototype,
  onSavePrototype,
  onLaunchTest
}) => {
  const currentProto =
    prototypes.find((p) => p.id === currentPrototypeId) || prototypes[0];

  const [activeProto, setActiveProto] = useState<PrototypeScreen>(currentProto);
  const [selectedFieldId, setSelectedFieldId] = useState<string>(
    currentProto?.fields[1]?.fieldId || currentProto?.fields[0]?.fieldId || ''
  );
  const [previewLanguage, setPreviewLanguage] = useState<Language>('hi');
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Sync if currentPrototypeId changes from outside
  React.useEffect(() => {
    const found = prototypes.find((p) => p.id === currentPrototypeId);
    if (found) {
      setActiveProto(found);
      if (found.fields.length > 0) {
        setSelectedFieldId(found.fields[0].fieldId);
      }
    }
  }, [currentPrototypeId, prototypes]);

  const selectedField = activeProto.fields.find(
    (f) => f.fieldId === selectedFieldId
  );

  const handleUpdateField = (updated: Field) => {
    setActiveProto((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      fields: prev.fields.map((f) =>
        f.fieldId === updated.fieldId ? updated : f
      )
    }));
  };

  const handleAddField = (type: FieldType) => {
    const newId = `field_${Date.now()}`;
    const newField: Field = {
      fieldId: newId,
      type,
      labels: {
        en: type === 'section' ? 'New Section Header' : 'New Field Label',
        hi: type === 'section' ? 'नया अनुभाग शीर्षक' : 'नया फ़ील्ड लेबल',
        te: type === 'section' ? 'కొత్త విభాగం శీర్షిక' : 'కొత్త ఫీల్డ్ లేబుల్',
        mr: type === 'section' ? 'नवीन विभाग शीर्षक' : 'नवीन फील्ड लेबल'
      },
      placeholders: {
        en: 'Enter value',
        hi: 'मान दर्ज करें',
        te: 'విలువను నమోదు చేయండి',
        mr: 'माहिती भरा'
      },
      isCritical: false
    };

    if (type === 'dropdown') {
      newField.options = [
        {
          value: 'option_1',
          labels: {
            en: 'Standard Option 1',
            hi: 'विकल्प 1',
            te: 'ఎంపిక 1',
            mr: 'पर्याय 1'
          }
        },
        {
          value: 'option_2',
          labels: {
            en: 'Standard Option 2',
            hi: 'विकल्प 2',
            te: 'ఎంపిక 2',
            mr: 'पर्याय 2'
          }
        }
      ];
    }

    setActiveProto((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      fields: [...prev.fields, newField]
    }));
    setSelectedFieldId(newId);
  };

  const handleDeleteField = (fieldId: string) => {
    if (activeProto.fields.length <= 1) return;
    setActiveProto((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      fields: prev.fields.filter((f) => f.fieldId !== fieldId)
    }));
    if (selectedFieldId === fieldId) {
      const remaining = activeProto.fields.filter((f) => f.fieldId !== fieldId);
      if (remaining.length > 0) setSelectedFieldId(remaining[0].fieldId);
    }
  };

  const handleMoveField = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= activeProto.fields.length) return;

    const fieldsCopy = [...activeProto.fields];
    const [moved] = fieldsCopy.splice(index, 1);
    fieldsCopy.splice(targetIndex, 0, moved);

    setActiveProto((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      fields: fieldsCopy
    }));
  };

  const handleDuplicateField = (field: Field) => {
    const dupId = `${field.fieldId}_copy_${Date.now().toString().slice(-4)}`;
    const duplicated: Field = {
      ...field,
      fieldId: dupId,
      labels: {
        en: `${field.labels.en} (Copy)`,
        hi: `${field.labels.hi} (प्रति)`,
        te: `${field.labels.te} (ప్రతి)`,
        mr: `${field.labels.mr} (प्रत)`
      }
    };
    const index = activeProto.fields.findIndex((f) => f.fieldId === field.fieldId);
    const fieldsCopy = [...activeProto.fields];
    fieldsCopy.splice(index + 1, 0, duplicated);

    setActiveProto((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      fields: fieldsCopy
    }));
    setSelectedFieldId(dupId);
  };

  const handleApplyGlossary = (termKey: string) => {
    const term = findGlossaryTermByKey(termKey);
    if (!term || !selectedField) return;

    const updated: Field = {
      ...selectedField,
      glossaryKey: term.key,
      labels: {
        en: term.en,
        hi: term.hi,
        te: term.te,
        mr: term.mr
      }
    };

    handleUpdateField(updated);
  };

  const handleSave = () => {
    onSavePrototype(activeProto);
    setSaveSuccessMsg('Prototype saved successfully. Ready for PHC doctor testing.');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Controls Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <label htmlFor="proto-select" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Prototype:
            </label>
            <select
              id="proto-select"
              value={activeProto.id}
              onChange={(e) => {
                onSelectPrototype(e.target.value);
              }}
              className="text-sm font-semibold text-slate-900 bg-white border border-slate-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {prototypes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.type})
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {activeProto.description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccessMsg && (
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {saveSuccessMsg}
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Generate Test Link</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Screen</span>
          </button>
          <button
            type="button"
            onClick={() => onLaunchTest(activeProto.id)}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Test This Screen</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Layout: Left Palette, Center Canvas, Right Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Column: Field Palette (col-span-2) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Field Palette
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Click to add standardized PHC clinical inputs:
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleAddField('numeric')}
                className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 border border-slate-200 rounded-lg transition-colors flex items-center justify-between"
              >
                <span>Numeric (Vitals)</span>
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleAddField('text')}
                className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 border border-slate-200 rounded-lg transition-colors flex items-center justify-between"
              >
                <span>Text Input</span>
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleAddField('dropdown')}
                className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 border border-slate-200 rounded-lg transition-colors flex items-center justify-between"
              >
                <span>Dropdown List</span>
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleAddField('checkbox')}
                className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 border border-slate-200 rounded-lg transition-colors flex items-center justify-between"
              >
                <span>Checkbox / Flag</span>
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleAddField('notes')}
                className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 border border-slate-200 rounded-lg transition-colors flex items-center justify-between"
              >
                <span>Clinical Notes</span>
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleAddField('section')}
                className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 border border-slate-200 rounded-lg transition-colors flex items-center justify-between"
              >
                <span>Section Divider</span>
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-900 block mb-1">
              Localization Standard:
            </span>
            Each field automatically stores English, Hindi, Telugu, and Marathi labels to measure doctor cognitive hesitation on low-end hardware.
          </div>
        </div>

        {/* Center Column: Prototype Canvas (col-span-6) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            {/* Canvas Header & Language Preview Switcher */}
            <div className="flex items-center justify-between gap-4 pb-3 mb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Canvas Preview Mode
                </span>
                <p className="text-xs text-slate-400">
                  Live rendering of non-Latin scripts and layout
                </p>
              </div>

              {/* Language switcher tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                {(['en', 'hi', 'te', 'mr'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setPreviewLanguage(lang)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                      previewLanguage === lang
                        ? 'bg-white text-slate-900 shadow-sm font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {lang === 'en'
                      ? 'English'
                      : lang === 'hi'
                      ? 'हिन्दी'
                      : lang === 'te'
                      ? 'తెలుగు'
                      : 'मराठी'}
                  </button>
                ))}
              </div>
            </div>

            {/* Field Canvas Items */}
            <div className="space-y-3 min-h-[400px]">
              {activeProto.fields.map((field, idx) => {
                const isSelected = field.fieldId === selectedFieldId;
                const labelText = field.labels[previewLanguage] || field.labels.en;
                const placeholderText =
                  field.placeholders[previewLanguage] || field.placeholders.en;

                if (field.type === 'section') {
                  return (
                    <div
                      key={field.fieldId}
                      onClick={() => setSelectedFieldId(field.fieldId)}
                      className={`cursor-pointer p-2.5 rounded-lg border transition-all ${
                        isSelected
                          ? 'border-teal-500 bg-teal-50/50 ring-1 ring-teal-500'
                          : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                          § {labelText}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            aria-label="Move up"
                            disabled={idx === 0}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveField(idx, 'up');
                            }}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            aria-label="Move down"
                            disabled={idx === activeProto.fields.length - 1}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveField(idx, 'down');
                            }}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            aria-label="Delete field"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteField(field.fieldId);
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={field.fieldId}
                    onClick={() => setSelectedFieldId(field.fieldId)}
                    className={`cursor-pointer p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/30 ring-2 ring-teal-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <label
                          className={`text-sm font-semibold text-slate-900 ${
                            previewLanguage === 'te'
                              ? 'font-indic-te'
                              : previewLanguage === 'hi' || previewLanguage === 'mr'
                              ? 'font-indic-hi'
                              : ''
                          }`}
                        >
                          {labelText}
                        </label>
                        {field.isCritical && (
                          <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                            Critical (Strict Validation)
                          </span>
                        )}
                        {field.unit && (
                          <span className="text-xs text-slate-400">[{field.unit}]</span>
                        )}
                      </div>

                      {/* Field Action Buttons */}
                      <div className="flex items-center gap-0.5">
                        <button
                          type="button"
                          aria-label="Move up"
                          disabled={idx === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveField(idx, 'up');
                          }}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          aria-label="Move down"
                          disabled={idx === activeProto.fields.length - 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveField(idx, 'down');
                          }}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          aria-label="Duplicate field"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateField(field);
                          }}
                          className="p-1 text-slate-400 hover:text-slate-700"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          aria-label="Delete field"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteField(field.fieldId);
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Low-Fidelity Mock Visual */}
                    {field.type === 'text' || field.type === 'numeric' ? (
                      <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-400">
                        {placeholderText || 'Mock input field'}
                      </div>
                    ) : field.type === 'dropdown' ? (
                      <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500 flex justify-between items-center">
                        <span>{placeholderText || 'Select option...'}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    ) : field.type === 'checkbox' ? (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <div className="w-4 h-4 border border-slate-300 rounded bg-white" />
                        <span>Enabled / Active Flag</span>
                      </div>
                    ) : (
                      <div className="w-full h-16 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-400">
                        {placeholderText || 'Clinical notes area...'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Properties Inspector & Glossary Suggester (col-span-4) */}
        <div className="lg:col-span-4 space-y-4">
          {selectedField ? (
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Field Inspector
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {selectedField.fieldId}
                </span>
              </div>

              {/* Glossary Suggester Card */}
              <div className="bg-teal-50/60 border border-teal-200 rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-900 mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  <span>PHC Multilingual Glossary Match</span>
                </div>
                <p className="text-[11px] text-teal-800 mb-2">
                  Standardized terminology prevents doctor hesitation and passes RFP procurement rules.
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {PHC_GLOSSARY.slice(0, 6).map((term) => (
                    <button
                      key={term.id}
                      type="button"
                      onClick={() => handleApplyGlossary(term.key)}
                      className="text-[11px] px-2 py-0.5 rounded bg-white border border-teal-300 text-teal-800 hover:bg-teal-600 hover:text-white transition-colors"
                    >
                      {term.en} ({term.commonEnglishAbbreviation})
                    </button>
                  ))}
                </div>
              </div>

              {/* Critical Field Toggle */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <label htmlFor="critical-toggle" className="text-xs font-semibold text-slate-900 block">
                    Critical Field (RFP Validation)
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Mandates ≥ 90% accuracy &amp; ≤ 5s hesitation
                  </span>
                </div>
                <input
                  id="critical-toggle"
                  type="checkbox"
                  checked={selectedField.isCritical}
                  onChange={(e) =>
                    handleUpdateField({
                      ...selectedField,
                      isCritical: e.target.checked
                    })
                  }
                  className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                />
              </div>

              {/* Multilingual Labels */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-700 block">
                  Multilingual Labels
                </label>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-slate-600">English (Required)</span>
                  </div>
                  <input
                    type="text"
                    value={selectedField.labels.en}
                    onChange={(e) =>
                      handleUpdateField({
                        ...selectedField,
                        labels: { ...selectedField.labels, en: e.target.value }
                      })
                    }
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-slate-600">Hindi (हिन्दी)</span>
                    <span className="text-[10px] text-slate-400">Devanagari</span>
                  </div>
                  <input
                    type="text"
                    value={selectedField.labels.hi}
                    onChange={(e) =>
                      handleUpdateField({
                        ...selectedField,
                        labels: { ...selectedField.labels, hi: e.target.value }
                      })
                    }
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-indic-hi focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-slate-600">Telugu (తెలుగు)</span>
                    <span className="text-[10px] text-slate-400">Telugu Script</span>
                  </div>
                  <input
                    type="text"
                    value={selectedField.labels.te}
                    onChange={(e) =>
                      handleUpdateField({
                        ...selectedField,
                        labels: { ...selectedField.labels, te: e.target.value }
                      })
                    }
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-indic-te focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-slate-600">Marathi (मराठी)</span>
                    <span className="text-[10px] text-slate-400">Devanagari</span>
                  </div>
                  <input
                    type="text"
                    value={selectedField.labels.mr}
                    onChange={(e) =>
                      handleUpdateField({
                        ...selectedField,
                        labels: { ...selectedField.labels, mr: e.target.value }
                      })
                    }
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-indic-mr focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Unit Specification */}
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">
                  Measurement Unit (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. mmHg, mg/dL, bpm, days"
                  value={selectedField.unit || ''}
                  onChange={(e) =>
                    handleUpdateField({
                      ...selectedField,
                      unit: e.target.value
                    })
                  }
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              {/* Dropdown Options Editor (if dropdown) */}
              {selectedField.type === 'dropdown' && selectedField.options && (
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">
                      Dropdown Options
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const newOpt = {
                          value: `opt_${Date.now()}`,
                          labels: {
                            en: 'New Option',
                            hi: 'नया विकल्प',
                            te: 'కొత్త ఎంపిక',
                            mr: 'नवीन पर्याय'
                          }
                        };
                        handleUpdateField({
                          ...selectedField,
                          options: [...(selectedField.options || []), newOpt]
                        });
                      }}
                      className="text-[11px] text-teal-600 hover:text-teal-700 font-medium"
                    >
                      + Add Option
                    </button>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {selectedField.options.map((opt, oIdx) => (
                      <div
                        key={opt.value}
                        className="p-2 bg-slate-50 rounded border border-slate-200 text-xs space-y-1"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-slate-800">
                            Option {oIdx + 1}
                          </span>
                          <button
                            type="button"
                            aria-label={`Remove option ${oIdx + 1}`}
                            onClick={() => {
                              const opts = (selectedField.options || []).filter(
                                (_, idx) => idx !== oIdx
                              );
                              handleUpdateField({
                                ...selectedField,
                                options: opts
                              });
                            }}
                            className="text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={opt.labels.en}
                          onChange={(e) => {
                            const opts = [...(selectedField.options || [])];
                            opts[oIdx] = {
                              ...opts[oIdx],
                              labels: { ...opts[oIdx].labels, en: e.target.value }
                            };
                            handleUpdateField({
                              ...selectedField,
                              options: opts
                            });
                          }}
                          placeholder="English label"
                          className="w-full text-[11px] px-2 py-1 border border-slate-300 rounded bg-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-500">
              Select a field from the canvas to edit its properties, multilingual labels, and glossary matches.
            </div>
          )}
        </div>
      </div>

      {/* Share Test Link Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Share Prototype Test Link
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Send this link to PHC doctors to test on low-end Android devices. Telemetry and cognitive hesitation are recorded automatically.
            </p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 break-all select-all mb-4">
              {window.location.origin}?proto={activeProto.id}&amp;mode=doctor-test
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(
                    `${window.location.origin}?proto=${activeProto.id}&mode=doctor-test`
                  );
                  alert('Test link copied to clipboard!');
                  setShowShareModal(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
              >
                Copy Link
              </button>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
