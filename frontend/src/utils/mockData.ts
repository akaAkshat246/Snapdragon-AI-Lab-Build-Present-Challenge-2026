import type { ScreeningResult, ReferralRecord, UserProfile } from '../types';

export const CURRENT_USER: UserProfile = {
  id: 'CLIN-99214',
  name: 'Dr. Ananya Sharma',
  role: 'Community Health Specialist',
  facilityName: 'Primary Care Center - Shankarpally Clinic',
  facilityId: 'CLIN-IN-501203',
  licenseId: 'MED-TEL-4432-8819',
  district: 'Rangareddy',
  state: 'Telangana',
  facilityGps: {
    latitude: 17.4325,
    longitude: 78.1254,
    accuracy: 4,
    altitude: 532,
    locationName: 'Shankarpally Health Center',
    timestamp: '2026-09-27T08:00:00Z',
  },
  isOnline: true,
};

export const SAMPLE_FUNDUS_IMAGES = [
  {
    id: 'sample-1',
    label: 'Fundus Scan A (Moderate NPDR)',
    prediction: 'Moderate Diabetic Retinopathy (NPDR)',
    class_id: 2,
    confidence: 94.8,
    fileUrl: '/samples/original.jpg',
    heatmapUrl: '/samples/heatmap.jpg',
    explainedUrl: '/samples/explained_result.jpg',
    description: 'Multiple microaneurysms and hard exudates in macular region. Prompt referral recommended.',
    lesions: [
      { name: 'Microaneurysms', count: 14, severity: 'moderate', description: 'Tiny capillary outpouchings in temporal retina' },
      { name: 'Hard Exudates', count: 8, severity: 'moderate', description: 'Lipid deposits bordering macular perimeter' },
      { name: 'Dot Hemorrhages', count: 6, severity: 'mild', description: 'Deep retinal intra-retinal hemorrhages' },
    ],
  },
  {
    id: 'sample-2',
    label: 'Fundus Scan B (No DR / Normal)',
    prediction: 'No Diabetic Retinopathy (Normal)',
    class_id: 0,
    confidence: 98.2,
    fileUrl: '/samples/original.jpg',
    heatmapUrl: '/samples/heatmap.jpg',
    explainedUrl: '/samples/explained_result.jpg',
    description: 'Clear optical disc and sharp foveal reflex. Retinal vasculature healthy with normal arteriovenous ratio.',
    lesions: [
      { name: 'Microaneurysms', count: 0, severity: 'mild', description: 'None detected' },
      { name: 'Hard Exudates', count: 0, severity: 'mild', description: 'None detected' },
      { name: 'Hemorrhages', count: 0, severity: 'mild', description: 'None detected' },
    ],
  },
  {
    id: 'sample-3',
    label: 'Fundus Scan C (Severe NPDR)',
    prediction: 'Severe Non-Proliferative DR',
    class_id: 3,
    confidence: 96.4,
    fileUrl: '/samples/original.jpg',
    heatmapUrl: '/samples/heatmap.jpg',
    explainedUrl: '/samples/explained_result.jpg',
    description: 'Widespread intraretinal microvascular abnormalities (IRMA), venous beading in 2+ quadrants, and severe cotton wool spots.',
    lesions: [
      { name: 'Cotton Wool Spots', count: 12, severity: 'severe', description: 'Nerve fiber layer infarcts' },
      { name: 'Venous Beading', count: 4, severity: 'severe', description: 'Venous caliber fluctuations' },
      { name: 'Microaneurysms', count: 28, severity: 'severe', description: 'High density vascular lesions' },
    ],
  },
  {
    id: 'sample-4',
    label: 'Fundus Scan D (Proliferative DR - PDR)',
    prediction: 'Proliferative Diabetic Retinopathy (PDR)',
    class_id: 4,
    confidence: 97.9,
    fileUrl: '/samples/original.jpg',
    heatmapUrl: '/samples/heatmap.jpg',
    explainedUrl: '/samples/explained_result.jpg',
    description: 'Active neovascularization at disc (NVD) and elsewhere (NVE). Urgent laser photocoagulation referral required within 24-48h.',
    lesions: [
      { name: 'Neovascularization', count: 5, severity: 'severe', description: 'Fragile new vessel sprouts at optic disc' },
      { name: 'Vitreous Preretinal Heme', count: 2, severity: 'severe', description: 'Subhyaloid hemorrhage threat' },
      { name: 'Fibrous Proliferation', count: 3, severity: 'severe', description: 'Tractional membrane formation risk' },
    ],
  },
];

export const INITIAL_SCREENINGS: ScreeningResult[] = [
  {
    id: 'SCR-2026-8801',
    patientId: 'P-1025',
    healthId: 'MRN-8842-1002-3490',
    patientName: 'Rameshwar Prasad Patel',
    age: 58,
    gender: 'Male',
    phone: '+91 98451 22340',
    village: 'Mokila Sector 4, Shankarpally',
    gpsLocation: {
      latitude: 17.4382,
      longitude: 78.1219,
      accuracy: 5,
      altitude: 535,
      locationName: 'Mokila Rural Health Center',
      timestamp: '2026-09-27T08:15:00Z',
    },
    diabetesStatus: 'Type 2 Diabetes',
    durationYears: 12,
    hba1c: 9.4,
    timestamp: '2026-09-27T08:15:00Z',
    facilityName: 'Primary Care Center - Shankarpally Clinic',
    facilityId: 'CLIN-IN-501203',
    screenedBy: 'Dr. Ananya Sharma',
    success: true,
    filename: 'fundus_p1025_od.jpg',
    content_type: 'image/jpeg',
    analysis: {
      status: 'completed',
      prediction: 'Moderate Diabetic Retinopathy',
      class_id: 2,
      confidence: 94.2,
      image_quality: 'High (Illumination: 94%, Focus: 91%)',
      recommendation: 'Refer to Regional Eye Hospital for dilated biomicroscopy and OCT assessment within 2 weeks. Intensify glycemic and blood pressure management.',
      clinicalSummary: 'Model flagged prominent cluster of microaneurysms and hard exudates in temporal juxtafoveal zone. No active neovascularization detected.',
      triageLevel: 'urgent',
      xai: {
        method: 'Grad-CAM XAI',
        regions: 4,
        original: '/samples/original.jpg',
        heatmap: '/samples/heatmap.jpg',
        explained_result: '/samples/explained_result.jpg',
        qualityScore: 94,
        illuminationScore: 92,
        clarityScore: 95,
        lesions: [
          { name: 'Microaneurysms', count: 16, severity: 'moderate', description: 'Temporal capillary microaneurysms' },
          { name: 'Hard Exudates', count: 7, severity: 'moderate', description: 'Macular perimeter circinate lipid ring' },
          { name: 'Dot Hemorrhages', count: 5, severity: 'mild', description: 'Isolated intra-retinal spots' },
        ],
      },
    },
  },
  {
    id: 'SCR-2026-8800',
    patientId: 'P-1024',
    healthId: 'MRN-3321-7789-1120',
    patientName: 'Lakshmi Devi K.',
    age: 49,
    gender: 'Female',
    phone: '+91 94401 55672',
    village: 'Tangatur Clinic Station',
    gpsLocation: {
      latitude: 17.4121,
      longitude: 78.1405,
      accuracy: 6,
      altitude: 528,
      locationName: 'Tangatur Field Node',
      timestamp: '2026-09-26T15:30:00Z',
    },
    diabetesStatus: 'Type 2 Diabetes',
    durationYears: 4,
    hba1c: 6.8,
    timestamp: '2026-09-26T15:30:00Z',
    facilityName: 'Primary Care Center - Shankarpally Clinic',
    facilityId: 'CLIN-IN-501203',
    screenedBy: 'Dr. Ananya Sharma',
    success: true,
    filename: 'fundus_p1024_os.jpg',
    content_type: 'image/jpeg',
    analysis: {
      status: 'completed',
      prediction: 'No Diabetic Retinopathy',
      class_id: 0,
      confidence: 98.7,
      image_quality: 'High',
      recommendation: 'Annual routine retinal re-screening recommended. Continue current lifestyle regimen.',
      clinicalSummary: 'Optic nerve head sharp, cup-to-disc ratio 0.3. No microaneurysms, hemorrhages or macular edema.',
      triageLevel: 'routine',
      xai: {
        method: 'Grad-CAM XAI',
        regions: 0,
        original: '/samples/original.jpg',
        heatmap: '/samples/heatmap.jpg',
        explained_result: '/samples/explained_result.jpg',
        qualityScore: 98,
        illuminationScore: 97,
        clarityScore: 99,
        lesions: [],
      },
    },
  },
  {
    id: 'SCR-2026-8799',
    patientId: 'P-1023',
    healthId: 'MRN-9988-4412-6531',
    patientName: 'Mohammed Ghouse',
    age: 64,
    gender: 'Male',
    phone: '+91 97003 88129',
    village: 'Singapur Field Unit',
    gpsLocation: {
      latitude: 17.4562,
      longitude: 78.1098,
      accuracy: 4,
      altitude: 540,
      locationName: 'Singapur Mobile Camp',
      timestamp: '2026-09-26T11:45:00Z',
    },
    diabetesStatus: 'Type 2 Diabetes',
    durationYears: 18,
    hba1c: 10.8,
    timestamp: '2026-09-26T11:45:00Z',
    facilityName: 'Primary Care Center - Shankarpally Clinic',
    facilityId: 'CLIN-IN-501203',
    screenedBy: 'Dr. Srinivas Rao',
    success: true,
    filename: 'fundus_p1023_od.jpg',
    content_type: 'image/jpeg',
    analysis: {
      status: 'completed',
      prediction: 'Proliferative Diabetic Retinopathy',
      class_id: 4,
      confidence: 97.4,
      image_quality: 'Adequate',
      recommendation: 'EMERGENCY: Immediate referral to Regional Eye Hospital within 24-48 hours for pan-retinal photocoagulation (PRP) evaluation.',
      clinicalSummary: 'High-risk features identified: Neovascularization on the optic disc (NVD > 1/4 disc area) and preretinal vitreous hemorrhage risk.',
      triageLevel: 'emergency',
      xai: {
        method: 'Grad-CAM XAI',
        regions: 6,
        original: '/samples/original.jpg',
        heatmap: '/samples/heatmap.jpg',
        explained_result: '/samples/explained_result.jpg',
        qualityScore: 91,
        illuminationScore: 89,
        clarityScore: 93,
        lesions: [
          { name: 'Neovascularization Disc', count: 3, severity: 'severe', description: 'New fragile vascular bundles on disc margin' },
          { name: 'Cotton Wool Infarcts', count: 8, severity: 'severe', description: 'Ischemic axoplasmic stasis' },
          { name: 'Blot Hemorrhages', count: 19, severity: 'severe', description: 'Deep retinal bleeding across 3 quadrants' },
        ],
      },
    },
  },
  {
    id: 'SCR-2026-8798',
    patientId: 'P-1022',
    healthId: 'MRN-1102-8834-9901',
    patientName: 'Sunita Bai Rathod',
    age: 52,
    gender: 'Female',
    phone: '+91 91234 56789',
    village: 'Chandanagar Station',
    gpsLocation: {
      latitude: 17.4891,
      longitude: 78.3284,
      accuracy: 5,
      altitude: 550,
      locationName: 'Chandanagar Clinic Node',
      timestamp: '2026-09-25T14:10:00Z',
    },
    diabetesStatus: 'Type 2 Diabetes',
    durationYears: 7,
    hba1c: 7.9,
    timestamp: '2026-09-25T14:10:00Z',
    facilityName: 'Primary Care Center - Shankarpally Clinic',
    facilityId: 'CLIN-IN-501203',
    screenedBy: 'Dr. Ananya Sharma',
    success: true,
    filename: 'fundus_p1022_os.jpg',
    content_type: 'image/jpeg',
    analysis: {
      status: 'completed',
      prediction: 'Mild Non-Proliferative DR',
      class_id: 1,
      confidence: 91.5,
      image_quality: 'High',
      recommendation: 'Follow-up screening in 6 months at clinic. Prescribe lifestyle counseling and strict glycemic & lipid target tracking.',
      clinicalSummary: 'Scattered isolated microaneurysms detected in peripheral retina. Macula clear with no center-involving edema.',
      triageLevel: 'routine',
      xai: {
        method: 'Grad-CAM XAI',
        regions: 2,
        original: '/samples/original.jpg',
        heatmap: '/samples/heatmap.jpg',
        explained_result: '/samples/explained_result.jpg',
        qualityScore: 96,
        illuminationScore: 95,
        clarityScore: 96,
        lesions: [
          { name: 'Microaneurysms', count: 4, severity: 'mild', description: 'Isolated temporal microaneurysms' },
        ],
      },
    },
  },
];

export const INITIAL_REFERRALS: ReferralRecord[] = [
  {
    id: 'REF-2026-0412',
    screeningId: 'SCR-2026-8799',
    patientId: 'P-1023',
    healthId: 'MRN-9988-4412-6531',
    patientName: 'Mohammed Ghouse',
    age: 64,
    gender: 'Male',
    phone: '+91 97003 88129',
    village: 'Singapur Field Unit',
    gpsLocation: {
      latitude: 17.4562,
      longitude: 78.1098,
      locationName: 'Singapur Mobile Camp',
    },
    prediction: 'Proliferative Diabetic Retinopathy',
    confidence: 97.4,
    priority: 'emergency',
    referralDate: '2026-09-26',
    scheduledDate: '2026-09-28',
    referredToHospital: 'Regional Retina Center & Eye Hospital',
    hospitalGps: {
      latitude: 17.4128,
      longitude: 78.4751,
      locationName: 'Regional Retina Center (Tertiary Care)',
    },
    distanceKm: 38.4,
    hospitalType: 'Medical College Retina Center',
    specialistName: 'Dr. K. Radhakrishnan, MS (Ophth)',
    specialistRole: 'Senior Vitreo-Retina Consultant',
    status: 'scheduled',
    transportAssistance: true,
    insuranceCovered: true,
    clinicalNotes: 'EMERGENCY CASE: Active NVD and threatening vitreous bleed. Tele-consult booked via tele-retina network. Free medical transit arranged.',
    lastUpdated: '2026-09-26 14:30',
  },
  {
    id: 'REF-2026-0411',
    screeningId: 'SCR-2026-8801',
    patientId: 'P-1025',
    healthId: 'MRN-8842-1002-3490',
    patientName: 'Rameshwar Prasad Patel',
    age: 58,
    gender: 'Male',
    phone: '+91 98451 22340',
    village: 'Mokila Sector 4',
    gpsLocation: {
      latitude: 17.4382,
      longitude: 78.1219,
      locationName: 'Mokila Field Station',
    },
    prediction: 'Moderate Diabetic Retinopathy',
    confidence: 94.2,
    priority: 'urgent',
    referralDate: '2026-09-27',
    scheduledDate: '2026-10-04',
    referredToHospital: 'District Specialty Eye Center',
    hospitalGps: {
      latitude: 17.4399,
      longitude: 78.3489,
      locationName: 'District Specialty Eye Center',
    },
    distanceKm: 24.1,
    hospitalType: 'Regional Eye Hospital',
    specialistName: 'Dr. Sneha Latha, MD (Ophth)',
    specialistRole: 'Consultant Ophthalmologist',
    status: 'pending',
    transportAssistance: false,
    insuranceCovered: true,
    clinicalNotes: 'Moderate NPDR with macular ring exudates. Referral slip issued. Follow-up SMS advisory dispatched.',
    lastUpdated: '2026-09-27 08:30',
  },
  {
    id: 'REF-2026-0410',
    screeningId: 'SCR-2026-8797',
    patientId: 'P-1021',
    healthId: 'MRN-7766-5544-3322',
    patientName: 'Venkat Reddy G.',
    age: 61,
    gender: 'Male',
    phone: '+91 98855 44332',
    village: 'Maharajpet Station',
    gpsLocation: {
      latitude: 17.4201,
      longitude: 78.0954,
      locationName: 'Maharajpet Camp',
    },
    prediction: 'Severe Non-Proliferative DR',
    confidence: 95.8,
    priority: 'urgent',
    referralDate: '2026-09-25',
    scheduledDate: '2026-09-30',
    referredToHospital: 'Advanced Tele-Ophthalmology Institute',
    hospitalGps: {
      latitude: 17.4412,
      longitude: 78.3812,
      locationName: 'Advanced Tele-Ophthalmology Institute',
    },
    distanceKm: 29.8,
    hospitalType: 'Tele-Ophthalmology Node',
    specialistName: 'Dr. Arvind Mehra, FRCS',
    specialistRole: 'Tele-Retina Specialist',
    status: 'triaged',
    transportAssistance: true,
    insuranceCovered: true,
    clinicalNotes: 'Severe NPDR (4-2-1 rule satisfied). Tele-triage completed via National Gateway. In-person angiogram requested.',
    lastUpdated: '2026-09-25 16:00',
  },
];

// Helper functions for storage
export const getStoredScreenings = (): ScreeningResult[] => {
  try {
    const raw = localStorage.getItem('dr_screenings_registry');
    if (!raw) {
      localStorage.setItem('dr_screenings_registry', JSON.stringify(INITIAL_SCREENINGS));
      return INITIAL_SCREENINGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SCREENINGS;
  }
};

export const saveScreeningToRegistry = (record: ScreeningResult) => {
  try {
    const current = getStoredScreenings();
    const updated = [record, ...current.filter((item) => item.id !== record.id)];
    localStorage.setItem('dr_screenings_registry', JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save to registry:', err);
  }
};

export const getStoredReferrals = (): ReferralRecord[] => {
  try {
    const raw = localStorage.getItem('dr_referrals_registry');
    if (!raw) {
      localStorage.setItem('dr_referrals_registry', JSON.stringify(INITIAL_REFERRALS));
      return INITIAL_REFERRALS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_REFERRALS;
  }
};

export const saveReferralToRegistry = (record: ReferralRecord) => {
  try {
    const current = getStoredReferrals();
    const updated = [record, ...current.filter((item) => item.id !== record.id)];
    localStorage.setItem('dr_referrals_registry', JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save referral to registry:', err);
  }
};
