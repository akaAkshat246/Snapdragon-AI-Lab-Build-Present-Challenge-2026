import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  theme?: 'emerald' | 'amber' | 'red' | 'blue';
  trend?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
  };
  progressPercent?: number;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon,
  theme = 'emerald',
  trend,
  progressPercent,
  onClick,
}) => {
  return (
    <div
      className="clay-stat-card"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="clay-stat-top">
        <div className={`clay-stat-icon-wrapper ${theme}`}>
          {icon}
        </div>
        {trend && (
          <span
            className={`clay-trend-badge ${
              trend.isNeutral ? 'neutral' : trend.isPositive ? 'positive' : 'negative'
            }`}
          >
            {trend.isNeutral ? (
              <Minus size={11} />
            ) : trend.isPositive ? (
              <TrendingUp size={11} />
            ) : (
              <TrendingDown size={11} />
            )}
            <span>{trend.value}</span>
          </span>
        )}
      </div>

      <div className="clay-stat-value">{value}</div>
      <div className="clay-stat-label">{label}</div>

      {typeof progressPercent === 'number' && (
        <div style={{ marginTop: 12, marginBottom: 4 }}>
          <div style={{
            height: 6,
            width: '100%',
            background: 'var(--border)',
            borderRadius: 9999,
            overflow: 'hidden',
          }}>
            <div
              style={{
                height: '100%',
                width: `${Math.min(100, Math.max(0, progressPercent))}%`,
                background:
                  theme === 'red'
                    ? 'linear-gradient(90deg, #f87171, #dc2626)'
                    : theme === 'amber'
                    ? 'linear-gradient(90deg, #fbbf24, #d97706)'
                    : theme === 'blue'
                    ? 'linear-gradient(90deg, #38bdf8, #0284c7)'
                    : 'linear-gradient(90deg, #34d399, #059669)',
                borderRadius: 9999,
                transition: 'width 0.6s ease',
              }}
            />
          </div>
        </div>
      )}

      {subtext && (
        <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 6 }}>
          {subtext}
        </div>
      )}
    </div>
  );
};

export default StatCard;
