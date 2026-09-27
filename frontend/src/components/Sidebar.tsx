import React from 'react';
import {
  LayoutDashboard,
  ScanEye,
  FileSpreadsheet,
  GitPullRequest,
  PhoneCall,
  Activity,
  LogOut,
  Navigation,
  Globe,
  X,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { CURRENT_USER } from '../utils/mockData';
import { useGeolocation } from '../hooks/useGeolocation';
import { useLanguage } from '../utils/i18n';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { location } = useGeolocation();
  const { isSidebarOpen, setIsSidebarOpen } = useLanguage();

  // Close drawer on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen, setIsSidebarOpen]);

  const links = [
    {
      name: 'Clinical Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: 'New Screening',
      path: '/screening',
      icon: ScanEye,
      badge: 'AI Active',
    },
    {
      name: 'Patient Register',
      path: '/history',
      icon: FileSpreadsheet,
      badge: '6 Records',
    },
    {
      name: 'Tele-Referrals',
      path: '/referral',
      icon: GitPullRequest,
      badge: '3 Active',
    },
    {
      name: 'AI Architecture Overview',
      path: '/landing',
      icon: Globe,
      badge: '7-Stage AI',
    },
  ];

  return (
    <>
      {/* Backdrop Overlay when sidebar drawer is open */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10, 25, 47, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 999,
            transition: 'opacity 0.25s ease',
          }}
          aria-hidden="true"
        />
      )}

      <aside
        className={`clay-sidebar no-print ${isSidebarOpen ? 'sidebar-drawer-open' : ''}`}
        aria-label="Clinical Navigation Drawer"
        style={{
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Brand Header */}
        <div className="clay-sidebar-brand" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="clay-brand-icon-box">
              <Activity size={24} />
            </div>
            <div className="clay-brand-titles">
              <h1>DR-XAI Suite</h1>
              <span>Clinical Retinal AI</span>
            </div>
          </div>

          {/* Close button inside drawer */}
          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="sidebar-close-btn"
            title="Close Navigation Menu (Esc)"
            aria-label="Close Navigation Menu"
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.18)',
              color: '#ffffff',
              borderRadius: 8,
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
              e.currentTarget.style.borderColor = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* GPS Field Node Sub-tag */}
        <div
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10,
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 11,
            color: '#34d399',
            fontWeight: 600,
          }}
        >
          <Navigation size={13} style={{ color: '#38bdf8' }} />
          <span>GPS Node: {location.latitude.toFixed(2)}°N, {location.longitude.toFixed(2)}°E</span>
        </div>

        {/* Navigation Items */}
        <nav className="clay-nav-menu">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `clay-nav-item ${isActive ? 'active' : ''}`
                }
              >
                <Icon size={18} />
                <span>{link.name}</span>
                {link.badge && (
                  <span className="clay-nav-badge">{link.badge}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Emergency Tele-Ophthalmology Contact */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(220,38,38,0.2) 0%, rgba(185,28,28,0.3) 100%)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 14,
            padding: '12px 14px',
            color: '#fecaca',
            fontSize: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#fca5a5', marginBottom: 4 }}>
            <PhoneCall size={13} />
            <span>Tele-Retina SOS</span>
          </div>
          <div style={{ fontSize: 11, color: '#e2e8f0', lineHeight: 1.4 }}>
            Direct audio line to On-Duty Retinal Specialist: <strong>1800-RETINA-AI</strong>
          </div>
        </div>

        {/* Footer Worker Card */}
        <div className="clay-sidebar-footer">
          <div className="clay-worker-card">
            <div className="clay-avatar">
              DOC
            </div>
            <div className="clay-worker-info">
              <strong>{CURRENT_USER.name}</strong>
              <span>{CURRENT_USER.facilityId}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsSidebarOpen(false);
              navigate('/login');
            }}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 10,
              color: '#94a3b8',
              padding: '8px 12px',
              fontSize: 12,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ef4444';
              e.currentTarget.style.borderColor = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#94a3b8';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
            }}
          >
            <LogOut size={13} />
            <span>Sign Out / Switch User</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;