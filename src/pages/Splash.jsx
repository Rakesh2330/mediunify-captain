import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Heart, ArrowRight } from 'lucide-react';
import logoImg from '../assets/logo.png';

export default function Splash() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigate('/home');
      } else {
        navigate('/login');
      }
    }, 2400);

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F0F9FF 50%, #E6F8F6 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative pulse ring background */}
      <div
        style={{
          position: 'absolute',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          border: '1px solid rgba(0, 168, 150, 0.15)',
          animation: 'pulse-teal 3s infinite',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '520px',
          height: '520px',
          borderRadius: '50%',
          border: '1px solid rgba(0, 34, 68, 0.08)',
          pointerEvents: 'none'
        }}
      />

      {/* Main Logo Container */}
      <div style={{ zIndex: 2, maxWidth: '420px', animation: 'slideUp 600ms ease' }}>
        <img
          src={logoImg}
          alt="MediUnify"
          style={{ width: '280px', maxWidth: '85vw', height: 'auto', marginBottom: '20px' }}
          onError={(e) => {
            if (e.currentTarget.src !== '/logo.png') {
              e.currentTarget.src = '/logo.png';
            }
          }}
        />

        <div style={{ marginTop: '10px' }}>
          <span
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #002244 0%, #00A896 100%)',
              color: 'white',
              fontSize: '13px',
              fontWeight: '800',
              letterSpacing: '0.14em',
              padding: '6px 18px',
              borderRadius: '999px',
              textTransform: 'uppercase',
              boxShadow: '0 4px 12px rgba(0, 168, 150, 0.3)'
            }}
          >
            CAPTAIN APPLICATION
          </span>
        </div>

        <h2
          style={{
            fontSize: '22px',
            fontWeight: '700',
            color: '#091E3A',
            marginTop: '20px',
            marginBottom: '6px'
          }}
        >
          Healthcare at Your Doorstep
        </h2>

        <p style={{ fontSize: '14px', color: '#64748B', maxWidth: '320px', margin: '0 auto 32px auto' }}>
          Field operations platform for Pharmacy Delivery & Diagnostic Sample Collection
        </p>

        {/* Loading indicator */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              border: '3px solid #E2E8F0',
              borderTopColor: '#00A896',
              borderRightColor: '#002244',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          />
          <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '600' }}>
            Initializing Captain Workspace...
          </span>

          <button
            onClick={() => navigate(isAuthenticated ? '/home' : '/login')}
            className="btn btn-primary"
            style={{ marginTop: '12px', padding: '8px 20px', fontSize: '13px' }}
          >
            <span>Proceed to Login</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Footer Tag */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          fontSize: '12px',
          color: '#94A3B8',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <ShieldCheck size={14} color="#00A896" />
        <span>Enterprise Healthcare Field-Ops Engine • v2.4</span>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
