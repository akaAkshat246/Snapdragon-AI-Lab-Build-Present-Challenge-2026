import React, { useState } from 'react';
import {
  Bell,
  Search,
  ChevronDown,
  UserCheck,
  AlertTriangle,
  Sparkles,
  Menu,
} from 'lucide-react';
import { CURRENT_USER } from '../utils/mockData';
import { useLanguage } from '../utils/i18n';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { toggleSidebar, isSidebarOpen } = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load active user (e.g. from Google OAuth or login)
  let activeUser = CURRENT_USER;
  try {
    const rawAuth = sessionStorage.getItem('auth_user') || localStorage.getItem('auth_user');
    if (rawAuth) {
      activeUser = JSON.parse(rawAuth);
    }
  } catch {
    activeUser = CURRENT_USER;
  }

  const notifications = [
    {
      id: 1,
      title: 'Emergency PDR Identified',
      desc: 'Patient P-1023 (Mohammed Ghouse) requires urgent photocoagulation within 24h.',
      time: '10 min ago',
      type: 'emergency',
    },
    {
      id: 2,
      title: 'Tele-Consult Confirmed',
      desc: 'Dr. Radhakrishnan accepted referral for Rameshwar Patel (P-1025).',
      time: '35 min ago',
      type: 'info',
    },
    {
      id: 3,
      title: 'AI Model v2.4 Active',
      desc: 'Grad-CAM lesion segmentation calibrated with 98.4% specificity.',
      time: '2 hours ago',
      type: 'success',
    },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/history?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav
      className="no-print app-navbar-bar"
      style={{
        background: 'var(--card)',
        borderBottom: '1px solid var(--border)',
        padding: '12px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Left: Hamburger Menu Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Hamburger Toggle Button */}
        <button
          type="button"
          onClick={toggleSidebar}
          title={isSidebarOpen ? 'Close Navigation Menu' : 'Open Navigation Menu (DR-XAI Suite)'}
          aria-label="Navigation Menu"
          aria-expanded={isSidebarOpen}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 38,
            height: 38,
            borderRadius: 10,
            background: isSidebarOpen ? 'rgba(5, 150, 105, 0.2)' : 'var(--bg-surface-secondary)',
            border: isSidebarOpen ? '1.5px solid #10b981' : '1px solid var(--border)',
            color: isSidebarOpen ? '#10b981' : 'var(--text-main)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: isSidebarOpen ? '0 0 12px rgba(16, 185, 129, 0.35)' : 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(5, 150, 105, 0.18)';
            e.currentTarget.style.color = '#10b981';
            e.currentTarget.style.borderColor = 'rgba(52, 211, 153, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = isSidebarOpen ? 'rgba(5, 150, 105, 0.2)' : 'var(--bg-surface-secondary)';
            e.currentTarget.style.color = isSidebarOpen ? '#10b981' : 'var(--text-main)';
            e.currentTarget.style.borderColor = isSidebarOpen ? '#10b981' : 'var(--border)';
          }}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Middle: Patient Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        style={{
          flex: 1,
          maxWidth: 420,
          margin: '0 20px',
          position: 'relative',
        }}
      >
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#94a3b8',
          }}
        />
        <input
          type="text"
          placeholder="Search by Health ID, Patient ID (P-1025), or Name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="clay-input"
          style={{
            paddingLeft: 38,
            paddingRight: 70,
            height: 40,
            fontSize: 12.5,
          }}
        />
        <span
          style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: 10,
            fontWeight: 700,
            background: '#e2e8f0',
            color: '#475569',
            padding: '2px 6px',
            borderRadius: 4,
          }}
        >
          Enter
        </span>
      </form>

      {/* Right: Actions, Notifications, User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Quick Screening CTA */}
        <button
          type="button"
          className="clay-btn clay-btn-primary clay-btn-sm"
          onClick={() => navigate('/screening')}
        >
          <Sparkles size={14} />
          <span>New Screening</span>
        </button>

        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              position: 'relative',
              width: 38,
              height: 38,
              borderRadius: 12,
              background: 'var(--bg-surface-secondary)',
              border: '1px solid var(--border)',
              display: 'grid',
              placeItems: 'center',
              color: 'var(--text-main)',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            }}
          >
            <Bell size={17} />
            <span
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#dc2626',
                border: '1.5px solid var(--card)',
              }}
            />
          </button>

          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 48,
                width: 340,
                background: 'var(--card)',
                borderRadius: 16,
                boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
                border: '1px solid var(--border)',
                padding: '16px',
                zIndex: 200,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 12,
                  paddingBottom: 8,
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <strong style={{ fontSize: 13, color: 'var(--text-main)' }}>Triage Notifications</strong>
                <span style={{ fontSize: 11, color: '#10b981', fontWeight: 700 }}>3 New</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 10,
                      background: n.type === 'emergency' ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-surface-secondary)',
                      border: n.type === 'emergency' ? '1px solid rgba(248, 113, 113, 0.3)' : '1px solid var(--border)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      {n.type === 'emergency' && <AlertTriangle size={13} style={{ color: '#f87171' }} />}
                      <span style={{ fontSize: 12, fontWeight: 700, color: n.type === 'emergency' ? '#f87171' : 'var(--text-main)' }}>
                        {n.title}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      {n.desc}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
                      {n.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Health Worker Profile Chip */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '6px 12px',
              borderRadius: 12,
              background: 'var(--bg-surface-secondary)',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: (activeUser as any).picture ? `url(${(activeUser as any).picture}) center/cover no-repeat` : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                color: '#ffffff',
                display: 'grid',
                placeItems: 'center',
                fontSize: 12,
                fontWeight: 800,
                border: '1px solid #d1fae5',
                overflow: 'hidden',
              }}
            >
              {!(activeUser as any).picture && (activeUser.name ? activeUser.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('') : 'DR')}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
                {activeUser.name}
              </div>
              <div style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>
                ID: {activeUser.licenseId ? activeUser.licenseId.slice(0, 14) : 'CLIN-99214'}
              </div>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          </div>

          {showProfileMenu && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 48,
                width: 240,
                background: 'var(--card)',
                borderRadius: 14,
                boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
                border: '1px solid var(--border)',
                padding: '12px',
                zIndex: 200,
              }}
            >
              <div style={{ paddingBottom: 8, borderBottom: '1px solid var(--border)', marginBottom: 8 }}>
                <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--text-main)' }}>{activeUser.name}</div>
                <div style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>{activeUser.role}</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <button
                  type="button"
                  onClick={() => {
                    sessionStorage.removeItem('auth_user');
                    localStorage.removeItem('auth_user');
                    setShowProfileMenu(false);
                    navigate('/login');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    padding: '8px 10px',
                    borderRadius: 8,
                    fontSize: 12,
                    color: '#ef4444',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <UserCheck size={14} />
                  <span>Switch Account / Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
