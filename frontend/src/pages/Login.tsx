import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserCheck,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Stethoscope,
  Eye,
  Activity,
  Navigation,
  Smartphone,
  KeyRound,
} from 'lucide-react';
import AppHeader from '../components/AppHeader';
import { PhoneOtpForm } from '../components/PhoneOtpForm';
import { CURRENT_USER } from '../utils/mockData';

declare global {
  interface Window {
    google?: any;
  }
}

const GOOGLE_CLIENT_ID = '711027938129-5naq08u1v1804qu1b582b2dl401jpjtm.apps.googleusercontent.com';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<'google' | 'otp' | 'password'>('google');
  const [selectedRole, setSelectedRole] = useState<'CHO' | 'MO' | 'OPH' | 'ADMIN'>('CHO');

  // Password auth state
  const [licenseId, setLicenseId] = useState('MED-TEL-4432-8819');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Initialize Google Identity Services
  useEffect(() => {
    const initGoogleGsi = () => {
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });
        } catch (e) {
          console.error('Google GSI init failed:', e);
        }
      }
    };

    if (window.google?.accounts?.id) {
      initGoogleGsi();
    } else {
      const timer = setInterval(() => {
        if (window.google?.accounts?.id) {
          initGoogleGsi();
          clearInterval(timer);
        }
      }, 300);
      return () => clearInterval(timer);
    }
  }, []);

  const handleGoogleCredentialResponse = (response: any) => {
    setGoogleLoading(true);
    try {
      let userName = 'Google Authenticated Clinician';
      let userEmail = 'doctor@dr-xai.org';
      let userPicture = '';

      if (response.credential) {
        const base64Url = response.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const payload = JSON.parse(jsonPayload);
        userName = payload.name || userName;
        userEmail = payload.email || userEmail;
        userPicture = payload.picture || '';
      }

      const googleUser = {
        ...CURRENT_USER,
        name: userName,
        email: userEmail,
        picture: userPicture,
        role: getRoleTitle(selectedRole),
        licenseId: 'GOOGLE-OAUTH-VERIFIED',
      };

      sessionStorage.setItem('auth_user', JSON.stringify(googleUser));
      localStorage.setItem('auth_user', JSON.stringify(googleUser));

      setTimeout(() => {
        setGoogleLoading(false);
        navigate('/dashboard');
      }, 400);
    } catch (err) {
      console.error('Error processing Google credentials:', err);
      setGoogleLoading(false);
      navigate('/dashboard');
    }
  };

  const getRoleTitle = (r: 'CHO' | 'MO' | 'OPH' | 'ADMIN') => {
    switch (r) {
      case 'CHO': return 'Community Health Specialist';
      case 'MO': return 'Primary Care Physician';
      case 'OPH': return 'Tele-Retina Consultant';
      case 'ADMIN': return 'Clinical Director';
    }
  };

  const handleDirectGoogleLogin = () => {
    setGoogleLoading(true);
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          launchOAuthRedirect();
        }
      });
    } else {
      launchOAuthRedirect();
    }
  };

  const launchOAuthRedirect = () => {
    const redirectUri = `${window.location.origin}/auth/callback`;
    const scope = encodeURIComponent('openid email profile');
    const responseType = 'id_token token';
    const nonce = Math.random().toString(36).substring(2);
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=${encodeURIComponent(responseType)}&scope=${scope}&nonce=${nonce}`;
    window.location.href = authUrl;
  };

  const roles = [
    {
      id: 'CHO',
      title: 'Community Health Specialist',
      facility: 'Primary Health Clinic',
      description: 'Perform fundus photography & AI triage in field clinics',
      icon: <Stethoscope size={18} style={{ color: '#059669' }} />,
    },
    {
      id: 'MO',
      title: 'Primary Care Physician',
      facility: 'Regional Health Center',
      description: 'Review clinical reports, manage glycemic therapy & sign referrals',
      icon: <UserCheck size={18} style={{ color: '#0284c7' }} />,
    },
    {
      id: 'OPH',
      title: 'Tele-Retina Consultant',
      facility: 'Specialty Eye Hospital',
      description: 'Secondary vitreo-retina tele-consultation & laser triage',
      icon: <Eye size={18} style={{ color: '#d97706' }} />,
    },
    {
      id: 'ADMIN',
      title: 'Clinical Director',
      facility: 'Regional Health Network',
      description: 'Monitor blindness prevention registry & screening telemetry',
      icon: <Activity size={18} style={{ color: '#dc2626' }} />,
    },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const userObj = {
      ...CURRENT_USER,
      name: selectedRole === 'OPH' ? 'Dr. Radhakrishnan, MS (Ophthal)' : selectedRole === 'MO' ? 'Dr. Aravind Swaminathan, MD' : selectedRole === 'ADMIN' ? 'Dr. Priya Sharma (Director)' : 'Dr. Radhakrishnan (CHO)',
      role: getRoleTitle(selectedRole),
      licenseId: licenseId || 'MED-TEL-4432-8819',
    };

    sessionStorage.setItem('auth_user', JSON.stringify(userObj));
    localStorage.setItem('auth_user', JSON.stringify(userObj));

    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 400);
  };

  return (
    <div className="app-layout-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppHeader />

      <main style={{ flex: 1, padding: '40px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: 1100, width: '100%', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 32, alignItems: 'stretch' }}>
          
          {/* Left: Clinical Platform Overview */}
          <div
            className="clay-card"
            style={{
              background: 'linear-gradient(135deg, #064e3b 0%, #065f46 60%, #047857 100%)',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: 36,
              border: 'none',
              boxShadow: '0 20px 40px rgba(6, 78, 59, 0.3)',
            }}
          >
            <div>
              {/* Brand Emblem */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.15)',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#ffffff',
                  }}
                >
                  <Eye size={24} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#38bdf8', letterSpacing: 0.5 }}>
                    CLINICAL RETINOPATHY AI PLATFORM
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800 }}>
                    DR-XAI Diagnostic & Tele-Ophthalmology Suite
                  </div>
                </div>
              </div>

              <h1 style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.25, marginBottom: 16, color: '#ffffff' }}>
                AI-Assisted Diabetic Retinopathy Screening & Triage
              </h1>

              <p style={{ fontSize: 14, color: '#d1fae5', lineHeight: 1.6, marginBottom: 24 }}>
                Empowering healthcare professionals and clinicians with Explainable AI (Grad-CAM) to detect diabetic retinopathy in primary clinics, prevent vision loss, and coordinate secondary care referrals.
              </p>

              {/* Key Highlights */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'grid', placeItems: 'center' }}>
                    <CheckCircle2 size={16} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>
                    Instant AI grading for 5 Diabetic Retinopathy severity levels
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'grid', placeItems: 'center' }}>
                    <Sparkles size={16} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>
                    Grad-CAM visual heatmap explaining why the model flagged each scan
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'grid', placeItems: 'center' }}>
                    <Navigation size={16} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>
                    Safe uncertainty-aware human-in-the-loop specialist referrals
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Clinician Single Sign-On */}
          <div className="clay-card" style={{ padding: 36, display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                Clinician Portal Login
              </h2>
            </div>

            {/* FIRST BUTTON: Single High-Fidelity Google Sign-In Button */}
            <div style={{ marginBottom: 18 }}>
              <button
                type="button"
                onClick={handleDirectGoogleLogin}
                disabled={googleLoading}
                className="clay-btn google-auth-btn"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  background: 'var(--card)',
                  color: 'var(--text-main)',
                  border: '1.5px solid var(--border)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  fontWeight: 700,
                  fontSize: 13.5,
                  padding: '11px 16px',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {googleLoading ? (
                  <span>Connecting...</span>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                    </svg>
                    <span>Sign in with Google</span>
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0 16px' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Or Sign In With</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>

            {/* Auth Method Switcher Tabs */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 8,
                background: 'var(--bg-surface-secondary)',
                padding: 4,
                borderRadius: 12,
                marginBottom: 16,
              }}
            >
              <button
                type="button"
                onClick={() => setAuthMode('otp')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '9px 12px',
                  borderRadius: 10,
                  border: 'none',
                  background: authMode === 'otp' ? 'var(--card)' : 'transparent',
                  color: authMode === 'otp' ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: 800,
                  fontSize: 12.5,
                  boxShadow: authMode === 'otp' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <Smartphone size={15} />
                <span>SMS Mobile OTP</span>
              </button>

              <button
                type="button"
                onClick={() => setAuthMode('password')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '9px 12px',
                  borderRadius: 10,
                  border: 'none',
                  background: authMode === 'password' ? 'var(--card)' : 'transparent',
                  color: authMode === 'password' ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: 800,
                  fontSize: 12.5,
                  boxShadow: authMode === 'password' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <KeyRound size={15} />
                <span>License ID & Password</span>
              </button>
            </div>

            {/* Role Selection Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 18 }}>
              {roles.map((r) => {
                const isSelected = selectedRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRole(r.id as any)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 10,
                      border: isSelected ? '2px solid #059669' : '1px solid var(--border)',
                      background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-surface-secondary)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      {r.icon}
                      <strong style={{ fontSize: 11, color: isSelected ? '#10b981' : 'var(--text-main)' }}>
                        {r.title}
                      </strong>
                    </div>
                    <div style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>
                      {r.facility}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* MODE 1: SMS MOBILE OTP AUTHENTICATION */}
            {authMode === 'otp' ? (
              <PhoneOtpForm
                length={4}
                defaultPhone="9848099887"
                defaultRole={selectedRole}
              />
            ) : (
              /* MODE 2: CLINICIAN LICENSE ID & SECURITY PASSWORD */
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="clay-input-group">
                  <label className="clay-label">
                    <UserCheck size={14} style={{ color: '#059669' }} />
                    <span>Clinical Practitioner / License ID</span>
                    <span className="clay-label-required">*</span>
                  </label>
                  <input
                    type="text"
                    value={licenseId}
                    onChange={(e) => setLicenseId(e.target.value)}
                    placeholder="e.g. MED-TEL-4432-8819"
                    required
                    className="clay-input"
                  />
                </div>

                <div className="clay-input-group">
                  <label className="clay-label">
                    <Lock size={14} style={{ color: '#059669' }} />
                    <span>Security Password / PIN</span>
                    <span className="clay-label-required">*</span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter security password"
                    required
                    className="clay-input"
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked style={{ accentColor: '#059669' }} />
                    <span>Remember terminal</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setAuthMode('otp')}
                    style={{ background: 'none', border: 'none', color: '#10b981', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Switch to SMS OTP
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="clay-btn clay-btn-primary clay-btn-lg"
                  style={{ width: '100%', marginTop: 6 }}
                >
                  {isLoading ? (
                    <span>Authenticating Credentials...</span>
                  ) : (
                    <>
                      <span>Enter Clinical Portal</span>
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </form>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;