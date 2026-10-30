import { PrototypeScreen, TestTask, TestSession } from '../types/clinic';

export const INITIAL_PROTOTYPES: PrototypeScreen[] = [
  {
    id: 'proto-opd-telangana',
    name: 'Telangana PHC - Comprehensive OPD Record v1',
    type: 'OPD',
    description: 'General outpatient department record optimized for Primary Health Centres in Telangana, supporting Telugu, Hindi, and code-mixed medical abbreviations.',
    createdAt: '2026-10-15T09:30:00Z',
    updatedAt: '2026-10-28T14:15:00Z',
    fields: [
      {
        fieldId: 'sec_vitals',
        type: 'section',
        labels: {
          en: 'Patient Vitals & Clinical Examination',
          hi: 'रोगी के महत्वपूर्ण लक्षण (Vitals)',
          te: 'రోగి ముఖ్యమైన లక్షణాలు (Vitals)',
          mr: 'रुग्णाची प्राथमिक लक्षणे (Vitals)'
        },
        placeholders: { en: '', hi: '', te: '', mr: '' },
        isCritical: false
      },
      {
        fieldId: 'bp_systolic',
        type: 'numeric',
        labels: {
          en: 'Blood Pressure - Systolic (BP)',
          hi: 'रक्तचाप - सिस्टोलिक (BP)',
          te: 'రక్తపోటు - సిస్టోలిక్ (BP)',
          mr: 'रक्तदाब - सिस्टॉलिक (BP)'
        },
        placeholders: {
          en: 'e.g. 140',
          hi: 'उदा. 140',
          te: 'ఉదా. 140',
          mr: 'उदा. 140'
        },
        unit: 'mmHg',
        isCritical: true,
        glossaryKey: 'blood_pressure',
        tooltip: {
          en: 'Systolic blood pressure measured via manual or digital cuff',
          hi: 'कफ द्वारा मापा गया सिस्टोलिक रक्तचाप',
          te: 'రక్తపోటు కొలత (సిస్టోలిక్)',
          mr: 'मोजलेला सिस्टॉलिक रक्तदाब'
        }
      },
      {
        fieldId: 'bp_diastolic',
        type: 'numeric',
        labels: {
          en: 'Blood Pressure - Diastolic (BP)',
          hi: 'रक्तचाप - डायस्टोलिक (BP)',
          te: 'రక్తపోటు - డయాస్టోలిక్ (BP)',
          mr: 'रक्तदाब - डायस्टॉलिक (BP)'
        },
        placeholders: {
          en: 'e.g. 90',
          hi: 'उदा. 90',
          te: 'ఉదా. 90',
          mr: 'उदा. 90'
        },
        unit: 'mmHg',
        isCritical: true,
        glossaryKey: 'blood_pressure'
      },
      {
        fieldId: 'pulse_rate',
        type: 'numeric',
        labels: {
          en: 'Pulse Rate (Pulse)',
          hi: 'नाड़ी दर (Pulse)',
          te: 'నాడీ వేగం (Pulse)',
          mr: 'नाडी दर (Pulse)'
        },
        placeholders: {
          en: 'e.g. 78',
          hi: 'उदा. 78',
          te: 'ఉదా. 78',
          mr: 'उदा. 78'
        },
        unit: 'bpm',
        isCritical: false,
        glossaryKey: 'pulse_rate'
      },
      {
        fieldId: 'blood_sugar',
        type: 'numeric',
        labels: {
          en: 'Blood Sugar - Fasting / Random (Sugar)',
          hi: 'ब्लड शुगर (Blood Sugar)',
          te: 'రక్తంలో చక్కెర (Sugar)',
          mr: 'रक्तातील साखर (Sugar)'
        },
        placeholders: {
          en: 'e.g. 180',
          hi: 'उदा. 180',
          te: 'ఉదా. 180',
          mr: 'उदा. 180'
        },
        unit: 'mg/dL',
        isCritical: true,
        glossaryKey: 'blood_sugar'
      },
      {
        fieldId: 'sec_clinical',
        type: 'section',
        labels: {
          en: 'Diagnosis & Clinical Findings',
          hi: 'नैदानिक निष्कर्ष व रोग निदान (Dx)',
          te: 'వ్యాధి నిర్ధారణ వివరాలు (Dx)',
          mr: 'निदान व आजाराचे स्वरूप (Dx)'
        },
        placeholders: { en: '', hi: '', te: '', mr: '' },
        isCritical: false
      },
      {
        fieldId: 'chief_complaint',
        type: 'notes',
        labels: {
          en: 'Chief Complaints & Symptoms',
          hi: 'मुख्य लक्षण व शिकायत (Symptoms)',
          te: 'ప్రధాన లక్షణాలు (Symptoms)',
          mr: 'मुख्य तक्रार व लक्षणे (Symptoms)'
        },
        placeholders: {
          en: 'e.g. Headache for 3 days, dizziness upon standing',
          hi: 'उदा. ३ दिनों से सिरदर्द और चक्कर आना',
          te: 'ఉదా. 3 రోజులుగా తలనొప్పి మరియు మైకం',
          mr: 'उदा. ३ दिवसांपासून डोकेदुखी आणि चक्कर'
        },
        isCritical: false,
        glossaryKey: 'chief_complaint'
      },
      {
        fieldId: 'diagnosis',
        type: 'dropdown',
        labels: {
          en: 'Clinical Diagnosis (Dx)',
          hi: 'रोग निदान (Diagnosis)',
          te: 'వ్యాధి నిర్ధారణ (Diagnosis)',
          mr: 'रोग निदान (Diagnosis)'
        },
        placeholders: {
          en: 'Select Diagnosis',
          hi: 'रोग चुनें',
          te: 'వ్యాధిని ఎంచుకోండి',
          mr: 'आजाराची निवड करा'
        },
        options: [
          {
            value: 'Hypertension',
            labels: {
              en: 'Hypertension (High BP)',
              hi: 'उच्च रक्तचाप (Hypertension)',
              te: 'అధిక రక్తపోటు (Hypertension)',
              mr: 'उच्च रक्तदाब (Hypertension)'
            }
          },
          {
            value: 'Type 2 Diabetes Mellitus',
            labels: {
              en: 'Type 2 Diabetes Mellitus (Sugar)',
              hi: 'टाइप 2 डायबिटीज (शुगर)',
              te: 'టైప్ 2 డయాబెటిస్ (షుగర్)',
              mr: 'टाइप २ मधुमेह (डायबिटीज)'
            }
          },
          {
            value: 'Acute Respiratory Infection',
            labels: {
              en: 'Acute Respiratory Infection (ARI)',
              hi: 'तीव्र श्वसन संक्रमण (ARI)',
              te: 'తీవ్ర శ్వాసకోశ ఇన్ఫెక్షన్ (ARI)',
              mr: 'तीव्र श्वसन संसर्ग (ARI)'
            }
          },
          {
            value: 'Viral Fever',
            labels: {
              en: 'Viral Fever with Myalgia',
              hi: 'वायरल बुखार (Viral Fever)',
              te: 'వైరల్ జ్వరం (Viral Fever)',
              mr: 'व्हायरल ताप (Viral Fever)'
            }
          }
        ],
        isCritical: true,
        glossaryKey: 'diagnosis'
      },
      {
        fieldId: 'is_chronic',
        type: 'checkbox',
        labels: {
          en: 'Enroll in NCD Chronic Care Register',
          hi: 'एनसीडी (NCD) दीर्घकालिक रजिस्टर में दर्ज करें',
          te: 'NCD దీర్ఘకాలిక సంరక్షణ రిజిస్టర్‌లో నమోదు చేయండి',
          mr: 'NCD दीर्घकालीन नोंदवहीत नोंद करा'
        },
        placeholders: { en: '', hi: '', te: '', mr: '' },
        isCritical: false
      },
      {
        fieldId: 'doctor_notes',
        type: 'notes',
        labels: {
          en: 'Doctor Advice & Follow-up Instructions',
          hi: 'डॉक्टर की सलाह एवं फॉलो-अप निर्देश',
          te: 'వైద్యుని సలహా మరియు ఫాలో-అప్ సూచనలు',
          mr: 'वैद्यकीय सल्ला व पुढील तपासणी सूचना'
        },
        placeholders: {
          en: 'e.g. Salt reduction, repeat BP check in 14 days',
          hi: 'उदा. नमक कम लें, १४ दिनों में पुनः रक्तचाप जांचें',
          te: 'ఉదా. ఉప్పు తగ్గించాలి, 14 రోజుల్లో మళ్లీ BP తనిఖీ',
          mr: 'उदा. मीठ कमी घ्यावे, १४ दिवसांनी पुन्हा रक्तदाब तपासावा'
        },
        isCritical: false,
        glossaryKey: 'special_instructions'
      }
    ]
  },
  {
    id: 'proto-rx-maharashtra',
    name: 'Maharashtra Arogya - Rapid e-Prescription & Vitals',
    type: 'PRESCRIPTION',
    description: 'Fast-flow electronic prescription slip for crowded PHC OPD counters with bilingual Marathi/Hindi drug frequency buttons.',
    createdAt: '2026-10-18T11:00:00Z',
    updatedAt: '2026-10-27T16:45:00Z',
    fields: [
      {
        fieldId: 'patient_uhid',
        type: 'text',
        labels: {
          en: 'ABHA / Patient UHID Number',
          hi: 'आभा / मरीज का यूएचआईडी नंबर (ABHA ID)',
          te: 'ABHA / రోగి UHID సంఖ్య (ABHA ID)',
          mr: 'आभा / रुग्णाचा युएचआयडी क्रमांक (ABHA ID)'
        },
        placeholders: {
          en: 'e.g. 91-4452-9812-7712',
          hi: 'उदा. 91-4452-9812-7712',
          te: 'ఉదా. 91-4452-9812-7712',
          mr: 'उदा. 91-4452-9812-7712'
        },
        isCritical: false
      },
      {
        fieldId: 'rx_medicine_1',
        type: 'text',
        labels: {
          en: 'Primary Medicine Name & Strength (Rx)',
          hi: 'मुख्य दवा का नाम एवं पावर (Rx)',
          te: 'ప్రధాన ఔషధం పేరు & మోతాదు (Rx)',
          mr: 'मुख्य औषधाचे नाव व प्रमाण (Rx)'
        },
        placeholders: {
          en: 'e.g. Tab. Amlodipine 5mg',
          hi: 'उदा. Tab. Amlodipine 5mg',
          te: 'ఉదా. Tab. Amlodipine 5mg',
          mr: 'उदा. Tab. Amlodipine 5mg'
        },
        isCritical: true,
        glossaryKey: 'medicine_name'
      },
      {
        fieldId: 'rx_frequency_1',
        type: 'dropdown',
        labels: {
          en: 'Dosage Timing & Frequency',
          hi: 'खुराक की आवृत्ति (दिन में कितनी बार)',
          te: 'మోతాదు వేళలు (రోజుకు ఎన్నిసార్లు)',
          mr: 'औषध घेण्याची वारंवारता (दिवसातून किती वेळा)'
        },
        placeholders: {
          en: 'Select Frequency',
          hi: 'आवृत्ति चुनें',
          te: 'ఫ్రీక్వెన్సీని ఎంచుకోండి',
          mr: 'वारंवारता निवडा'
        },
        options: [
          {
            value: 'OD',
            labels: {
              en: 'OD - Once Daily (Morning)',
              hi: 'OD - दिन में एक बार (सुबह)',
              te: 'OD - రోజుకు ఒకసారి (ఉదయం)',
              mr: 'OD - दिवसातून एकदा (सकाळी)'
            }
          },
          {
            value: 'BD',
            labels: {
              en: 'BD - Twice Daily (Morning & Night)',
              hi: 'BD - दिन में दो बार (सुबह व रात)',
              te: 'BD - రోజుకు రెండుసార్లు (ఉదయం & రాత్రి)',
              mr: 'BD - दिवसातून दोनदा (सकाळ व रात्र)'
            }
          },
          {
            value: 'TDS',
            labels: {
              en: 'TDS - Thrice Daily (M-A-N)',
              hi: 'TDS - दिन में तीन बार (सुबह-दोपहर-रात)',
              te: 'TDS - రోజుకు మూడుసార్లు',
              mr: 'TDS - दिवसातून तीन वेळा'
            }
          },
          {
            value: 'SOS',
            labels: {
              en: 'SOS - Only When Needed',
              hi: 'SOS - आवश्यकता पड़ने पर ही',
              te: 'SOS - అవసరమైనప్పుడు మాత్రమే',
              mr: 'SOS - आवश्यकतेनुसार'
            }
          }
        ],
        isCritical: true,
        glossaryKey: 'dosage_frequency'
      },
      {
        fieldId: 'rx_duration_1',
        type: 'numeric',
        labels: {
          en: 'Duration of Course (Days)',
          hi: 'दवा लेने की अवधि (दिन)',
          te: 'వాడవలసిన రోజుల సంఖ్య (రోజులు)',
          mr: 'औषधाचा कालावधी (दिवस)'
        },
        placeholders: {
          en: 'e.g. 14',
          hi: 'उदा. 14',
          te: 'ఉదా. 14',
          mr: 'उदा. 14'
        },
        unit: 'days',
        isCritical: true,
        glossaryKey: 'treatment_duration'
      },
      {
        fieldId: 'rx_medicine_2',
        type: 'text',
        labels: {
          en: 'Secondary Medicine Name (Optional)',
          hi: 'द्वितीयक दवा का नाम (वैकल्पिक)',
          te: 'రెండవ ఔషధం పేరు (ఐచ్ఛికం)',
          mr: 'दुसऱ्या औषधाचे नाव (पर्यायी)'
        },
        placeholders: {
          en: 'e.g. Tab. Paracetamol 500mg',
          hi: 'उदा. Tab. Paracetamol 500mg',
          te: 'ఉదా. Tab. Paracetamol 500mg',
          mr: 'उदा. Tab. Paracetamol 500mg'
        },
        isCritical: false
      },
      {
        fieldId: 'emergency_alert',
        type: 'checkbox',
        labels: {
          en: 'Emergency / Adverse Drug Caution Flag',
          hi: 'आपातकालीन / दवा रिएक्शन सावधानी फ्लैग',
          te: 'అత్యవసర / అలెర్జీ జాగ్రత్త ఫ్లాగ్',
          mr: 'तातडीचे / औषध ॲलर्जी खबरदारी सूचना'
        },
        placeholders: { en: '', hi: '', te: '', mr: '' },
        isCritical: true,
        glossaryKey: 'emergency_flag'
      }
    ]
  },
  {
    id: 'proto-anc-nhm',
    name: 'National Health Mission - High-Risk ANC Referral Note',
    type: 'REFERRAL',
    description: 'Antenatal care screening and high-risk pregnancy referral slip connecting PHCs to Community Health Centres (CHC) and District Hospitals.',
    createdAt: '2026-10-20T15:20:00Z',
    updatedAt: '2026-10-29T10:00:00Z',
    fields: [
      {
        fieldId: 'patient_name',
        type: 'text',
        labels: {
          en: 'Mother Full Name',
          hi: 'गर्भवती महिला का नाम',
          te: 'గర్భిణీ స్త్రీ పూర్తి పేరు',
          mr: 'गर्भवती महिलेचे पूर्ण नाव'
        },
        placeholders: {
          en: 'e.g. Sunita Devi',
          hi: 'उदा. सुनीता देवी',
          te: 'ఉదా. సునీత దేవి',
          mr: 'उदा. सुनिता देवी'
        },
        isCritical: false
      },
      {
        fieldId: 'gestational_weeks',
        type: 'numeric',
        labels: {
          en: 'Gestational Age (Weeks)',
          hi: 'गर्भधारण की अवधि (सप्ताह / Weeks)',
          te: 'గర్భధారణ కాలం (వారాలు / Weeks)',
          mr: 'गर्भधारणेचा कालावधी (आठवडे / Weeks)'
        },
        placeholders: {
          en: 'e.g. 32',
          hi: 'उदा. 32',
          te: 'ఉదా. 32',
          mr: 'उदा. 32'
        },
        unit: 'weeks',
        isCritical: true,
        glossaryKey: 'antenatal_care'
      },
      {
        fieldId: 'hb_level',
        type: 'numeric',
        labels: {
          en: 'Hemoglobin Level (Hb)',
          hi: 'हीमोग्लोबिन स्तर (Hb)',
          te: 'హిమోగ్లోబిన్ స్థాయి (Hb)',
          mr: 'हिमोग्लोबिन पातळी (Hb)'
        },
        placeholders: {
          en: 'e.g. 7.8',
          hi: 'उदा. 7.8',
          te: 'ఉదా. 7.8',
          mr: 'उदा. 7.8'
        },
        unit: 'g/dL',
        isCritical: true,
        glossaryKey: 'hemoglobin'
      },
      {
        fieldId: 'referral_reason',
        type: 'dropdown',
        labels: {
          en: 'Reason for Referral',
          hi: 'रेफर करने का मुख्य कारण',
          te: 'రెఫరల్ చేయుటకు ముఖ్య కారణం',
          mr: 'रेफर करण्याचे मुख्य कारण'
        },
        placeholders: {
          en: 'Select Referral Reason',
          hi: 'कारण चुनें',
          te: 'కారణాన్ని ఎంచుకోండి',
          mr: 'कारण निवडा'
        },
        options: [
          {
            value: 'Severe Anemia (Hb < 7 g/dL)',
            labels: {
              en: 'Severe Anemia (Hb < 7 g/dL)',
              hi: 'गंभीर एनीमिया (Hb < 7 g/dL)',
              te: 'తీవ్ర రక్తహీనత (Hb < 7 g/dL)',
              mr: 'तीव्र ॲनिमिया / रक्तक्षय (Hb < 7)'
            }
          },
          {
            value: 'Gestational Hypertension / Preeclampsia',
            labels: {
              en: 'Gestational Hypertension / Preeclampsia (High BP)',
              hi: 'गर्भावधि उच्च रक्तचाप / प्री-एक्लेम्पसिया',
              te: 'గర్భధారణ అధిక రక్తపోటు (Preeclampsia)',
              mr: 'गर्भधारणेतील उच्च रक्तदाब / प्री-एक्लॅम्प्सिया'
            }
          },
          {
            value: 'Previous Cesarean Section in Labor',
            labels: {
              en: 'Previous C-Section in Labor',
              hi: 'पूर्व सिजेरियन प्रसव पीड़ा में',
              te: 'గతంలో సి-సెక్షన్ ప్రసవ నొప్పులు',
              mr: 'पूर्वीचे सिझेरियन प्रसूती वेदना'
            }
          }
        ],
        isCritical: true,
        glossaryKey: 'referral_reason'
      },
      {
        fieldId: 'target_facility',
        type: 'dropdown',
        labels: {
          en: 'Referred Facility Tier',
          hi: 'रेफरल अस्पताल स्तर (CHC / District Hospital)',
          te: 'రెఫరల్ ఆసుపత్రి స్థాయి (CHC / District Hospital)',
          mr: 'रेफरल रुग्णालय स्तर (CHC / जिल्हा रुग्णालय)'
        },
        placeholders: {
          en: 'Select Facility',
          hi: 'अस्पताल चुनें',
          te: 'ఆసుపత్రిని ఎంచుకోండి',
          mr: 'रुग्णालय निवडा'
        },
        options: [
          {
            value: 'Community Health Centre (CHC)',
            labels: {
              en: 'Community Health Centre (CHC)',
              hi: 'सामुदायिक स्वास्थ्य केंद्र (CHC)',
              te: 'కమ్యూనిటీ హెల్త్ సెంటర్ (CHC)',
              mr: 'सामुदायिक आरोग्य केंद्र (CHC)'
            }
          },
          {
            value: 'District Hospital (DH)',
            labels: {
              en: 'District Hospital (DH) - FRU',
              hi: 'जिला अस्पताल (District Hospital - FRU)',
              te: 'జిల్లా ఆసుపత్రి (District Hospital - FRU)',
              mr: 'जिल्हा रुग्णालय (District Hospital - FRU)'
            }
          }
        ],
        isCritical: true,
        glossaryKey: 'referred_facility'
      },
      {
        fieldId: 'is_urgent',
        type: 'checkbox',
        labels: {
          en: 'Urgent Red Flag Emergency Case',
          hi: 'अत्यावश्यक / रेड फ्लैग केस (Urgent Case)',
          te: 'అత్యవసర / రెడ్ ఫ్లాగ్ కేసు (Urgent Case)',
          mr: 'अतितातडीचे / रेड फ्लॅग प्रकरण (Urgent Case)'
        },
        placeholders: { en: '', hi: '', te: '', mr: '' },
        isCritical: true,
        glossaryKey: 'emergency_flag'
      }
    ]
  }
];

export const INITIAL_TASKS: TestTask[] = [
  {
    id: 'task-opd-htn',
    prototypeId: 'proto-opd-telangana',
    scenarioTitle: {
      en: 'OPD Visit: 48-Year-Old Hypertensive Follow-up',
      hi: 'ओपीडी कार्य: 48 वर्षीय उच्च रक्तचाप (BP) मरीज की जांच',
      te: 'OPD పని: 48 ఏళ్ల అధిక రక్తపోటు (BP) రోగి తనిఖీ',
      mr: 'ओपीडी कार्य: ४८ वर्षीय उच्च रक्तदाब (BP) तपासणी'
    },
    patient: {
      name: 'Rameshwar Reddy',
      age: 48,
      gender: 'Male',
      uhid: 'TS-PHC-2026-8941',
      complaintSummary: 'Occasional morning headache and fatigue for 10 days. Known hypertensive on irregular medication.'
    },
    clinicalInstructions: {
      en: 'Record patient clinical vitals: BP Systolic: 150 mmHg, BP Diastolic: 92 mmHg, Pulse: 82 bpm, Blood Sugar: 165 mg/dL. Set Diagnosis to Hypertension and recommend salt restriction.',
      hi: 'रोगी के विटल्स दर्ज करें: सिस्टोलिक BP: 150 mmHg, डायस्टोलिक BP: 92 mmHg, नाड़ी (Pulse): 82 bpm, ब्लड शुगर: 165 mg/dL. रोग निदान में "Hypertension" चुनें।',
      te: 'రోగి ముఖ్య లక్షణాలు నమోదు చేయండి: సిస్టోలిక్ BP: 150 mmHg, డయాస్టోలిక్ BP: 92 mmHg, పల్స్: 82 bpm, షుగర్: 165 mg/dL. రోగ నిర్ధారణలో "Hypertension" ఎంచుకోండి.',
      mr: 'रुग्णाची लक्षणे नोंदवा: सिस्टॉलिक BP: 150 mmHg, डायस्टॉलिक BP: 92 mmHg, नाडी: 82 bpm, ब्लड शुगर: 165 mg/dL. निदान "Hypertension" निवडा.'
    },
    expectedAnswers: {
      bp_systolic: 150,
      bp_diastolic: 92,
      pulse_rate: 82,
      blood_sugar: 165,
      diagnosis: 'Hypertension'
    },
    targetTimeSeconds: 180
  },
  {
    id: 'task-rx-fever',
    prototypeId: 'proto-rx-maharashtra',
    scenarioTitle: {
      en: 'e-Prescription: Acute Hypertension Medication Refill',
      hi: 'ई-प्रिस्क्रिप्शन: उच्च रक्तचाप दवा पर्ची जारी करना',
      te: 'ఈ-ప్రిస్క్రిప్షన్: రక్తపోటు మందుల చీటీ జారీ',
      mr: 'ई-प्रिस्क्रिप्शन: उच्च रक्तदाब औषध चिठ्ठी देणे'
    },
    patient: {
      name: 'Anandi Patil',
      age: 52,
      gender: 'Female',
      uhid: 'MH-PHC-2026-4402',
      complaintSummary: 'Needs monthly refill of anti-hypertensive medication. BP today 138/86 mmHg.'
    },
    clinicalInstructions: {
      en: 'Prescribe Tab. Amlodipine 5mg with Frequency OD (Once Daily) for a Duration of 14 days.',
      hi: 'दवा में "Tab. Amlodipine 5mg", खुराक की आवृत्ति "OD", और अवधि "14" दिन दर्ज करें।',
      te: 'ఔషధంలో "Tab. Amlodipine 5mg", ఫ్రీక్వెన్సీ "OD", మరియు వ్యవధి "14" రోజులు నమోదు చేయండి.',
      mr: 'औषधात "Tab. Amlodipine 5mg", वारंवारता "OD", आणि कालावधी "14" दिवस भरा.'
    },
    expectedAnswers: {
      rx_medicine_1: 'Tab. Amlodipine 5mg',
      rx_frequency_1: 'OD',
      rx_duration_1: 14,
      emergency_alert: false
    },
    targetTimeSeconds: 120
  },
  {
    id: 'task-anc-referral',
    prototypeId: 'proto-anc-nhm',
    scenarioTitle: {
      en: 'ANC Referral: High-Risk Severe Anemia at 32 Weeks',
      hi: 'एएनसी रेफरल: 32 सप्ताह में गंभीर एनीमिया केस',
      te: 'ANC రెఫరల్: 32 వారాలలో తీవ్ర రక్తహీనత కేసు',
      mr: 'एएनसी रेफरल: ३२ आठवड्यांत तीव्र ॲनिमिया रेफरल'
    },
    patient: {
      name: 'Kavita Bai',
      age: 24,
      gender: 'Female',
      uhid: 'NHM-ANC-2026-1094',
      complaintSummary: 'Gravida 2, Para 1, 32 weeks gestation. Pallor +++, Hb 6.4 g/dL. Requires urgent blood transfusion.'
    },
    clinicalInstructions: {
      en: 'Enter Gestational Age 32 weeks, Hb level 6.4 g/dL. Select Referral Reason "Severe Anemia (Hb < 7 g/dL)", Target Facility "District Hospital (DH)", and mark Urgent Red Flag Case.',
      hi: 'गर्भधारण 32 सप्ताह, हीमोग्लोबिन 6.4 g/dL दर्ज करें। रेफरल कारण "Severe Anemia (Hb < 7 g/dL)", अस्पताल "District Hospital (DH)" चुनें, और आपातकालीन फ्लैग लगाएं।',
      te: 'గర్భధారణ 32 వారాలు, హిమోగ్లోబిన్ 6.4 g/dL నమోదు చేయండి. రెఫరల్ కారణం "Severe Anemia", ఆసుపత్రి "District Hospital", మరియు అత్యవసర ఫ్లాగ్ ఎంచుకోండి.',
      mr: 'गर्भधारणा ३२ आठवडे, हिमोग्लोबिन ६.४ g/dL भरा. रेफरल कारण "Severe Anemia", रुग्णालय "District Hospital", व आणीबाणी फ्लॅग निवडा.'
    },
    expectedAnswers: {
      gestational_weeks: 32,
      hb_level: 6.4,
      referral_reason: 'Severe Anemia (Hb < 7 g/dL)',
      target_facility: 'District Hospital (DH)',
      is_urgent: true
    },
    targetTimeSeconds: 150
  }
];

export const INITIAL_TEST_SESSIONS: TestSession[] = [
  // Session 1: Telugu PHC Doctor
  {
    id: 'sess-te-001',
    prototypeId: 'proto-opd-telangana',
    taskId: 'task-opd-htn',
    language: 'te',
    codeMixed: true,
    doctorIdentifier: 'Dr. Srinivas Rao, MBBS (PHC Narsingi)',
    deviceInfo: {
      userAgent: 'Mozilla/5.0 (Linux; Android 10; Redmi 9A) AppleWebKit/537.36 Chrome/108.0.0.0 Mobile Safari/537.36',
      screenWidth: 390,
      simulatedDevice: 'Xiaomi Redmi 9A (Android 10)',
      textScale: 1.0
    },
    startedAt: 1761821000000,
    endedAt: 1761821124000,
    durationSeconds: 124,
    responses: {
      bp_systolic: 150,
      bp_diastolic: 92,
      pulse_rate: 82,
      blood_sugar: 165,
      chief_complaint: 'Morning headache for 10 days',
      diagnosis: 'Hypertension',
      is_chronic: true
    },
    accuracy: {
      overallAccuracy: 100,
      criticalAccuracy: 100,
      fieldResults: {
        bp_systolic: { correct: true, userValue: 150, expectedValue: 150, isCritical: true },
        bp_diastolic: { correct: true, userValue: 92, expectedValue: 92, isCritical: true },
        pulse_rate: { correct: true, userValue: 82, expectedValue: 82, isCritical: false },
        blood_sugar: { correct: true, userValue: 165, expectedValue: 165, isCritical: true },
        diagnosis: { correct: true, userValue: 'Hypertension', expectedValue: 'Hypertension', isCritical: true }
      }
    },
    telemetry: {
      timeToFirstInteraction: 2.1,
      fieldDwells: {
        bp_systolic: 3.4,
        bp_diastolic: 2.8,
        pulse_rate: 2.2,
        blood_sugar: 3.9,
        chief_complaint: 6.2,
        diagnosis: 4.1
      },
      fieldHesitations: {
        bp_systolic: 2.1,
        bp_diastolic: 6.2,
        pulse_rate: 10.1,
        blood_sugar: 14.5,
        chief_complaint: 22.0,
        diagnosis: 31.4
      },
      fieldEdits: {
        bp_systolic: 1,
        bp_diastolic: 1,
        pulse_rate: 1,
        blood_sugar: 2,
        chief_complaint: 5,
        diagnosis: 1
      },
      helpClicks: {},
      totalEdits: 11
    },
    feedback: {
      id: 'fb-001',
      sessionId: 'sess-te-001',
      language: 'te',
      confusingFieldIds: [],
      confusingTermsFreeText: 'All terms very clear because BP and Sugar abbreviations were visible in brackets next to Telugu text.',
      easeOfUseRating: 5,
      additionalComments: 'Font size was comfortably readable on our PHC tablet without pinching.',
      doctorRole: 'Medical Officer (Primary Health Centre)'
    }
  },
  // Session 2: Hindi PHC Doctor
  {
    id: 'sess-hi-002',
    prototypeId: 'proto-opd-telangana',
    taskId: 'task-opd-htn',
    language: 'hi',
    codeMixed: true,
    doctorIdentifier: 'Dr. Sunita Sharma, MBBS (PHC Rampur)',
    deviceInfo: {
      userAgent: 'Mozilla/5.0 (Linux; Android 9; Samsung Galaxy J6) AppleWebKit/537.36 Chrome/104.0.0.0 Mobile Safari/537.36',
      screenWidth: 360,
      simulatedDevice: 'Samsung Galaxy J6 (Android 9)',
      textScale: 1.1
    },
    startedAt: 1761822000000,
    endedAt: 1761822146000,
    durationSeconds: 146,
    responses: {
      bp_systolic: 150,
      bp_diastolic: 90, // slight difference within tolerance
      pulse_rate: 80,
      blood_sugar: 165,
      diagnosis: 'Hypertension'
    },
    accuracy: {
      overallAccuracy: 100,
      criticalAccuracy: 100,
      fieldResults: {
        bp_systolic: { correct: true, userValue: 150, expectedValue: 150, isCritical: true },
        bp_diastolic: { correct: true, userValue: 90, expectedValue: 92, isCritical: true },
        pulse_rate: { correct: true, userValue: 80, expectedValue: 82, isCritical: false },
        blood_sugar: { correct: true, userValue: 165, expectedValue: 165, isCritical: true },
        diagnosis: { correct: true, userValue: 'Hypertension', expectedValue: 'Hypertension', isCritical: true }
      }
    },
    telemetry: {
      timeToFirstInteraction: 2.8,
      fieldDwells: {
        bp_systolic: 4.2,
        bp_diastolic: 3.1,
        pulse_rate: 2.5,
        blood_sugar: 4.4,
        diagnosis: 5.8
      },
      fieldHesitations: {
        bp_systolic: 2.8,
        bp_diastolic: 8.5,
        pulse_rate: 13.2,
        blood_sugar: 18.0,
        diagnosis: 28.5
      },
      fieldEdits: {
        bp_systolic: 1,
        bp_diastolic: 2,
        pulse_rate: 1,
        blood_sugar: 1,
        diagnosis: 1
      },
      helpClicks: {},
      totalEdits: 6
    },
    feedback: {
      id: 'fb-002',
      sessionId: 'sess-hi-002',
      language: 'hi',
      confusingFieldIds: [],
      confusingTermsFreeText: 'Good that "BP" and "Sugar" are included. In Hindi typing "रक्तचाप" takes too long if abbreviation is missing.',
      easeOfUseRating: 4,
      additionalComments: 'Buttons are large enough for thumb entry when standing during OPD.',
      doctorRole: 'Medical Officer'
    }
  },
  // Session 3: Marathi PHC Doctor
  {
    id: 'sess-mr-003',
    prototypeId: 'proto-opd-telangana',
    taskId: 'task-opd-htn',
    language: 'mr',
    codeMixed: false,
    doctorIdentifier: 'Dr. Ganesh Deshmukh, BAMS (PHC Baramati)',
    deviceInfo: {
      userAgent: 'Mozilla/5.0 (Linux; Android 10; Realme C2) AppleWebKit/537.36 Chrome/109.0.0.0 Mobile Safari/537.36',
      screenWidth: 360,
      simulatedDevice: 'Realme C2 (Android 10)',
      textScale: 1.0
    },
    startedAt: 1761823000000,
    endedAt: 1761823168000,
    durationSeconds: 168,
    responses: {
      bp_systolic: 150,
      bp_diastolic: 92,
      pulse_rate: 82,
      blood_sugar: 165,
      diagnosis: 'Hypertension'
    },
    accuracy: {
      overallAccuracy: 100,
      criticalAccuracy: 100,
      fieldResults: {
        bp_systolic: { correct: true, userValue: 150, expectedValue: 150, isCritical: true },
        bp_diastolic: { correct: true, userValue: 92, expectedValue: 92, isCritical: true },
        pulse_rate: { correct: true, userValue: 82, expectedValue: 82, isCritical: false },
        blood_sugar: { correct: true, userValue: 165, expectedValue: 165, isCritical: true },
        diagnosis: { correct: true, userValue: 'Hypertension', expectedValue: 'Hypertension', isCritical: true }
      }
    },
    telemetry: {
      timeToFirstInteraction: 3.5,
      fieldDwells: {
        bp_systolic: 4.8,
        bp_diastolic: 3.6,
        pulse_rate: 3.1,
        blood_sugar: 5.2,
        diagnosis: 6.9
      },
      fieldHesitations: {
        bp_systolic: 3.5,
        bp_diastolic: 9.8,
        pulse_rate: 15.6,
        blood_sugar: 22.1,
        diagnosis: 34.0
      },
      fieldEdits: {
        bp_systolic: 2,
        bp_diastolic: 1,
        pulse_rate: 1,
        blood_sugar: 3,
        diagnosis: 1
      },
      helpClicks: { bp_systolic: 1 },
      totalEdits: 8
    },
    feedback: {
      id: 'fb-003',
      sessionId: 'sess-mr-003',
      language: 'mr',
      confusingFieldIds: ['diagnosis'],
      confusingTermsFreeText: 'Diagnosis dropdown list had long technical sentences. Simple words like "उच्च रक्तदाब (High BP)" are best.',
      easeOfUseRating: 4,
      additionalComments: 'Very helpful to have Marathi labels.',
      doctorRole: 'Ayush Medical Officer'
    }
  },
  // Session 4: English baseline
  {
    id: 'sess-en-004',
    prototypeId: 'proto-opd-telangana',
    taskId: 'task-opd-htn',
    language: 'en',
    codeMixed: true,
    doctorIdentifier: 'Dr. Priya Nair, MBBS (Urban PHC Hyderabad)',
    deviceInfo: {
      userAgent: 'Mozilla/5.0 (Linux; Android 10; Moto G8) AppleWebKit/537.36 Chrome/109.0.0.0 Mobile Safari/537.36',
      screenWidth: 412,
      simulatedDevice: 'Motorola Moto G8 (Android 10)',
      textScale: 1.0
    },
    startedAt: 1761824000000,
    endedAt: 1761824108000,
    durationSeconds: 108,
    responses: {
      bp_systolic: 150,
      bp_diastolic: 92,
      pulse_rate: 82,
      blood_sugar: 165,
      diagnosis: 'Hypertension'
    },
    accuracy: {
      overallAccuracy: 100,
      criticalAccuracy: 100,
      fieldResults: {
        bp_systolic: { correct: true, userValue: 150, expectedValue: 150, isCritical: true },
        bp_diastolic: { correct: true, userValue: 92, expectedValue: 92, isCritical: true },
        pulse_rate: { correct: true, userValue: 82, expectedValue: 82, isCritical: false },
        blood_sugar: { correct: true, userValue: 165, expectedValue: 165, isCritical: true },
        diagnosis: { correct: true, userValue: 'Hypertension', expectedValue: 'Hypertension', isCritical: true }
      }
    },
    telemetry: {
      timeToFirstInteraction: 1.8,
      fieldDwells: {
        bp_systolic: 2.6,
        bp_diastolic: 2.1,
        pulse_rate: 1.9,
        blood_sugar: 3.0,
        diagnosis: 3.2
      },
      fieldHesitations: {
        bp_systolic: 1.8,
        bp_diastolic: 5.2,
        pulse_rate: 8.4,
        blood_sugar: 12.0,
        diagnosis: 19.5
      },
      fieldEdits: {
        bp_systolic: 1,
        bp_diastolic: 1,
        pulse_rate: 1,
        blood_sugar: 1,
        diagnosis: 1
      },
      helpClicks: {},
      totalEdits: 5
    },
    feedback: {
      id: 'fb-004',
      sessionId: 'sess-en-004',
      language: 'en',
      confusingFieldIds: [],
      confusingTermsFreeText: 'Fast and responsive layout.',
      easeOfUseRating: 5,
      additionalComments: 'Good hierarchy.',
      doctorRole: 'Civil Assistant Surgeon'
    }
  }
];
