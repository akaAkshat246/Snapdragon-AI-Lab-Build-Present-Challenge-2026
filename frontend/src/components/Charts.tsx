import React, { useState } from 'react';

// ==========================================================================
// 1. INTERACTIVE DR SEVERITY DONUT CHART
// ==========================================================================
interface DonutSlice {
  label: string;
  value: number;
  color: string;
  grade: string;
}

export const PrevalenceDonutChart: React.FC<{ data?: DonutSlice[] }> = ({
  data = [
    { label: 'No DR (Normal)', value: 412, color: '#059669', grade: 'Level 0' },
    { label: 'Mild NPDR', value: 168, color: '#0284c7', grade: 'Level 1' },
    { label: 'Moderate NPDR', value: 94, color: '#d97706', grade: 'Level 2' },
    { label: 'Severe NPDR', value: 42, color: '#ea580c', grade: 'Level 3' },
    { label: 'Proliferative DR', value: 19, color: '#dc2626', grade: 'Level 4' },
  ],
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = data.reduce((acc, cur) => acc + cur.value, 0);
  const size = 260;
  const strokeWidth = 34;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {data.map((slice, index) => {
            const percent = slice.value / total;
            const strokeDasharray = `${circumference * percent} ${circumference * (1 - percent)}`;
            const strokeDashoffset = -circumference * accumulatedPercent;
            accumulatedPercent += percent;

            const isHovered = hoveredIndex === index;

            return (
              <circle
                key={slice.label}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={slice.color}
                strokeWidth={isHovered ? strokeWidth + 6 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${center} ${center})`}
                style={{
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  cursor: 'pointer',
                  filter: isHovered ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.25))' : 'none',
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </svg>

        {/* Center Total / Hover detail */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            {hoveredIndex !== null ? data[hoveredIndex].grade : 'Total Screened'}
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: hoveredIndex !== null ? data[hoveredIndex].color : 'var(--text-main)' }}>
            {hoveredIndex !== null ? data[hoveredIndex].value : total}
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>
            {hoveredIndex !== null
              ? `${((data[hoveredIndex].value / total) * 100).toFixed(1)}% of cases`
              : 'Ayushman Bharat'
            }
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '8px 16px',
        marginTop: 20,
        width: '100%',
      }}>
        {data.map((slice, index) => {
          const isHovered = hoveredIndex === index;
          return (
            <div
              key={slice.label}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 10px',
                borderRadius: 8,
                background: isHovered ? 'var(--hover)' : 'transparent',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: slice.color,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                  }}
                />
                <span style={{ fontSize: 12, fontWeight: isHovered ? 700 : 600, color: 'var(--text-secondary)' }}>
                  {slice.label}
                </span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-main)' }}>
                {slice.value} ({((slice.value / total) * 100).toFixed(0)}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================================================
// 2. INTERACTIVE SCREENING VOLUME TREND AREA CHART
// ==========================================================================
interface TrendPoint {
  day: string;
  screenings: number;
  highRisk: number;
}

export const ScreeningTrendChart: React.FC<{
  data?: TrendPoint[];
  periodLabel?: string;
}> = ({
  data = [
    { day: 'Mon', screenings: 18, highRisk: 2 },
    { day: 'Tue', screenings: 26, highRisk: 4 },
    { day: 'Wed', screenings: 22, highRisk: 3 },
    { day: 'Thu', screenings: 34, highRisk: 5 },
    { day: 'Fri', screenings: 29, highRisk: 4 },
    { day: 'Sat', screenings: 38, highRisk: 7 },
    { day: 'Sun', screenings: 24, highRisk: 3 },
  ],
  periodLabel = 'Last 7 Days (PHC Shankarpally)',
}) => {
  const [activePoint, setActivePoint] = useState<TrendPoint | null>(null);

  const width = 500;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;

  const maxScreenings = Math.max(...data.map((d) => d.screenings), 40);

  const getX = (index: number) =>
    paddingX + (index / (data.length - 1)) * (width - paddingX * 2);

  const getY = (val: number) =>
    height - paddingY - (val / maxScreenings) * (height - paddingY * 2);

  const linePoints = data
    .map((d, i) => `${getX(i)},${getY(d.screenings)}`)
    .join(' ');

  const areaPoints = `${getX(0)},${height - paddingY} ${linePoints} ${getX(
    data.length - 1
  )},${height - paddingY}`;

  const highRiskLinePoints = data
    .map((d, i) => `${getX(i)},${getY(d.highRisk)}`)
    .join(' ');

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{periodLabel}</div>
        <div style={{ display: 'flex', gap: 14, fontSize: 11.5, fontWeight: 700 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#059669' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669' }} />
            <span>Total Screened</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#dc2626' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#dc2626' }} />
            <span>High-Risk Flagged</span>
          </div>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', height: 'auto', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0, 10, 20, 30, 40].map((level) => {
          const y = getY(level);
          return (
            <g key={level}>
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="var(--border)"
                strokeDasharray="4 4"
              />
              <text
                x={paddingX - 10}
                y={y + 4}
                fontSize="10"
                fill="var(--text-muted)"
                textAnchor="end"
                fontWeight="600"
              >
                {level}
              </text>
            </g>
          );
        })}

        {/* Screenings Area */}
        <polygon points={areaPoints} fill="url(#areaGrad)" />

        {/* Screenings Line */}
        <polyline
          fill="none"
          stroke="#059669"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={linePoints}
        />

        {/* High Risk Line */}
        <polyline
          fill="none"
          stroke="#dc2626"
          strokeWidth="2.5"
          strokeDasharray="5 3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={highRiskLinePoints}
        />

        {/* Data points */}
        {data.map((point, index) => {
          const cx = getX(index);
          const cy = getY(point.screenings);
          const isSelected = activePoint?.day === point.day;

          return (
            <g
              key={point.day}
              onMouseEnter={() => setActivePoint(point)}
              onMouseLeave={() => setActivePoint(null)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={cx}
                cy={cy}
                r={isSelected ? 6 : 4}
                fill="var(--card)"
                stroke="#059669"
                strokeWidth="2.5"
                style={{ transition: 'all 0.2s ease' }}
              />
              <text
                x={cx}
                y={height - 8}
                fontSize="11"
                fill="var(--text-muted)"
                textAnchor="middle"
                fontWeight="700"
              >
                {point.day}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Hover Tooltip */}
      {activePoint && (
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--foreground)',
            color: 'var(--background)',
            padding: '6px 14px',
            borderRadius: 8,
            fontSize: 12,
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <strong>{activePoint.day}</strong>
          <span>Total: <strong style={{ color: '#34d399' }}>{activePoint.screenings}</strong></span>
          <span>High Risk: <strong style={{ color: '#f87171' }}>{activePoint.highRisk}</strong></span>
        </div>
      )}
    </div>
  );
};

// ==========================================================================
// 3. BAR CHART: AGE & DIABETES DURATION DISTRIBUTION
// ==========================================================================
interface AgeGroupData {
  ageGroup: string;
  total: number;
  drDetected: number;
}

export const AgeGroupBarChart: React.FC<{ data?: AgeGroupData[] }> = ({
  data = [
    { ageGroup: '< 40 yrs', total: 45, drDetected: 6 },
    { ageGroup: '40-50 yrs', total: 110, drDetected: 24 },
    { ageGroup: '50-60 yrs', total: 240, drDetected: 82 },
    { ageGroup: '60-70 yrs', total: 195, drDetected: 96 },
    { ageGroup: '> 70 yrs', total: 85, drDetected: 48 },
  ],
}) => {
  const maxTotal = Math.max(...data.map((d) => d.total));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
        <span>Age Cohort</span>
        <span>DR Detection Rate (%)</span>
      </div>

      {data.map((item) => {
        const percent = Math.round((item.drDetected / item.total) * 100);
        const widthPercent = (item.total / maxTotal) * 100;

        return (
          <div key={item.ageGroup} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700 }}>
              <span style={{ color: 'var(--text-main)' }}>{item.ageGroup}</span>
              <span style={{ color: percent > 40 ? '#dc2626' : '#059669' }}>
                {item.drDetected} / {item.total} ({percent}%)
              </span>
            </div>
            <div
              style={{
                height: 10,
                width: '100%',
                background: 'var(--border)',
                borderRadius: 9999,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${widthPercent}%`,
                  background: 'var(--text-muted)',
                  borderRadius: 9999,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
              />
              <div
                style={{
                  height: '100%',
                  width: `${(item.drDetected / maxTotal) * 100}%`,
                  background:
                    percent > 40
                      ? 'linear-gradient(90deg, #ea580c, #dc2626)'
                      : 'linear-gradient(90deg, #10b981, #059669)',
                  borderRadius: 9999,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
