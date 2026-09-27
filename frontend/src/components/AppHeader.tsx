import React from 'react';
import { Eye, Globe, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage, type Language } from '../utils/i18n';

export const AppHeader: React.FC = () => {
  const navigate = useNavigate();
  const {
    language,
    setLanguage,
    t,
    fontSize,
    setFontSize,
    theme,
    toggleTheme,
  } = useLanguage();

  const isDark = theme === 'dark';

  return (
    <header className="app-header-wrapper no-print">
      {/* Top Clinical Utility Strip */}
      <div
        className="gov-topbar"
        style={{
          background: '#0a192f',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '6px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <div className="gov-topbar-right" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Text Size Controls (A- / A / A+) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 11, color: '#94a3b8', marginRight: 4, fontWeight: 600 }}>{t.textSize}</span>
            <button
              type="button"
              className="gov-access-btn"
              onClick={() => setFontSize('sm')}
              style={{
                fontWeight: fontSize === 'sm' ? '800' : '600',
                background: fontSize === 'sm' ? '#059669' : 'rgba(255,255,255,0.12)',
                color: '#ffffff',
                padding: '3px 10px',
                borderRadius: 6,
                border: fontSize === 'sm' ? '1px solid #34d399' : '1px solid rgba(255,255,255,0.15)',
                cursor: 'pointer',
                fontSize: 11.5,
                transition: 'all 0.15s ease',
              }}
              title="Decrease Font Size (A-)"
            >
              A-
            </button>
            <button
              type="button"
              className="gov-access-btn"
              onClick={() => setFontSize('md')}
              style={{
                fontWeight: fontSize === 'md' ? '800' : '600',
                background: fontSize === 'md' ? '#059669' : 'rgba(255,255,255,0.12)',
                color: '#ffffff',
                padding: '3px 10px',
                borderRadius: 6,
                border: fontSize === 'md' ? '1px solid #34d399' : '1px solid rgba(255,255,255,0.15)',
                cursor: 'pointer',
                fontSize: 11.5,
                transition: 'all 0.15s ease',
              }}
              title="Standard Font Size (A)"
            >
              A
            </button>
            <button
              type="button"
              className="gov-access-btn"
              onClick={() => setFontSize('lg')}
              style={{
                fontWeight: fontSize === 'lg' ? '800' : '600',
                background: fontSize === 'lg' ? '#059669' : 'rgba(255,255,255,0.12)',
                color: '#ffffff',
                padding: '3px 10px',
                borderRadius: 6,
                border: fontSize === 'lg' ? '1px solid #34d399' : '1px solid rgba(255,255,255,0.15)',
                cursor: 'pointer',
                fontSize: 11.5,
                transition: 'all 0.15s ease',
              }}
              title="Increase Font Size (A+)"
            >
              A+
            </button>
          </div>

          <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.2)' }} />

          {/* Light / Dark Theme Mode Toggle */}
          <button
            type="button"
            id="theme-toggle-btn"
            className="gov-access-btn"
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: isDark ? '#0f766e' : 'rgba(255,255,255,0.12)',
              color: '#ffffff',
              padding: '3px 11px',
              borderRadius: 6,
              border: isDark ? '1px solid #2dd4bf' : '1px solid rgba(255,255,255,0.18)',
              cursor: 'pointer',
              fontSize: 11.5,
              fontWeight: 600,
              transition: 'all 0.15s ease',
            }}
          >
            {isDark ? (
              <>
                <Sun size={13} style={{ color: '#fde047' }} />
                <span>{t.themeLight}</span>
              </>
            ) : (
              <>
                <Moon size={13} style={{ color: '#38bdf8' }} />
                <span>{t.themeDark}</span>
              </>
            )}
          </button>

          <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.2)' }} />

          {/* Language Selector (English, Hindi, Telugu only) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Globe size={13} style={{ color: '#38bdf8' }} />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="gov-access-btn"
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: 6,
                padding: '3px 8px',
                fontSize: 11.5,
                fontWeight: 700,
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="English" style={{ background: '#0a192f', color: '#fff' }}>English</option>
              <option value="Hindi" style={{ background: '#0a192f', color: '#fff' }}>हिन्दी (Hindi)</option>
              <option value="Telugu" style={{ background: '#0a192f', color: '#fff' }}>తెలుగు (Telugu)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Clinical Platform Masthead */}
      <div
        className="app-header-masthead"
        style={{
          background: isDark ? '#0b1526' : '#ffffff',
          borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0',
          padding: '12px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'background 0.2s ease, border-color 0.2s ease',
        }}
      >
        <div
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}
        >
          {/* Brand Logo Icon */}
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
              display: 'grid',
              placeItems: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(6, 78, 59, 0.25)',
            }}
          >
            <Eye size={22} />
          </div>

          <div>
            <div
              style={{
                fontSize: 15.5,
                fontWeight: 800,
                color: isDark ? '#34d399' : '#064e3b',
                letterSpacing: '-0.02em',
                transition: 'color 0.2s ease',
              }}
            >
              {t.brandTitle}
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: isDark ? '#94a3b8' : '#64748b',
                transition: 'color 0.2s ease',
              }}
            >
              {t.brandSubtitle}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export const GovHeader = AppHeader;
export default AppHeader;
