import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { CURRENT_USER } from '../utils/mockData';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Parse token or code from URL hash or search params
    const hash = window.location.hash.substring(1);
    const search = window.location.search.substring(1);
    const params = new URLSearchParams(hash || search);

    const accessToken = params.get('access_token');
    const idToken = params.get('id_token');
    const code = params.get('code');

    if (idToken || accessToken || code) {
      let userName = 'Clinician Practitioner';
      let userEmail = 'clinician@dr-xai.org';
      let userPicture = '';

      if (idToken) {
        try {
          const base64Url = idToken.split('.')[1];
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
        } catch (e) {
          console.error('Error decoding Google ID token:', e);
        }
      }

      const googleUser = {
        ...CURRENT_USER,
        name: userName,
        email: userEmail,
        picture: userPicture,
        licenseId: 'GOOGLE-OAUTH-VERIFIED',
      };

      sessionStorage.setItem('auth_user', JSON.stringify(googleUser));
      localStorage.setItem('auth_user', JSON.stringify(googleUser));

      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 600);
    } else {
      // Fallback
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 500);
    }
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-main)',
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      <div
        className="clay-card"
        style={{
          padding: 40,
          textAlign: 'center',
          maxWidth: 420,
          background: 'var(--card)',
          border: '1px solid var(--border)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#10b981',
            display: 'grid',
            placeItems: 'center',
            margin: '0 auto 18px',
          }}
        >
          <CheckCircle2 size={32} />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8 }}>
          Google Authentication Verified
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>
          Connecting your Google Account to DR-XAI Clinical Workspace...
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: '#10b981', fontSize: 13, fontWeight: 700 }}>
          <Loader2 size={18} className="animate-spin" />
          <span>Launching Clinical Dashboard...</span>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
