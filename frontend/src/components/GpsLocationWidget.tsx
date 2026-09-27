import React from 'react';
import { MapPin, RefreshCw, Satellite, Radio } from 'lucide-react';
import type { GpsCoordinates } from '../types';

interface GpsLocationWidgetProps {
  coordinates: GpsCoordinates;
  isLocating?: boolean;
  onRefresh?: () => void;
  compact?: boolean;
  showMapLink?: boolean;
}

export const GpsLocationWidget: React.FC<GpsLocationWidgetProps> = ({
  coordinates,
  isLocating = false,
  onRefresh,
  compact = false,
  showMapLink = true,
}) => {
  const mapUrl = `https://www.openstreetmap.org/?mlat=${coordinates.latitude}&mlon=${coordinates.longitude}#map=15/${coordinates.latitude}/${coordinates.longitude}`;

  if (compact) {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 10px',
          borderRadius: 9999,
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#10b981',
          fontSize: 11.5,
          fontWeight: 600,
        }}
        title={`GPS Accuracy: ±${coordinates.accuracy || 5}m • Alt: ${coordinates.altitude || 500}m`}
      >
        <Radio size={12} style={{ color: '#10b981' }} />
        <span>
          {coordinates.latitude.toFixed(4)}° N, {coordinates.longitude.toFixed(4)}° E
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'var(--bg-surface-secondary)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 14,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'rgba(16, 185, 129, 0.18)',
            color: '#10b981',
            display: 'grid',
            placeItems: 'center',
            boxShadow: '0 2px 6px rgba(16, 185, 129, 0.15)',
          }}
        >
          <Satellite size={18} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-main)' }}>
              GPS Field Geotag
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#10b981',
                padding: '2px 6px',
                borderRadius: 4,
              }}
            >
              ACTIVE
            </span>
          </div>

          <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 2, fontFamily: 'monospace' }}>
            Lat: <strong style={{ color: 'var(--text-main)' }}>{coordinates.latitude.toFixed(4)}° N</strong> • Long: <strong style={{ color: 'var(--text-main)' }}>{coordinates.longitude.toFixed(4)}° E</strong>
            {coordinates.accuracy && (
              <span style={{ color: 'var(--text-muted)' }}> (±{coordinates.accuracy}m)</span>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {showMapLink && (
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="clay-btn clay-btn-secondary clay-btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}
          >
            <MapPin size={12} />
            <span>Map</span>
          </a>
        )}

        {onRefresh && (
          <button
            type="button"
            className="clay-btn clay-btn-secondary clay-btn-sm"
            onClick={onRefresh}
            disabled={isLocating}
            title="Update Live GPS Position"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
          >
            <RefreshCw size={12} className={isLocating ? 'animate-spin' : ''} />
            <span>{isLocating ? 'Locating...' : 'Refresh GPS'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default GpsLocationWidget;
