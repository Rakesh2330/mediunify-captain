import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import OTPInput from '../components/verification/OTPInput';
import CameraProofCapture from '../components/verification/CameraProofCapture';
import {
  User,
  Phone,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Package,
  CreditCard,
  Check,
  Banknote,
  Camera,
  AlertCircle
} from 'lucide-react';

export default function PharmacyDelivery() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getTaskById, updateTaskStatus, pharmacyTasks } = useTasks();

  const taskId = searchParams.get('taskId');
  const task = getTaskById(taskId) || pharmacyTasks.find(t => t.status !== 'COMPLETED');

  const [step, setStep] = useState('OTP_VERIFY'); // 'OTP_VERIFY' | 'CONFIRMATION' | 'SUCCESS'
  const [proofImage, setProofImage] = useState(null);
  const [paymentCollected, setPaymentCollected] = useState(task?.isPaid || false);
  const [remarks, setRemarks] = useState('Handed directly to patient at doorstep.');

  if (!task) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px 20px' }}>
        <h2>Order Not Found</h2>
        <Link to="/tasks" className="btn btn-primary" style={{ marginTop: '16px' }}>
          Back to Tasks
        </Link>
      </div>
    );
  }

  const handleVerifyDeliveryOtp = (code) => {
    updateTaskStatus(task.id, 'ARRIVED_AT_PATIENT', { verifiedDeliveryOtp: code });
    setStep('CONFIRMATION');
  };

  const handleConfirmDelivery = (e) => {
    e.preventDefault();
    updateTaskStatus(task.id, 'DELIVERED', {
      deliveryProofImage: proofImage,
      paymentCollected: true,
      deliveryRemarks: remarks
    });
    setStep('SUCCESS');
  };

  const handleCompleteOrder = () => {
    updateTaskStatus(task.id, 'COMPLETED');
    navigate('/home');
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link
          to={`/tasks/${task.id}`}
          style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '600' }}
        >
          ← Back to Order
        </Link>
        <span style={{ fontSize: '12px', fontWeight: '700', color: '#059669', background: '#ECFDF5', padding: '3px 10px', borderRadius: '999px' }}>
          Final Delivery Verification
        </span>
      </div>

      {/* Safety Notice if Pharmacy Pickup was skipped */}
      {(!['ORDER_PICKED_UP', 'GOING_TO_PATIENT', 'DELIVERED', 'COMPLETED'].includes(task.status) && !task.verifiedPickupOtp && !task.pickupProofImage) && (
        <div 
          style={{
            background: '#FFFBEB',
            border: '1px solid #FCD34D',
            borderRadius: '10px',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '220px' }}>
            <AlertCircle size={22} color="#D97706" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#92400E' }}>
                Pharmacy Pickup Required First
              </div>
              <div style={{ fontSize: '12px', color: '#78350F', marginTop: '2px' }}>
                Medicines must be collected and verified at <strong>{task.pharmacyName}</strong> before patient delivery.
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Link
              to={`/pharmacy-pickup?taskId=${task.id}`}
              className="btn btn-primary"
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              Go to Pharmacy Pickup
            </Link>
            <Link
              to={`/navigation?taskId=${task.id}&dest=pharmacy`}
              className="btn btn-outline"
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              Route to Pharmacy
            </Link>
          </div>
        </div>
      )}

      {/* Patient & Order Details Card */}
      <div className="card" style={{ background: '#F8FAFC' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
              Patient Delivery
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-heading)' }}>
              {task.patientName}
            </h2>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Phone: <strong>{task.patientPhone}</strong>
            </div>
          </div>
          <span style={{ fontSize: '15px', fontWeight: '800', fontFamily: 'monospace', color: 'var(--color-primary-navy)' }}>
            {task.id}
          </span>
        </div>

        <div style={{ fontSize: '13px', color: 'var(--text-body)', marginTop: '6px' }}>
          <strong>Address:</strong> {task.deliveryAddress}
        </div>

        {/* Payment info pill */}
        <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '8px', background: task.isPaid ? '#ECFDF5' : '#FEF3C7', border: `1px solid ${task.isPaid ? '#A7F3D0' : '#FDE68A'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '700', color: task.isPaid ? '#065F46' : '#92400E' }}>
            {task.isPaid ? <CreditCard size={16} /> : <Banknote size={16} />}
            <span>{task.paymentMode}</span>
          </div>
          <span style={{ fontSize: '15px', fontWeight: '800', color: task.isPaid ? '#065F46' : '#92400E' }}>
            ₹{task.totalAmount}
          </span>
        </div>
      </div>

      {/* STEP 1: RECEIVE OTP FROM PATIENT */}
      {step === 'OTP_VERIFY' && (
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#F0FDFA', color: '#00A896', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px auto' }}>
              <ShieldCheck size={26} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-heading)' }}>
              Patient Doorstep Verification
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Receive the 4-digit security OTP from <strong>{task.patientName}</strong> (sent to {task.patientPhone} via SMS) to verify delivery.
            </p>
          </div>

          <OTPInput
            length={4}
            expectedOtp={task.deliveryOtp || '5192'}
            title="Receive Patient Delivery OTP"
            subtitle={`Ask patient for the 4-digit security code sent to ${task.patientPhone}`}
            onVerify={handleVerifyDeliveryOtp}
          />

          <button
            onClick={() => handleVerifyDeliveryOtp(task.deliveryOtp || '5192')}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '16px' }}
          >
            <CheckCircle2 size={18} />
            <span>VERIFY OTP & CAPTURE PROOF</span>
          </button>
        </div>
      )}

      {/* STEP 2: ONE PICTURE PROOF & CONFIRM ORDER DELIVERED (NO E-SIGN) */}
      {step === 'CONFIRMATION' && (
        <form onSubmit={handleConfirmDelivery} className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Package size={20} color="#00A896" />
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-heading)', margin: 0 }}>
              Confirm Delivery & Capture Photo
            </h3>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Capture a single photo of the parcel handed over to the patient to complete this delivery. Digital signature is not required.
          </p>

          {/* Cash collection checkbox if COD */}
          {!task.isPaid && (
            <div
              onClick={() => setPaymentCollected(!paymentCollected)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                background: paymentCollected ? '#ECFDF5' : '#FFFBEB',
                border: paymentCollected ? '1.5px solid #10B981' : '1px solid #FDE68A',
                cursor: 'pointer',
                marginBottom: '16px'
              }}
            >
              <CheckCircle2 size={22} color={paymentCollected ? '#059669' : '#D97706'} />
              <div>
                <strong style={{ fontSize: '13px', color: 'var(--text-heading)' }}>
                  Cash Amount Collected: ₹{task.totalAmount}
                </strong>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Confirm you have received the cash payment from the patient.
                </div>
              </div>
            </div>
          )}

          {/* Single Photo Proof (One Picture) */}
          <CameraProofCapture
            type="pharmacy"
            label="Capture Handover Photo (Doorstep Proof)"
            onPhotoCapture={(img) => setProofImage(img)}
          />

          {/* Delivery Remarks */}
          <div style={{ marginTop: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-heading)', marginBottom: '4px' }}>
              Delivery Remarks (Optional)
            </label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Handed to patient, package in good condition"
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-success btn-lg"
            style={{ width: '100%', marginTop: '20px' }}
          >
            <CheckCircle2 size={18} />
            <span>CONFIRM ORDER DELIVERED</span>
          </button>
        </form>
      )}

      {/* STEP 3: SUCCESS CONFIRMATION */}
      {step === 'SUCCESS' && (
        <div className="card" style={{ textAlign: 'center', padding: '36px 20px', animation: 'slideUp 300ms ease' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#DCFCE7',
              color: '#15803D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              border: '2px solid #86EFAC'
            }}
          >
            <Check size={36} strokeWidth={3} />
          </div>

          <h3 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-heading)' }}>
            Delivery Successful
          </h3>

          <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '360px', margin: '8px auto 20px auto' }}>
            Medicines handed over safely. The electronic proof of delivery has been logged.
          </p>

          <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: 'var(--radius-md)', maxWidth: '360px', margin: '0 auto 24px auto', textAlign: 'left', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Order ID:</span>
              <strong>{task.id}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Patient:</span>
              <strong>{task.patientName}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Completed Time:</span>
              <strong>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E2E8F0', paddingTop: '6px', marginTop: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Trip Payout:</span>
              <strong style={{ color: '#059669', fontSize: '15px' }}>+ ₹{task.earnings}</strong>
            </div>
          </div>

          <button
            onClick={handleCompleteOrder}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', maxWidth: '360px' }}
          >
            <span>BACK TO HOME</span>
          </button>
        </div>
      )}
    </div>
  );
}
