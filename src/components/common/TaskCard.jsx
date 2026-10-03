import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../../context/TaskContext';
import StatusBadge from './StatusBadge';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Navigation, 
  FileText, 
  Store, 
  User, 
  Activity, 
  ThermometerSnowflake,
  ShieldCheck,
  Package,
  Lock
} from 'lucide-react';

export default function TaskCard({ task }) {
  const navigate = useNavigate();
  const { updateTaskStatus, labTasks, pharmacyTasks } = useTasks();
  const isPharmacy = task.type === 'pharmacy';
  const allTasks = isPharmacy ? pharmacyTasks : labTasks;
  const activeOtherOrder = allTasks.find(t => 
    t.id !== task.id &&
    t.status !== 'ASSIGNED' && 
    t.status !== 'COMPLETED' && 
    t.status !== 'CANCELLED'
  );

  const pickedUpStatuses = ['ORDER_PICKED_UP', 'GOING_TO_PATIENT', 'ARRIVED_AT_PATIENT', 'DELIVERED', 'COMPLETED'];
  const hasPickedUp = isPharmacy && pickedUpStatuses.includes(task.status);

  const handleCall = (e, phone) => {
    e.stopPropagation();
    window.open(`tel:${phone}`, '_self');
  };

  const handleNavigate = (e) => {
    e.stopPropagation();
    if (activeOtherOrder) {
      alert(`Cannot start task ${task.id}. Active order #${activeOtherOrder.id} is already in progress. Complete it first.`);
      navigate(`/navigation?taskId=${activeOtherOrder.id}`);
      return;
    }
    const dest = isPharmacy ? (hasPickedUp ? 'patient' : 'pharmacy') : 'patient';

    // Transition to active travel status
    if (isPharmacy) {
      if (!hasPickedUp && (task.status === 'ASSIGNED' || task.status === 'ACCEPTED')) {
        updateTaskStatus(task.id, 'GOING_TO_PHARMACY');
      } else if (task.status === 'ORDER_PICKED_UP') {
        updateTaskStatus(task.id, 'GOING_TO_PATIENT');
      }
    } else {
      if (task.status === 'ASSIGNED' || task.status === 'ACCEPTED') {
        updateTaskStatus(task.id, 'ON_THE_WAY');
      }
    }

    navigate(`/navigation?taskId=${task.id}&dest=${dest}`);
  };

  return (
    <div 
      className="card card-interactive" 
      onClick={() => navigate(`/tasks/${task.id}`)}
      style={{ 
        cursor: 'pointer', 
        position: 'relative', 
        overflow: 'hidden',
        borderLeft: isPharmacy ? '4px solid #00A896' : '4px solid #002244'
      }}
    >
      {/* Top Bar: ID & Status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span 
            style={{ 
              fontWeight: '800', 
              fontSize: '15px', 
              color: 'var(--color-primary-navy)',
              letterSpacing: '0.03em',
              fontFamily: 'monospace',
              background: '#F1F5F9',
              padding: '2px 8px',
              borderRadius: '6px'
            }}
          >
            {task.id}
          </span>
          {task.coldBoxRequired && (
            <span 
              title="Cold-Box Required"
              style={{
                background: '#E0F2FE',
                color: '#0284C7',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: '700',
                border: '1px solid #BAE6FD'
              }}
            >
              <ThermometerSnowflake size={12} />
              2-8°C Box
            </span>
          )}
          {task.coldChain && (
            <span 
              title="Cold Chain Medicine (Insulin/Biologics)"
              style={{
                background: '#EFF6FF',
                color: '#1D4ED8',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: '700',
                border: '1px solid #BFDBFE'
              }}
            >
              <ThermometerSnowflake size={12} />
              Cold-Chain
            </span>
          )}
        </div>
        <StatusBadge status={task.status} />
      </div>

      {/* Main Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Patient / Customer Row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div 
                style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  background: isPharmacy ? '#E6F8F5' : '#EEF4FB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <User size={14} color={isPharmacy ? '#00A896' : '#002244'} />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-heading)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {task.patientName}
              </h3>
              {task.patientAge && (
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
                  ({task.patientAge}y, {task.patientGender})
                </span>
              )}
            </div>

            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: '500' }}>{task.patientPhone}</span>
              <button 
                onClick={(e) => handleCall(e, task.patientPhone)}
                style={{ 
                  background: 'rgba(0, 168, 150, 0.1)', 
                  border: 'none', 
                  color: 'var(--color-primary-teal)', 
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '3px 6px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '700',
                  gap: '3px'
                }}
                title="Call Patient"
              >
                <Phone size={12} />
                <span>Call</span>
              </button>
            </div>
          </div>

          {/* Earnings Pill */}
          <div 
            style={{ 
              textAlign: 'right', 
              background: '#ECFDF5', 
              border: '1px solid #A7F3D0',
              padding: '6px 10px',
              borderRadius: 'var(--radius-md)',
              flexShrink: 0
            }}
          >
            <span style={{ fontSize: '10px', color: '#047857', display: 'block', fontWeight: '800', textTransform: 'uppercase' }}>Payout Fee</span>
            <span style={{ fontSize: '16px', fontWeight: '800', color: '#059669' }}>
              ₹{task.earnings}
            </span>
          </div>
        </div>

        {/* Task Specific Details */}
        {isPharmacy ? (
          <div style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid #EEF2F6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '700', color: 'var(--text-heading)' }}>
              <Store size={14} color="#00A896" />
              <span>{task.pharmacyName}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <span>{task.medicines?.length || 0} Medicines ({task.medicines?.map(m => m.name.split(' ')[0]).join(', ')})</span>
              <span style={{ fontWeight: '800', color: 'var(--text-heading)' }}>Total: ₹{task.totalAmount}</span>
            </div>
          </div>
        ) : (
          <div style={{ background: '#F0FDFA', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid #CCFBF1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '800', color: '#0F766E' }}>
              <Activity size={14} />
              <span>{task.testName}</span>
            </div>
            <div style={{ fontSize: '12px', color: '#115E59', marginTop: '4px', fontWeight: '500' }}>
              {task.requiredSample}
            </div>
          </div>
        )}

        {/* Location & Time Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', paddingTop: '2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: 0, paddingRight: '12px' }}>
            <MapPin size={14} color="#64748B" style={{ flexShrink: 0 }} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {isPharmacy ? task.deliveryAddress : task.patientAddress}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-primary-navy)', fontWeight: '700' }}>
              <Clock size={13} />
              <span>{isPharmacy ? task.scheduledTime : task.collectionTime}</span>
            </div>
            <span style={{ background: '#F1F5F9', padding: '3px 8px', borderRadius: '6px', fontWeight: '700', color: '#334155' }}>
              {task.distance}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '8px', 
          marginTop: '12px', 
          paddingTop: '12px', 
          borderTop: '1px solid var(--border-card)' 
        }}
      >
        <button
          onClick={() => navigate(`/tasks/${task.id}`)}
          className="btn btn-outline"
          style={{ width: '100%', padding: '8px 10px', fontSize: '12px', fontWeight: '700', borderRadius: '8px', gap: '6px' }}
        >
          <FileText size={14} />
          <span>{isPharmacy ? 'View Order' : 'View Details'}</span>
        </button>

        <button
          onClick={handleNavigate}
          className={`btn ${activeOtherOrder ? 'btn-outline' : 'btn-primary'}`}
          style={{ width: '100%', padding: '8px 10px', fontSize: '12px', fontWeight: '700', borderRadius: '8px', opacity: activeOtherOrder ? 0.6 : 1, gap: '6px' }}
        >
          {activeOtherOrder ? <Lock size={13} /> : <Navigation size={14} />}
          <span>{activeOtherOrder ? `Locked (#${activeOtherOrder.id})` : (isPharmacy ? (hasPickedUp ? 'To Patient' : 'To Pharmacy') : 'Navigate')}</span>
        </button>
      </div>
    </div>
  );
}
