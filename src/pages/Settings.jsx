import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { 
  Settings, 
  User, 
  Bell, 
  Lock, 
  ShieldCheck, 
  HelpCircle, 
  FileText, 
  LogOut, 
  ChevronRight, 
  Headphones, 
  Check,
  Smartphone
} from 'lucide-react';

export default function SettingsPage() {
  const { logout, captainType, deviceMode, toggleDeviceMode } = useAuth();
  const navigate = useNavigate();

  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  const handleConfirmLogout = () => {
    setIsLogoutOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Settings size={22} color="var(--color-primary-navy)" />
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-heading)' }}>
            Account & Operations Settings
          </h1>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
          Configure dispatch alerts, duty notifications, application preferences and security.
        </p>
      </div>

      {/* Settings Menu Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Section 1: Captain Preferences */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Captain Preferences
          </div>

          <Link
            to="/profile"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: '1px solid #F1F5F9',
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <User size={18} color="var(--color-primary-teal)" />
              <div>
                <strong style={{ fontSize: '14px', color: 'var(--text-heading)' }}>Captain Profile & Documents</strong>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Name, phone, vehicle & NABL/drug certifications</div>
              </div>
            </div>
            <ChevronRight size={18} color="#94A3B8" />
          </Link>


          {/* Device Frame Mode Toggle */}
          <div
            onClick={toggleDeviceMode}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Smartphone size={18} color="#002244" />
              <div>
                <strong style={{ fontSize: '14px', color: 'var(--text-heading)' }}>Device Presentation Frame</strong>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {deviceMode === 'responsive' ? 'Standard Responsive Web View' : 'Emulated Mobile Smartphone Shell'}
                </div>
              </div>
            </div>
            <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }}>
              Toggle Frame
            </button>
          </div>
        </div>

        {/* Section 2: Security & Support */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Security & Support
          </div>

          <div
            onClick={() => setIsPasswordModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #F1F5F9', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Lock size={18} color="#D97706" />
              <div>
                <strong style={{ fontSize: '14px', color: 'var(--text-heading)' }}>Change Password</strong>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Update login credentials and biometric PIN</div>
              </div>
            </div>
            <ChevronRight size={18} color="#94A3B8" />
          </div>

          <div
            onClick={() => setSupportModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #F1F5F9', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Headphones size={18} color="var(--color-primary-teal)" />
              <div>
                <strong style={{ fontSize: '14px', color: 'var(--text-heading)' }}>Fleet Help & Emergency Dispatch Support</strong>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>24/7 Operations Command Center hotline</div>
              </div>
            </div>
            <ChevronRight size={18} color="#94A3B8" />
          </div>

          <div
            onClick={() => setTermsModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FileText size={18} color="#64748B" />
              <div>
                <strong style={{ fontSize: '14px', color: 'var(--text-heading)' }}>Terms & Healthcare Privacy Policy</strong>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>HIPAA / DISHA healthcare data compliance</div>
              </div>
            </div>
            <ChevronRight size={18} color="#94A3B8" />
          </div>
        </div>

        {/* Section 3: Logout Button Card */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <strong style={{ fontSize: '15px', color: '#DC2626' }}>Logout Session</strong>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                End your active shift. Requires confirmation before signing out.
              </p>
            </div>

            <button
              onClick={() => setIsLogoutOpen(true)}
              className="btn btn-danger"
              style={{ gap: '8px' }}
            >
              <LogOut size={16} />
              <span>LOGOUT</span>
            </button>
          </div>
        </div>
      </div>

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

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="modal-overlay" onClick={() => setIsPasswordModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '14px' }}>Change Captain Password</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Current Password</label>
                <input type="password" placeholder="••••••••" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '4px' }}>New Password</label>
                <input type="password" placeholder="New strong password" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button onClick={() => setIsPasswordModalOpen(false)} className="btn btn-outline">Cancel</button>
              <button onClick={() => { alert("Password successfully updated!"); setIsPasswordModalOpen(false); }} className="btn btn-primary">Update Password</button>
            </div>
          </div>
        </div>
      )}

      {/* Support Modal */}
      {supportModalOpen && (
        <div className="modal-overlay" onClick={() => setSupportModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>MediUnify Fleet Support</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              For road accidents, patient unreachable, cold chain failure or lab specimen spills, contact support immediately.
            </p>
            <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', marginBottom: '20px' }}>
              <div><strong>Emergency Dispatch Hotline:</strong> 1800-419-6334 (Toll Free)</div>
              <div><strong>Mysuru Field Hub Lead:</strong> +91 821 2419988</div>
              <div><strong>Fleet Email:</strong> captains.mys@mediunify.com</div>
            </div>
            <button onClick={() => setSupportModalOpen(false)} className="btn btn-primary" style={{ width: '100%' }}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Terms Modal */}
      {termsModalOpen && (
        <div className="modal-overlay" onClick={() => setTermsModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>Terms & Operating Guidelines</h3>
            <div style={{ maxHeight: '240px', overflowY: 'auto', fontSize: '13px', color: 'var(--text-body)', lineHeight: 1.6, paddingRight: '6px', marginBottom: '16px' }}>
              <p style={{ marginBottom: '8px' }}>
                1. <strong>Patient Confidentiality</strong>: Never disclose patient identities, diagnoses or prescription details.
              </p>
              <p style={{ marginBottom: '8px' }}>
                2. <strong>Cold Chain Adherence</strong>: Insulin and temperature-sensitive diagnostic samples must remain strictly within the calibrated 2°C to 8°C thermal carry containers.
              </p>
              <p>
                3. <strong>Double OTP Verification</strong>: Handover of prescription drugs and biological samples must only occur after positive electronic OTP or digital signature.
              </p>
            </div>
            <button onClick={() => setTermsModalOpen(false)} className="btn btn-primary" style={{ width: '100%' }}>
              I Understand
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
