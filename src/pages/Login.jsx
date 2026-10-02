import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Pill, 
  Activity, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import logoImg from '../assets/logo.png';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [captainType, setCaptainType] = useState('pharmacy'); // 'pharmacy' | 'lab'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectCaptainType = (type) => {
    setCaptainType(type);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(captainType);
      setIsLoading(false);
      navigate('/home');
    }, 600);
  };

  const isPharmacy = captainType === 'pharmacy';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 10% 20%, rgba(0, 168, 150, 0.12) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(0, 34, 68, 0.12) 0%, transparent 40%), #F4F7FB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        position: 'relative'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          background: '#FFFFFF',
          borderRadius: 'var(--radius-2xl)',
          padding: '40px 36px',
          boxShadow: '0 20px 45px -10px rgba(0, 34, 68, 0.14), 0 10px 18px -6px rgba(0, 34, 68, 0.05)',
          border: '1px solid rgba(226, 232, 240, 0.95)',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img
            src={logoImg}
            alt="MediUnify"
            style={{ width: '220px', height: 'auto', marginBottom: '8px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.04))' }}
            onError={(e) => {
              if (e.currentTarget.src !== '/logo.png') {
                e.currentTarget.src = '/logo.png';
              }
            }}
          />
          <p style={{ fontSize: '13px', color: '#00A896', fontWeight: '800', letterSpacing: '0.04em' }}>
            Healthcare at Your Doorstep
          </p>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-heading)', marginTop: '8px', letterSpacing: '-0.02em' }}>
            Captain Portal Sign In
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Captain Type Selector */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
              Select Captain Fleet Role
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => handleSelectCaptainType('pharmacy')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '13px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: isPharmacy ? '2px solid #00A896' : '1px solid #E2E8F0',
                  background: isPharmacy ? '#E6F8F5' : '#FFFFFF',
                  color: isPharmacy ? '#007A6D' : 'var(--text-body)',
                  cursor: 'pointer',
                  fontWeight: '800',
                  fontSize: '13px',
                  boxShadow: isPharmacy ? '0 4px 12px rgba(0, 168, 150, 0.18)' : 'none',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: isPharmacy ? '5px solid #00A896' : '2px solid #CBD5E1',
                    background: 'white',
                    flexShrink: 0
                  }}
                />
                <Pill size={16} color={isPharmacy ? '#00A896' : '#64748B'} />
                <span>Pharmacy Fleet</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectCaptainType('lab')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '13px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: !isPharmacy ? '2px solid #002244' : '1px solid #E2E8F0',
                  background: !isPharmacy ? '#EEF4FB' : '#FFFFFF',
                  color: !isPharmacy ? '#002244' : 'var(--text-body)',
                  cursor: 'pointer',
                  fontWeight: '800',
                  fontSize: '13px',
                  boxShadow: !isPharmacy ? '0 4px 12px rgba(0, 34, 68, 0.15)' : 'none',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: !isPharmacy ? '5px solid #002244' : '2px solid #CBD5E1',
                    background: 'white',
                    flexShrink: 0
                  }}
                />
                <Activity size={16} color={!isPharmacy ? '#002244' : '#64748B'} />
                <span>Lab Test Fleet</span>
              </button>
            </div>
          </div>

          {/* Identifier Input */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-heading)', marginBottom: '8px' }}>
              Mobile Number / Email
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter email or 10-digit mobile"
                style={{
                  width: '100%',
                  padding: '13px 14px 13px 42px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  outline: 'none',
                  fontSize: '14px',
                  background: '#F8FAFC',
                  fontWeight: '500',
                  transition: 'all var(--transition-fast)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#00A896';
                  e.target.style.boxShadow = '0 0 0 3px rgba(0, 168, 150, 0.18)';
                  e.target.style.background = '#FFFFFF';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-subtle)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = '#F8FAFC';
                }}
              />
              <Mail
                size={18}
                color="#64748B"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-heading)' }}>
                Password
              </label>
              <a
                href="#forgot"
                onClick={(e) => { e.preventDefault(); alert("Password reset OTP sent to registered mobile number."); }}
                style={{ fontSize: '12px', color: 'var(--color-primary-teal)', textDecoration: 'none', fontWeight: '700' }}
              >
                Forgot Password?
              </a>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                style={{
                  width: '100%',
                  padding: '13px 42px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  outline: 'none',
                  fontSize: '14px',
                  background: '#F8FAFC',
                  fontWeight: '500',
                  transition: 'all var(--transition-fast)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#00A896';
                  e.target.style.boxShadow = '0 0 0 3px rgba(0, 168, 150, 0.18)';
                  e.target.style.background = '#FFFFFF';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-subtle)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = '#F8FAFC';
                }}
              />
              <Lock
                size={18}
                color="#64748B"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748B',
                  padding: '4px'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '26px' }}>
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary-teal)', cursor: 'pointer' }}
            />
            <label htmlFor="remember" style={{ fontSize: '13px', color: 'var(--text-body)', cursor: 'pointer', userSelect: 'none', fontWeight: '500' }}>
              Remember me on this device
            </label>
          </div>

          {/* Login Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', height: '50px', fontSize: '15px', letterSpacing: '0.04em' }}
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>SIGN IN AS {isPharmacy ? 'PHARMACY CAPTAIN' : 'LAB CAPTAIN'}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Register Link */}
        <div style={{ textAlign: 'center', marginTop: '28px', paddingTop: '22px', borderTop: '1px solid var(--border-card)' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            New to MediUnify Fleet?{' '}
          </span>
          <Link
            to="/register"
            style={{ fontSize: '13px', fontWeight: '800', color: 'var(--color-primary-navy)', textDecoration: 'none' }}
          >
            Register as Captain
          </Link>
        </div>
      </div>
    </div>
  );
}
