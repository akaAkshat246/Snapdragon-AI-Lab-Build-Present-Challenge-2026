import React, { useState } from 'react';
import { ShieldCheck, Lock, Activity, PhoneCall, HelpCircle, FileCheck, MapPin, ExternalLink, X } from 'lucide-react';

export const AppFooter: React.FC = () => {
  const [modalContent, setModalContent] = useState<{ title: string; content: React.ReactNode } | null>(null);

  const openDoc = (title: string, content: React.ReactNode) => {
    setModalContent({ title, content });
  };

  return (
    <>
      <footer className="gov-footer no-print" style={{ background: '#0a192f', color: '#e2e8f0', padding: '40px 28px 24px', borderTop: '2px solid #059669' }}>
        <div className="gov-footer-grid" style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32, marginBottom: 32 }}>
          
          {/* Column 1: Clinical Platform Mission */}
          <div className="gov-footer-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: '#059669',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#ffffff',
                  fontWeight: 800,
                }}
              >
                <Activity size={20} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#ffffff' }}>DR-XAI Clinical Intelligence</h4>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>Retinal Screening & Tele-Ophthalmology</span>
              </div>
            </div>
            <p style={{ fontSize: 12.5, color: '#94a3b8', lineHeight: 1.6, marginBottom: 14 }}>
              An explainable AI-powered retinal assessment and tele-consultation platform designed for rural clinics, mobile screening camps, and primary care centers to detect diabetic retinopathy early and streamline secondary eye care referrals.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#38bdf8', fontSize: 11.5, fontWeight: 600 }}>
              <MapPin size={14} />
              <span>GPS-Tagged Field Telemetry & Geotagged Clinical Records</span>
            </div>
          </div>

          {/* Column 2: Clinical Resources & External Links */}
          <div className="gov-footer-col">
            <h4 style={{ fontSize: 14, fontWeight: 800, color: '#ffffff', marginBottom: 14 }}>Clinical Intelligence & Tools</h4>
            <ul className="gov-footer-links" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12.5 }}>
              <li>
                <a
                  href="/login#tele-retina"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                >
                  <ExternalLink size={12} style={{ color: '#059669' }} />
                  <span>Tele-Retina Consultation Gateway</span>
                </a>
              </li>
              <li>
                <a
                  href="/login#etdrs-protocols"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                >
                  <ExternalLink size={12} style={{ color: '#059669' }} />
                  <span>ETDRS Retinopathy Classification Guidelines</span>
                </a>
              </li>
              <li>
                <a
                  href="/login#xai-audit"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                >
                  <ExternalLink size={12} style={{ color: '#059669' }} />
                  <span>Grad-CAM Explainable AI Biomarker Reference</span>
                </a>
              </li>
              <li>
                <a
                  href="/login#hospital-directory"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                >
                  <ExternalLink size={12} style={{ color: '#059669' }} />
                  <span>Regional Referral Eye Hospital Directory</span>
                </a>
              </li>
              <li>
                <a
                  href="/login#mobile-units"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                >
                  <ExternalLink size={12} style={{ color: '#059669' }} />
                  <span>Mobile Fundus Screening Camp Protocols</span>
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openDoc('NHM Infrastructure MIS & Facility Matrix', (
                    <div>
                      <p><strong>National Health Mission Verified MIS (Status as of 30 June 2024):</strong></p>
                      <ul>
                        <li><strong>167,275</strong> Sub-centres (Ayushman Arogya Mandirs) - 83.6%</li>
                        <li><strong>26,636</strong> Primary Health Centres (PHCs) - 13.3%</li>
                        <li><strong>6,155</strong> Community Health Centres (CHCs) - 3.1%</li>
                        <li><strong>200,066</strong> Total Public Health Facilities Nationwide</li>
                      </ul>
                      <p style={{ fontSize: 12, color: '#64748b' }}>Offline AI triage deployed at sub-centres and PHCs with asynchronous referral to CHCs and Tertiary Eye Care institutes.</p>
                    </div>
                  ))}
                  style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 6, color: '#38bdf8', fontSize: 12, cursor: 'pointer', marginTop: 4 }}
                >
                  <ExternalLink size={12} />
                  <span>External Reference: NHM Infrastructure (MIS 2024)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Security & Governance */}
          <div className="gov-footer-col">
            <h4 style={{ fontSize: 14, fontWeight: 800, color: '#ffffff', marginBottom: 14 }}>Clinical Governance & Security</h4>
            <ul className="gov-footer-links" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#cbd5e1' }}>
                <Lock size={13} style={{ color: '#10b981', flexShrink: 0 }} />
                <span>HIPAA & GDPR Data Privacy Architecture</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#cbd5e1' }}>
                <FileCheck size={13} style={{ color: '#10b981', flexShrink: 0 }} />
                <span>ICD-11 & ETDRS Retinopathy Classification</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#cbd5e1' }}>
                <ShieldCheck size={13} style={{ color: '#10b981', flexShrink: 0 }} />
                <span>End-to-End Encrypted Tele-Consultation</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#cbd5e1' }}>
                <HelpCircle size={13} style={{ color: '#38bdf8', flexShrink: 0 }} />
                <span>Grad-CAM Feature Attribution Visual Audit Logs</span>
              </li>
            </ul>
          </div>

          {/* Column 4: 24x7 Clinical Support */}
          <div className="gov-footer-col">
            <h4 style={{ fontSize: 14, fontWeight: 800, color: '#ffffff', marginBottom: 14 }}>Clinical Support Network</h4>
            <div
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                padding: 14,
                marginBottom: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#38bdf8', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
                <PhoneCall size={14} />
                <span>Clinical Line: 1800-RETINA-AI</span>
              </div>
              <div style={{ fontSize: 11.5, color: '#94a3b8', lineHeight: 1.4 }}>
                24/7 technical and clinical support for field health workers and ophthalmology consult nodes.
              </div>
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>
              System Architecture: <strong>DR-XAI Distributed Clinical Suite v2.4</strong>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div
          className="gov-footer-bottom"
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            paddingTop: 18,
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            fontSize: 12,
            color: '#94a3b8',
          }}
        >
          <div>
            © 2026 DR-XAI Clinical Healthcare Platform. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <span>Security Status: <strong style={{ color: '#34d399' }}>Encrypted & Validated</strong></span>
            <span>•</span>
            <span>GPS Telemetry: <strong style={{ color: '#38bdf8' }}>Active</strong></span>
            <span>•</span>
            <span>Version: <strong style={{ color: '#ffffff' }}>v2.4.2 Clinical Production</strong></span>
          </div>
        </div>
      </footer>

      {/* Quick External Document Dialog Modal */}
      {modalContent && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 20,
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            className="clay-card"
            style={{
              maxWidth: 540,
              width: '100%',
              background: 'var(--card)',
              border: '1px solid var(--border)',
              padding: 24,
              borderRadius: 16,
              boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{modalContent.title}</h3>
              <button
                type="button"
                onClick={() => setModalContent(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {modalContent.content}
            </div>
            <div style={{ marginTop: 20, textAlign: 'right' }}>
              <button
                type="button"
                className="clay-btn clay-btn-primary clay-btn-sm"
                onClick={() => setModalContent(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const GovFooter = AppFooter;
export default AppFooter;
