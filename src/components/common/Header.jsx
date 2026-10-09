import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useTasks } from '../../context/TaskContext';
import { Bell, Pill, Activity, Lock } from 'lucide-react';
import logoImg from '../../assets/logo.png';

export default function Header() {
  const { captainType, profile, dutyStatus, toggleDutyStatus } = useAuth();
  const { unreadCount } = useNotifications();
  const { labTasks, pharmacyTasks } = useTasks();
  const [logoLoadFailed, setLogoLoadFailed] = useState(false);

  const isPharmacy = captainType === 'pharmacy';
  const tasks = isPharmacy ? pharmacyTasks : labTasks;
  const activeOrder = tasks.find(t => 
    t.status !== 'ASSIGNED' && 
    t.status !== 'COMPLETED' && 
    t.status !== 'CANCELLED'
  );

  return (
    <header className="top-header">
      {/* Brand Logo & Fleet Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link 
          to={activeOrder ? `/tasks/${activeOrder.id}` : "/home"} 
          className="brand-badge" 
          title={activeOrder ? `Active Order #${activeOrder.id}` : "MediUnify Captain Home"} 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
        >
          {!logoLoadFailed ? (
            <img 
              src={logoImg} 
              alt="MediUnify" 
              className="brand-logo-img" 
              style={{ 
                height: '40px', 
                maxWidth: '180px',
                objectFit: 'contain',
                display: 'block'
              }} 
              onError={(e) => {
                if (!e.currentTarget.dataset.fallbackTried) {
                  e.currentTarget.dataset.fallbackTried = 'true';
                  e.currentTarget.src = '/logo.png';
                } else {
                  setLogoLoadFailed(true);
                }
              }}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #002244 0%, #00A896 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '900',
                  fontSize: '16px',
                  boxShadow: '0 3px 8px rgba(0, 168, 150, 0.3)'
                }}
              >
                +
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                <span style={{ fontSize: '17px', fontWeight: '900', color: '#002244', letterSpacing: '-0.02em' }}>
                  Medi<span style={{ color: '#00A896' }}>Unify</span>
                </span>
                <span style={{ fontSize: '9px', fontWeight: '800', color: '#00A896', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Captain
                </span>
              </div>
            </div>
          )}
          <div className="hide-on-mobile" style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.08em', color: '#002244', textTransform: 'uppercase' }}>
              CAPTAIN PORTAL
            </span>
            <span style={{ fontSize: '10px', color: '#00A896', fontWeight: '700' }}>
              Healthcare at Your Doorstep
            </span>
          </div>
        </Link>

        {/* Role Credential Badge */}
        <div 
          className="hide-on-mobile"
          style={{
            display: 'flex',
            alignItems: 'center',
            background: isPharmacy ? '#E6F8F5' : '#EEF4FB',
            border: `1px solid ${isPharmacy ? '#A7F3D0' : '#BAE6FD'}`,
            borderRadius: '999px',
            padding: '4px 14px',
            fontSize: '12px',
            fontWeight: '700',
            color: isPharmacy ? '#065F46' : '#0369A1',
            gap: '6px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}
        >
          {isPharmacy ? <Pill size={14} color="#00A896" /> : <Activity size={14} color="#0284C7" />}
          <span>{isPharmacy ? 'Pharmacy Fleet Captain' : 'Diagnostic Lab Fleet Captain'}</span>
        </div>
      </div>

      {/* Header Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>

        {/* Duty Status Toggle */}
        <div
          onClick={() => {
            if (activeOrder && dutyStatus === 'ONLINE') {
              alert(`Cannot switch offline while active order #${activeOrder.id} is in progress.`);
              return;
            }
            toggleDutyStatus();
          }}
          className={`duty-status-pill ${dutyStatus === 'ONLINE' ? 'online' : 'offline'}`}
          title={activeOrder ? `Active trip #${activeOrder.id} in progress` : "Click to toggle availability"}
          style={{ opacity: activeOrder ? 0.9 : 1 }}
        >
          <span className="status-dot"></span>
          <span>{dutyStatus === 'ONLINE' ? 'ONLINE' : 'OFFLINE'}</span>
        </div>

        {/* Notifications Icon */}
        <Link
          to={activeOrder ? `/tasks/${activeOrder.id}` : "/notifications"}
          onClick={(e) => {
            if (activeOrder) {
              e.preventDefault();
              alert(`Order #${activeOrder.id} is in progress. Complete fulfillment before opening Notifications.`);
            }
          }}
          style={{
            position: 'relative',
            background: '#FFFFFF',
            border: '1px solid var(--border-card)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-body)',
            textDecoration: 'none',
            boxShadow: 'var(--shadow-xs)',
            transition: 'all var(--transition-fast)'
          }}
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                background: 'var(--color-danger)',
                color: 'white',
                fontSize: '10px',
                fontWeight: '800',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(239, 68, 68, 0.4)'
              }}
            >
              {unreadCount}
            </span>
          )}
        </Link>

        {/* Profile Avatar & Info */}
        <Link
          to={activeOrder ? `/tasks/${activeOrder.id}` : "/profile"}
          onClick={(e) => {
            if (activeOrder) {
              e.preventDefault();
              alert(`Order #${activeOrder.id} is locked in progress. Complete delivery before accessing Profile.`);
            }
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            color: 'inherit',
            padding: '4px 6px',
            borderRadius: 'var(--radius-md)',
            transition: 'background var(--transition-fast)'
          }}
        >
          <div style={{ position: 'relative' }}>
            <img
              src={profile.avatar}
              alt={profile.name}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--color-primary-teal)',
                boxShadow: '0 2px 6px rgba(0, 168, 150, 0.2)'
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: dutyStatus === 'ONLINE' ? '#10B981' : '#94A3B8',
                border: '2px solid white'
              }}
            />
          </div>
          <div className="hide-on-mobile" style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-heading)', lineHeight: 1.2 }}>
              {profile.name}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {profile.id}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}
