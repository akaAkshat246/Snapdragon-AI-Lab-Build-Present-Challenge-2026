import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Layers,
  RefreshCw,
  UserCheck,
  Globe,
} from 'lucide-react';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import { useLanguage } from '../utils/i18n';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Active Stage Focus state in 7-Stage Architecture
  const [selectedStage, setSelectedStage] = useState<number>(1);

  // Stage details data
  const stageIcons = [
    <UserCheck size={20} style={{ color: '#059669' }} />,
    <Eye size={20} style={{ color: '#0284c7' }} />,
    <RefreshCw size={20} style={{ color: '#d97706' }} />,
    <Layers size={20} style={{ color: '#7c3aed' }} />,
    <Sparkles size={20} style={{ color: '#ea580c' }} />,
    <ShieldCheck size={20} style={{ color: '#dc2626' }} />,
    <Globe size={20} style={{ color: '#0d9488' }} />,
  ];

  const stageColors = [
    '#059669',
    '#0284c7',
    '#d97706',
    '#7c3aed',
    '#ea580c',
    '#dc2626',
    '#0d9488',
  ];

  const currentStageInfo = t.stages[selectedStage - 1] || t.stages[0];

  return (
    <div className="app-layout-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppHeader />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
          color: '#ffffff',
          padding: '48px 24px 56px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'inset 0 -10px 30px rgba(0,0,0,0.15)',
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: 36,
            alignItems: 'center',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 'clamp(28px, 4vw, 42px)',
                fontWeight: 900,
                lineHeight: 1.2,
                marginBottom: 14,
                color: '#ffffff',
                letterSpacing: '-0.02em',
              }}
            >
              {t.heroTitle}
            </h1>

            <h2
              style={{
                fontSize: 'clamp(15px, 2vw, 19px)',
                fontWeight: 700,
                color: '#6ee7b7',
                marginBottom: 16,
              }}
            >
              {t.heroSubtitle}
            </h2>

            <p
              style={{
                fontSize: 14.5,
                lineHeight: 1.65,
                color: '#ecfdf5',
                marginBottom: 28,
                maxWidth: 680,
              }}
            >
              {t.heroDescription}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <button
                type="button"
                className="clay-btn"
                onClick={() => navigate('/login')}
                style={{
                  background: '#ffffff',
                  color: '#064e3b',
                  fontWeight: 800,
                  fontSize: 14,
                  padding: '12px 24px',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  border: 'none',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease',
                }}
              >
                <span>{t.heroCtaLogin}</span>
                <ArrowRight size={16} />
              </button>

              <a
                href="#architecture"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 22px',
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: '#ffffff',
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: 'none',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <Layers size={16} style={{ color: '#38bdf8' }} />
                <span>{t.heroCtaArch}</span>
              </a>
            </div>
          </div>

          {/* Hero Feature Highlights Card */}
          <div
            className="clay-card"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              backdropFilter: 'blur(12px)',
              padding: 28,
              borderRadius: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#059669', display: 'grid', placeItems: 'center', color: '#fff' }}>
                <Eye size={20} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#ffffff' }}>Rural Clinical Architecture</div>
                <div style={{ fontSize: 11, color: '#a7f3d0' }}>Explainable • Offline • Safe Triage</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13, color: '#f0fdf4' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle2 size={16} style={{ color: '#34d399', flexShrink: 0 }} />
                <span>Automated image quality gate (blur, cataract, small pupil)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle2 size={16} style={{ color: '#34d399', flexShrink: 0 }} />
                <span>5-stage international diabetic retinopathy classification</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle2 size={16} style={{ color: '#34d399', flexShrink: 0 }} />
                <span>Grad-CAM attention heatmaps & lesion overlays</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle2 size={16} style={{ color: '#34d399', flexShrink: 0 }} />
                <span>Safe uncertainty-aware human-in-the-loop referral rules</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle2 size={16} style={{ color: '#34d399', flexShrink: 0 }} />
                <span>Bilingual patient counseling & 30/60/90-day follow-up tracking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. NATIONAL KEY METRICS COUNTER BAR */}
      {/* ========================================================================= */}
      <section style={{ padding: '24px 20px', background: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          {[
            { label: t.subCentres, count: '167,275', note: t.subCentresNote, color: '#059669' },
            { label: t.phcs, count: '26,636', note: t.phcsNote, color: '#0284c7' },
            { label: t.chcs, count: '6,155', note: t.chcsNote, color: '#7c3aed' },
            { label: t.totalFacilities, count: '200,066', note: t.totalFacilitiesNote, color: '#ea580c' },
            { label: t.validatedSens, count: '93.3%', note: t.validatedSensNote, color: '#dc2626' },
            { label: t.offlineInference, count: '>= 95%', note: t.offlineInferenceNote, color: '#0d9488' },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                background: 'var(--bg-surface-secondary)',
                border: `1px solid var(--border)`,
                borderTop: `3px solid ${stat.color}`,
                borderRadius: 14,
                padding: '14px 16px',
                textAlign: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 900, color: stat.color, letterSpacing: '-0.02em' }}>
                {stat.count}
              </div>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-main)', marginTop: 2 }}>
                {stat.label}
              </div>
              <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 4 }}>
                {stat.note}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. PROMINENT 7-STAGE AI ARCHITECTURE SHOWCASE */}
      {/* ========================================================================= */}
      <main id="architecture" style={{ maxWidth: 1240, width: '100%', margin: '0 auto', padding: '40px 20px', flex: 1 }}>
        
        {/* Section Header */}
        <div className="clay-card" style={{ padding: 30, marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(5, 150, 105, 0.15)', display: 'grid', placeItems: 'center', color: '#10b981' }}>
              <Layers size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                {t.archSectionTitle}
              </h2>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#10b981' }}>Figure 1: Complete Clinical Decision Support Flow</span>
            </div>
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: '10px 0 16px' }}>
            {t.archSectionSubtitle}
          </p>
          <div
            style={{
              background: 'rgba(220, 38, 38, 0.12)',
              border: '1px solid rgba(220, 38, 38, 0.25)',
              padding: '10px 16px',
              borderRadius: 10,
              fontSize: 12.5,
              color: '#f87171',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <AlertTriangle size={16} style={{ flexShrink: 0 }} />
            <span>{t.archRuleNote}</span>
          </div>
        </div>

        {/* Interactive 7 Stages Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10, marginBottom: 24, overflowX: 'auto', paddingBottom: 6 }}>
          {t.stages.map((st, idx) => {
            const stepNum = idx + 1;
            const isSelected = selectedStage === stepNum;
            const color = stageColors[idx];
            return (
              <button
                key={stepNum}
                type="button"
                onClick={() => setSelectedStage(stepNum)}
                style={{
                  background: isSelected ? 'var(--card)' : 'var(--bg-surface-secondary)',
                  border: isSelected ? `2.5px solid ${color}` : '1px solid var(--border)',
                  borderRadius: 14,
                  padding: '12px 10px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  boxShadow: isSelected ? `0 8px 20px ${color}35` : 'none',
                  transition: 'all 0.2s ease',
                  minWidth: 130,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: isSelected ? color : 'var(--border)',
                    color: isSelected ? '#ffffff' : 'var(--text-muted)',
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: 800,
                    fontSize: 13,
                  }}
                >
                  0{stepNum}
                </div>
                <div style={{ fontSize: 11.5, fontWeight: 800, color: isSelected ? color : 'var(--text-main)', lineHeight: 1.3 }}>
                  {st.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail Showcase Card */}
        <div
          className="clay-card"
          style={{
            padding: 30,
            borderLeft: `6px solid ${stageColors[selectedStage - 1]}`,
            marginBottom: 36,
            boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 18, borderBottom: '1px solid var(--border)', paddingBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: stageColors[selectedStage - 1],
                  color: '#ffffff',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 900,
                  fontSize: 20,
                  boxShadow: `0 4px 12px ${stageColors[selectedStage - 1]}40`,
                }}
              >
                0{selectedStage}
              </div>
              <div>
                <div style={{ fontSize: 11.5, fontWeight: 800, color: stageColors[selectedStage - 1], textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {t.stepWord} 0{selectedStage} / 07
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-main)', margin: '2px 0 0' }}>
                  {currentStageInfo.title}
                </h3>
              </div>
            </div>

            <div
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                background: `${stageColors[selectedStage - 1]}20`,
                color: stageColors[selectedStage - 1],
                fontWeight: 700,
                fontSize: 12.5,
              }}
            >
              {currentStageInfo.module}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            {/* Input */}
            <div style={{ background: 'var(--bg-surface-secondary)', padding: 18, borderRadius: 12, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                📥 {t.inputWord}
              </div>
              <p style={{ fontSize: 13.5, color: 'var(--text-main)', margin: 0, lineHeight: 1.5, fontWeight: 600 }}>
                {currentStageInfo.input}
              </p>
            </div>

            {/* Output */}
            <div style={{ background: 'var(--bg-surface-secondary)', padding: 18, borderRadius: 12, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                📤 {t.outputWord}
              </div>
              <p style={{ fontSize: 13.5, color: 'var(--text-main)', margin: 0, lineHeight: 1.5, fontWeight: 600 }}>
                {currentStageInfo.output}
              </p>
            </div>
          </div>

          {/* Safety Rule */}
          <div
            style={{
              background: 'rgba(5, 150, 105, 0.15)',
              border: '1.5px solid rgba(52, 211, 153, 0.35)',
              padding: '14px 18px',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <ShieldCheck size={20} style={{ color: '#10b981', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#34d399', textTransform: 'uppercase' }}>
                🛡️ {t.safetyRuleWord}
              </div>
              <div style={{ fontSize: 13.5, color: '#6ee7b7', fontWeight: 600, marginTop: 2 }}>
                {currentStageInfo.failSafe}
              </div>
            </div>
          </div>
        </div>

        {/* All 7 Stages Detailed Stack Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 40 }}>
          {t.stages.map((s, idx) => {
            const stepNum = idx + 1;
            const color = stageColors[idx];
            return (
              <div
                key={stepNum}
                className="clay-card"
                style={{
                  padding: '16px 20px',
                  borderLeft: `5px solid ${color}`,
                  display: 'grid',
                  gridTemplateColumns: '50px 1.2fr 1fr',
                  gap: 16,
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: color,
                    color: '#ffffff',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 16,
                    fontWeight: 800,
                  }}
                >
                  0{stepNum}
                </div>

                <div>
                  <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--text-main)' }}>{s.title}</div>
                  <div style={{ fontSize: 11.5, color: color, fontWeight: 700, marginTop: 2 }}>{s.module}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 4 }}>
                    <strong>{t.inputWord}:</strong> {s.input}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-surface-secondary)', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 11.5 }}>
                  <div style={{ color: 'var(--text-main)', fontWeight: 700, marginBottom: 2 }}>
                    <strong>{t.outputWord}:</strong> {s.output}
                  </div>
                  <div style={{ color: '#10b981' }}>
                    <strong>{t.safetyRuleWord}:</strong> {s.failSafe}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* 4. THE 7 CORE IMPLEMENTATION PILLARS */}
        {/* ========================================================================= */}
        <div className="clay-card" style={{ padding: 30, marginBottom: 30 }}>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-main)' }}>
              {t.pillarsTitle}
            </h3>
            <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginTop: 4 }}>
              {t.pillarsSubtitle}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {t.pillars.map((p, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-surface-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 14,
                  padding: 18,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    {stageIcons[idx]}
                    <strong style={{ fontSize: 14, color: 'var(--text-main)' }}>{p.title}</strong>
                  </div>
                  <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    {p.desc}
                  </p>
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '3px 8px', borderRadius: 6, width: 'fit-content' }}>
                  {p.tag}
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Footer is rendered only on Landing Page */}
      <AppFooter />
    </div>
  );
};

export default Landing;
