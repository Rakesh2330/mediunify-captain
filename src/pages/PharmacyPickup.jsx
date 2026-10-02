import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import GeneratedOTPDisplay from '../components/verification/GeneratedOTPDisplay';
import CameraProofCapture from '../components/verification/CameraProofCapture';
import {
  Package,
  PackageCheck,
  ThermometerSnowflake,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function PharmacyPickup() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getTaskById, updateTaskStatus, updateTaskOtp, pharmacyTasks } = useTasks();

  const taskId = searchParams.get('taskId');
  const task = getTaskById(taskId) || pharmacyTasks.find(t => t.status !== 'COMPLETED');

  const [step, setStep] = useState('OTP_VERIFY'); // 'OTP_VERIFY' | 'PROOF' | 'DONE'
  const [proofImage, setProofImage] = useState(null);
  const [remarks, setRemarks] = useState('Sealed package inspected. Cold chain stored in cooling carrier.');
  const [tamperCheck, setTamperCheck] = useState(true);

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

  const handleRegenerateOtp = (newOtp) => {
    if (updateTaskOtp) {
      updateTaskOtp(task.id, 'pharmacyOtp', newOtp);
    }
  };

  const handleConfirmHandover = (code) => {
    updateTaskStatus(task.id, 'ARRIVED_AT_PHARMACY', { verifiedPickupOtp: code });
    setStep('PROOF');
  };

  const handleConfirmPickup = (e) => {
    e.preventDefault();
    updateTaskStatus(task.id, 'ORDER_PICKED_UP', {
      pickupProofImage: proofImage,
      pickupRemarks: remarks
    });
    setStep('DONE');
  };

  const handleProceedToDelivery = () => {
    navigate(`/navigation?taskId=${task.id}&dest=patient`);
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link
          to={`/tasks/${task.id}`}
          style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '600' }}
        >
          ← Back to Order
        </Link>
        <span style={{ fontSize: '12px', fontWeight: '700', color: '#00A896', background: '#E6F8F5', padding: '3px 10px', borderRadius: '999px' }}>
          Pharmacy Handover Stage
        </span>
      </div>

      {/* Store Header Card */}
      <div className="card" style={{ background: '#F8FAFC' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
              Pickup Verification
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-heading)' }}>
              {task.pharmacyName}
            </h2>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {task.pharmacyAddress}
            </div>
          </div>
          <span style={{ fontSize: '15px', fontWeight: '800', fontFamily: 'monospace', color: 'var(--color-primary-navy)' }}>
            {task.id}
          </span>
        </div>

        {/* Medicines Checklist */}
        <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', marginTop: '10px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
            Package Contents ({task.medicines?.length} Items)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {task.medicines?.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ fontWeight: '600', color: 'var(--text-heading)' }}>• {m.name}</span>
                <span style={{ color: 'var(--text-muted)' }}>Qty: {m.qty}</span>
              </div>
            ))}
          </div>
          {task.coldChain && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0284C7', fontSize: '12px', fontWeight: '700', marginTop: '8px', borderTop: '1px solid #E2E8F0', paddingTop: '6px' }}>
              <ThermometerSnowflake size={14} />
              <span>COLD CHAIN ITEM: Store in insulated cooling bag</span>
            </div>
          )}
        </div>
      </div>

      {/* STEP 1: PHARMACY HANDOVER OTP (GIVE CODE TO PHARMACIST) */}
      {step === 'OTP_VERIFY' && (
        <div className="card" style={{ padding: '24px' }}>
          <GeneratedOTPDisplay
            otp={task.pharmacyOtp || '7391'}
            title="Pharmacy Pickup Handover OTP"
            subtitle="Give this 4-digit verification code to the pharmacist at the store counter. The pharmacist enters this code in their terminal to authorize order handover to you."
            recipientLabel="Pharmacist at Counter"
            orderId={task.id}
            confirmButtonText="PHARMACIST VERIFIED & PACKAGE HANDED OVER"
            onRegenerate={handleRegenerateOtp}
            onConfirm={handleConfirmHandover}
            accentColor="#00A896"
          />
        </div>
      )}

      {/* STEP 2: RECEIVE MEDICINES & PROOF CAPTURE */}
      {step === 'PROOF' && (
        <form onSubmit={handleConfirmPickup} className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PackageCheck size={22} color="#00A896" />
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-heading)', margin: 0 }}>
                Receive & Inspect Medicines
              </h3>
            </div>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#0F766E', background: '#F0FDFA', padding: '3px 8px', borderRadius: '6px' }}>
              Counter Handover
            </span>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '18px', lineHeight: 1.5 }}>
            Inspect the sealed medicine package handed over by the pharmacist. Confirm all items are securely packed and matches the prescription order before departure.
          </p>

          {/* Tamper Evident Seal Checkbox */}
          <div
            onClick={() => setTamperCheck(!tamperCheck)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              background: tamperCheck ? '#F0FDF4' : '#FFFBEB',
              border: tamperCheck ? '1.5px solid #10B981' : '1px solid #FDE68A',
              cursor: 'pointer',
              marginBottom: '16px'
            }}
          >
            <CheckCircle2 size={22} color={tamperCheck ? '#059669' : '#D97706'} />
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-heading)' }}>
                Tamper-Evident Safety Seal Verified
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Medicines package is sealed and matches prescription label.
              </div>
            </div>
          </div>

          {/* Photo Capture */}
          <CameraProofCapture
            type="pharmacy"
            label="Capture Photo of Sealed Pharmacy Parcel"
            onPhotoCapture={(img) => setProofImage(img)}
          />

          {/* Remarks */}
          <div style={{ marginTop: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-heading)', marginBottom: '4px' }}>
              Pickup Notes / Remarks
            </label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '20px' }}
          >
            <CheckCircle2 size={18} />
            <span>CONFIRM PICKUP & PROCEED TO PATIENT</span>
          </button>
        </form>
      )}

      {/* STEP 3: DONE - MOVE TO DELIVERY */}
      {step === 'DONE' && (
        <div className="card" style={{ textAlign: 'center', padding: '36px 20px', animation: 'slideUp 300ms ease' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#DCFCE7',
              color: '#166534',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}
          >
            <Package size={32} />
          </div>

          <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-heading)' }}>
            Order Picked Up Successfully!
          </h3>

          <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '360px', margin: '6px auto 20px auto' }}>
            The order is now in your custody. Next step: Deliver to <strong>{task.patientName}</strong> at <strong>{task.deliveryAddress}</strong>.
          </p>

          <button
            onClick={handleProceedToDelivery}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', maxWidth: '340px' }}
          >
            <span>START NAVIGATION TO PATIENT</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
