import React from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import NavigationMap from '../components/maps/NavigationMap';
import { ArrowLeft, Navigation, ShieldCheck, CornerUpRight } from 'lucide-react';

export default function NavigationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getTaskById, updateTaskStatus, labTasks, pharmacyTasks } = useTasks();

  const taskId = searchParams.get('taskId');
  const rawDest = searchParams.get('dest');

  // Fallback to active task if no taskId in URL
  const task = getTaskById(taskId) || 
    pharmacyTasks.find(t => t.status !== 'COMPLETED') || 
    labTasks.find(t => t.status !== 'COMPLETED');

  const isPharmacy = task?.type === 'pharmacy';
  const pickedUpStatuses = ['ORDER_PICKED_UP', 'GOING_TO_PATIENT', 'ARRIVED_AT_PATIENT', 'DELIVERED', 'COMPLETED'];
  const hasPickedUp = isPharmacy && pickedUpStatuses.includes(task?.status);

  // Determine whether destination is pharmacy or patient
  // 1. Explicit URL parameter takes priority if present
  // 2. Otherwise: Pharmacy order not yet picked up -> Pharmacy!
  // 3. Pharmacy order already picked up -> Patient!
  // 4. Lab order -> Patient
  const resolvedDest = rawDest || (isPharmacy ? (hasPickedUp ? 'patient' : 'pharmacy') : 'patient');
  const isGoingToPharmacy = isPharmacy && resolvedDest === 'pharmacy';

  // Automatically sync task status to in-transit when entering navigation
  React.useEffect(() => {
    if (!task) return;
    if (isPharmacy) {
      if (isGoingToPharmacy && (task.status === 'ASSIGNED' || task.status === 'ACCEPTED')) {
        updateTaskStatus(task.id, 'GOING_TO_PHARMACY');
      } else if (!isGoingToPharmacy && task.status === 'ORDER_PICKED_UP') {
        updateTaskStatus(task.id, 'GOING_TO_PATIENT');
      }
    } else {
      if (task.status === 'ASSIGNED' || task.status === 'ACCEPTED') {
        updateTaskStatus(task.id, 'ON_THE_WAY');
      }
    }
  }, [task?.id, isGoingToPharmacy]);

  if (!task) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px 20px' }}>
        <h2>No Active Route Found</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px', marginBottom: '16px' }}>
          Select an assigned task from the dashboard to start GPS route navigation.
        </p>
        <Link to="/tasks" className="btn btn-primary">
          View Tasks
        </Link>
      </div>
    );
  }

  const handleArrival = () => {
    if (isPharmacy) {
      if (isGoingToPharmacy) {
        updateTaskStatus(task.id, 'ARRIVED_AT_PHARMACY');
        navigate(`/pharmacy-pickup?taskId=${task.id}`);
      } else {
        updateTaskStatus(task.id, 'ARRIVED_AT_PATIENT');
        navigate(`/pharmacy-delivery?taskId=${task.id}`);
      }
    } else {
      updateTaskStatus(task.id, 'ARRIVED');
      navigate(`/sample-collection?taskId=${task.id}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      {/* Top Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 4px',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        <Link
          to={`/tasks/${task.id}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#002244',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: '700',
            backgroundColor: '#FFFFFF',
            padding: '8px 14px',
            borderRadius: '10px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0,34,68,0.04)'
          }}
        >
          <ArrowLeft size={16} />
          <span>Task Details</span>
        </Link>

        {isPharmacy ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: '800',
                color: isGoingToPharmacy ? '#002244' : '#00A896',
                backgroundColor: isGoingToPharmacy ? '#EEF4FB' : '#E6F8F6',
                padding: '6px 14px',
                borderRadius: '20px',
                border: isGoingToPharmacy ? '1px solid #CBD5E1' : '1px solid #A7F3D0'
              }}
            >
              <Navigation size={13} />
              <span>{isGoingToPharmacy ? 'LEG 1: TO PHARMACY PICKUP' : 'LEG 2: TO PATIENT DOORSTEP'}</span>
            </span>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: '800',
              color: '#00A896',
              backgroundColor: '#E6F8F6',
              padding: '6px 12px',
              borderRadius: '20px'
            }}
          >
            <Navigation size={13} />
            <span>LIVE GPS ROUTE</span>
          </div>
        )}
      </div>

      {/* Navigation Map Component */}
      <NavigationMap
        task={task}
        destinationType={isGoingToPharmacy ? 'pharmacy' : 'patient'}
        onArrival={handleArrival}
      />
    </div>
  );
}
