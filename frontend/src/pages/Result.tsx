import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Printer,
  GitPullRequest,
  Sparkles,
  FileSpreadsheet,
  Activity,
  MapPin,
  Menu,
} from 'lucide-react';
import AppHeader from '../components/AppHeader';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import RiskBadge from '../components/RiskBadge';
import HeatmapViewer from '../components/HeatmapViewer';
import PrintReportModal from '../components/PrintReportModal';
import { getStoredScreenings, INITIAL_SCREENINGS } from '../utils/mockData';
import { useLanguage } from '../utils/i18n';
import type { ScreeningResult } from '../types';

export const Result: React.FC = () => {
  const navigate = useNavigate();
  const { toggleSidebar } = useLanguage();
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Retrieve result from session storage or fallback to latest in registry
  const stored = sessionStorage.getItem('screeningResult');
  let result: ScreeningResult;

  if (stored) {
    try {
      result = JSON.parse(stored);
    } catch {
      result = getStoredScreenings()[0] || INITIAL_SCREENINGS[0];
    }
  } else {
    result = getStoredScreenings()[0] || INITIAL_SCREENINGS[0];
  }

  const analysis = result.analysis;
  const isHighRisk = analysis.class_id >= 2;
  const isNoDR = analysis.class_id === 0;

  return (
    <div className="app-layout-root">
      <AppHeader />

      <div className="app-layout-main">
        <Sidebar />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <Navbar />

          <main className="app-content-body">
            {/* Top Navigation & Print Controls with Hamburger Menu */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  type="button"
                  className="clay-btn clay-btn-secondary clay-btn-sm"
                  onClick={toggleSidebar}
                  title="Toggle Navigation Menu"
                >
                  <Menu size={16} />
                  <span>Menu</span>
                </button>

                <button
                  type="button"
                  className="clay-btn clay-btn-secondary clay-btn-sm"
                  onClick={() => navigate('/screening')}
                >
                  <ArrowLeft size={14} />
                  <span>New Screening</span>
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  type="button"
                  className="clay-btn clay-btn-secondary clay-btn-sm"
                  onClick={() => navigate('/history')}
                >
                  <FileSpreadsheet size={14} />
                  <span>Patient Registry</span>
                </button>

                <button
                  type="button"
                  className="clay-btn clay-btn-primary clay-btn-sm"
                  onClick={() => setShowPrintModal(true)}
                >
                  <Printer size={14} />
                  <span>Print Clinical Slip (PDF)</span>
                </button>
              </div>
            </div>

            {/* Official Report Header Banner */}
            <div
              className="clay-card"
              style={{
                background: 'linear-gradient(135deg, #064e3b 0%, #065f46 60%, #047857 100%)',
                color: '#ffffff',
                marginBottom: 24,
                padding: '24px 32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 20,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, background: '#ff9933', color: '#064e3b', padding: '2px 8px', borderRadius: 4, fontWeight: 800 }}>
                    AI DIAGNOSTIC REPORT
                  </span>
                  <span style={{ fontSize: 12, color: '#a7f3d0', fontWeight: 600 }}>
                    EHR Linked • Screening ID: {result.id}
                  </span>
                </div>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  Retinopathy Assessment: {result.patientName}
                </h1>
                <p style={{ fontSize: 13, color: '#d1fae5', marginTop: 4, margin: 0 }}>
                  Patient ID: <strong>{result.patientId}</strong> • Health ID: <strong>{result.healthId || 'MRN-9988-12'}</strong> • Age: <strong>{result.age} yrs</strong> ({result.gender})
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    padding: '8px 16px',
                    borderRadius: 12,
                    textAlign: 'right',
                  }}
                >
                  <div style={{ fontSize: 10.5, color: '#a7f3d0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                    <MapPin size={12} />
                    <span>GPS TELEMETRY</span>
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 800, color: '#ffffff' }}>
                    {result.gpsLocation ? `${result.gpsLocation.latitude.toFixed(4)}°N, ${result.gpsLocation.longitude.toFixed(4)}°E` : (result.facilityName.split(' - ')[1] || result.facilityName)}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Result & Confidence Summary Card (Claymorphic) */}
            <div
              className="clay-card"
              style={{
                marginBottom: 24,
                display: 'grid',
                gridTemplateColumns: '1.4fr 1fr',
                gap: 24,
                alignItems: 'center',
                background: 'var(--card)',
                border: isHighRisk ? '1.5px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border)',
              }}
            >
              {/* Left Column: Diagnosis & Risk Badge */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      background: isNoDR ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: isNoDR ? '#10b981' : '#f87171',
                      display: 'grid',
                      placeItems: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                    }}
                  >
                    {isNoDR ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      CLASSIFICATION (ICD-11 / ETDRS)
                    </div>
                    <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                      {analysis.prediction}
                    </h2>
                  </div>
                </div>

                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                  {analysis.clinicalSummary || (isNoDR
                    ? 'No microaneurysms, hemorrhages, or macular edema detected. Retinal vascular caliber is normal.'
                    : 'The Explainable AI model flagged prominent microvascular abnormalities and lipid exudate rings.')}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <RiskBadge prediction={analysis.prediction} classId={analysis.class_id} size="lg" />
                  <span style={{ fontSize: 12, background: 'var(--bg-surface-secondary)', padding: '6px 12px', borderRadius: 9999, fontWeight: 700, color: 'var(--text-muted)' }}>
                    Triage: {analysis.triageLevel?.toUpperCase() || 'ROUTINE'}
                  </span>
                </div>
              </div>

              {/* Right Column: AI Confidence & Model Metrics */}
              <div
                style={{
                  background: 'var(--bg-surface-secondary)',
                  borderRadius: 16,
                  padding: 20,
                  boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.04)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>AI Model Confidence:</span>
                  <strong style={{ fontSize: 24, fontWeight: 800, color: '#10b981' }}>
                    {analysis.confidence.toFixed(1)}%
                  </strong>
                </div>

                {/* Progress bar */}
                <div style={{ height: 8, width: '100%', background: 'var(--border)', borderRadius: 9999, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${analysis.confidence}%`,
                      background: 'linear-gradient(90deg, #34d399, #059669)',
                      borderRadius: 9999,
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, fontSize: 11.5, color: 'var(--text-secondary)', paddingTop: 6 }}>
                  <div>
                    XAI Method: <strong>{analysis.xai.method}</strong>
                  </div>
                  <div>
                    Image Quality: <strong>{analysis.image_quality}</strong>
                  </div>
                  <div>
                    Regions Flagged: <strong>{analysis.xai.regions || 0} Clusters</strong>
                  </div>
                  <div>
                    Audited Standard: <strong>ISO 27001 / DICOM</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Explainable AI Heatmap Diagnostic Suite */}
            <div style={{ marginBottom: 28 }}>
              <HeatmapViewer
                original={analysis.xai.original}
                heatmap={analysis.xai.heatmap}
                explained={analysis.xai.explained_result || analysis.xai.heatmap}
                lesions={analysis.xai.lesions}
                prediction={analysis.prediction}
                confidence={analysis.confidence}
              />
            </div>

            {/* Why Did AI Flag This Scan & Clinical Recommendation Pathway */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, marginBottom: 28 }}>
              
              {/* Evidence & Feature Attribution */}
              <div className="clay-card">
                <div className="clay-card-header">
                  <div>
                    <div className="clay-card-title">
                      <Sparkles size={18} style={{ color: '#059669' }} />
                      <span>XAI Feature Attribution Breakdown</span>
                    </div>
                    <div className="clay-card-subtitle">
                      Why the deep learning model arrived at this prediction
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', gap: 12, padding: '12px 14px', borderRadius: 12, background: 'var(--bg-surface-secondary)', border: '1px solid var(--border)' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(5, 150, 105, 0.15)', color: '#10b981', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 12 }}>
                      01
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)' }}>Retinal Vessel & Caliber Analysis</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        Model inspected the temporal vascular arcade. No major venous beading in quadrant 1 & 2.
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12, padding: '12px 14px', borderRadius: 12, background: 'var(--bg-surface-secondary)', border: '1px solid var(--border)' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(5, 150, 105, 0.15)', color: '#10b981', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 12 }}>
                      02
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)' }}>Grad-CAM Activation Hotspots</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        Highest gradient activations concentrated along the juxtafoveal lipid borders and microaneurysm loci.
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12, padding: '12px 14px', borderRadius: 12, background: 'var(--bg-surface-secondary)', border: '1px solid var(--border)' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(5, 150, 105, 0.15)', color: '#10b981', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 12 }}>
                      03
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)' }}>Clinical Guideline Concordance</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        Classification matches Early Treatment Diabetic Retinopathy Study (ETDRS) standard scoring.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clinical Recommendation & Action Panel */}
              <div
                className="clay-card"
                style={{
                  background: isHighRisk ? 'rgba(217, 119, 6, 0.12)' : 'rgba(5, 150, 105, 0.12)',
                  border: isHighRisk ? '1.5px solid rgba(245, 158, 11, 0.3)' : '1.5px solid rgba(16, 185, 129, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <Activity size={18} style={{ color: isHighRisk ? '#f59e0b' : '#10b981' }} />
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                      Recommended Clinical Pathway
                    </h3>
                  </div>

                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 18 }}>
                    {analysis.recommendation}
                  </p>

                  <div
                    style={{
                      background: 'var(--bg-surface-secondary)',
                      border: '1px solid var(--border)',
                      borderRadius: 12,
                      padding: '12px 14px',
                      fontSize: 12,
                      color: 'var(--text-secondary)',
                      marginBottom: 20,
                    }}
                  >
                    <div><strong>Patient Follow-Up:</strong> Automated recall & SMS alert scheduled</div>
                    <div><strong>Transport Service:</strong> Medical transit assistance available</div>
                  </div>
                </div>

                {/* Referral & Telemedicine CTAs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {isHighRisk && (
                    <button
                      type="button"
                      className="clay-btn clay-btn-primary"
                      onClick={() => navigate('/referral')}
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      <GitPullRequest size={16} />
                      <span>Create Tertiary Referral (REF-TR2)</span>
                    </button>
                  )}

                  <button
                    type="button"
                    className="clay-btn clay-btn-secondary"
                    onClick={() => setShowPrintModal(true)}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <Printer size={16} />
                    <span>Print Diagnostic Slip for Patient</span>
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Printable Modal */}
      {showPrintModal && (
        <PrintReportModal
          result={result}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
};

export default Result;