import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Bike, 
  Calendar, 
  Award, 
  Edit3, 
  Camera, 
  Save, 
  CheckCircle2, 
  Pill, 
  Activity,
  Star,
  Lock,
  ThermometerSnowflake,
  LogOut
} from 'lucide-react';

import { useTasks } from '../context/TaskContext';

export default function Profile() {
  const navigate = useNavigate();
  const { profile, captainType, updateProfile, logout, deviceMode } = useAuth();
  const isMobile = deviceMode === 'mobile_frame';
  const { labTasks, pharmacyTasks } = useTasks();
  const isPharmacy = captainType === 'pharmacy';
  const tasks = isPharmacy ? pharmacyTasks : labTasks;
  const activeOrder = tasks.find(t => 
    t.status !== 'ASSIGNED' && 
    t.status !== 'COMPLETED' && 
    t.status !== 'CANCELLED'
  );

  const handleLogout = () => {
    if (activeOrder) {
      alert(`Cannot logout while Order #${activeOrder.id} is in progress.`);
      return;
    }
    if (window.confirm("Are you sure you want to log out of your Captain account?")) {
      logout();
      navigate('/login');
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name,
    phone: profile.phone,
    email: profile.email,
    address: profile.address,
    city: profile.city,
    vehicle: profile.vehicle
  });

  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Profile Header Card */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #002244 0%, #003366 100%)',
          color: 'white',
          padding: isMobile ? '16px' : '28px',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Top row: Avatar + Identity Details + Desktop Buttons */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px', flexWrap: isMobile ? 'nowrap' : 'wrap' }}>
            {/* Identity Group: Avatar + Details */}
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '18px', minWidth: 0, flex: 1 }}>
              {/* Avatar with photo update trigger */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  style={{
                    width: isMobile ? '74px' : '88px',
                    height: isMobile ? '74px' : '88px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid #00A896',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                    display: 'block'
                  }}
                />
                <button
                  onClick={() => alert("Photo update dialog simulated: Camera/Gallery upload.")}
                  title="Update profile photo"
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    background: '#00A896',
                    color: 'white',
                    border: '2px solid #002244',
                    borderRadius: '50%',
                    width: isMobile ? '26px' : '30px',
                    height: isMobile ? '26px' : '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                  }}
                >
                  <Camera size={isMobile ? 13 : 15} />
                </button>
              </div>

              {/* Name, Fleet Badge & ID */}
              <div style={{ minWidth: 0, flex: 1 }}>
                <h1
                  style={{
                    fontSize: isMobile ? '17.5px' : '22px',
                    fontWeight: '800',
                    color: '#FFFFFF',
                    lineHeight: 1.25,
                    margin: 0,
                    wordBreak: 'break-word'
                  }}
                >
                  {profile.name}
                </h1>

                {/* Fleet Badge on its own line */}
                <div style={{ marginTop: '5px' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: isPharmacy ? 'rgba(0,168,150,0.25)' : 'rgba(2,132,199,0.25)',
                      border: `1px solid ${isPharmacy ? 'rgba(0,196,159,0.45)' : 'rgba(56,189,248,0.45)'}`,
                      color: isPharmacy ? '#5EEAD4' : '#BAE6FD',
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {isPharmacy ? <Pill size={11} /> : <Activity size={11} />}
                    <span>{isPharmacy ? 'Pharmacy Fleet' : 'Diagnostic Lab Fleet'}</span>
                  </span>
                </div>

                <p style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '5px', lineHeight: 1.3, margin: '5px 0 0 0' }}>
                  ID: <strong style={{ color: '#E2E8F0' }}>{profile.id}</strong> • Joined: {profile.joinedDate}
                </p>
              </div>
            </div>

            {/* Desktop-only action buttons */}
            {!isMobile && (
              <div style={{ display: 'flex', gap: '8px', alignSelf: 'flex-start' }}>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn btn-outline"
                  style={{ background: isEditing ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', fontSize: '12.5px', padding: '8px 12px' }}
                >
                  <Edit3 size={14} />
                  <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                </button>

                <button
                  onClick={handleLogout}
                  style={{
                    background: 'rgba(239, 68, 68, 0.25)',
                    color: '#FECACA',
                    border: '1px solid rgba(239, 68, 68, 0.5)',
                    fontSize: '12.5px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: '700'
                  }}
                >
                  <LogOut size={14} />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>

          {/* Stats Bar / Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: isMobile ? '8px' : '14px',
              width: '100%',
              marginTop: '4px'
            }}
          >
            {/* Rating Card */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                padding: '9px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '9px'
              }}
            >
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '7px',
                  background: 'rgba(250, 204, 21, 0.15)',
                  border: '1px solid rgba(250, 204, 21, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Star size={15} fill="#FACC15" color="#FACC15" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#FFFFFF', lineHeight: 1.1 }}>
                  {profile.rating}
                </div>
                <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '2px' }}>
                  Rating
                </div>
              </div>
            </div>

            {/* Completed Trips Card */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                padding: '9px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '9px'
              }}
            >
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '7px',
                  background: 'rgba(0, 196, 159, 0.15)',
                  border: '1px solid rgba(0, 196, 159, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <CheckCircle2 size={15} color="#00C49F" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#FFFFFF', lineHeight: 1.1 }}>
                  {isPharmacy ? profile.totalDeliveries : profile.totalCollections}
                </div>
                <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '2px', whiteSpace: 'nowrap' }}>
                  Completed Trips
                </div>
              </div>
            </div>
          </div>

          {/* Mobile-only action buttons (full-width 2-column grid) */}
          {isMobile && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                width: '100%',
                marginTop: '2px'
              }}
            >
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn btn-outline"
                style={{
                  background: isEditing ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.25)',
                  fontSize: '12px',
                  fontWeight: '700',
                  padding: '9px 10px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Edit3 size={14} />
                <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
              </button>

              <button
                onClick={handleLogout}
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  color: '#FECACA',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  fontSize: '12px',
                  fontWeight: '700',
                  padding: '9px 10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <LogOut size={14} />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {savedMessage && (
        <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', padding: '12px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} color="#059669" />
          <span>Profile changes saved successfully to local state!</span>
        </div>
      )}

      {/* Role-Specific Professional Verification Badge Card */}
      <div
        className="card"
        style={{
          borderLeft: `5px solid ${isPharmacy ? '#00A896' : '#002244'}`,
          background: '#FFFFFF'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: isPharmacy ? '#E6F8F5' : '#EEF4FB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isPharmacy ? '#00A896' : '#002244', flexShrink: 0 }}>
            <Award size={22} />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-heading)' }}>
                {isPharmacy ? 'Drug Distribution & Courier Logistics Authorization' : 'NABL Certified Phlebotomist Credential'}
              </h3>
              <span style={{ background: '#ECFDF5', color: '#065F46', fontSize: '11px', fontWeight: '800', padding: '3px 8px', borderRadius: '4px' }}>
                ACTIVE & VERIFIED
              </span>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.5 }}>
              {isPharmacy
                ? `Authorized for transport and doorstep handover of Schedule H & H1 medications under the National Pharmacy Field Logistics Guidelines. License Ref: ${profile.licenseNo}.`
                : `Certified Medical Laboratory Technologist & Venipuncture Specialist compliant with ISO 15189 / NABL requirements for biological specimen handling. License Ref: ${profile.licenseNo}.`}
            </p>

            <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '12px', color: 'var(--text-heading)' }}>
              {isPharmacy ? (
                <>
                  <div>Vehicle: <strong>{profile.vehicle}</strong></div>
                  <div>Cold Bag ID: <strong>CB-MYS-042</strong></div>
                </>
              ) : (
                <>
                  <div>Cold-Box Temp Sensor: <strong>{profile.coldBoxTemp || '3.6°C (Optimal)'}</strong></div>
                  <div>Biohazard Kit: <strong>Inspected & Verified</strong></div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form (View or Edit mode) */}
      <div className="card">
        <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-heading)', marginBottom: '18px' }}>
          Personal & Contact Information
        </h3>

        {isEditing ? (
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-heading)', marginBottom: '4px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-heading)', marginBottom: '4px' }}>
                  Mobile Number
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-heading)', marginBottom: '4px' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-heading)', marginBottom: '4px' }}>
                  Operating City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div style={{ gridColumn: isMobile ? 'span 1' : 'span 2' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-heading)', marginBottom: '4px' }}>
                  Residential Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div style={{ gridColumn: isMobile ? 'span 1' : 'span 2' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-heading)', marginBottom: '4px' }}>
                  Assigned Fleet Vehicle & Registration
                </label>
                <input
                  type="text"
                  value={formData.vehicle}
                  onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: isMobile ? 'stretch' : 'flex-end', gap: '10px', flexDirection: isMobile ? 'column-reverse' : 'row' }}>
              <button type="button" onClick={() => setIsEditing(false)} className="btn btn-outline" style={{ justifyContent: 'center' }}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }}>
                <Save size={15} />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Phone size={16} color="#64748B" />
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>Mobile Number</span>
                <strong>{profile.phone}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail size={16} color="#64748B" />
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>Email Address</span>
                <strong>{profile.email}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={16} color="#64748B" />
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>Address & City</span>
                <strong>{profile.address}, {profile.city} ({profile.pincode})</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bike size={16} color="#64748B" />
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>Field Vehicle</span>
                <strong>{profile.vehicle}</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Account & Security Card with Logout */}
      <div className="card" style={{ border: '1px solid #FECACA', background: '#FFFDFD' }}>
        <div style={{ display: 'flex', alignItems: isMobile ? 'stretch' : 'center', justifyContent: 'space-between', flexDirection: isMobile ? 'column' : 'row', gap: '14px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#991B1B', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={16} color="#DC2626" />
              <span>Account & Session Security</span>
            </h3>
            <p style={{ fontSize: '12.5px', color: '#475569', marginTop: '4px' }}>
              Currently active as <strong>{isPharmacy ? 'Pharmacy Fleet Captain' : 'Diagnostic Lab Captain'}</strong> ({profile.name}).
            </p>
            <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
              To switch between roles, log out and choose the desired captain role on the sign-in screen.
            </p>
          </div>

          <button
            onClick={handleLogout}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              background: '#DC2626',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: '700',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(220, 38, 38, 0.25)',
              width: isMobile ? '100%' : 'auto'
            }}
          >
            <LogOut size={16} />
            <span>Log Out from Device</span>
          </button>
        </div>
      </div>
    </div>
  );
}
