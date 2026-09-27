import React, { useState } from 'react';
import {
  ScanEye,
  Flame,
  Layers3,
  Sliders,
  Maximize2,
  Minimize2,
  Info,
  CheckCircle2,
  Sparkles,
  Eye,
  ArrowLeftRight,
  AlertCircle,
} from 'lucide-react';
import type { LesionFeature } from '../types';

interface HeatmapViewerProps {
  original: string;
  heatmap: string;
  explained: string;
  lesions?: LesionFeature[];
  prediction?: string;
  confidence?: number;
}

type ViewMode = 'split' | 'overlay' | 'original' | 'heatmap' | 'explained';

export const HeatmapViewer: React.FC<HeatmapViewerProps> = ({
  original,
  heatmap,
  explained,
  lesions = [
    { name: 'Microaneurysms', count: 14, severity: 'moderate', description: 'Small capillary outpouchings in temporal macular zone' },
    { name: 'Hard Exudates', count: 8, severity: 'moderate', description: 'Lipid deposits with distinct yellow waxy borders' },
    { name: 'Dot Hemorrhages', count: 5, severity: 'mild', description: 'Deep intra-retinal microvascular bleeds' },
  ],
  prediction = 'Moderate Diabetic Retinopathy',
  confidence = 94.2,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [splitPos, setSplitPos] = useState<number>(50);
  const [opacity, setOpacity] = useState<number>(80);
  const [isRedFreeFilter, setIsRedFreeFilter] = useState<boolean>(false);
  const [isHighContrastFilter, setIsHighContrastFilter] = useState<boolean>(false);
  const [showLesionLabels, setShowLesionLabels] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const filterStyle = [
    isRedFreeFilter ? 'hue-rotate(90deg) saturate(200%)' : '',
    isHighContrastFilter ? 'contrast(160%) brightness(90%)' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={`clay-card ${isFullscreen ? 'heatmap-fullscreen-container' : ''}`}
      style={
        isFullscreen
          ? {
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9999,
              borderRadius: 0,
              padding: 24,
              overflowY: 'auto',
              background: '#0f172a',
              color: '#ffffff',
            }
          : {}
      }
    >
      {/* Header */}
      <div className="clay-card-header">
        <div>
          <div className="clay-card-title">
            <Sparkles size={18} style={{ color: '#059669' }} />
            <span>Explainable AI (Grad-CAM) Visual Diagnostic Suite</span>
          </div>
          <div className="clay-card-subtitle">
            Attention map highlighting the retinal features influencing the AI prediction ({prediction} • {confidence.toFixed(1)}% Confidence)
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            className="clay-btn clay-btn-secondary clay-btn-sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen Diagnostic Mode'}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            <span>{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          padding: '12px 16px',
          background: isFullscreen ? 'rgba(255,255,255,0.06)' : 'var(--bg-surface-secondary)',
          borderRadius: 14,
          marginBottom: 18,
          border: '1px solid var(--border)',
        }}
      >
        {/* Mode Selector Tabs */}
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            type="button"
            className={`clay-btn clay-btn-sm ${viewMode === 'split' ? 'clay-btn-primary' : 'clay-btn-secondary'}`}
            onClick={() => setViewMode('split')}
          >
            <Sliders size={13} />
            <span>Split Slider</span>
          </button>
          <button
            type="button"
            className={`clay-btn clay-btn-sm ${viewMode === 'overlay' ? 'clay-btn-primary' : 'clay-btn-secondary'}`}
            onClick={() => setViewMode('overlay')}
          >
            <Layers3 size={13} />
            <span>Opacity Blend</span>
          </button>
          <button
            type="button"
            className={`clay-btn clay-btn-sm ${viewMode === 'original' ? 'clay-btn-primary' : 'clay-btn-secondary'}`}
            onClick={() => setViewMode('original')}
          >
            <ScanEye size={13} />
            <span>Original Fundus</span>
          </button>
          <button
            type="button"
            className={`clay-btn clay-btn-sm ${viewMode === 'heatmap' ? 'clay-btn-primary' : 'clay-btn-secondary'}`}
            onClick={() => setViewMode('heatmap')}
          >
            <Flame size={13} />
            <span>Pure Heatmap</span>
          </button>
          <button
            type="button"
            className={`clay-btn clay-btn-sm ${viewMode === 'explained' ? 'clay-btn-primary' : 'clay-btn-secondary'}`}
            onClick={() => setViewMode('explained')}
          >
            <Sparkles size={13} />
            <span>Explained Composite</span>
          </button>
        </div>

        {/* Clinical Optical Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            className={`clay-btn clay-btn-sm ${isRedFreeFilter ? 'clay-btn-primary' : 'clay-btn-secondary'}`}
            onClick={() => setIsRedFreeFilter(!isRedFreeFilter)}
            title="Red-Free (Green Channel) filter enhances contrast of retinal blood vessels and microaneurysms"
          >
            <Eye size={13} />
            <span>Red-Free Filter</span>
          </button>
          <button
            type="button"
            className={`clay-btn clay-btn-sm ${isHighContrastFilter ? 'clay-btn-primary' : 'clay-btn-secondary'}`}
            onClick={() => setIsHighContrastFilter(!isHighContrastFilter)}
            title="Enhance image microvascular contrast"
          >
            <span>High Contrast</span>
          </button>
          <button
            type="button"
            className={`clay-btn clay-btn-sm ${showLesionLabels ? 'clay-btn-primary' : 'clay-btn-secondary'}`}
            onClick={() => setShowLesionLabels(!showLesionLabels)}
          >
            <span>Lesions ({lesions.length})</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Viewport */}
      <div
        className="xai-viewport"
        style={{
          height: isFullscreen ? '62vh' : 420,
          position: 'relative',
          cursor: viewMode === 'split' ? 'ew-resize' : 'default',
        }}
        onMouseMove={(e) => {
          if (viewMode === 'split') {
            const rect = e.currentTarget.getBoundingClientRect();
            const pos = ((e.clientX - rect.left) / rect.width) * 100;
            setSplitPos(Math.max(5, Math.min(95, pos)));
          }
        }}
        onTouchMove={(e) => {
          if (viewMode === 'split' && e.touches[0]) {
            const rect = e.currentTarget.getBoundingClientRect();
            const pos = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
            setSplitPos(Math.max(5, Math.min(95, pos)));
          }
        }}
      >
        {/* Under layer (Original) */}
        <img
          src={original}
          alt="Original Retinal Fundus"
          className="xai-image-layer"
          style={{ filter: filterStyle || 'none' }}
        />

        {/* Mode: Split Screen Slider */}
        {viewMode === 'split' && (
          <>
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                clipPath: `polygon(${splitPos}% 0%, 100% 0%, 100% 100%, ${splitPos}% 100%)`,
                overflow: 'hidden',
              }}
            >
              <img
                src={explained}
                alt="AI Grad-CAM Overlay"
                className="xai-image-layer"
                style={{ filter: filterStyle || 'none' }}
              />
            </div>

            {/* Split Divider line */}
            <div
              className="xai-split-divider"
              style={{ left: `${splitPos}%` }}
            >
              <div className="xai-split-handle">
                <ArrowLeftRight size={14} />
              </div>
            </div>

            {/* Labels for sides */}
            <div
              style={{
                position: 'absolute',
                top: 14,
                left: 14,
                background: 'rgba(0,0,0,0.7)',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 700,
                pointerEvents: 'none',
              }}
            >
              ORIGINAL FUNDUS
            </div>
            <div
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                background: 'rgba(5, 150, 105, 0.85)',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 700,
                pointerEvents: 'none',
              }}
            >
              GRAD-CAM ATTENTION MAP
            </div>
          </>
        )}

        {/* Mode: Opacity Blend Overlay */}
        {viewMode === 'overlay' && (
          <img
            src={heatmap}
            alt="AI Heatmap Overlay"
            className="xai-image-layer"
            style={{
              opacity: opacity / 100,
              mixBlendMode: 'screen',
              filter: filterStyle || 'none',
            }}
          />
        )}

        {/* Mode: Pure Heatmap */}
        {viewMode === 'heatmap' && (
          <img
            src={heatmap}
            alt="Pure Heatmap"
            className="xai-image-layer"
            style={{ filter: filterStyle || 'none' }}
          />
        )}

        {/* Mode: Explained Composite */}
        {viewMode === 'explained' && (
          <img
            src={explained}
            alt="Explained Composite"
            className="xai-image-layer"
            style={{ filter: filterStyle || 'none' }}
          />
        )}

        {/* Anatomical Landmark Overlays */}
        {showLesionLabels && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
            {/* Optic Disc Marker */}
            <div
              style={{
                position: 'absolute',
                top: '42%',
                left: '26%',
                transform: 'translate(-50%, -50%)',
                border: '2px dashed #38bdf8',
                borderRadius: '50%',
                width: 60,
                height: 60,
                boxShadow: '0 0 10px rgba(56, 189, 248, 0.5)',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: -20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#0369a1',
                  color: '#ffffff',
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: 4,
                  whiteSpace: 'nowrap',
                }}
              >
                Optic Disc
              </span>
            </div>

            {/* Macula Marker */}
            <div
              style={{
                position: 'absolute',
                top: '52%',
                left: '60%',
                transform: 'translate(-50%, -50%)',
                border: '2px dashed #f59e0b',
                borderRadius: '50%',
                width: 70,
                height: 70,
                boxShadow: '0 0 10px rgba(245, 158, 11, 0.5)',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  bottom: -20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#d97706',
                  color: '#ffffff',
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: 4,
                  whiteSpace: 'nowrap',
                }}
              >
                Macula / Fovea Center
              </span>
            </div>

            {/* Lesion Hotspot Attention */}
            <div
              style={{
                position: 'absolute',
                top: '48%',
                left: '68%',
                transform: 'translate(-50%, -50%)',
                background: 'rgba(220, 38, 38, 0.9)',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 800,
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                border: '1px solid #ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <AlertCircle size={13} />
              <span>Primary Grad-CAM Hotspot</span>
            </div>
          </div>
        )}
      </div>

      {/* Sliders for Opacity if in Overlay mode */}
      {viewMode === 'overlay' && (
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>Heatmap Opacity:</span>
          <input
            type="range"
            min={10}
            max={100}
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            style={{ flex: 1, accentColor: '#059669' }}
          />
          <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-main)' }}>{opacity}%</span>
        </div>
      )}

      {/* Lesion Breakdown Cards */}
      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Info size={14} style={{ color: '#10b981' }} />
          <span>Explainable AI Biomarker Findings</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {lesions.map((lesion) => (
            <div
              key={lesion.name}
              style={{
                background: isFullscreen ? 'rgba(255,255,255,0.06)' : 'var(--bg-surface-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: lesion.severity === 'severe' ? 'rgba(239, 68, 68, 0.18)' : lesion.severity === 'moderate' ? 'rgba(245, 158, 11, 0.18)' : 'rgba(56, 189, 248, 0.18)',
                  color: lesion.severity === 'severe' ? '#f87171' : lesion.severity === 'moderate' ? '#fbbf24' : '#38bdf8',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 800,
                  fontSize: 12,
                }}
              >
                {lesion.count}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-main)' }}>
                  {lesion.name}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  {lesion.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clinical Verification Note */}
      <div
        style={{
          marginTop: 16,
          padding: '10px 14px',
          background: 'rgba(5, 150, 105, 0.15)',
          border: '1px solid rgba(52, 211, 153, 0.35)',
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: 12,
          color: '#34d399',
        }}
      >
        <CheckCircle2 size={16} style={{ color: '#10b981', flexShrink: 0 }} />
        <span>
          <strong>Clinical Verification Note:</strong> Heatmaps are generated via Gradient-weighted Class Activation Mapping (Grad-CAM) to provide transparent visual reasoning for the clinician. Final diagnosis rests with certified ophthalmologists.
        </span>
      </div>
    </div>
  );
};

export default HeatmapViewer;