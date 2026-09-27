export type DRGrade =
  | 'No DR'
  | 'Mild NPDR'
  | 'Moderate NPDR'
  | 'Severe NPDR'
  | 'Proliferative DR';

export type TriagePriority = 'emergency' | 'urgent' | 'routine';
export type ReferralStatus = 'pending' | 'triaged' | 'scheduled' | 'completed' | 'cancelled';

export interface GpsCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
  locationName?: string;
  timestamp?: string;
}

export interface PatientData {
  patientId: string;
  healthId: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  village: string;
  district: string;
  state: string;
  gpsLocation: GpsCoordinates;
  diabetesType: 'Type 1' | 'Type 2' | 'Gestational' | 'Pre-diabetic' | 'Unknown';
  durationYears: number;
  hba1c: number;
  systolicBP: number;
  diastolicBP: number;
  visualAcuityOD: string;
  visualAcuityOS: string;
  notes?: string;
}

export interface LesionFeature {
  name: string;
  count: number;
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
}

export interface XAIAnalysis {
  method: string;
  regions: number;
  original: string;
  heatmap: string;
  explained_result: string;
  lesions?: LesionFeature[];
  qualityScore?: number;
  illuminationScore?: number;
  clarityScore?: number;
}

export interface ScreeningResult {
  id: string;
  patientId: string;
  healthId: string;
  patientName: string;
  age: number;
  gender: string;
  phone: string;
  village: string;
  gpsLocation: GpsCoordinates;
  diabetesStatus: string;
  durationYears: number;
  hba1c: number;
  timestamp: string;
  facilityName: string;
  facilityId: string;
  screenedBy: string;
  
  success: boolean;
  filename: string;
  content_type: string;

  image?: {
    format: string | null;
    original_width: number;
    original_height: number;
    processed_width: number;
    processed_height: number;
    size_bytes: number;
  };

  analysis: {
    status: string;
    prediction: string;
    class_id: number;
    confidence: number;
    image_quality: string;
    xai: XAIAnalysis;
    recommendation: string;
    clinicalSummary?: string;
    triageLevel?: TriagePriority;
  };
}

export interface ReferralRecord {
  id: string;
  screeningId: string;
  patientId: string;
  healthId: string;
  patientName: string;
  age: number;
  gender: string;
  phone: string;
  village: string;
  gpsLocation: GpsCoordinates;
  prediction: string;
  confidence: number;
  priority: TriagePriority;
  referralDate: string;
  scheduledDate?: string;
  referredToHospital: string;
  hospitalGps: GpsCoordinates;
  distanceKm: number;
  hospitalType: 'Regional Eye Hospital' | 'Medical College Retina Center' | 'Tele-Ophthalmology Node' | 'Mobile Screening Unit';
  specialistName: string;
  specialistRole: string;
  status: ReferralStatus;
  transportAssistance: boolean;
  insuranceCovered: boolean;
  clinicalNotes: string;
  lastUpdated: string;
}

export interface UserProfile {
  id: string;
  name: string;
  role: 'Community Health Specialist' | 'Primary Care Physician' | 'Tele-Retina Consultant' | 'Clinical Director';
  facilityName: string;
  facilityId: string;
  licenseId: string;
  district: string;
  state: string;
  facilityGps: GpsCoordinates;
  isOnline: boolean;
}
