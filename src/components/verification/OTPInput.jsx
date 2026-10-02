import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function OTPInput({ 
  length = 4, 
  expectedOtp, 
  onVerify, 
  title = "Enter OTP",
  subtitle = "Enter the 4-digit security code received via SMS"
}) {
  const [digits, setDigits] = useState(Array(length).fill(''));
  const [error, setError] = useState(null);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    setError(null);

    // Auto advance to next input
    if (value && index < length - 1 && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1].focus();
    }

    // Auto submit when complete
    const combined = newDigits.join('');
    if (combined.length === length) {
      validateOtp(combined);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0 && inputsRef.current[index - 1]) {
      inputsRef.current[index - 1].focus();
    }
  };

  const validateOtp = (code) => {
    if (expectedOtp && code !== expectedOtp) {
      setError(`Incorrect OTP. Please enter ${expectedOtp} for demo verification.`);
      return false;
    }
    setError(null);
    if (onVerify) {
      onVerify(code);
    }
    return true;
  };

  const handleAutoFill = () => {
    if (expectedOtp) {
      const codeDigits = expectedOtp.split('').slice(0, length);
      setDigits(codeDigits);
      setError(null);
      if (onVerify) {
        onVerify(expectedOtp);
      }
    }
  };

  return (
    <div style={{ textAlign: 'center', margin: '20px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
        <ShieldCheck size={22} color="var(--color-primary-teal)" />
        <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-heading)' }}>
          {title}
        </h4>
      </div>

      {subtitle && (
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
          {subtitle}
        </p>
      )}

      {/* Inputs row */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '14px' }}>
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputsRef.current[i] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            style={{
              width: '52px',
              height: '56px',
              fontSize: '24px',
              fontWeight: '800',
              textAlign: 'center',
              borderRadius: 'var(--radius-md)',
              border: error ? '2px solid var(--color-danger)' : '2px solid var(--border-subtle)',
              outline: 'none',
              background: '#F8FAFC',
              color: 'var(--color-primary-navy)',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
              transition: 'all var(--transition-fast)'
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary-teal)')}
            onBlur={(e) => (e.target.style.borderColor = error ? 'var(--color-danger)' : 'var(--border-subtle)')}
          />
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--color-danger)', fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      {/* Demo helper quick fill */}
      {expectedOtp && (
        <div style={{ marginTop: '10px' }}>
          <button
            type="button"
            onClick={handleAutoFill}
            style={{
              background: '#F0FDFA',
              border: '1px dashed var(--color-primary-teal)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--color-primary-teal-dark)',
              fontSize: '12px',
              fontWeight: '600',
              padding: '6px 14px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>Demo Auto-fill OTP:</span>
            <strong style={{ letterSpacing: '0.1em' }}>{expectedOtp}</strong>
          </button>
        </div>
      )}
    </div>
  );
}
