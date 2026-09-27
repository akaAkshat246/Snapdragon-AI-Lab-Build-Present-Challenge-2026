import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../utils/theme';
import { useLanguage } from '../utils/i18n';

interface ThemeToggleProps {
  variant?: 'header' | 'navbar' | 'compact' | 'pill';
  showLabel?: boolean;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'header',
  showLabel = true,
  className = '',
  style = {},
  id = 'theme-toggle-btn',
}) => {
  const { toggleTheme, isDark } = useTheme();
  let t = { themeLight: 'Light Mode', themeDark: 'Dark Mode' };
  try {
    const langContext = useLanguage();
    if (langContext?.t) {
      t = {
        themeLight: langContext.t.themeLight || 'Light Mode',
        themeDark: langContext.t.themeDark || 'Dark Mode',
      };
    }
  } catch {
    // Language provider not present, use defaults
  }

  const tooltipText = isDark ? 'Switch to light theme' : 'Switch to dark theme';
  const labelText = isDark ? t.themeLight : t.themeDark;

  if (variant === 'navbar') {
    return (
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={isDark}
        aria-label={tooltipText}
        title={tooltipText}
        onClick={toggleTheme}
        className={`theme-toggle-btn theme-toggle-navbar ${className}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          padding: '6px 12px',
          borderRadius: 12,
          background: isDark ? '#1e293b' : '#f8fafc',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.16)' : '1px solid #e2e8f0',
          color: isDark ? '#f8fafc' : '#0f172a',
          fontSize: 12,
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: isDark
            ? '0 2px 6px rgba(0, 0, 0, 0.3)'
            : '0 2px 6px rgba(0, 0, 0, 0.04)',
          ...style,
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.25s ease',
            transform: isDark ? 'rotate(18deg)' : 'rotate(0deg)',
          }}
        >
          {isDark ? (
            <Sun size={15} style={{ color: '#fde047' }} />
          ) : (
            <Moon size={15} style={{ color: '#0284c7' }} />
          )}
        </span>
        {showLabel && <span>{labelText}</span>}
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={isDark}
        aria-label={tooltipText}
        title={tooltipText}
        onClick={toggleTheme}
        className={`theme-toggle-btn theme-toggle-compact ${className}`}
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          display: 'grid',
          placeItems: 'center',
          background: isDark ? '#1e293b' : '#f1f5f9',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #cbd5e1',
          color: isDark ? '#fde047' : '#0284c7',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          ...style,
        }}
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    );
  }

  // Default 'header' topbar variant
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={isDark}
      aria-label={tooltipText}
      title={tooltipText}
      onClick={toggleTheme}
      className={`gov-access-btn theme-toggle-btn ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        background: isDark ? '#0f766e' : 'rgba(255,255,255,0.12)',
        color: '#ffffff',
        padding: '3px 11px',
        borderRadius: 6,
        border: isDark ? '1px solid #2dd4bf' : '1px solid rgba(255,255,255,0.2)',
        cursor: 'pointer',
        fontSize: 11.5,
        fontWeight: 600,
        transition: 'all 0.15s ease',
        ...style,
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.25s ease',
          transform: isDark ? 'rotate(18deg)' : 'rotate(0deg)',
        }}
      >
        {isDark ? (
          <Sun size={13} style={{ color: '#fde047' }} />
        ) : (
          <Moon size={13} style={{ color: '#38bdf8' }} />
        )}
      </span>
      {showLabel && <span>{labelText}</span>}
    </button>
  );
};

export default ThemeToggle;
