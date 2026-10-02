import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useTasks } from '../../context/TaskContext';
import { 
  Home, 
  ClipboardList, 
  Bell, 
  User, 
  Wallet, 
  Navigation, 
  FileText, 
  Store, 
  PackageCheck, 
  Activity, 
  Lock 
} from 'lucide-react';

export default function BottomNav() {
  const { captainType } = useAuth();
  const { unreadCount } = useNotifications();
  const { labTasks, pharmacyTasks } = useTasks();

  const isPharmacy = captainType === 'pharmacy';
  const tasks = isPharmacy ? pharmacyTasks : labTasks;
  const activeTasksCount = tasks.filter(t => t.status !== 'COMPLETED' && t.status !== 'CANCELLED').length;

  const activeOrder = tasks.find(t => 
    t.status !== 'ASSIGNED' && 
    t.status !== 'COMPLETED' && 
    t.status !== 'CANCELLED'
  );

  const isPharm = activeOrder?.type === 'pharmacy';
  const hasPickedUp = isPharm && ['ORDER_PICKED_UP', 'GOING_TO_PATIENT', 'ARRIVED_AT_PATIENT', 'DELIVERED'].includes(activeOrder?.status);

  // If Captain has an active in-progress order, lock BottomNav to Trip Mode
  if (activeOrder) {
    return (
      <nav className="bottom-nav" style={{ borderTop: '2px solid #00A896', background: '#FFFFFF' }}>
        <div className="bottom-nav-inner" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {/* 1. Live Route Map */}
          <NavLink 
            to={`/navigation?taskId=${activeOrder.id}&dest=${isPharm ? (hasPickedUp ? 'patient' : 'pharmacy') : 'patient'}`} 
            className={({ isActive }) => `bottom-nav-btn ${isActive ? 'active' : ''}`}
          >
            <Navigation size={22} color={isPharm ? '#00A896' : '#002244'} />
            <span style={{ fontWeight: '700' }}>GPS Route</span>
          </NavLink>

          {/* 2. Order Info */}
          <NavLink 
            to={`/tasks/${activeOrder.id}`} 
            className={({ isActive }) => `bottom-nav-btn ${isActive ? 'active' : ''}`}
          >
            <FileText size={22} />
            <span>Order Info</span>
          </NavLink>

          {/* 3. Current Verification Stage */}
          {isPharm ? (
            !hasPickedUp ? (
              <NavLink 
                to={`/pharmacy-pickup?taskId=${activeOrder.id}`} 
                className={({ isActive }) => `bottom-nav-btn ${isActive ? 'active' : ''}`}
              >
                <Store size={22} />
                <span>Pickup</span>
              </NavLink>
            ) : (
              <NavLink 
                to={`/pharmacy-delivery?taskId=${activeOrder.id}`} 
                className={({ isActive }) => `bottom-nav-btn ${isActive ? 'active' : ''}`}
              >
                <PackageCheck size={22} />
                <span>Delivery</span>
              </NavLink>
            )
          ) : (
            <NavLink 
              to={`/sample-collection?taskId=${activeOrder.id}`} 
              className={({ isActive }) => `bottom-nav-btn ${isActive ? 'active' : ''}`}
            >
              <Activity size={22} />
              <span>Collect</span>
            </NavLink>
          )}

          {/* 4. Trip Lock Notice */}
          <div 
            onClick={() => alert(`Active Order #${activeOrder.id} is in progress. Complete delivery before accessing main menus.`)}
            className="bottom-nav-btn"
            style={{ cursor: 'pointer', opacity: 0.8 }}
            title="Active order is locked. Complete fulfillment first."
          >
            <div style={{ position: 'relative' }}>
              <Lock size={20} color="#059669" />
              <div 
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-4px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#10B981'
                }}
              />
            </div>
            <span style={{ color: '#059669', fontWeight: '700' }}>Locked</span>
          </div>
        </div>
      </nav>
    );
  }

  // Normal BottomNav when no active order is in progress
  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        <NavLink to="/home" className={({ isActive }) => `bottom-nav-btn ${isActive ? 'active' : ''}`}>
          <Home size={22} />
          <span>Home</span>
        </NavLink>

        <NavLink to="/tasks" className={({ isActive }) => `bottom-nav-btn ${isActive ? 'active' : ''}`}>
          <div style={{ position: 'relative' }}>
            <ClipboardList size={22} />
            {activeTasksCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-10px',
                  background: 'var(--color-primary-teal)',
                  color: 'white',
                  fontSize: '9px',
                  fontWeight: '800',
                  padding: '1px 5px',
                  borderRadius: '999px',
                  boxShadow: '0 2px 5px rgba(0, 168, 150, 0.4)'
                }}
              >
                {activeTasksCount}
              </span>
            )}
          </div>
          <span>Tasks</span>
        </NavLink>

        <NavLink to="/earnings" className={({ isActive }) => `bottom-nav-btn ${isActive ? 'active' : ''}`}>
          <Wallet size={22} />
          <span>Earnings</span>
        </NavLink>

        <NavLink to="/notifications" className={({ isActive }) => `bottom-nav-btn ${isActive ? 'active' : ''}`}>
          <div style={{ position: 'relative' }}>
            <Bell size={22} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-10px',
                  background: 'var(--color-danger)',
                  color: 'white',
                  fontSize: '9px',
                  fontWeight: '800',
                  padding: '1px 5px',
                  borderRadius: '999px',
                  boxShadow: '0 2px 5px rgba(239, 68, 68, 0.4)'
                }}
              >
                {unreadCount}
              </span>
            )}
          </div>
          <span>Alerts</span>
        </NavLink>

        <NavLink to="/profile" className={({ isActive }) => `bottom-nav-btn ${isActive ? 'active' : ''}`}>
          <User size={22} />
          <span>Profile</span>
        </NavLink>
      </div>
    </nav>
  );
}
