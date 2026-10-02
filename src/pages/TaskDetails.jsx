import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import StatusBadge from '../components/common/StatusBadge';
import StatusTimeline from '../components/common/StatusTimeline';
import {
  ArrowLeft,
  Phone,
  MapPin,
  Navigation,
  Calendar,
  Clock,
  ShieldCheck,
  Activity,
  Pill,
  Store,
  User,
  AlertCircle,
  CheckCircle2,
  Package,
  FileCheck,
  Check,
  ChevronRight,
  ThermometerSnowflake,
  ExternalLink,
  Lock
} from 'lucide-react';

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTaskById, updateTaskStatus } = useTasks();

  const task = getTaskById(id);

  if (!task) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px 20px' }}>
        <AlertCircle size={40} color="var(--color-danger)" style={{ margin: '0 auto 12px auto' }} />
        <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Task Not Found</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px', marginBottom: '16px' }}>
          Unable to locate task with ID "{id}".
        </p>
        <Link to="/tasks" className="btn btn-primary">
          Back to Tasks
        </Link>
      </div>
    );
  }

  const isPharmacy = task.type === 'pharmacy';

  const handleCall = (phone) => {
    window.open(`tel:${phone}`, '_self');
  };

  // Status progression action handler
  const handlePrimaryAction = () => {
    if (isPharmacy) {
      switch (task.status) {
        case 'ASSIGNED':
        case 'ACCEPTED':
          updateTaskStatus(task.id, 'GOING_TO_PHARMACY');
          navigate(`/navigation?taskId=${task.id}&dest=pharmacy`);
          break;
        case 'GOING_TO_PHARMACY':
          updateTaskStatus(task.id, 'ARRIVED_AT_PHARMACY');
          navigate(`/pharmacy-pickup?taskId=${task.id}`);
          break;
        case 'ARRIVED_AT_PHARMACY':
          navigate(`/pharmacy-pickup?taskId=${task.id}`);
          break;
        case 'ORDER_PICKED_UP':
          updateTaskStatus(task.id, 'GOING_TO_PATIENT');
          navigate(`/navigation?taskId=${task.id}&dest=patient`);
          break;
        case 'GOING_TO_PATIENT':
          updateTaskStatus(task.id, 'ARRIVED_AT_PATIENT');
          navigate(`/pharmacy-delivery?taskId=${task.id}`);
          break;
        case 'ARRIVED_AT_PATIENT':
          navigate(`/pharmacy-delivery?taskId=${task.id}`);
          break;
        case 'DELIVERED':
          updateTaskStatus(task.id, 'COMPLETED');
          break;
        default:
          break;
      }
    } else {
      // Lab flow
      switch (task.status) {
        case 'ASSIGNED':
        case 'ACCEPTED':
          updateTaskStatus(task.id, 'ON_THE_WAY');
          navigate(`/navigation?taskId=${task.id}&dest=patient`);
          break;
        case 'ON_THE_WAY':
          updateTaskStatus(task.id, 'ARRIVED');
          break;
        case 'ARRIVED':
          navigate(`/sample-collection?taskId=${task.id}`);
          break;
        case 'COLLECTED':
          updateTaskStatus(task.id, 'VERIFIED');
          break;
        case 'VERIFIED':
          updateTaskStatus(task.id, 'COMPLETED');
          break;
        default:
          break;
      }
    }
  };

  // Helper to render dynamic button label & style
  const getButtonConfig = () => {
    if (isPharmacy) {
      switch (task.status) {
        case 'ASSIGNED':
          return { label: 'ACCEPT PICKUP TASK', className: 'btn-primary' };
        case 'ACCEPTED':
          return { label: 'START NAVIGATION (TO PHARMACY)', className: 'btn-navy' };
        case 'GOING_TO_PHARMACY':
          return { label: 'I HAVE ARRIVED AT PHARMACY', className: 'btn-success' };
        case 'ARRIVED_AT_PHARMACY':
          return { label: 'VERIFY PHARMACY PICKUP (OTP & PARCEL)', className: 'btn-primary' };
        case 'ORDER_PICKED_UP':
          return { label: 'START DELIVERY (TO PATIENT)', className: 'btn-navy' };
        case 'GOING_TO_PATIENT':
          return { label: 'I HAVE ARRIVED AT PATIENT', className: 'btn-success' };
        case 'ARRIVED_AT_PATIENT':
          return { label: 'VERIFY DELIVERY (OTP & SIGNATURE)', className: 'btn-primary' };
        case 'DELIVERED':
          return { label: 'COMPLETE ORDER & EARN ₹' + task.earnings, className: 'btn-success' };
        case 'COMPLETED':
          return { label: 'ORDER COMPLETED ✓', className: 'btn-outline', disabled: true };
        default:
          return { label: 'UPDATE STATUS', className: 'btn-primary' };
      }
    } else {
      switch (task.status) {
        case 'ASSIGNED':
          return { label: 'ACCEPT TASK', className: 'btn-primary' };
        case 'ACCEPTED':
          return { label: 'START NAVIGATION (TO PATIENT)', className: 'btn-navy' };
        case 'ON_THE_WAY':
          return { label: 'I HAVE ARRIVED AT LOCATION', className: 'btn-success' };
        case 'ARRIVED':
          return { label: 'VERIFY PATIENT & COLLECT SAMPLE', className: 'btn-primary' };
        case 'COLLECTED':
          return { label: 'VERIFY SAMPLE LABELS & OTP', className: 'btn-navy' };
        case 'VERIFIED':
          return { label: 'COMPLETE TASK & EARN ₹' + task.earnings, className: 'btn-success' };
        case 'COMPLETED':
          return { label: 'COLLECTION COMPLETED ✓', className: 'btn-outline', disabled: true };
        default:
          return { label: 'UPDATE STATUS', className: 'btn-primary' };
      }
    }
  };

  const btnConfig = getButtonConfig();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {task.status === 'ASSIGNED' || task.status === 'COMPLETED' ? (
          <Link
            to="/tasks"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Tasks</span>
          </Link>
        ) : (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0F766E', fontSize: '12px', fontWeight: '800', background: '#F0FDFA', padding: '6px 12px', borderRadius: '8px', border: '1px solid #CCFBF1' }}>
            <Lock size={13} />
            <span>Active Trip In Progress • Order #{task.id} (Locked)</span>
          </div>
        )}
        <StatusBadge status={task.status} />
      </div>

      {/* Task Headline Card */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #002244 0%, #003366 100%)',
          color: 'white',
          padding: '24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'monospace', color: '#5EEAD4' }}>
                {task.id}
              </span>
              <span style={{ background: 'rgba(255,255,255,0.15)', padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>
                {isPharmacy ? 'Pharmacy Order' : 'Diagnostic Lab Booking'}
              </span>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#FFFFFF', marginTop: '6px' }}>
              {isPharmacy ? (task.medicines?.map(m => m.name).join(', ')) : task.testName}
            </h2>
            <div style={{ fontSize: '13px', color: '#CBD5E1', marginTop: '4px' }}>
              Booking Ref: <strong>{task.bookingId || task.id}</strong> • Scheduled: <strong>{isPharmacy ? task.scheduledTime : task.collectionTime}</strong>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '12px', color: '#CBD5E1', display: 'block' }}>Captain Earning</span>
            <span style={{ fontSize: '26px', fontWeight: '800', color: '#34D399' }}>
              ₹{task.earnings}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Action Button (Prominent Floating-style Banner) */}
      <div
        style={{
          position: 'sticky',
          top: '70px',
          zIndex: 30,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border-card)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <button
          onClick={handlePrimaryAction}
          disabled={btnConfig.disabled}
          className={`btn ${btnConfig.className} btn-lg`}
          style={{ flex: 1, height: '48px', fontSize: '15px' }}
        >
          <span>{btnConfig.label}</span>
          {!btnConfig.disabled && <ChevronRight size={18} />}
        </button>

        <button
          onClick={() => {
            const pickedUpStatuses = ['ORDER_PICKED_UP', 'GOING_TO_PATIENT', 'ARRIVED_AT_PATIENT', 'DELIVERED', 'COMPLETED'];
            const hasPickedUp = isPharmacy && pickedUpStatuses.includes(task.status);
            const dest = isPharmacy ? (hasPickedUp ? 'patient' : 'pharmacy') : 'patient';

            if (isPharmacy && (task.status === 'ASSIGNED' || task.status === 'ACCEPTED')) {
              updateTaskStatus(task.id, 'GOING_TO_PHARMACY');
            } else if (!isPharmacy && (task.status === 'ASSIGNED' || task.status === 'ACCEPTED')) {
              updateTaskStatus(task.id, 'ON_THE_WAY');
            }

            navigate(`/navigation?taskId=${task.id}&dest=${dest}`);
          }}
          className="btn btn-outline btn-lg"
          style={{ padding: '12px 18px' }}
          title="Open Map Route"
        >
          <Navigation size={18} color="var(--color-primary-teal)" />
          <span className="hide-on-mobile">
            {isPharmacy ? (['ORDER_PICKED_UP', 'GOING_TO_PATIENT', 'ARRIVED_AT_PATIENT'].includes(task.status) ? 'Patient Route' : 'Pharmacy Route') : 'Route Map'}
          </span>
        </button>
      </div>

      {/* Grid: Details (Left) + Timeline (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Left Column: Patient & Order/Test Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Patient Information Card */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={18} color="#00A896" />
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-heading)' }}>
                  Patient Information
                </h3>
              </div>
              <button
                onClick={() => handleCall(task.patientPhone)}
                className="btn btn-outline"
                style={{ padding: '6px 12px', fontSize: '12px', gap: '6px' }}
              >
                <Phone size={13} color="#059669" />
                <span>Call Patient</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Name</span>
                <div style={{ fontWeight: '700', color: 'var(--text-heading)', marginTop: '2px' }}>{task.patientName}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Age & Gender</span>
                <div style={{ fontWeight: '600', marginTop: '2px' }}>
                  {task.patientAge ? `${task.patientAge} Years • ${task.patientGender}` : 'Adult Patient'}
                </div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Phone</span>
                <div style={{ fontWeight: '600', marginTop: '2px' }}>{task.patientPhone}</div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Destination Address</span>
                <div style={{ fontWeight: '600', color: 'var(--text-heading)', marginTop: '2px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <MapPin size={15} color="#64748B" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{isPharmacy ? task.deliveryAddress : task.patientAddress}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pharmacy Info Card (Only for Pharmacy Captain) */}
          {isPharmacy && (
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Store size={18} color="#002244" />
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-heading)' }}>
                    Fulfilling Pharmacy
                  </h3>
                </div>
                <button
                  onClick={() => handleCall(task.pharmacyPhone)}
                  className="btn btn-outline"
                  style={{ padding: '6px 12px', fontSize: '12px', gap: '6px' }}
                >
                  <Phone size={13} color="#002244" />
                  <span>Call Store</span>
                </button>
              </div>

              <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Pharmacy Store Name</span>
                  <div style={{ fontWeight: '700', color: 'var(--text-heading)', marginTop: '2px' }}>{task.pharmacyName}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Pickup Address</span>
                  <div style={{ fontWeight: '600', marginTop: '2px' }}>{task.pharmacyAddress}</div>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Order Medicines ({task.medicines?.length})</span>
                  <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {task.medicines?.map((med, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F8FAFC', padding: '6px 10px', borderRadius: '6px' }}>
                        <div>
                          <strong style={{ color: 'var(--text-heading)' }}>{med.name}</strong>
                          <span style={{ fontSize: '11px', color: '#64748B', marginLeft: '6px' }}>Qty: {med.qty}</span>
                        </div>
                        <span style={{ fontWeight: '700', color: '#002244' }}>₹{med.price * med.qty}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', fontWeight: '800', borderTop: '1px solid #E2E8F0' }}>
                      <span>Total Bill Amount ({task.paymentMode})</span>
                      <span style={{ color: '#059669' }}>₹{task.totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Diagnostic Info Card (Only for Lab Test Captain) */}
          {!isPharmacy && (
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Activity size={18} color="#00A896" />
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-heading)' }}>
                  Diagnostic Sample Specifications
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Package / Test Profile</span>
                  <div style={{ fontWeight: '700', color: 'var(--text-heading)', marginTop: '2px' }}>{task.testPackage}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Sample Type</span>
                  <div style={{ fontWeight: '600', marginTop: '2px' }}>{task.sampleType}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Required Vacutainer Tubes</span>
                  <div style={{ fontWeight: '600', color: '#0F766E', marginTop: '2px' }}>{task.requiredSample}</div>
                </div>
                <div style={{ background: '#FFFBEB', padding: '10px 12px', borderRadius: '8px', border: '1px solid #FDE68A' }}>
                  <span style={{ color: '#B45309', fontSize: '11px', textTransform: 'uppercase', fontWeight: '800' }}>Special Patient Instructions</span>
                  <p style={{ fontSize: '12px', color: '#92400E', marginTop: '2px', lineHeight: 1.4 }}>
                    {task.specialInstructions}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Status Progression Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-heading)' }}>
                Task Progress Timeline
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--color-primary-teal)', fontWeight: '700' }}>
                Step-by-Step
              </span>
            </div>

            <StatusTimeline currentStatus={task.status} type={task.type} />
          </div>

          {/* Quick Security Check */}
          <div className="card" style={{ background: '#F8FAFC', border: '1px dashed #CBD5E1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <ShieldCheck size={16} color="#00A896" />
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-heading)' }}>
                Field Security Verification
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              {isPharmacy
                ? `Pharmacy OTP: ${task.pharmacyOtp || '----'} | Delivery OTP: ${task.deliveryOtp || '----'}`
                : `Patient Verification OTP: ${task.otp || '----'}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
