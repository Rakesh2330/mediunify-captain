import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import BottomNav from '../components/common/BottomNav';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { Pill, Activity, Smartphone, Monitor, Navigation, FileText, Lock } from 'lucide-react';

export default function AppLayout() {
  const { captainType, profile, logout, deviceMode, toggleDeviceMode } = useAuth();
  const { labTasks, pharmacyTasks } = useTasks();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isPharmacy = captainType === 'pharmacy';
  const tasks = isPharmacy ? pharmacyTasks : labTasks;
  const activeOrder = tasks.find(t => 
    t.status !== 'ASSIGNED' && 
    t.status !== 'COMPLETED' && 
    t.status !== 'CANCELLED'
  );

  // Active Trip Lock: Captain cannot leave the order flow while an order is in progress
  useEffect(() => {
    if (!activeOrder) return;
    const path = location.pathname;

    const isAllowed = 
      path.startsWith('/navigation') ||
      path === `/tasks/${activeOrder.id}` ||
      path === '/pharmacy-pickup' ||
      path === '/pharmacy-delivery' ||
      path === '/sample-collection';

    if (!isAllowed) {
      if (activeOrder.type === 'pharmacy') {
        const hasPickedUp = ['ORDER_PICKED_UP', 'GOING_TO_PATIENT', 'ARRIVED_AT_PATIENT', 'DELIVERED'].includes(activeOrder.status);
        if (activeOrder.status === 'ARRIVED_AT_PHARMACY') {
          navigate(`/pharmacy-pickup?taskId=${activeOrder.id}`, { replace: true });
        } else if (activeOrder.status === 'ARRIVED_AT_PATIENT') {
          navigate(`/pharmacy-delivery?taskId=${activeOrder.id}`, { replace: true });
        } else {
          const dest = hasPickedUp ? 'patient' : 'pharmacy';
          navigate(`/navigation?taskId=${activeOrder.id}&dest=${dest}`, { replace: true });
        }
      } else {
        if (activeOrder.status === 'ARRIVED' || activeOrder.status === 'COLLECTED') {
          navigate(`/sample-collection?taskId=${activeOrder.id}`, { replace: true });
        } else {
          navigate(`/navigation?taskId=${activeOrder.id}&dest=patient`, { replace: true });
        }
      }
    }
  }, [activeOrder?.id, activeOrder?.status, location.pathname, navigate]);

  const handleConfirmLogout = () => {
    setIsLogoutOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <div className={`device-preview-wrapper ${deviceMode === 'mobile_frame' ? 'mobile-frame-mode' : ''}`}>
      {/* Top Session & Device Bar */}
      <div className="demo-role-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: '700', letterSpacing: '0.04em' }}>LOGGED IN ACCOUNT:</span>
          <span><strong>{isPharmacy ? 'Pharmacy Captain' : 'Diagnostic Lab Captain'}</strong> ({profile?.name})</span>
        </div>

        <div className="demo-role-pills">
          <button
            onClick={toggleDeviceMode}
            className="demo-switch-btn"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: deviceMode === 'mobile_frame' ? '#00A896' : 'rgba(255,255,255,0.1)' }}
          >
            {deviceMode === 'responsive' ? <Smartphone size={13} /> : <Monitor size={13} />}
            <span>{deviceMode === 'responsive' ? 'Phone Mode' : 'Desktop View'}</span>
          </button>
        </div>
      </div>

      {/* Simulated Smartphone Hardware Notch & Status Bar (Only in Phone Mode) */}
      {deviceMode === 'mobile_frame' && (
        <div className="mobile-phone-statusbar">
          <span>9:41</span>
          <div className="mobile-dynamic-island">
            <div className="dynamic-island-cam" />
            <div className="dynamic-island-sensor" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
            <span>5G</span>
            <div style={{ width: '18px', height: '10px', border: '1px solid white', borderRadius: '3px', padding: '1px', display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '100%', height: '100%', background: '#10B981', borderRadius: '1px' }} />
            </div>
          </div>
        </div>
      )}

      <div className="app-layout">
        {deviceMode !== 'mobile_frame' && (
          <Sidebar onOpenLogoutModal={() => setIsLogoutOpen(true)} />
        )}
        
        <div className="main-content-wrapper">
          <Header isMobileFrame={deviceMode === 'mobile_frame'} />

          {!location.pathname.startsWith('/navigation') && activeOrder && (
            <div
              style={{
                background: 'linear-gradient(135deg, #001730 0%, #002244 100%)',
                color: '#FFFFFF',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                flexWrap: 'wrap',
                borderBottom: '2px solid #00A896',
                boxShadow: '0 2px 10px rgba(0,34,68,0.25)',
                position: 'relative',
                zIndex: 10
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#00C49F',
                    boxShadow: '0 0 10px #00C49F'
                  }}
                />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Lock size={13} color="#5EEAD4" />
                    <span>TRIP LOCKED: {activeOrder.id}</span>
                    <span style={{ fontSize: '10.5px', background: 'rgba(0,168,150,0.25)', padding: '1px 8px', borderRadius: '12px', color: '#5EEAD4', border: '1px solid rgba(0,168,150,0.4)', fontWeight: '700' }}>
                      {activeOrder.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                    {activeOrder.type === 'pharmacy' ? `${activeOrder.pharmacyName} → ${activeOrder.patientName}` : `${activeOrder.patientName} (${activeOrder.testName})`}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => {
                    const isPharm = activeOrder.type === 'pharmacy';
                    const hasPickedUp = isPharm && ['ORDER_PICKED_UP', 'GOING_TO_PATIENT', 'ARRIVED_AT_PATIENT', 'DELIVERED'].includes(activeOrder.status);
                    const dest = isPharm ? (hasPickedUp ? 'patient' : 'pharmacy') : 'patient';
                    navigate(`/navigation?taskId=${activeOrder.id}&dest=${dest}`);
                  }}
                  className="btn btn-primary"
                  style={{ padding: '6px 12px', fontSize: '12px', gap: '5px' }}
                >
                  <Navigation size={13} />
                  <span>GPS Route</span>
                </button>

                <button
                  onClick={() => navigate(`/tasks/${activeOrder.id}`)}
                  className="btn btn-outline"
                  style={{ padding: '6px 12px', fontSize: '12px', background: 'rgba(255,255,255,0.08)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.2)', gap: '5px' }}
                >
                  <FileText size={13} />
                  <span>Order Info</span>
                </button>
              </div>
            </div>
          )}

          <main className="page-container">
            <Outlet />
          </main>
        </div>

        <BottomNav isMobileFrame={deviceMode === 'mobile_frame'} />
      </div>

      {deviceMode === 'mobile_frame' && (
        <div className="mobile-phone-home-indicator" />
      )}

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={isLogoutOpen}
        title="Logout Confirmation"
        message="Are you sure you want to logout from MediUnify Captain? Your current duty session will be paused."
        confirmText="Logout"
        cancelText="Cancel"
        type="danger"
        onConfirm={handleConfirmLogout}
        onCancel={() => setIsLogoutOpen(false)}
      />
    </div>
  );
}
