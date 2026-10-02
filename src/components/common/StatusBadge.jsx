import React from 'react';
import { 
  Clock, 
  CheckCircle, 
  Truck, 
  MapPin, 
  Package, 
  Activity, 
  XCircle, 
  AlertCircle 
} from 'lucide-react';

export default function StatusBadge({ status, showDot = true }) {
  const normStatus = (status || '').toUpperCase();

  const getStatusConfig = (s) => {
    switch (s) {
      case 'ASSIGNED':
        return { label: 'Assigned', className: 'badge-assigned', icon: Clock, dotColor: '#2563EB' };
      case 'ACCEPTED':
        return { label: 'Accepted', className: 'badge-accepted', icon: CheckCircle, dotColor: '#16A34A' };
      case 'ON_THE_WAY':
        return { label: 'On The Way', className: 'badge-on_the_way', icon: Truck, dotColor: '#D97706' };
      case 'ARRIVED':
        return { label: 'Arrived at Patient', className: 'badge-arrived', icon: MapPin, dotColor: '#4F46E5' };
      case 'GOING_TO_PHARMACY':
        return { label: 'Going to Pharmacy', className: 'badge-going_to_pharmacy', icon: Truck, dotColor: '#D97706' };
      case 'ARRIVED_AT_PHARMACY':
        return { label: 'Arrived at Pharmacy', className: 'badge-arrived_at_pharmacy', icon: MapPin, dotColor: '#4F46E5' };
      case 'ORDER_PICKED_UP':
        return { label: 'Order Picked Up', className: 'badge-order_picked_up', icon: Package, dotColor: '#00A896' };
      case 'GOING_TO_PATIENT':
        return { label: 'En Route to Patient', className: 'badge-going_to_patient', icon: Truck, dotColor: '#D97706' };
      case 'ARRIVED_AT_PATIENT':
        return { label: 'Arrived at Patient', className: 'badge-arrived_at_patient', icon: MapPin, dotColor: '#4F46E5' };
      case 'COLLECTED':
        return { label: 'Sample Collected', className: 'badge-collected', icon: Activity, dotColor: '#00A896' };
      case 'VERIFIED':
        return { label: 'Verified', className: 'badge-collected', icon: CheckCircle, dotColor: '#00A896' };
      case 'DELIVERED':
        return { label: 'Delivered', className: 'badge-delivered', icon: Package, dotColor: '#16A34A' };
      case 'COMPLETED':
        return { label: 'Completed', className: 'badge-completed', icon: CheckCircle, dotColor: '#16A34A' };
      case 'CANCELLED':
        return { label: 'Cancelled', className: 'badge-cancelled', icon: XCircle, dotColor: '#DC2626' };
      default:
        return { label: s.replace(/_/g, ' '), className: 'badge-assigned', icon: AlertCircle, dotColor: '#64748B' };
    }
  };

  const config = getStatusConfig(normStatus);
  const Icon = config.icon;

  return (
    <span className={`status-badge ${config.className}`}>
      {showDot && (
        <span 
          style={{ 
            width: '6px', 
            height: '6px', 
            borderRadius: '50%', 
            background: config.dotColor,
            flexShrink: 0
          }} 
        />
      )}
      <Icon size={12} strokeWidth={2.5} />
      <span>{config.label}</span>
    </span>
  );
}
