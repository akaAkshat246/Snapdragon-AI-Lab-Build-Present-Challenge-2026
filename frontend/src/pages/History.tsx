import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Download,
  Printer,
  ChevronRight,
  ScanEye,
  MapPin,
} from 'lucide-react';
import AppHeader from '../components/AppHeader';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import RiskBadge from '../components/RiskBadge';
import PrintReportModal from '../components/PrintReportModal';
import { getStoredScreenings, CURRENT_USER } from '../utils/mockData';
import type { ScreeningResult } from '../types';

export const History: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [selectedResult, setSelectedResult] = useState<ScreeningResult | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const allScreenings = getStoredScreenings();

  // Filter logic
  const filteredList = useMemo(() => {
    return allScreenings.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.patientName.toLowerCase().includes(q) ||
        item.patientId.toLowerCase().includes(q) ||
        (item.healthId && item.healthId.toLowerCase().includes(q)) ||
        item.village.toLowerCase().includes(q);

      let matchesSeverity = true;
      if (severityFilter === 'normal') {
        matchesSeverity = item.analysis.class_id === 0;
      } else if (severityFilter === 'mild') {
        matchesSeverity = item.analysis.class_id === 1;
      } else if (severityFilter === 'moderate') {
        matchesSeverity = item.analysis.class_id === 2;
      } else if (severityFilter === 'severe') {
        matchesSeverity = item.analysis.class_id === 3;
      } else if (severityFilter === 'pdr') {
        matchesSeverity = item.analysis.class_id === 4;
      } else if (severityFilter === 'high_risk') {
        matchesSeverity = item.analysis.class_id >= 2;
      }

      return matchesSearch && matchesSeverity;
    });
  }, [allScreenings, searchQuery, severityFilter]);

  const handleExportCSV = () => {
    const headers = [
      'Screening ID',
      'Patient ID',
      'Health ID',
      'Patient Name',
      'Age',
      'Gender',
      'Location / Village',
      'GPS Latitude',
      'GPS Longitude',
      'Diabetes Type',
      'Duration (Yrs)',
      'HbA1c (%)',
      'AI Prediction',
      'Confidence (%)',
      'Triage Level',
      'Screening Date',
    ];

    const rows = filteredList.map((item) => [
      item.id,
      item.patientId,
      item.healthId || 'N/A',
      `"${item.patientName}"`,
      item.age,
      item.gender,
      `"${item.village}"`,
      item.gpsLocation?.latitude ?? '',
      item.gpsLocation?.longitude ?? '',
      item.diabetesStatus,
      item.durationYears,
      item.hba1c,
      `"${item.analysis.prediction}"`,
      item.analysis.confidence.toFixed(1),
      item.analysis.triageLevel || 'Routine',
      new Date(item.timestamp).toISOString(),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DR_Clinical_Registry_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRowClick = (item: ScreeningResult) => {
    sessionStorage.setItem('screeningResult', JSON.stringify(item));
    navigate('/result');
  };

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
                  CLINICAL PATIENT REGISTER
                </div>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  Patient Retinal Screening Register
                </h1>
                <p style={{ fontSize: 13, color: '#d1fae5', marginTop: 4, margin: 0 }}>
                  Centralized Longitudinal Database of Retinal Diagnostic Assessments conducted at {CURRENT_USER.facilityName}.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  type="button"
                  className="clay-btn clay-btn-secondary"
                  onClick={handleExportCSV}
                >
                  <Download size={15} />
                  <span>Export CSV / Excel</span>
                </button>

                <button
                  type="button"
                  className="clay-btn"
                  onClick={() => navigate('/screening')}
                  style={{
                    background: '#ff9933',
                    color: '#064e3b',
                    boxShadow: '0 6px 18px rgba(255, 153, 51, 0.4)',
                    fontWeight: 800,
                  }}
                >
                  <ScanEye size={18} />
                  <span>New Screening</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
              <div className="clay-card-flat" style={{ padding: 16 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)' }}>TOTAL SCREENINGS</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)' }}>{allScreenings.length}</div>
                <div style={{ fontSize: 11, color: '#059669', fontWeight: 600 }}>100% EHR Linked • GPS Geotagged</div>
              </div>

              <div className="clay-card-flat" style={{ padding: 16 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)' }}>NORMAL / NO DR</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#059669' }}>
                  {allScreenings.filter((s) => s.analysis.class_id === 0).length}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>12-Month Recall</div>
              </div>

              <div className="clay-card-flat" style={{ padding: 16 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)' }}>MODERATE / SEVERE NPDR</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#d97706' }}>
                  {allScreenings.filter((s) => [2, 3].includes(s.analysis.class_id)).length}
                </div>
                <div style={{ fontSize: 11, color: '#d97706' }}>Specialist Review</div>
              </div>

              <div className="clay-card-flat" style={{ padding: 16 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)' }}>PROLIFERATIVE (PDR)</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#dc2626' }}>
                  {allScreenings.filter((s) => s.analysis.class_id === 4).length}
                </div>
                <div style={{ fontSize: 11, color: '#dc2626', fontWeight: 700 }}>Immediate Laser Triage</div>
              </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div
              className="clay-card"
              style={{
                padding: '16px 20px',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16,
              }}
            >
              {/* Search input */}
              <div style={{ position: 'relative', minWidth: 320, flex: 1, maxWidth: 480 }}>
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--placeholder)',
                  }}
                />
                <input
                  type="text"
                  placeholder="Filter by Patient Name, Health ID, Patient ID, Location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="clay-input"
                  style={{ paddingLeft: 38, height: 40, fontSize: 13 }}
                />
              </div>

              {/* Severity Filter Pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <Filter size={14} style={{ color: 'var(--text-muted)' }} />
                <button
                  type="button"
                  className={`clay-btn clay-btn-sm ${severityFilter === 'all' ? 'clay-btn-primary' : 'clay-btn-secondary'}`}
                  onClick={() => setSeverityFilter('all')}
                >
                  All ({allScreenings.length})
                </button>
                <button
                  type="button"
                  className={`clay-btn clay-btn-sm ${severityFilter === 'normal' ? 'clay-btn-primary' : 'clay-btn-secondary'}`}
                  onClick={() => setSeverityFilter('normal')}
                >
                  Normal (0)
                </button>
                <button
                  type="button"
                  className={`clay-btn clay-btn-sm ${severityFilter === 'mild' ? 'clay-btn-primary' : 'clay-btn-secondary'}`}
                  onClick={() => setSeverityFilter('mild')}
                >
                  Mild (1)
                </button>
                <button
                  type="button"
                  className={`clay-btn clay-btn-sm ${severityFilter === 'moderate' ? 'clay-btn-primary' : 'clay-btn-secondary'}`}
                  onClick={() => setSeverityFilter('moderate')}
                >
                  Moderate (2)
                </button>
                <button
                  type="button"
                  className={`clay-btn clay-btn-sm ${severityFilter === 'severe' ? 'clay-btn-primary' : 'clay-btn-secondary'}`}
                  onClick={() => setSeverityFilter('severe')}
                >
                  Severe (3)
                </button>
                <button
                  type="button"
                  className={`clay-btn clay-btn-sm ${severityFilter === 'pdr' ? 'clay-btn-primary' : 'clay-btn-secondary'}`}
                  onClick={() => setSeverityFilter('pdr')}
                >
                  PDR (4)
                </button>
              </div>
            </div>

            {/* Patients Table */}
            <div className="clay-table-container">
              <table className="clay-table">
                <thead>
                  <tr>
                    <th>Screening ID / Date</th>
                    <th>Patient Demographics</th>
                    <th>Health ID & GPS Location</th>
                    <th>Diabetes Profile</th>
                    <th>AI Classification</th>
                    <th>Confidence</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                        No screening records matching your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredList.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{item.id}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                            {new Date(item.timestamp).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </div>
                        </td>

                        <td>
                          <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{item.patientName}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                            {item.patientId} • {item.age} Yrs / {item.gender}
                          </div>
                        </td>

                        <td>
                          <div style={{ fontSize: 12, fontWeight: 700, fontFamily: 'monospace', color: '#0284c7' }}>
                            {item.healthId || 'N/A'}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                            <MapPin size={11} style={{ color: '#059669', flexShrink: 0 }} />
                            <span>
                              {item.gpsLocation
                                ? `${item.gpsLocation.latitude.toFixed(4)}°N, ${item.gpsLocation.longitude.toFixed(4)}°E`
                                : item.village}
                            </span>
                          </div>
                          <div style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>
                            {item.phone}
                          </div>
                        </td>

                        <td>
                          <div style={{ fontSize: 12, fontWeight: 700 }}>
                            {item.diabetesStatus} ({item.durationYears} yrs)
                          </div>
                          <div style={{ fontSize: 11, color: item.hba1c > 8 ? '#dc2626' : '#059669', fontWeight: 600 }}>
                            HbA1c: {item.hba1c}%
                          </div>
                        </td>

                        <td>
                          <RiskBadge prediction={item.analysis.prediction} classId={item.analysis.class_id} />
                        </td>

                        <td>
                          <div style={{ fontWeight: 800, color: '#059669' }}>
                            {item.analysis.confidence.toFixed(1)}%
                          </div>
                          <div style={{ fontSize: 10.5, color: '#94a3b8' }}>
                            {item.analysis.xai.method}
                          </div>
                        </td>

                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: 6 }}>
                            <button
                              type="button"
                              className="clay-btn clay-btn-secondary clay-btn-sm"
                              onClick={() => {
                                setSelectedResult(item);
                                setShowPrintModal(true);
                              }}
                              title="Print Official Slip"
                            >
                              <Printer size={13} />
                            </button>
                            <button
                              type="button"
                              className="clay-btn clay-btn-primary clay-btn-sm"
                              onClick={() => handleRowClick(item)}
                            >
                              <span>XAI Report</span>
                              <ChevronRight size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>

      {/* Print Slip Modal */}
      {showPrintModal && selectedResult && (
        <PrintReportModal
          result={selectedResult}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
};

export default History;