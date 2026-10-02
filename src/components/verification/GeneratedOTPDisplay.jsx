import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  RefreshCw, 
  Copy, 
  Check, 
  CheckCircle2, 
  Store, 
  User, 
  Clock, 
  Sparkles,
  Info
} from 'lucide-react';
import { soundEffects } from '../../utils/audio';

export default function GeneratedOTPDisplay({
  otp,
  onRegenerate,
  onConfirm,
  title = "Handover Verification OTP",
  subtitle = "Give this 4-digit verification code to the person to release/handover the package.",
  recipientLabel = "Pharmacy Staff / Counter",
  orderId,
  confirmButtonText = "VERIFY & PROCEED",
  confirmButtonIcon: ConfirmIcon = CheckCircle2,
  accentColor = "#00A896"
}) {
  const [currentOtp, setCurrentOtp] = useState(otp || '7391');
  const [copied, setCopied] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(300); // 5 minute freshness

  useEffect(() => {
    if (otp) {
      setCurrentOtp(otp);
    }
  }, [otp]);

  // Countdown timer for code validity
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          return 300; // auto-refresh
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(currentOtp);
    setCopied(true);
    soundEffects.playAlert();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateNew = () => {
    setIsRotating(true);
    soundEffects.playAlert();
    
    // Generate fresh random 4-digit OTP
    const newCode = Math.floor(1000 + Math.random() * 9000).toString();
    setCurrentOtp(newCode);
    setSecondsRemaining(300);

    if (onRegenerate) {
      onRegenerate(newCode);
    }

    setTimeout(() => {
      setIsRotating(false);
    }, 500);
  };

  const digits = (currentOtp || '7391').toString().padStart(4, '0').split('').slice(0, 4);

  return (
    <div style={{ textAlign: 'center', margin: '10px 0' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: '#E6F8F5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: accentColor
        }}>
          <ShieldCheck size={22} />
        </div>
        <div style={{ textAlign: 'left' }}>
          <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-heading)', margin: 0 }}>
            {title}
          </h3>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
            ORDER REF: <strong style={{ color: 'var(--color-primary-navy)', fontFamily: 'monospace' }}>{orderId || 'ACTIVE'}</strong>
          </span>
        </div>
      </div>

      <p style={{ fontSize: '13px', color: 'var(--text-body)', margin: '8px auto 16px auto', maxWidth: '440px', lineHeight: 1.45 }}>
        {subtitle}
      </p>

      {/* Main OTP Presentation Box */}
      <div style={{
        background: 'linear-gradient(135deg, #001E3D 0%, #002B54 100%)',
        borderRadius: '16px',
        padding: '24px 20px',
        color: '#FFFFFF',
        boxShadow: '0 10px 25px -5px rgba(0, 34, 68, 0.25)',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {/* Subtle decorative background glow */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 168, 150, 0.3) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Top pill inside card */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <span style={{
            background: 'rgba(0, 168, 150, 0.2)',
            border: '1px solid rgba(0, 168, 150, 0.4)',
            color: '#2DD4BF',
            fontSize: '11px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            padding: '4px 10px',
            borderRadius: '999px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2DD4BF', animation: 'pulse 1.5s infinite' }} />
            Show Code to {recipientLabel}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#94A3B8' }}>
            <Clock size={13} />
            <span>Valid for {formatTimer(secondsRemaining)}</span>
          </div>
        </div>

        {/* Large 4 Digit Display */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            margin: '14px 0'
          }}>
            {digits.map((digit, index) => (
              <div
                key={index}
                style={{
                  width: '64px',
                  height: '74px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '2px solid rgba(0, 168, 150, 0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '34px',
                  fontWeight: '900',
                  fontFamily: 'monospace',
                  color: '#FFFFFF',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 4px 12px rgba(0, 168, 150, 0.2)',
                  letterSpacing: '0px'
                }}
              >
                {digit}
              </div>
            ))}
          </div>

          <div style={{ fontSize: '12px', color: '#CBD5E1', marginTop: '6px' }}>
            4-Digit Secure Delivery Token
          </div>
        </div>

        {/* Action Controls Row (Regenerate, Copy) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          marginTop: '18px',
          flexWrap: 'wrap'
        }}>
          {/* Generate New OTP button */}
          <button
            type="button"
            onClick={handleGenerateNew}
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              borderRadius: '8px',
              padding: '7px 14px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <RefreshCw size={14} style={{ transform: isRotating ? 'rotate(360deg)' : 'none', transition: 'transform 0.5s ease' }} />
            <span>Generate New OTP</span>
          </button>

          {/* Copy OTP Button */}
          <button
            type="button"
            onClick={handleCopy}
            style={{
              background: copied ? '#059669' : 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              borderRadius: '8px',
              padding: '7px 14px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>
      </div>

      {/* Field Workflow Checklist Instructions */}
      <div style={{
        marginTop: '16px',
        padding: '12px 16px',
        borderRadius: '10px',
        background: '#F0FDFA',
        border: '1px solid #CCFBF1',
        textAlign: 'left'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0F766E', fontSize: '12px', fontWeight: '800', marginBottom: '6px' }}>
          <Info size={15} />
          <span>HANDOVER INSTRUCTIONS FOR CAPTAIN:</span>
        </div>
        <ol style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#134E4A', lineHeight: 1.5 }}>
          <li>Present this <strong>4-digit code ({currentOtp})</strong> to the {recipientLabel}.</li>
          <li>The {recipientLabel} inputs the code into their MediUnify portal to confirm your identity.</li>
          <li>Once approved, collect the package and tap the button below.</li>
        </ol>
      </div>

      {/* Main Confirm Button */}
      <button
        type="button"
        onClick={() => onConfirm && onConfirm(currentOtp)}
        className="btn btn-primary btn-lg"
        style={{
          width: '100%',
          marginTop: '18px',
          padding: '15px 20px',
          fontSize: '14px',
          letterSpacing: '0.3px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          boxShadow: '0 6px 18px rgba(0, 168, 150, 0.35)'
        }}
      >
        <ConfirmIcon size={20} />
        <span>{confirmButtonText}</span>
      </button>
    </div>
  );
}
