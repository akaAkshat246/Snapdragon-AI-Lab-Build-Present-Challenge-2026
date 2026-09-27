import React, { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Plus,
  Send,
  Video,
  MapPin,
  Truck,
  X,
} from 'lucide-react';
import AppHeader from '../components/AppHeader';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { getStoredReferrals, saveReferralToRegistry } from '../utils/mockData';
import type { ReferralRecord, TriagePriority } from '../types';

export const Referral: React.FC = () => {
  const [referrals, setReferrals] = useState<ReferralRecord[]>(getStoredReferrals());
  const [showNewModal, setShowNewModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'emergency' | 'scheduled' | 'completed'>('all');

  // New referral form state
  const [newReferral, setNewReferral] = useState({
    patientId: 'P-1027',
    patientName: 'K. Anjaiah',
    healthId: 'MRN-6655-4433-2211',
    age: 62,
    gender: 'Male',
    phone: '+91 98480 99887',
    village: 'Chandanagar Rural',
    gpsLocation: {
      latitude: 17.4891,
      longitude: 78.3284,
      locationName: 'Chandanagar Center',
    },
    prediction: 'Severe Non-Proliferative DR',
    confidence: 96.1,
    priority: 'urgent' as TriagePriority,
    referredToHospital: 'Regional Retina Center & Eye Hospital',
    hospitalGps: {
      latitude: 17.4128,
      longitude: 78.4751,
      locationName: 'Regional Retina Center',
    },
    distanceKm: 28.5,
    hospitalType: 'District Eye Hospital' as any,
    specialistName: 'Dr. Sneha Latha, MD (Ophth)',
    specialistRole: 'Tertiary Retina Specialist',
    clinicalNotes: 'Severe NPDR with cotton wool infarcts and macular circinate ring. Urgent biomicroscopy requested.',
    transportAssistance: true,
    insuranceCovered: true,
  });

  const handleCreateReferral = (e: React.FormEvent) => {
    e.preventDefault();
    const created: ReferralRecord = {
      id: `REF-2026-0${Math.floor(400 + Math.random() * 600)}`,
      screeningId: `SCR-2026-${Math.floor(8000 + Math.random() * 1000)}`,
      ...newReferral,
      referralDate: new Date().toISOString().slice(0, 10),
      scheduledDate: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
      status: 'pending',
      lastUpdated: 'Just now',
    };

    saveReferralToRegistry(created);
    setReferrals([created, ...referrals]);
    setShowNewModal(false);
    alert(`Referral ${created.id} generated successfully with GPS telemetry and tertiary hospital notification.`);
  };

  const filteredReferrals = referrals.filter((r) => {
    if (activeTab === 'emergency') return r.priority === 'emergency';
    if (activeTab === 'scheduled') return r.status === 'scheduled';
    if (activeTab === 'completed') return r.status === 'completed';
    return true;
  });

  return (
    <div className="app-layout-root">
      <AppHeader />

      <div className="app-layout-main">
        <Sidebar />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <Navbar />

          <main className="app-content-body">
            {/* Header */}
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
                <div style={{ fontSize: 11, background: '#ff9933', color: '#064e3b', padding: '2px 8px', borderRadius: 4, fontWeight: 800, display: 'inline-block', marginBottom: 6 }}>
                  CLINICAL TELE-OPHTHALMOLOGY PIPELINE
                </div>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  Tertiary Eye Care Referral & Tele-Consult Hub
                </h1>
                <p style={{ fontSize: 13, color: '#d1fae5', marginTop: 4, margin: 0 }}>
                  Manage urgent clinical escalations, tele-ophthalmology consultations, and GPS-tracked patient transit pathways.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  type="button"
                  className="clay-btn"
                  onClick={() => setShowNewModal(true)}
                  style={{
                    background: '#ff9933',
                    color: '#064e3b',
                    boxShadow: '0 6px 18px rgba(255, 153, 51, 0.4)',
                    fontWeight: 800,
                  }}
                >
                  <Plus size={18} />
                  <span>Create Clinical Referral</span>
                </button>
              </div>
            </div>

            {/* Referral Triage Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 24 }}>
              <div className="clay-card" style={{ borderLeft: '4px solid #dc2626' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#f87171' }}>EMERGENCY TRIAGE (&lt;24H)</div>
                  <AlertTriangle size={18} style={{ color: '#f87171' }} />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-main)' }}>
                  {referrals.filter((r) => r.priority === 'emergency').length} Cases
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                  Proliferative DR / Vitreous Hemorrhage threat. Immediate laser photocoagulation arranged.
                </p>
              </div>

              <div className="clay-card" style={{ borderLeft: '4px solid #d97706' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#fbbf24' }}>URGENT REVIEW (&lt;7 DAYS)</div>
                  <Clock size={18} style={{ color: '#fbbf24' }} />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-main)' }}>
                  {referrals.filter((r) => r.priority === 'urgent').length} Cases
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                  Severe NPDR with macular ring exudates. Dilated biomicroscopy & OCT at Tertiary Eye Center.
                </p>
              </div>

              <div className="clay-card" style={{ borderLeft: '4px solid #059669' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#34d399' }}>COMPLETED & DISCHARGED</div>
                  <CheckCircle2 size={18} style={{ color: '#34d399' }} />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-main)' }}>
                  {referrals.filter((r) => r.status === 'completed').length} Patients
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                  Post-laser discharge summaries synced back to central electronic health records.
                </p>
              </div>
            </div>

            {/* Filter Tabs */}
            <div
              className="clay-card"
              style={{
                padding: '14px 20px',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  className={`clay-btn clay-btn-sm ${activeTab === 'all' ? 'clay-btn-primary' : 'clay-btn-secondary'}`}
                  onClick={() => setActiveTab('all')}
                >
                  All Referrals ({referrals.length})
                </button>
                <button
                  type="button"
                  className={`clay-btn clay-btn-sm ${activeTab === 'emergency' ? 'clay-btn-primary' : 'clay-btn-secondary'}`}
                  onClick={() => setActiveTab('emergency')}
                >
                  Emergency Triage
                </button>
                <button
                  type="button"
                  className={`clay-btn clay-btn-sm ${activeTab === 'scheduled' ? 'clay-btn-primary' : 'clay-btn-secondary'}`}
                  onClick={() => setActiveTab('scheduled')}
                >
                  Tele-Consult Scheduled
                </button>
                <button
                  type="button"
                  className={`clay-btn clay-btn-sm ${activeTab === 'completed' ? 'clay-btn-primary' : 'clay-btn-secondary'}`}
                  onClick={() => setActiveTab('completed')}
                >
                  Treatment Completed
                </button>
              </div>

              <div style={{ fontSize: 12, color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                <span>Tele-Ophthalmology Network: Online</span>
              </div>
            </div>

            {/* Referrals Pipeline Table */}
            <div className="clay-table-container">
              <table className="clay-table">
                <thead>
                  <tr>
                    <th>Referral ID / Date</th>
                    <th>Patient Demographics</th>
                    <th>DR Assessment</th>
                    <th>Triage Priority</th>
                    <th>Referred Specialist & Hospital</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReferrals.map((ref) => (
                    <tr key={ref.id}>
                      <td>
                        <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{ref.id}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Date: {ref.referralDate}</div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{ref.patientName}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          {ref.patientId} • {ref.age} Yrs / {ref.gender}
                        </div>
                        <div style={{ fontSize: 11, color: '#0284c7', fontFamily: 'monospace' }}>
                          Health ID: {ref.healthId || 'N/A'}
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 700, fontSize: 12.5, color: 'var(--text-main)' }}>{ref.prediction}</div>
                        <div style={{ fontSize: 11, color: '#10b981' }}>
                          Confidence: {ref.confidence.toFixed(1)}%
                        </div>
                      </td>

                      <td>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '4px 10px',
                            borderRadius: 9999,
                            fontSize: 11,
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            background: ref.priority === 'emergency' ? 'rgba(239, 68, 68, 0.18)' : 'rgba(245, 158, 11, 0.18)',
                            color: ref.priority === 'emergency' ? '#f87171' : '#fbbf24',
                            border: ref.priority === 'emergency' ? '1px solid rgba(248, 113, 113, 0.3)' : '1px solid rgba(251, 191, 36, 0.3)',
                          }}
                        >
                          {ref.priority}
                        </span>
                        {ref.transportAssistance && (
                          <div style={{ fontSize: 10.5, color: '#10b981', fontWeight: 700, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Truck size={12} />
                            <span>Medical Transit</span>
                          </div>
                        )}
                      </td>

                      <td>
                        <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--text-main)' }}>{ref.specialistName}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{ref.referredToHospital}</div>
                        {ref.distanceKm && (
                          <div style={{ fontSize: 10.5, color: '#0284c7', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
                            <MapPin size={10} />
                            <span>{ref.distanceKm} km GPS Distance</span>
                          </div>
                        )}
                      </td>

                      <td>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: 6,
                            fontSize: 11.5,
                            fontWeight: 700,
                            textTransform: 'capitalize',
                            background:
                              ref.status === 'completed'
                                ? 'rgba(16, 185, 129, 0.15)'
                                : ref.status === 'scheduled'
                                ? 'rgba(56, 189, 248, 0.15)'
                                : 'var(--bg-surface-secondary)',
                            color:
                              ref.status === 'completed'
                                ? '#34d399'
                                : ref.status === 'scheduled'
                                ? '#38bdf8'
                                : 'var(--text-muted)',
                            border: '1px solid var(--border)',
                          }}
                        >
                          {ref.status}
                        </span>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 6 }}>
                          <button
                            type="button"
                            className="clay-btn clay-btn-primary clay-btn-sm"
                            onClick={() => alert(`Launching Clinical Tele-Consultation Room for Patient ${ref.patientName}...`)}
                            title="Join Tele-Consultation"
                          >
                            <Video size={13} />
                            <span>Tele-Consult</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>

      {/* New Referral Modal */}
      {showNewModal && (
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
            className="clay-card"
            style={{
              width: '100%',
              maxWidth: 680,
              background: 'var(--card)',
              color: 'var(--card-foreground)',
              padding: 32,
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Create Tertiary Eye Care Referral (REF-TR2)
                </h3>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Clinical Tele-Ophthalmology Network • GPS Geotagged
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateReferral} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="clay-input-group">
                  <label className="clay-label">Patient Name</label>
                  <input
                    type="text"
                    value={newReferral.patientName}
                    onChange={(e) => setNewReferral({ ...newReferral, patientName: e.target.value })}
                    className="clay-input"
                    required
                  />
                </div>

                <div className="clay-input-group">
                  <label className="clay-label">Health ID / MRN</label>
                  <input
                    type="text"
                    value={newReferral.healthId}
                    onChange={(e) => setNewReferral({ ...newReferral, healthId: e.target.value })}
                    className="clay-input"
                    required
                  />
                </div>

                <div className="clay-input-group">
                  <label className="clay-label">Triage Priority Level</label>
                  <select
                    value={newReferral.priority}
                    onChange={(e) => setNewReferral({ ...newReferral, priority: e.target.value as any })}
                    className="clay-select"
                  >
                    <option value="emergency">Emergency (&lt;24 Hours - PDR threat)</option>
                    <option value="urgent">Urgent (&lt;7 Days - Severe NPDR)</option>
                    <option value="routine">Routine (1 Month - Moderate NPDR)</option>
                  </select>
                </div>

                <div className="clay-input-group">
                  <label className="clay-label">Referred Tertiary Hospital</label>
                  <select
                    value={newReferral.referredToHospital}
                    onChange={(e) => setNewReferral({ ...newReferral, referredToHospital: e.target.value })}
                    className="clay-select"
                  >
                    <option value="Regional Retina Center & Eye Hospital">
                      Regional Retina Center (38.4 km away)
                    </option>
                    <option value="District Specialty Eye Center">
                      District Specialty Eye Center (24.1 km away)
                    </option>
                    <option value="Advanced Tele-Ophthalmology Institute">
                      Advanced Tele-Ophthalmology Institute (29.8 km away)
                    </option>
                  </select>
                </div>
              </div>

              <div className="clay-input-group">
                <label className="clay-label">Clinical Observations & Biomarkers</label>
                <textarea
                  rows={3}
                  value={newReferral.clinicalNotes}
                  onChange={(e) => setNewReferral({ ...newReferral, clinicalNotes: e.target.value })}
                  className="clay-input"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 20, fontSize: 12.5, color: 'var(--text-secondary)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={newReferral.transportAssistance}
                    onChange={(e) => setNewReferral({ ...newReferral, transportAssistance: e.target.checked })}
                    style={{ accentColor: '#059669' }}
                  />
                  <span>Arrange Medical Transport Assistance</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={newReferral.insuranceCovered}
                    onChange={(e) => setNewReferral({ ...newReferral, insuranceCovered: e.target.checked })}
                    style={{ accentColor: '#059669' }}
                  />
                  <span>Health Coverage / Insurance Verified</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
                <button
                  type="button"
                  className="clay-btn clay-btn-secondary"
                  onClick={() => setShowNewModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="clay-btn clay-btn-primary"
                >
                  <Send size={15} />
                  <span>Dispatch Referral & Alert Specialist</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Referral;