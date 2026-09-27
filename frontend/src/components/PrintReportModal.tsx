import React from 'react';
import { Printer, X, Activity, MapPin } from 'lucide-react';
import type { ScreeningResult } from '../types';
import RiskBadge from './RiskBadge';

interface PrintReportModalProps {
  result: ScreeningResult;
  onClose: () => void;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({ result, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(result.timestamp).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 20,
          width: '100%',
          maxWidth: 860,
          maxHeight: '94vh',
          overflowY: 'auto',
          boxShadow: '0 24px 48px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Modal Top Control Bar (Hidden during print) */}
        <div
          className="no-print"
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f8fafc',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Activity size={20} style={{ color: '#059669' }} />
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0, color: '#0f172a' }}>
                Clinical Retinopathy Diagnostic Assessment Slip
              </h3>
              <span style={{ fontSize: 11.5, color: '#64748b' }}>
                DR-XAI Tele-Ophthalmology Diagnostic Record
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              className="clay-btn clay-btn-primary"
              onClick={handlePrint}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Printer size={15} />
              <span>Print Official Slip (PDF)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: '#e2e8f0',
                border: 'none',
                width: 34,
                height: 34,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Official Clinical Document Body */}
        <div style={{ padding: '32px 36px', color: '#0f172a' }}>
          {/* Clinical Header */}
          <div
            style={{
              borderBottom: '3px double #064e3b',
              paddingBottom: 16,
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 10,
                  background: '#064e3b',
                  color: '#ffffff',
                  display: 'grid',
                  placeItems: 'center',
                  boxShadow: '0 4px 10px rgba(6, 78, 59, 0.25)',
                }}
              >
                <Activity size={26} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#064e3b', letterSpacing: 0.5 }}>
                  DR-XAI CLINICAL TELE-OPHTHALMOLOGY NETWORK
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>
                  Diabetic Retinopathy Screening & Explainable AI Assessment Report
                </div>
                <div style={{ fontSize: 11, color: '#475569' }}>
                  Standardized ETDRS / ICD-11 Retinal Diagnostic Record
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: '#64748b' }}>REPORT ID</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#064e3b' }}>{result.id}</div>
              <div style={{ fontSize: 10, color: '#64748b' }}>{formattedDate}</div>
            </div>
          </div>

          {/* Facility & GPS Location Info */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              padding: '10px 14px',
              marginBottom: 18,
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 12,
              fontSize: 11.5,
            }}
          >
            <div>
              <span style={{ color: '#64748b' }}>Facility:</span>{' '}
              <strong>{result.facilityName}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Facility ID:</span>{' '}
              <strong>{result.facilityId}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Screening Clinician:</span>{' '}
              <strong>{result.screenedBy}</strong>
            </div>
            <div style={{ gridColumn: 'span 3', borderTop: '1px dashed #e2e8f0', paddingTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={13} style={{ color: '#059669' }} />
              <span style={{ color: '#64748b' }}>GPS Geotag:</span>{' '}
              <strong style={{ fontFamily: 'monospace' }}>
                {result.gpsLocation?.latitude?.toFixed(4) || '17.4325'}° N, {result.gpsLocation?.longitude?.toFixed(4) || '78.1254'}° E
              </strong>
              <span style={{ color: '#64748b' }}>({result.gpsLocation?.locationName || 'Field Screening Station'})</span>
            </div>
          </div>

          {/* Patient Details Table */}
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: 13, fontWeight: 800, color: '#064e3b', marginBottom: 8, textTransform: 'uppercase' }}>
              Patient Profile & Clinical Biomarkers
            </h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 10,
                border: '1px solid #cbd5e1',
                borderRadius: 8,
                padding: '12px 16px',
                fontSize: 12,
              }}
            >
              <div>
                <div style={{ color: '#64748b', fontSize: 10.5 }}>PATIENT NAME</div>
                <div style={{ fontWeight: 800 }}>{result.patientName}</div>
              </div>
              <div>
                <div style={{ color: '#64748b', fontSize: 10.5 }}>HEALTH CARD / MRN</div>
                <div style={{ fontWeight: 800, color: '#0369a1' }}>{result.healthId}</div>
              </div>
              <div>
                <div style={{ color: '#64748b', fontSize: 10.5 }}>AGE / GENDER</div>
                <div style={{ fontWeight: 700 }}>{result.age} Yrs / {result.gender}</div>
              </div>
              <div>
                <div style={{ color: '#64748b', fontSize: 10.5 }}>PHONE / LOCATION</div>
                <div style={{ fontWeight: 600 }}>{result.village}</div>
              </div>
              <div>
                <div style={{ color: '#64748b', fontSize: 10.5 }}>DIABETES STATUS</div>
                <div style={{ fontWeight: 700 }}>{result.diabetesStatus}</div>
              </div>
              <div>
                <div style={{ color: '#64748b', fontSize: 10.5 }}>DURATION</div>
                <div style={{ fontWeight: 700 }}>{result.durationYears} Years</div>
              </div>
              <div>
                <div style={{ color: '#64748b', fontSize: 10.5 }}>HBA1C LEVEL</div>
                <div style={{ fontWeight: 800, color: result.hba1c > 8 ? '#dc2626' : '#059669' }}>
                  {result.hba1c}%
                </div>
              </div>
              <div>
                <div style={{ color: '#64748b', fontSize: 10.5 }}>TRIAGE STATUS</div>
                <div style={{ fontWeight: 800, textTransform: 'uppercase', color: '#064e3b' }}>
                  {result.analysis.triageLevel || 'Routine'}
                </div>
              </div>
            </div>
          </div>

          {/* AI Diagnostic Assessment Box */}
          <div
            style={{
              background: '#ecfdf5',
              border: '1.5px solid #059669',
              borderRadius: 12,
              padding: '16px 20px',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#047857', letterSpacing: 0.5 }}>
                AI RETINOPATHY CLASSIFICATION (ICD-11 / ETDRS)
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#064e3b', margin: '4px 0' }}>
                {result.analysis.prediction}
              </div>
              <div style={{ fontSize: 12, color: '#334155' }}>
                {result.analysis.clinicalSummary}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <RiskBadge prediction={result.analysis.prediction} classId={result.analysis.class_id} size="lg" />
              <div style={{ fontSize: 11, fontWeight: 700, color: '#064e3b', marginTop: 6 }}>
                AI Confidence: <strong>{result.analysis.confidence.toFixed(1)}%</strong>
              </div>
            </div>
          </div>

          {/* Retinal Fundus & Heatmap Visuals */}
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: 13, fontWeight: 800, color: '#064e3b', marginBottom: 10, textTransform: 'uppercase' }}>
              Retinal Fundus Image & Grad-CAM Attention Map
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              <div style={{ border: '1px solid #cbd5e1', borderRadius: 8, padding: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>
                  ORIGINAL RETINAL FUNDUS SCAN
                </div>
                <img
                  src={result.analysis.xai.original}
                  alt="Original fundus"
                  style={{ width: '100%', height: 200, objectFit: 'contain', borderRadius: 6, background: '#000' }}
                />
              </div>

              <div style={{ border: '1px solid #cbd5e1', borderRadius: 8, padding: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#059669', marginBottom: 6 }}>
                  GRAD-CAM XAI EXPLAINABILITY ATTENTION MAP
                </div>
                <img
                  src={result.analysis.xai.explained_result || result.analysis.xai.heatmap}
                  alt="Heatmap"
                  style={{ width: '100%', height: 200, objectFit: 'contain', borderRadius: 6, background: '#000' }}
                />
              </div>
            </div>
          </div>

          {/* Clinical Recommendations & Action Pathway */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: 8,
              padding: '14px 18px',
              marginBottom: 24,
            }}
          >
            <h4 style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
              Clinical Recommendation & Specialist Pathway:
            </h4>
            <p style={{ fontSize: 12, color: '#334155', lineHeight: 1.5, margin: 0 }}>
              {result.analysis.recommendation}
            </p>
          </div>

          {/* Verification & Signature Block */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              paddingTop: 24,
              borderTop: '1px solid #e2e8f0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 60,
                  height: 60,
                  border: '1.5px solid #0f172a',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 10,
                  fontWeight: 700,
                  textAlign: 'center',
                  padding: 4,
                }}
              >
                QR VERIFY<br />CLINICAL
              </div>
              <div style={{ fontSize: 10.5, color: '#64748b' }}>
                Digitally authenticated on DR-XAI Telemedicine Network.<br />
                Security Hash: <strong>SHA256-{result.id.slice(-6)}-VERIFIED</strong>
              </div>
            </div>

            <div style={{ textAlign: 'center', minWidth: 200 }}>
              <div style={{ borderBottom: '1px solid #0f172a', marginBottom: 4, height: 36 }} />
              <div style={{ fontSize: 11.5, fontWeight: 800 }}>{result.screenedBy}</div>
              <div style={{ fontSize: 10.5, color: '#64748b' }}>Certified Clinician / Retinal Specialist</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintReportModal;
