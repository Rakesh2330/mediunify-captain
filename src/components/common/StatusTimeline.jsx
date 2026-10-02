import React from 'react';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  Navigation, 
  MapPin, 
  Activity, 
  PackageCheck, 
  ShieldCheck, 
  Award,
  Truck
} from 'lucide-react';

export default function StatusTimeline({ currentStatus, type = 'lab' }) {
  const norm = (currentStatus || '').toUpperCase();

  const labSteps = [
    { key: 'ASSIGNED', label: 'Assigned', icon: ClipboardCheck, time: '10:00 AM' },
    { key: 'ACCEPTED', label: 'Accepted by Captain', icon: CheckCircle2, time: '10:02 AM' },
    { key: 'ON_THE_WAY', label: 'On the Way to Patient', icon: Navigation, time: '10:05 AM' },
    { key: 'ARRIVED', label: 'Arrived at Patient Address', icon: MapPin, time: '10:18 AM' },
    { key: 'COLLECTED', label: 'Sample Collected & Tagged', icon: Activity, time: '10:25 AM' },
    { key: 'VERIFIED', label: 'Patient & OTP Verified', icon: ShieldCheck, time: '10:28 AM' },
    { key: 'COMPLETED', label: 'Task Completed & Logged', icon: Award, time: '10:30 AM' }
  ];

  const pharmacySteps = [
    { key: 'ASSIGNED', label: 'Order Assigned', icon: ClipboardCheck, time: '09:45 AM' },
    { key: 'ACCEPTED', label: 'Accepted by Captain', icon: CheckCircle2, time: '09:48 AM' },
    { key: 'GOING_TO_PHARMACY', label: 'Going to Pharmacy', icon: Navigation, time: '09:50 AM' },
    { key: 'ARRIVED_AT_PHARMACY', label: 'Arrived at Pharmacy', icon: MapPin, time: '10:02 AM' },
    { key: 'ORDER_PICKED_UP', label: 'Order Picked Up & Sealed', icon: PackageCheck, time: '10:10 AM' },
    { key: 'GOING_TO_PATIENT', label: 'Going to Patient', icon: Truck, time: '10:12 AM' },
    { key: 'ARRIVED_AT_PATIENT', label: 'Arrived at Patient Location', icon: MapPin, time: '10:24 AM' },
    { key: 'DELIVERED', label: 'Medicine Delivered & Verified', icon: ShieldCheck, time: '10:28 AM' },
    { key: 'COMPLETED', label: 'Order Completed', icon: Award, time: '10:30 AM' }
  ];

  const steps = type === 'pharmacy' ? pharmacySteps : labSteps;

  // Find index of current status
  const currentIndex = steps.findIndex(s => s.key === norm);
  const activeIdx = currentIndex >= 0 ? currentIndex : 0;

  return (
    <div className="timeline">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isCompleted = index < activeIdx || norm === 'COMPLETED';
        const isActive = index === activeIdx && norm !== 'COMPLETED';
        const isPending = index > activeIdx && norm !== 'COMPLETED';

        let stateClass = 'pending';
        if (isCompleted) stateClass = 'completed';
        if (isActive) stateClass = 'active';

        return (
          <div key={step.key} className={`timeline-step ${stateClass}`}>
            <div className="timeline-icon-wrap">
              <Icon size={17} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <div className="timeline-content">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="timeline-title">{step.label}</span>
                {(isCompleted || isActive) && (
                  <span className="timeline-time">{step.time}</span>
                )}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {isCompleted && '✓ Completed'}
                {isActive && '● In Progress right now'}
                {isPending && 'Pending next action'}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
