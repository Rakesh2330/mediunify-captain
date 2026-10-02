import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import OTPInput from '../components/verification/OTPInput';
import CameraProofCapture from '../components/verification/CameraProofCapture';
import BarcodeScannerModal from '../components/verification/BarcodeScannerModal';
import {
  Activity,
  User,
  Phone,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Clock,
  CheckSquare,
  Square,
  ThermometerSnowflake,
  FileCheck,
  AlertCircle,
  Check,
  ScanLine
} from 'lucide-react';

export default function SampleCollection() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getTaskById, updateTaskStatus, labTasks } = useTasks();

  const taskId = searchParams.get('taskId');
  const task = getTaskById(taskId) || labTasks.find(t => t.status !== 'COMPLETED');

  // Multi-step internal flow: 'VERIFY' -> 'COLLECT' -> 'SUCCESS'
  const [stage, setStage] = useState('VERIFY'); // 'VERIFY' | 'COLLECT' | 'SUCCESS'
  const [isVerified, setIsVerified] = useState(false);
  const [tubesChecked, setTubesChecked] = useState({});
  const [sampleCount, setSampleCount] = useState(2);
  const [barcodeInput, setBarcodeInput] = useState('MED-BC-904812');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [remarks, setRemarks] = useState('Venipuncture successful on first attempt without hematoma.');
  const [proofImage, setProofImage] = useState(null);

  if (!task) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px 20px' }}>
        <h2>Task Not Found</h2>
        <Link to="/tasks" className="btn btn-primary" style={{ marginTop: '16px' }}>
          Back to Tasks
        </Link>
      </div>
    );
  }

  const handleVerifyOtp = (code) => {
    setIsVerified(true);
    setStage('COLLECT');
    updateTaskStatus(task.id, 'ARRIVED');
  };

  const toggleTube = (tubeId) => {
    setTubesChecked(prev => ({
      ...prev,
      [tubeId]: !prev[tubeId]
    }));
  };

  const handleConfirmCollection = (e) => {
    e.preventDefault();
    updateTaskStatus(task.id, 'COLLECTED', {
      proofImage,
      sampleCount,
      barcode: barcodeInput,
      collectionRemarks: remarks
    });
    setStage('SUCCESS');
  };

  const handleCompleteTask = () => {
    updateTaskStatus(task.id, 'COMPLETED');
    navigate('/tasks');
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link
          to={`/tasks/${task.id}`}
          style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '600' }}
        >
          ← Back to Task
        </Link>
        <div style={{ fontSize: '12px', fontWeight: '700', color: '#00A896', background: '#E6F8F5', padding: '3px 10px', borderRadius: '999px' }}>
          NABL Specimen Protocol
        </div>
      </div>

      {/* Patient Summary Header */}
      <div className="card" style={{ background: '#F8FAFC' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
              PATIENT CONFIRMATION
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-heading)' }}>
              {task.patientName} {task.patientAge ? `(${task.patientAge}y, ${task.patientGender})` : ''}
            </h2>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Booking Ref: <strong>{task.bookingId}</strong> • Phone: <strong>{task.patientPhone}</strong>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '12px', color: '#00A896', fontWeight: '800', display: 'block' }}>
              {task.id}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Scheduled {task.collectionTime}
            </span>
          </div>
        </div>

        <div style={{ fontSize: '13px', color: '#0F766E', fontWeight: '700', background: '#F0FDFA', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CCFBF1' }}>
          Test: {task.testName}
        </div>
      </div>

      {/* STAGE 1: PATIENT VERIFICATION (OTP / IDENTITY) */}
      {stage === 'VERIFY' && (
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#E6F8F5', color: '#00A896', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px auto' }}>
              <ShieldCheck size={26} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-heading)' }}>
              Verify Patient Identity
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Confirm identity using Patient Security OTP sent to {task.patientPhone}.
            </p>
          </div>

          <OTPInput
            length={4}
            expectedOtp={task.otp || '4829'}
            title="Patient Security OTP"
            subtitle={`Ask patient for the 4-digit code sent to ${task.patientPhone}`}
            onVerify={handleVerifyOtp}
          />

          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-card)', textAlign: 'center' }}>
            <button
              onClick={() => handleVerifyOtp(task.otp || '4829')}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              <CheckCircle2 size={18} />
              <span>VERIFY PATIENT & PROCEED TO SAMPLE DRAW</span>
            </button>
          </div>
        </div>
      )}

      {/* STAGE 2: SAMPLE COLLECTION CHECKLIST & PROOF */}
      {stage === 'COLLECT' && (
        <form onSubmit={handleConfirmCollection} className="card" style={{ padding: '20px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <Activity size={20} color="#00A896" />
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-heading)' }}>
              Diagnostic Sample Collection Checklist
            </h3>
          </div>

          {/* Vacutainer Tube Checkbox Checklist */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-heading)', marginBottom: '8px' }}>
              Required Vacutainer Tubes *
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {task.tubeTypes?.map(tube => {
                const checked = tubesChecked[tube.id] || false;
                return (
                  <div
                    key={tube.id}
                    onClick={() => toggleTube(tube.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: checked ? '#F0FDF4' : '#F8FAFC',
                      border: checked ? '1.5px solid #10B981' : '1px solid #E2E8F0',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    {checked ? <CheckSquare size={20} color="#059669" /> : <Square size={20} color="#94A3B8" />}
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: '13px', color: 'var(--text-heading)' }}>{tube.name}</strong>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Target: {tube.test} • Fill Volume: {tube.volume}
                      </div>
                    </div>
                    <span style={{ fontSize: '11px', background: checked ? '#DCFCE7' : '#E2E8F0', color: checked ? '#166534' : '#475569', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                      {checked ? 'Drawn ✓' : 'Pending'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Barcode & Sample Count Section (Phone-Optimized Responsive Layout) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '18px' }}>
            {/* 1. Barcode Tag Field */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-heading)', marginBottom: '6px' }}>
                Specimen Barcode Tag <span style={{ color: '#EF4444' }}>*</span>
              </label>

              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  required
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  placeholder="e.g. MED-BC-904812"
                  style={{
                    flex: 1,
                    minWidth: 0,
                    padding: '11px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '13.5px',
                    fontFamily: 'monospace',
                    fontWeight: '700',
                    letterSpacing: '0.04em',
                    background: '#F8FAFC'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setIsScannerOpen(true)}
                  className="btn btn-primary"
                  title="Open Camera Barcode Scanner"
                  style={{
                    padding: '0 16px',
                    borderRadius: '8px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    fontWeight: '700',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                >
                  <ScanLine size={16} />
                  <span>Scan</span>
                </button>
              </div>

              {barcodeInput && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '11.5px', color: '#059669', fontWeight: '600' }}>
                  <CheckCircle2 size={13} color="#059669" />
                  <span>Specimen Tagged: <strong style={{ fontFamily: 'monospace' }}>{barcodeInput}</strong></span>
                </div>
              )}
            </div>

            {/* 2. Samples Count Field with Touch Stepper */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '4px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-heading)' }}>
                  Samples Collected <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Target: {task.tubeTypes?.length || 2} tubes
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', background: '#F1F5F9', borderRadius: '8px', border: '1px solid #CBD5E1', padding: '2px' }}>
                  <button
                    type="button"
                    onClick={() => setSampleCount(Math.max(1, sampleCount - 1))}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '6px',
                      border: 'none',
                      background: '#FFFFFF',
                      fontSize: '16px',
                      fontWeight: '800',
                      color: 'var(--text-heading)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}
                  >
                    -
                  </button>

                  <span style={{ minWidth: '46px', textAlign: 'center', fontSize: '15px', fontWeight: '800', color: 'var(--text-heading)', fontFamily: 'monospace' }}>
                    {sampleCount}
                  </span>

                  <button
                    type="button"
                    onClick={() => setSampleCount(Math.min(8, sampleCount + 1))}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '6px',
                      border: 'none',
                      background: '#FFFFFF',
                      fontSize: '16px',
                      fontWeight: '800',
                      color: 'var(--text-heading)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}
                  >
                    +
                  </button>
                </div>

                <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: '600' }}>
                  {sampleCount === 1 ? '1 Vacutainer Tube' : `${sampleCount} Vacutainer Tubes`}
                </span>
              </div>
            </div>
          </div>

          {/* Cold-box Temperature Confirmation */}
          <div style={{ background: '#E0F2FE', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid #BAE6FD', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <ThermometerSnowflake size={20} color="#0284C7" />
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#0369A1' }}>
                Carrier Cold-Box Status: 3.4°C (Normal 2°C - 8°C)
              </div>
              <div style={{ fontSize: '11px', color: '#075985' }}>
                Samples must be immediately placed into insulated cooling pouch after collection.
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-heading)', marginBottom: '4px' }}>
              Phlebotomist Remarks & Observations
            </label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Fasting confirmed, specimen intact, 8x inversions done."
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
            />
          </div>

          {/* Photo Proof Component */}
          <CameraProofCapture
            type="lab"
            label="Capture Photo Proof of Barcoded Sample Vials"
            onPhotoCapture={(img) => setProofImage(img)}
          />

          {/* Submit Action */}
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '24px' }}
          >
            <CheckCircle2 size={18} />
            <span>CONFIRM SAMPLE COLLECTION</span>
          </button>
        </form>
      )}

      {/* STAGE 3: SUCCESS CELEBRATION & COMPLETION */}
      {stage === 'SUCCESS' && (
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
            Sample Collection Successful
          </h3>

          <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '380px', margin: '8px auto 20px auto' }}>
            Specimens tagged with barcode <strong>{barcodeInput}</strong> and sealed in temperature-controlled cooler.
          </p>

          <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: 'var(--radius-md)', maxWidth: '360px', margin: '0 auto 24px auto', textAlign: 'left', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Task ID:</span>
              <strong>{task.id}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Patient Name:</span>
              <strong>{task.patientName}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Status:</span>
              <span style={{ color: '#059669', fontWeight: '700' }}>SAMPLE COLLECTED</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Captain Earnings:</span>
              <strong style={{ color: '#059669' }}>+ ₹{task.earnings}</strong>
            </div>
          </div>

          <button
            onClick={handleCompleteTask}
            className="btn btn-success btn-lg"
            style={{ width: '100%', maxWidth: '360px' }}
          >
            <CheckCircle2 size={18} />
            <span>COMPLETE TASK</span>
          </button>
        </div>
      )}

      {/* Barcode Scanner Modal Component */}
      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        initialBarcode={barcodeInput}
        onScanSuccess={(scannedCode) => {
          setBarcodeInput(scannedCode);
        }}
      />
    </div>
  );
}
