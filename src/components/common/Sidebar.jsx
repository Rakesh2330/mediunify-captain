import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useTasks } from '../../context/TaskContext';
import {
  Home,
  ClipboardList,
  History,
  Bell,
  Wallet,
  User,
  Settings,
  LogOut,
  ShieldCheck,
  Bike,
  Activity,
  Pill,
  RotateCcw,
  Navigation,
  Lock
} from 'lucide-react';

export default function Sidebar({ onOpenLogoutModal }) {
  const { captainType, profile } = useAuth();
  const { unreadCount } = useNotifications();
  const { labTasks, pharmacyTasks, resetAllTasks } = useTasks();

  const isPharmacy = captainType === 'pharmacy';
  const tasks = isPharmacy ? pharmacyTasks : labTasks;
  const activeTasksCount = tasks.filter(t => t.status !== 'COMPLETED' && t.status !== 'CANCELLED').length;

  const activeOrder = tasks.find(t => 
    t.status !== 'ASSIGNED' && 
    t.status !== 'COMPLETED' && 
    t.status !== 'CANCELLED'
  );

  const navItems = [
    { label: 'Home', path: '/home', icon: Home },
    { label: 'My Tasks', path: '/tasks', icon: ClipboardList, badge: activeTasksCount },
    { label: 'Task History', path: '/task-history', icon: History },
    { label: 'Notifications', path: '/notifications', icon: Bell, badge: unreadCount },
    { label: 'Earnings', path: '/earnings', icon: Wallet },
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="sidebar">
      {/* Sidebar Top Mini Brand */}
      <div style={{ padding: '20px 16px 14px 16px', borderBottom: '1px solid var(--border-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: isPharmacy
                ? 'linear-gradient(135deg, #00A896 0%, #008779 100%)'
                : 'linear-gradient(135deg, #002244 0%, #0052CC 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              flexShrink: 0,
              boxShadow: isPharmacy ? '0 4px 10px rgba(0, 168, 150, 0.3)' : '0 4px 10px rgba(0, 34, 68, 0.3)'
            }}
          >
            {isPharmacy ? <Pill size={20} /> : <Activity size={20} />}
          </div>
          <div className="sidebar-header-text" style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-heading)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {isPharmacy ? 'Pharmacy Fleet' : 'Lab Diagnostic Fleet'}
            </h3>
            <span style={{ fontSize: '11px', color: '#00A896', fontWeight: '700' }}>
              {profile.city} Division
            </span>
          </div>
        </div>
      </div>

      {/* Active Trip Banner if Order in Progress */}
      {activeOrder && (
        <div style={{ margin: '12px 14px 6px 14px', padding: '12px', borderRadius: '10px', background: 'linear-gradient(135deg, #001730 0%, #002244 100%)', color: '#FFFFFF', border: '1px solid #00A896', boxShadow: '0 3px 10px rgba(0,34,68,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10.5px', fontWeight: '800', color: '#00C49F' }}>
            <Lock size={12} />
            <span>ACTIVE TRIP LOCKED</span>
          </div>
          <div style={{ fontSize: '13px', fontWeight: '800', marginTop: '4px' }}>
            #{activeOrder.id}
          </div>
          <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {activeOrder.type === 'pharmacy' ? activeOrder.pharmacyName : activeOrder.patientName}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
            <NavLink
              to={`/navigation?taskId=${activeOrder.id}`}
              className="btn btn-primary"
              style={{ padding: '6px 10px', fontSize: '11.5px', justifyContent: 'center', gap: '5px' }}
            >
              <Navigation size={13} />
              <span>Live GPS Route</span>
            </NavLink>
            <NavLink
              to={`/tasks/${activeOrder.id}`}
              className="btn btn-outline"
              style={{ padding: '6px 10px', fontSize: '11.5px', justifyContent: 'center', background: 'rgba(255,255,255,0.06)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <span>Order Details</span>
            </NavLink>
          </div>
        </div>
      )}

      {/* Navigation List */}
      <ul className="sidebar-nav-list">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.path}>
              <NavLink
                to={activeOrder ? `/tasks/${activeOrder.id}` : item.path}
                onClick={(e) => {
                  if (activeOrder) {
                    e.preventDefault();
                    alert(`Order #${activeOrder.id} is locked in progress. Complete fulfillment before opening ${item.label}.`);
                  }
                }}
                className={({ isActive }) => `sidebar-item ${isActive && !activeOrder ? 'active' : ''}`}
                title={activeOrder ? `Locked: Order #${activeOrder.id} in progress` : item.label}
                style={{ opacity: activeOrder ? 0.6 : 1 }}
              >
                <Icon size={19} />
                <span className="sidebar-text">{item.label}</span>
                {activeOrder ? (
                  <Lock size={12} color="#94A3B8" style={{ marginLeft: 'auto' }} />
                ) : (
                  item.badge !== undefined && item.badge > 0 && (
                    <span className="nav-badge-pill">{item.badge}</span>
                  )
                )}
              </NavLink>
            </li>
          );
        })}

        {/* Reset Demo Data Button */}
        <li style={{ marginTop: 'auto', paddingTop: '16px' }}>
          <button
            onClick={resetAllTasks}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: '#F8FAFC',
              border: '1px dashed #CBD5E1',
              color: 'var(--text-muted)',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
            title="Reset sample tasks to initial state"
          >
            <RotateCcw size={15} />
            <span className="sidebar-text">Reset Demo Tasks</span>
          </button>
        </li>

        {/* Logout item */}
        <li style={{ marginTop: '6px' }}>
          <button
            onClick={() => {
              if (activeOrder) {
                alert(`Cannot logout while Order #${activeOrder.id} is in progress.`);
                return;
              }
              onOpenLogoutModal();
            }}
            className="sidebar-item"
            style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', color: '#DC2626', opacity: activeOrder ? 0.6 : 1 }}
            title="Logout"
          >
            <LogOut size={19} color="#DC2626" />
            <span className="sidebar-text" style={{ color: '#DC2626', fontWeight: '700' }}>Logout</span>
          </button>
        </li>
      </ul>

      {/* Captain Mini Info footer */}
      <div
        className="sidebar-text"
        style={{
          padding: '14px 16px',
          background: '#F8FAFC',
          borderTop: '1px solid var(--border-card)',
          fontSize: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Bike size={15} color="#002244" />
          <span style={{ fontWeight: '700', color: 'var(--text-heading)', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {profile.vehicle}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontSize: '11px', fontWeight: '700' }}>
          <ShieldCheck size={14} />
          <span>{isPharmacy ? 'Drug Transport Auth' : 'NABL Phlebotomist'}</span>
        </div>
      </div>
    </aside>
  );
}
