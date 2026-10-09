import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import StatusBadge from '../components/common/StatusBadge';
import {
  Activity,
  Pill,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MapPin,
  Phone,
  ArrowRight,
  ShieldCheck,
  ThermometerSnowflake,
  Wifi,
  WifiOff,
  Navigation,
  Sparkles,
  Zap,
  QrCode,
  Wallet,
  PhoneCall,
  ChevronRight
} from 'lucide-react';

export default function Home() {
  const { captainType, profile, dutyStatus, toggleDutyStatus } = useAuth();
  const { labTasks, pharmacyTasks, earnings, updateTaskStatus } = useTasks();
  const navigate = useNavigate();

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

  const isPharmacy = captainType === 'pharmacy';
  const tasks = isPharmacy ? pharmacyTasks : labTasks;

  // Active / in-progress or next assigned task
  const activeTask = tasks.find(t => t.status !== 'COMPLETED' && t.status !== 'CANCELLED');

  // Stats calculation
  const totalTasksToday = tasks.length + 1;
  const completedCount = tasks.filter(t => t.status === 'COMPLETED').length + 2;
  const pendingCount = tasks.filter(t => t.status !== 'COMPLETED' && t.status !== 'CANCELLED').length;

  const handleCall = (e, phone) => {
    e.stopPropagation();
    window.open(`tel:${phone}`, '_self');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome Banner & Duty Card */}
      <div
        style={{
          background: isPharmacy
            ? 'radial-gradient(circle at 90% 15%, rgba(0, 168, 150, 0.35) 0%, transparent 45%), linear-gradient(135deg, #001730 0%, #002B66 55%, #001E3D 100%)'
            : 'radial-gradient(circle at 90% 15%, rgba(2, 132, 199, 0.35) 0%, transparent 45%), linear-gradient(135deg, #001226 0%, #002244 55%, #001A35 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: isMobile ? '16px 14px' : '26px 28px',
          color: 'white',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.12)'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '12px' : '16px' }}>
            <div style={{ minWidth: 0, width: isMobile ? '100%' : 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                <span 
                  style={{ 
                    fontSize: '10.5px', 
                    background: 'rgba(255, 255, 255, 0.16)', 
                    padding: '3px 10px', 
                    borderRadius: '999px', 
                    fontWeight: '800', 
                    letterSpacing: '0.04em',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  {isPharmacy ? 'PHARMACY DISPATCH FLEET' : 'DIAGNOSTIC SAMPLE COLLECTION FLEET'}
                </span>
                <span style={{ fontSize: '11.5px', color: '#5EEAD4', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#5EEAD4' }} />
                  {profile.city} Sector
                </span>
              </div>

              <h1 style={{ fontSize: isMobile ? '19.5px' : '25px', fontWeight: '800', color: '#FFFFFF', margin: '2px 0 6px 0', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
                Good Morning, {profile.name}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap', fontSize: isMobile ? '11.5px' : '12.5px', color: '#CBD5E1', lineHeight: 1.4 }}>
                <span>ID: <strong style={{ color: '#FFFFFF' }}>{profile.id}</strong></span>
                <span style={{ opacity: 0.35 }}>•</span>
                <span style={{ whiteSpace: 'nowrap' }}>Vehicle: <strong style={{ color: '#FFFFFF' }}>{profile.vehicle}</strong></span>
                <span style={{ opacity: 0.35 }}>•</span>
                <span style={{ color: '#FDE047', fontWeight: '800', whiteSpace: 'nowrap' }}>★ {profile.rating}</span>
              </div>
            </div>

            {/* Prominent Duty Status Switcher */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.10)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: '12px',
                padding: isMobile ? '10px 14px' : '12px 18px',
                border: '1px solid rgba(255, 255, 255, 0.20)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.18)',
                width: isMobile ? '100%' : 'auto',
                boxSizing: 'border-box'
              }}
            >
              <div>
                <div style={{ fontSize: '10px', color: '#CBD5E1', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Duty Status
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                  <span
                    style={{
                      width: '9px',
                      height: '9px',
                      borderRadius: '50%',
                      background: dutyStatus === 'ONLINE' ? '#10B981' : '#94A3B8',
                      boxShadow: dutyStatus === 'ONLINE' ? '0 0 8px #10B981, 0 0 0 2px rgba(16, 185, 129, 0.3)' : 'none'
                    }}
                  />
                  <strong style={{ fontSize: '14.5px', color: '#FFFFFF', letterSpacing: '0.02em' }}>{dutyStatus}</strong>
                </div>
              </div>

              <button
                onClick={toggleDutyStatus}
                style={{
                  background: dutyStatus === 'ONLINE' ? '#10B981' : '#E2E8F0',
                  color: dutyStatus === 'ONLINE' ? 'white' : '#002244',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  padding: isMobile ? '7px 14px' : '9px 18px',
                  fontWeight: '800',
                  fontSize: isMobile ? '11.5px' : '12.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.18)',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {dutyStatus === 'ONLINE' ? <Wifi size={14} /> : <WifiOff size={14} />}
                <span>Go {dutyStatus === 'ONLINE' ? 'Offline' : 'Online'}</span>
              </button>
            </div>
          </div>

          {/* Duty Availability Message */}
          <div
            style={{
              marginTop: isMobile ? '12px' : '18px',
              padding: isMobile ? '10px 12px' : '11px 16px',
              borderRadius: '10px',
              background: dutyStatus === 'ONLINE' ? 'rgba(0, 168, 150, 0.22)' : 'rgba(239, 68, 68, 0.18)',
              border: `1px solid ${dutyStatus === 'ONLINE' ? 'rgba(0, 196, 159, 0.45)' : 'rgba(239, 68, 68, 0.35)'}`,
              fontSize: isMobile ? '12px' : '13px',
              lineHeight: 1.45,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '9px'
            }}
          >
            <div style={{ marginTop: '2px', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
              {dutyStatus === 'ONLINE' ? (
                <CheckCircle2 size={15} color="#34D399" />
              ) : (
                <AlertCircle size={15} color="#F87171" />
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0, color: '#E2E8F0' }}>
              {dutyStatus === 'ONLINE' ? (
                <span>You are <strong style={{ color: '#FFFFFF' }}>online & ready</strong> for instant dispatches in your assigned zone.</span>
              ) : (
                <span>You are currently <strong style={{ color: '#FFFFFF' }}>offline</strong>. Switch Online to receive active order alerts.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Utility Shortcuts */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', 
          gap: '12px' 
        }}
      >
        <button
          onClick={() => navigate('/tasks')}
          className="card card-interactive"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 16px',
            background: '#FFFFFF',
            border: '1px solid var(--border-card)',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <div style={{ background: '#E6F8F5', padding: '10px', borderRadius: '10px', color: '#00A896', flexShrink: 0 }}>
            <Zap size={18} />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-heading)' }}>Task Queue</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{tasks.length} assigned</div>
          </div>
        </button>

        <button
          onClick={() => navigate('/earnings')}
          className="card card-interactive"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 16px',
            background: '#FFFFFF',
            border: '1px solid var(--border-card)',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <div style={{ background: '#ECFDF5', padding: '10px', borderRadius: '10px', color: '#059669', flexShrink: 0 }}>
            <Wallet size={18} />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-heading)' }}>Earnings</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>₹{earnings.today.amount} today</div>
          </div>
        </button>

        <button
          onClick={() => navigate('/task-history')}
          className="card card-interactive"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 16px',
            background: '#FFFFFF',
            border: '1px solid var(--border-card)',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <div style={{ background: '#EFF6FF', padding: '10px', borderRadius: '10px', color: '#2563EB', flexShrink: 0 }}>
            <Clock size={18} />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-heading)' }}>History</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Past deliveries</div>
          </div>
        </button>

        <button
          onClick={() => alert("MediUnify Fleet Dispatch Support Helpline: +91 1800 200 4567\nMedical Cold-Chain Emergency: Available 24/7")}
          className="card card-interactive"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 16px',
            background: '#FFFFFF',
            border: '1px solid var(--border-card)',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <div style={{ background: '#FEF2F2', padding: '10px', borderRadius: '10px', color: '#DC2626', flexShrink: 0 }}>
            <PhoneCall size={18} />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-heading)' }}>Support SOS</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>24/7 Helpline</div>
          </div>
        </button>
      </div>

      {/* Role-Specific Metric Cards */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-heading)' }}>
            {isPharmacy ? "Today's Pharmacy Fleet Metrics" : "Today's Diagnostic Collection Metrics"}
          </h2>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
            Live Sync • 08 Sep 2026
          </span>
        </div>

        <div className="metrics-grid-4">
          {/* Card 1: Today's Total */}
          <div className="card card-interactive" onClick={() => navigate('/tasks')} style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {isPharmacy ? "Today's Orders" : "Today's Collections"}
              </span>
              <div style={{ background: '#F0F9FF', color: '#0284C7', padding: '8px', borderRadius: '10px' }}>
                {isPharmacy ? <Pill size={18} /> : <Activity size={18} />}
              </div>
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-heading)' }}>
              {totalTasksToday}
            </div>
            <div style={{ fontSize: '11px', color: '#059669', marginTop: '6px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={12} />
              <span>Assigned for active shift</span>
            </div>
          </div>

          {/* Card 2: Completed */}
          <div className="card card-interactive" onClick={() => navigate('/task-history')} style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {isPharmacy ? 'Completed' : 'Collected'}
              </span>
              <div style={{ background: '#ECFDF5', color: '#059669', padding: '8px', borderRadius: '10px' }}>
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-heading)' }}>
              {completedCount}
            </div>
            <div style={{ fontSize: '11px', color: '#059669', marginTop: '6px', fontWeight: '700' }}>
              OTP verified & handed over
            </div>
          </div>

          {/* Card 3: Pending */}
          <div className="card card-interactive" onClick={() => navigate('/tasks')} style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Pending
              </span>
              <div style={{ background: '#FFFBEB', color: '#D97706', padding: '8px', borderRadius: '10px' }}>
                <Clock size={18} />
              </div>
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-heading)' }}>
              {pendingCount}
            </div>
            <div style={{ fontSize: '11px', color: '#B45309', marginTop: '6px', fontWeight: '700' }}>
              Awaiting captain action
            </div>
          </div>

          {/* Card 4: Today's Earnings */}
          <div className="card card-interactive" onClick={() => navigate('/earnings')} style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Today's Earnings
              </span>
              <div style={{ background: 'var(--color-teal-tint)', color: '#00A896', padding: '8px', borderRadius: '10px' }}>
                <TrendingUp size={18} />
              </div>
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--color-primary-navy)' }}>
              ₹{earnings.today.amount}
            </div>
            <div style={{ fontSize: '11px', color: '#008779', marginTop: '6px', fontWeight: '700' }}>
              + ₹{earnings.today.incentive} surge incentive
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVE TASK CARD (Prominent Highlight) */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00A896', animation: 'pulse-teal 2s infinite' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-heading)' }}>
              ACTIVE TASK IN PROGRESS
            </h2>
          </div>
          <button
            onClick={() => navigate('/tasks')}
            style={{ background: 'none', border: 'none', color: 'var(--color-primary-teal)', fontWeight: '800', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <span>View All ({tasks.length})</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {activeTask ? (
          <div
            className="card"
            style={{
              border: '2px solid var(--color-primary-teal)',
              background: '#FFFFFF',
              boxShadow: 'var(--shadow-md)',
              position: 'relative',
              padding: '24px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-primary-navy)', fontFamily: 'monospace', background: '#F1F5F9', padding: '3px 10px', borderRadius: '6px' }}>
                    {activeTask.id}
                  </span>
                  <StatusBadge status={activeTask.status} />
                  {isPharmacy && activeTask.coldChain && (
                    <span style={{ background: '#E0F2FE', color: '#0284C7', padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '4px', border: '1px solid #BAE6FD' }}>
                      <ThermometerSnowflake size={13} /> Cold Chain
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
                  Assignment: <strong style={{ color: 'var(--text-heading)' }}>{isPharmacy ? 'Pharmacy Medicine Delivery' : 'Diagnostic Sample Collection'}</strong>
                </div>
              </div>

              <div 
                style={{ 
                  textAlign: 'right', 
                  background: '#ECFDF5', 
                  border: '1px solid #A7F3D0', 
                  padding: '8px 14px', 
                  borderRadius: 'var(--radius-md)' 
                }}
              >
                <span style={{ fontSize: '10px', color: '#047857', display: 'block', fontWeight: '800', textTransform: 'uppercase' }}>Trip Fee</span>
                <span style={{ fontSize: '22px', fontWeight: '800', color: '#059669' }}>
                  ₹{activeTask.earnings}
                </span>
              </div>
            </div>

            {/* Patient & Location Quick Details */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '16px',
                background: '#F8FAFC',
                padding: '18px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Patient Information
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-heading)', marginTop: '4px' }}>
                  {activeTask.patientName} {activeTask.patientAge ? `(${activeTask.patientAge}y)` : ''}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <span style={{ fontWeight: '600' }}>{activeTask.patientPhone}</span>
                  <button
                    onClick={(e) => handleCall(e, activeTask.patientPhone)}
                    style={{ background: 'rgba(0, 168, 150, 0.1)', border: 'none', color: '#00A896', cursor: 'pointer', padding: '3px 8px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '700' }}
                    title="Call patient"
                  >
                    <Phone size={12} />
                    <span>Call</span>
                  </button>
                </div>
                <div style={{ fontSize: '13px', color: '#0F766E', marginTop: '8px', fontWeight: '700' }}>
                  {isPharmacy ? (activeTask.medicines?.map(m => m.name).join(', ')) : activeTask.testName}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Route & Schedule
                </span>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '4px', fontSize: '13px', color: 'var(--text-heading)' }}>
                  <MapPin size={16} color="#00A896" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontWeight: '600' }}>{isPharmacy ? activeTask.deliveryAddress : activeTask.patientAddress}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '10px', fontSize: '12px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#002244', fontWeight: '800' }}>
                    <Clock size={14} />
                    <span>{isPharmacy ? activeTask.scheduledTime : activeTask.collectionTime}</span>
                  </div>
                  <span>Distance: <strong style={{ color: 'var(--text-heading)' }}>{activeTask.distance}</strong></span>
                  <span>ETA: <strong style={{ color: '#059669' }}>{activeTask.eta}</strong></span>
                </div>
              </div>
            </div>

            {/* View Task CTA button */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1.15fr 1fr' : '1.2fr 1fr',
                gap: isMobile ? '8px' : '12px',
                marginTop: '6px'
              }}
            >
              <button
                onClick={() => navigate(`/tasks/${activeTask.id}`)}
                className="btn btn-primary"
                style={{
                  padding: isMobile ? '9px 12px' : '11px 18px',
                  fontSize: isMobile ? '12px' : '13.5px',
                  fontWeight: '700',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.02em',
                  boxShadow: 'var(--shadow-teal-sm)'
                }}
              >
                <span>Workflow Steps</span>
                <ArrowRight size={isMobile ? 15 : 17} />
              </button>

              <button
                onClick={() => {
                  const isPharm = activeTask.type === 'pharmacy';
                  const pickedUpStatuses = ['ORDER_PICKED_UP', 'GOING_TO_PATIENT', 'ARRIVED_AT_PATIENT', 'DELIVERED', 'COMPLETED'];
                  const hasPickedUp = isPharm && pickedUpStatuses.includes(activeTask.status);
                  const dest = isPharm ? (hasPickedUp ? 'patient' : 'pharmacy') : 'patient';

                  if (isPharm && (activeTask.status === 'ASSIGNED' || activeTask.status === 'ACCEPTED')) {
                    updateTaskStatus(activeTask.id, 'GOING_TO_PHARMACY');
                  } else if (!isPharm && (activeTask.status === 'ASSIGNED' || activeTask.status === 'ACCEPTED')) {
                    updateTaskStatus(activeTask.id, 'ON_THE_WAY');
                  }

                  navigate(`/navigation?taskId=${activeTask.id}&dest=${dest}`);
                }}
                className="btn btn-navy"
                style={{
                  padding: isMobile ? '9px 12px' : '11px 18px',
                  fontSize: isMobile ? '12px' : '13.5px',
                  fontWeight: '700',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.02em',
                  boxShadow: '0 4px 14px rgba(0, 34, 68, 0.25)'
                }}
                title="Direct Route Navigation"
              >
                <Navigation size={isMobile ? 14 : 16} />
                <span>
                  {activeTask.type === 'pharmacy' 
                    ? (['ORDER_PICKED_UP', 'GOING_TO_PATIENT', 'ARRIVED_AT_PATIENT'].includes(activeTask.status) ? 'To Patient' : 'To Pharmacy')
                    : 'Start GPS'}
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#F0FDFA', color: '#00A896', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
              <CheckCircle2 size={30} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-heading)' }}>
              All Current Tasks Completed!
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '360px', margin: '6px auto 18px auto' }}>
              You are caught up. Keep your status ONLINE to be prioritized for incoming dispatch orders.
            </p>
            <button onClick={() => navigate('/tasks')} className="btn btn-outline">
              Check Task Queue
            </button>
          </div>
        )}
      </div>

      {/* Role-Specific Quick Guidelines Card */}
      <div className="card" style={{ background: isPharmacy ? '#F0FDF4' : '#F0F9FF', border: `1px solid ${isPharmacy ? '#DCFCE7' : '#E0F2FE'}` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <ShieldCheck size={26} color={isPharmacy ? '#059669' : '#0284C7'} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: isPharmacy ? '#065F46' : '#0369A1' }}>
              {isPharmacy ? 'Pharmacy Delivery Safety Protocol' : 'NABL Phlebotomy Diagnostic Protocol'}
            </h3>
            <p style={{ fontSize: '13px', color: isPharmacy ? '#166534' : '#075985', marginTop: '4px', lineHeight: 1.55 }}>
              {isPharmacy
                ? 'Always verify the tamper-evident pharmacy seal before leaving the store. Verify Patient OTP before handing over Schedule H drugs. Cold chain medicines must remain in the 2-8°C ice-pack bag.'
                : 'Confirm patient fasting status prior to blood draw. Invert EDTA/Fluoride tubes 8-10 times gently immediately after collection. Place samples inside the temperature-monitored carrier box.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
