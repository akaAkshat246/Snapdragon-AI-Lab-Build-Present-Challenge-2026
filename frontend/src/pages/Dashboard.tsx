import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ScanEye,
  Users,
  AlertTriangle,
  GitPullRequest,
  ShieldCheck,
  FileSpreadsheet,
  Calendar,
  Building2,
  ChevronRight,
  Filter,
  Navigation,
  MapPin,
  ArrowUpRight,
} from 'lucide-react';
import AppHeader from '../components/AppHeader';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import RiskBadge from '../components/RiskBadge';
import {
  PrevalenceDonutChart,
  ScreeningTrendChart,
  AgeGroupBarChart,
} from '../components/Charts';
import { getStoredScreenings, CURRENT_USER } from '../utils/mockData';
import { useGeolocation, calculateDistanceKm } from '../hooks/useGeolocation';
import type { ScreeningResult } from '../types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const screenings = getStoredScreenings();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'high_risk' | 'normal'>('all');
  const { location, isLocating, detectLocation } = useGeolocation();

  const highRiskCount = screenings.filter((s) => s.analysis.class_id >= 3).length;
  const referralCount = screenings.filter((s) => s.analysis.class_id >= 2).length;
  const noDrCount = screenings.filter((s) => s.analysis.class_id === 0).length;

  const filteredScreenings = screenings.filter((s) => {
    if (selectedFilter === 'high_risk') return s.analysis.class_id >= 2;
    if (selectedFilter === 'normal') return s.analysis.class_id === 0;
    return true;
  });

  const handleOpenResult = (item: ScreeningResult) => {
    sessionStorage.setItem('screeningResult', JSON.stringify(item));
    navigate('/result');
  };

  // Distance to Regional Eye Hospital (17.4128, 78.4751)
  const distToTertiary = calculateDistanceKm(location.latitude, location.longitude, 17.4128, 78.4751);
  // Distance to District Eye Center (17.4399, 78.3489)
  const distToDistrict = calculateDistanceKm(location.latitude, location.longitude, 17.4399, 78.3489);

  return (
    <div className="app-layout-root">
      <AppHeader />

      <div className="app-layout-main">
        <Sidebar />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <Navbar />

          <main className="app-content-body">
            {/* Top Greeting & PHC Health Facility telemetry strip */}
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
              <div style={{ maxWidth: 700 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, background: '#38bdf8', color: '#064e3b', padding: '2px 8px', borderRadius: 4, fontWeight: 800 }}>
                    CLINICAL AI WORKSPACE
                  </span>
                  <span style={{ fontSize: 12, color: '#a7f3d0', fontWeight: 600 }}>
                    {CURRENT_USER.facilityName} • Facility ID: {CURRENT_USER.facilityId}
                  </span>
                </div>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
                  Welcome, {CURRENT_USER.name}
                </h1>
                <p style={{ fontSize: 13, color: '#d1fae5', marginTop: 4, margin: 0 }}>
                  Active screening terminal for Diabetic Retinopathy. AI models are calibrated with Grad-CAM visual explainability and GPS field geotagging.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  type="button"
                  className="clay-btn clay-btn-secondary"
                  onClick={() => navigate('/history')}
                >
                  <FileSpreadsheet size={16} />
                  <span>Patient Register</span>
                </button>

                <button
                  type="button"
                  className="clay-btn"
                  onClick={() => navigate('/screening')}
                  style={{
                    background: '#38bdf8',
                    color: '#064e3b',
                    boxShadow: '0 6px 18px rgba(56, 189, 248, 0.4)',
                    fontWeight: 800,
                  }}
                >
                  <ScanEye size={18} />
                  <span>Start Retinal Screening</span>
                </button>
              </div>
            </div>

            {/* GPS Telemetry & Nearest Referral Hospitals Card */}
            <div
              className="clay-card"
              style={{
                marginBottom: 24,
                padding: '16px 24px',
                background: 'var(--bg-surface-secondary)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: '#dcfce7',
                    color: '#15803d',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <Navigation size={20} className={isLocating ? 'animate-spin' : ''} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <strong style={{ fontSize: 13, color: 'var(--text-main)' }}>Live GPS Facility Coordinates</strong>
                    <span style={{ fontSize: 10.5, fontWeight: 700, background: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: 4 }}>
                      GEOTAGGED
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, fontFamily: 'monospace' }}>
                    Latitude: <strong>{location.latitude.toFixed(4)}° N</strong> • Longitude: <strong>{location.longitude.toFixed(4)}° E</strong> (Accuracy: ±{location.accuracy || 4}m • Alt: {location.altitude || 530}m)
                  </div>
                </div>
              </div>

              {/* Hospital Distances */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Nearest Specialty Eye Hospital</div>
                  <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                    <MapPin size={13} style={{ color: '#059669' }} />
                    <span>{distToDistrict} km (District Eye Center)</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Tertiary Retina Care Center</div>
                  <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                    <MapPin size={13} style={{ color: '#0284c7' }} />
                    <span>{distToTertiary} km (Regional Retina Center)</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="clay-btn clay-btn-secondary clay-btn-sm"
                  onClick={detectLocation}
                  disabled={isLocating}
                >
                  <Navigation size={13} className={isLocating ? 'animate-spin' : ''} />
                  <span>{isLocating ? 'Locating...' : 'Refresh GPS'}</span>
                </button>
              </div>
            </div>

            {/* Key Stats Grid (Claymorphic) */}
            <div className="clay-stat-grid">
              <StatCard
                label="Total Screenings (Month)"
                value="738"
                subtext="24 Screenings recorded today"
                icon={<ScanEye size={24} />}
                theme="emerald"
                trend={{ value: '+14% vs last month', isPositive: true }}
                progressPercent={82}
              />

              <StatCard
                label="High-Risk Flagged (Level 3-4)"
                value={highRiskCount.toString().padStart(2, '0')}
                subtext="Needs urgent photocoagulation"
                icon={<AlertTriangle size={24} />}
                theme="red"
                trend={{ value: '3 Critical cases', isPositive: false }}
                progressPercent={45}
              />

              <StatCard
                label="Active Hospital Referrals"
                value={referralCount.toString().padStart(2, '0')}
                subtext="Dispatched to Specialty Eye Centers"
                icon={<GitPullRequest size={24} />}
                theme="amber"
                trend={{ value: '3 Tele-Consults Booked', isPositive: true }}
                progressPercent={65}
              />

              <StatCard
                label="No DR / Normal (Clean)"
                value={noDrCount.toString().padStart(2, '0')}
                subtext="Enrolled in 1-Year routine recall"
                icon={<Users size={24} />}
                theme="blue"
                trend={{ value: 'Annual Recall', isNeutral: true }}
                progressPercent={92}
              />
            </div>

            {/* Charts & Analytics Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 24, marginBottom: 28 }}>
              {/* Left Chart: DR Severity Breakdown (Donut) */}
              <div className="clay-card">
                <div className="clay-card-header">
                  <div>
                    <div className="clay-card-title">
                      <ShieldCheck size={18} style={{ color: '#059669' }} />
                      <span>Retinopathy Severity Distribution</span>
                    </div>
                    <div className="clay-card-subtitle">
                      ICD-11 & ETDRS clinical classification breakdown
                    </div>
                  </div>
                  <span style={{ fontSize: 11, background: 'var(--muted)', padding: '4px 8px', borderRadius: 6, fontWeight: 700, color: 'var(--text-muted)' }}>
                    738 Patients
                  </span>
                </div>

                <PrevalenceDonutChart />
              </div>

              {/* Right Chart: Screening Trends (Area Line) */}
              <div className="clay-card">
                <div className="clay-card-header">
                  <div>
                    <div className="clay-card-title">
                      <Calendar size={18} style={{ color: '#059669' }} />
                      <span>Screening Throughput & High-Risk Triage</span>
                    </div>
                    <div className="clay-card-subtitle">
                      Daily volume trends across rural clinic catchment area
                    </div>
                  </div>
                </div>

                <ScreeningTrendChart />

                <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', marginBottom: 12 }}>
                    Retinopathy Prevalence by Age Group
                  </div>
                  <AgeGroupBarChart />
                </div>
              </div>
            </div>

            {/* Recent Screenings Patient Queue */}
            <div className="clay-card" style={{ marginBottom: 28 }}>
              <div className="clay-card-header">
                <div>
                  <div className="clay-card-title">
                    <Users size={18} style={{ color: '#059669' }} />
                    <span>Recent Patient Retinal Assessments</span>
                  </div>
                  <div className="clay-card-subtitle">
                    Real-time AI inference results and triage pathway
                  </div>
                </div>

                {/* Filter buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Filter size={14} style={{ color: 'var(--text-muted)' }} />
                  <button
                    type="button"
                    className={`clay-btn clay-btn-sm ${selectedFilter === 'all' ? 'clay-btn-primary' : 'clay-btn-secondary'}`}
                    onClick={() => setSelectedFilter('all')}
                  >
                    All ({screenings.length})
                  </button>
                  <button
                    type="button"
                    className={`clay-btn clay-btn-sm ${selectedFilter === 'high_risk' ? 'clay-btn-primary' : 'clay-btn-secondary'}`}
                    onClick={() => setSelectedFilter('high_risk')}
                  >
                    High-Risk ({highRiskCount + referralCount})
                  </button>
                  <button
                    type="button"
                    className={`clay-btn clay-btn-sm ${selectedFilter === 'normal' ? 'clay-btn-primary' : 'clay-btn-secondary'}`}
                    onClick={() => setSelectedFilter('normal')}
                  >
                    Normal ({noDrCount})
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="clay-table-container" style={{ boxShadow: 'none', border: '1px solid var(--border)' }}>
                <table className="clay-table">
                  <thead>
                    <tr>
                      <th>Patient ID / Health Card</th>
                      <th>Patient Name</th>
                      <th>Age / Location</th>
                      <th>AI DR Grade</th>
                      <th>Confidence</th>
                      <th>GPS Geotag</th>
                      <th>Screening Date</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredScreenings.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{item.patientId}</div>
                          <div style={{ fontSize: 11, color: '#0284c7', fontFamily: 'monospace' }}>
                            {item.healthId}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700 }}>{item.patientName}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                            {item.diabetesStatus} ({item.durationYears} yrs)
                          </div>
                        </td>
                        <td>
                          <div>{item.age} Yrs • {item.gender}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.village.split(',')[0]}</div>
                        </td>
                        <td>
                          <RiskBadge prediction={item.analysis.prediction} classId={item.analysis.class_id} />
                        </td>
                        <td>
                          <div style={{ fontWeight: 800, color: '#10b981' }}>
                            {item.analysis.confidence.toFixed(1)}%
                          </div>
                          <div style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>
                            {item.analysis.xai.method}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#10b981', fontWeight: 600 }}>
                            {item.gpsLocation?.latitude?.toFixed(2)}°N, {item.gpsLocation?.longitude?.toFixed(2)}°E
                          </div>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                            {item.gpsLocation?.locationName?.split(' ')[0] || 'Field Station'}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: 12.5, fontWeight: 600 }}>
                            {new Date(item.timestamp).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </div>
                          <div style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>
                            {new Date(item.timestamp).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            className="clay-btn clay-btn-secondary clay-btn-sm"
                            onClick={() => handleOpenResult(item)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                          >
                            <span>View XAI Report</span>
                            <ChevronRight size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Clinical Tools Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
              <div className="clay-card" style={{ background: 'var(--bg-surface-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <Building2 size={20} style={{ color: '#059669' }} />
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                    Tele-Retina Consultation Hub
                  </h3>
                </div>
                <p style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 16 }}>
                  Directly connect rural field clinic patients with high-risk diabetic retinopathy to specialist ophthalmologists.
                </p>
                <button
                  type="button"
                  className="clay-btn clay-btn-primary clay-btn-sm"
                  onClick={() => navigate('/referral')}
                >
                  <GitPullRequest size={14} />
                  <span>Open Referral Hub</span>
                </button>
              </div>

              <div className="clay-card" style={{ background: 'var(--bg-surface-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <FileSpreadsheet size={20} style={{ color: '#d97706' }} />
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                    Clinical Registry Export
                  </h3>
                </div>
                <p style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 16 }}>
                  Export standardized CSV and Excel datasets of all retinal screenings with GPS geotag metadata for clinical audits.
                </p>
                <button
                  type="button"
                  className="clay-btn clay-btn-secondary clay-btn-sm"
                  onClick={() => navigate('/history')}
                >
                  <ArrowUpRight size={14} />
                  <span>Export Registry Data</span>
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;