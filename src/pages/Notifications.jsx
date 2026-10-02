import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { 
  Bell, 
  CheckCheck, 
  Activity, 
  Pill, 
  Wallet, 
  AlertTriangle, 
  Clock, 
  ShieldAlert,
  ChevronRight,
  Trash2,
  X,
  RotateCcw
} from 'lucide-react';

export default function Notifications() {
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    clearAllNotifications, 
    clearNotification, 
    resetNotifications, 
    unreadCount 
  } = useNotifications();
  const { captainType } = useAuth();
  const [filter, setFilter] = useState('ALL');

  const filteredNotifs = notifications.filter(n => {
    // Strictly isolate notifications by captain type
    if (n.captainType !== 'all' && n.captainType !== captainType) return false;
    if (filter === 'UNREAD') return !n.read;
    if (filter === 'TASKS') return n.type === 'task';
    if (filter === 'PAYMENTS') return n.type === 'payment' || n.type === 'earnings';
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'task':
        return captainType === 'pharmacy' ? <Pill size={18} color="#00A896" /> : <Activity size={18} color="#0284C7" />;
      case 'alert':
        return <AlertTriangle size={18} color="#D97706" />;
      case 'payment':
      case 'earnings':
        return <Wallet size={18} color="#059669" />;
      default:
        return <Bell size={18} color="#002244" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={22} color="var(--color-primary-navy)" />
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-heading)' }}>
              Notifications & Alerts
            </h1>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Real-time updates regarding task dispatch, patient OTPs, cold chain alerts and payments.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="btn btn-outline"
              style={{ fontSize: '13px', gap: '6px' }}
            >
              <CheckCheck size={16} color="var(--color-primary-teal)" />
              <span>Mark All as Read</span>
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="btn btn-outline"
              style={{
                fontSize: '13px',
                gap: '6px',
                color: '#DC2626',
                borderColor: '#FECACA',
                background: '#FEF2F2',
                cursor: 'pointer'
              }}
              title="Clear all notifications"
            >
              <Trash2 size={16} color="#DC2626" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }}>
        {[
          { id: 'ALL', label: `All (${notifications.length})` },
          { id: 'UNREAD', label: `Unread (${unreadCount})` },
          { id: 'TASKS', label: 'Tasks' },
          { id: 'PAYMENTS', label: 'Payouts & Bonuses' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            style={{
              background: filter === tab.id ? 'var(--color-primary-navy)' : '#FFFFFF',
              color: filter === tab.id ? 'white' : 'var(--text-body)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {filteredNotifs.length > 0 ? (
          <div>
            {filteredNotifs.map((notif, idx) => (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  padding: '16px 20px',
                  background: notif.read ? '#FFFFFF' : '#F0FDFA',
                  borderBottom: idx < filteredNotifs.length - 1 ? '1px solid #F1F5F9' : 'none',
                  cursor: 'pointer',
                  transition: 'background var(--transition-fast)'
                }}
              >
                {/* Icon Circle */}
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: notif.read ? '#F1F5F9' : '#E6F8F5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {getIcon(notif.type)}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '2px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: notif.read ? '600' : '800', color: 'var(--text-heading)' }}>
                      {notif.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{notif.time}</span>
                      {!notif.read && (
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-primary-teal)' }} />
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          clearNotification(notif.id);
                        }}
                        title="Dismiss notification"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#94A3B8',
                          padding: '2px',
                          display: 'flex',
                          alignItems: 'center',
                          borderRadius: '4px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#EF4444'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                  <p style={{ fontSize: '13px', color: notif.read ? 'var(--text-muted)' : 'var(--text-body)', lineHeight: 1.4 }}>
                    {notif.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px 24px' }}>
            <Bell size={36} color="#94A3B8" style={{ margin: '0 auto 12px auto' }} />
            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>No notifications</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              You are all caught up with your fleet alerts.
            </p>
            <button
              onClick={resetNotifications}
              className="btn btn-outline"
              style={{ marginTop: '16px', fontSize: '12px', gap: '6px' }}
            >
              <RotateCcw size={14} />
              <span>Restore Sample Alerts</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
