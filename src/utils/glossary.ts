import { GlossaryTerm, Language } from '../types/clinic';

export const PHC_GLOSSARY: GlossaryTerm[] = [
  {
    id: 'gloss-bp',
    key: 'blood_pressure',
    en: 'Blood Pressure',
    hi: 'रक्तचाप (BP)',
    te: 'రక్తపోటు (BP)',
    mr: 'रक्तदाब (BP)',
    commonEnglishAbbreviation: 'BP',
    category: 'vitals',
    notes: 'Always retain "BP" in brackets. Low-literacy doctors and staff are accustomed to the abbreviation BP alongside local script.',
    recommendedDisplay: 'BP (रक्तचाप / రక్తపోటు / रक्तदाब)'
  },
  {
    id: 'gloss-sugar',
    key: 'blood_sugar',
    en: 'Blood Sugar / Glucose',
    hi: 'ब्लड शुगर (रक्त शर्करा)',
    te: 'రక్తంలో చక్కెర (Sugar)',
    mr: 'रक्तातील साखर (Sugar)',
    commonEnglishAbbreviation: 'Sugar / RBS / FBS',
    category: 'vitals',
    notes: 'Do not use purely archaic words like "मधुमेह शर्करा" without "Sugar" or "RBS". Code-mixed term improves speed by 40%.',
    recommendedDisplay: 'Blood Sugar (FBS/PPBS)'
  },
  {
    id: 'gloss-pulse',
    key: 'pulse_rate',
    en: 'Pulse Rate',
    hi: 'नाड़ी दर (Pulse)',
    te: 'నాడీ వేగం (Pulse)',
    mr: 'नाडी दर (Pulse)',
    commonEnglishAbbreviation: 'Pulse / PR',
    category: 'vitals',
    notes: 'Unit should be beats/min (प्रति मिनट).',
    recommendedDisplay: 'Pulse (नाड़ी / నాడీ)'
  },
  {
    id: 'gloss-resp',
    key: 'respiratory_rate',
    en: 'Respiratory Rate',
    hi: 'साँस लेने की दर (RR)',
    te: 'శ్వాస రేటు (RR)',
    mr: 'श्वासोच्छ्वास दर (RR)',
    commonEnglishAbbreviation: 'RR',
    category: 'vitals',
    notes: 'Pure English "Respiratory Rate" causes high dwell time (>12s). Include "साँस" or "శ్వాస".',
    recommendedDisplay: 'RR (साँस दर / శ్వాస రేటు)'
  },
  {
    id: 'gloss-temp',
    key: 'body_temperature',
    en: 'Body Temperature',
    hi: 'शरीर का तापमान (Temp)',
    te: 'శరీర ఉష్ణోగ్రత (Temp)',
    mr: 'शरीराचे तापमान (Temp)',
    commonEnglishAbbreviation: 'Temp',
    category: 'vitals',
    notes: 'Specify scale: °F or °C clearly.',
    recommendedDisplay: 'Temperature (°F)'
  },
  {
    id: 'gloss-spo2',
    key: 'spo2',
    en: 'Oxygen Saturation (SpO2)',
    hi: 'ऑक्सीजन स्तर (SpO2)',
    te: 'ఆక్సిజన్ స్థాయి (SpO2)',
    mr: 'ऑक्सिजन पातळी (SpO2)',
    commonEnglishAbbreviation: 'SpO2',
    category: 'vitals',
    notes: 'Keep SpO2 token visible. Never transliterate to pure vernacular without token.',
    recommendedDisplay: 'SpO2 (%)'
  },
  {
    id: 'gloss-complaint',
    key: 'chief_complaint',
    en: 'Chief Complaint & Symptoms',
    hi: 'मुख्य लक्षण / समस्या (Chief Complaint)',
    te: 'ప్రధాన లక్షణాలు / సమస్య (Chief Complaint)',
    mr: 'मुख्य तक्रार व लक्षणे (Chief Complaint)',
    commonEnglishAbbreviation: 'C/C',
    category: 'symptoms',
    notes: 'Avoid legalistic translations of "complaint" like "अभियोग". Use "लक्षण" or "లక్షణాలు".',
    recommendedDisplay: 'Chief Complaints (लक्षणे / లక్షణాలు)'
  },
  {
    id: 'gloss-diagnosis',
    key: 'diagnosis',
    en: 'Clinical Diagnosis',
    hi: 'रोग निदान / बीमारी का नाम (Diagnosis)',
    te: 'వ్యాధి నిర్ధారణ (Diagnosis)',
    mr: 'रोग निदान (Diagnosis)',
    commonEnglishAbbreviation: 'Dx',
    category: 'symptoms',
    notes: 'Doctors commonly write diagnosis in English (Hypertension, T2DM, Viral Fever). Provide English search alongside local category names.',
    recommendedDisplay: 'Diagnosis (Dx / निदान)'
  },
  {
    id: 'gloss-medicine',
    key: 'medicine_name',
    en: 'Medicine Name & Dosage',
    hi: 'दवा का नाम एवं मात्रा (Rx)',
    te: 'మందు పేరు & మోతాదు (Rx)',
    mr: 'औषधाचे नाव व डोस (Rx)',
    commonEnglishAbbreviation: 'Rx',
    category: 'prescription',
    notes: 'Generic drug names must remain in English (e.g. Paracetamol, Metformin) with local dosage instructions.',
    recommendedDisplay: 'Medicine / Rx (दवा / మందు)'
  },
  {
    id: 'gloss-frequency',
    key: 'dosage_frequency',
    en: 'Dosage Frequency',
    hi: 'खुराक की आवृत्ति (OD/BD/TDS - कितनी बार)',
    te: 'మోతాదు వేళలు (OD/BD/TDS - ఎన్నిసార్లు)',
    mr: 'डोस वारंवारता (OD/BD/TDS)',
    commonEnglishAbbreviation: 'OD / BD / TDS / QID',
    category: 'prescription',
    notes: 'Preserve standard Latin abbreviations OD (once daily), BD (twice daily), TDS (thrice daily) as doctors instinctively tap these.',
    recommendedDisplay: 'Frequency (OD / BD / TDS)'
  },
  {
    id: 'gloss-duration',
    key: 'treatment_duration',
    en: 'Duration of Course (Days)',
    hi: 'दवा लेने के दिन (अवधि - कितने दिन)',
    te: 'వాడవలసిన రోజుల సంఖ్య (వ్యవధి)',
    mr: 'औषध घेण्याचे दिवस (कालावधी)',
    commonEnglishAbbreviation: 'Days',
    category: 'prescription',
    notes: 'Numeric input with default unit "दिन / రోజులు / Days".',
    recommendedDisplay: 'Duration (Days / दिन / రోజులు)'
  },
  {
    id: 'gloss-anc',
    key: 'antenatal_care',
    en: 'Antenatal Care (ANC)',
    hi: 'प्रसव पूर्व जांच (ANC)',
    te: 'ప్రసవ పూర్వ తనిఖీ (ANC)',
    mr: 'प्रसूतीपूर्व तपासणी (ANC)',
    commonEnglishAbbreviation: 'ANC',
    category: 'symptoms',
    notes: 'ANC is universally recognized in Indian public health (ASHA, ANM, MO).',
    recommendedDisplay: 'ANC Visit (प्रसव पूर्व)'
  },
  {
    id: 'gloss-hb',
    key: 'hemoglobin',
    en: 'Hemoglobin (Hb / HbA1c)',
    hi: 'हीमोग्लोबिन स्तर (Hb / HbA1c)',
    te: 'హిమోగ్లోబిన్ స్థాయి (Hb / HbA1c)',
    mr: 'हिमोग्लोबिन पातळी (Hb / HbA1c)',
    commonEnglishAbbreviation: 'Hb / HbA1c',
    category: 'lab',
    notes: 'Always show g/dL unit. Critical for severe anemia screening in pregnant women (<7 g/dL).',
    recommendedDisplay: 'Hemoglobin (Hb g/dL)'
  },
  {
    id: 'gloss-referral-reason',
    key: 'referral_reason',
    en: 'Reason for Referral',
    hi: 'रेफर करने का कारण (Referral Reason)',
    te: 'రెఫరల్ చేయుటకు కారణం (Referral Reason)',
    mr: 'रेफर करण्याचे कारण (Referral Reason)',
    commonEnglishAbbreviation: 'Ref Reason',
    category: 'referral',
    notes: 'Essential field for referral slips to CHC / Sub-district / District Hospital.',
    recommendedDisplay: 'Referral Reason (रेफरल कारण)'
  },
  {
    id: 'gloss-facility',
    key: 'referred_facility',
    en: 'Referred Facility Level',
    hi: 'रेफरल अस्पताल स्तर (CHC / District Hospital)',
    te: 'రెఫరల్ ఆసుపత్రి స్థాయి (CHC / District Hospital)',
    mr: 'रेफरल रुग्णालय स्तर (CHC / जिल्हा रुग्णालय)',
    commonEnglishAbbreviation: 'CHC / DH / Medical College',
    category: 'referral',
    notes: 'Dropdown standard tier: CHC, Sub-District Hospital (SDH), District Hospital (DH), Tertiary Medical College.',
    recommendedDisplay: 'Target Facility (CHC / DH)'
  },
  {
    id: 'gloss-emergency',
    key: 'emergency_flag',
    en: 'Emergency / High Risk Flag',
    hi: 'आपातकालीन / उच्च जोखिम (Urgent / Red Flag)',
    te: 'అత్యవసర / అధిక ప్రమాదం (Urgent / Red Flag)',
    mr: 'तातडीचे / उच्च जोखीम (Urgent / Red Flag)',
    commonEnglishAbbreviation: 'Emergency / Red Flag',
    category: 'referral',
    notes: 'High-visibility toggle. Clear red highlight with both local script and "EMERGENCY".',
    recommendedDisplay: 'Urgent / Red Flag (आपातकालीन)'
  },
  {
    id: 'gloss-advice',
    key: 'special_instructions',
    en: 'Advice & Instructions for Patient',
    hi: 'रोगी के लिए विशेष सलाह व निर्देश',
    te: 'రోగికి ప్రత్యేక సూచనలు మరియు సలహా',
    mr: 'रुग्णासाठी सूचना व सल्ला',
    commonEnglishAbbreviation: 'Advice',
    category: 'prescription',
    notes: 'Multi-line notes. Plain vernacular is vital as printed instructions are given to the patient/family.',
    recommendedDisplay: 'Patient Advice (सल्ला / సలహా)'
  }
];

export function findGlossaryTermByKey(key: string): GlossaryTerm | undefined {
  return PHC_GLOSSARY.find((item) => item.key === key || item.id === key);
}

export function searchGlossary(query: string): GlossaryTerm[] {
  const q = query.trim().toLowerCase();
  if (!q) return PHC_GLOSSARY;
  return PHC_GLOSSARY.filter((term) =>
    term.en.toLowerCase().includes(q) ||
    term.hi.toLowerCase().includes(q) ||
    term.te.toLowerCase().includes(q) ||
    term.mr.toLowerCase().includes(q) ||
    term.commonEnglishAbbreviation.toLowerCase().includes(q) ||
    term.key.toLowerCase().includes(q)
  );
}

export function getRecommendedLabel(term: GlossaryTerm, lang: Language, codeMixed: boolean = true): string {
  if (lang === 'en') return term.en;

  const localText = term[lang] || term.en;
  if (!codeMixed || !term.commonEnglishAbbreviation) {
    return localText;
  }

  // If local text already contains the abbreviation, return it
  if (localText.includes(term.commonEnglishAbbreviation)) {
    return localText;
  }

  return `${localText} (${term.commonEnglishAbbreviation})`;
}
