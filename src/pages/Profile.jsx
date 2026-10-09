import React, { useState, useEffect } from 'react';
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
  const { profile, captainType, updateProfile, logout } = useAuth();
  
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;
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
          background: '#FFFFFF',
          padding: isMobile ? '16px' : '22px 24px',
          boxShadow: 'var(--shadow-sm)',
          borderRadius: 'var(--radius-lg)'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Top row with Icon, Badge & Title */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: isMobile ? '12px' : '16px' }}>
            <div
              style={{
                width: isMobile ? '40px' : '44px',
                height: isMobile ? '40px' : '44px',
                borderRadius: '12px',
                background: isPharmacy ? '#E6F8F5' : '#EEF4FB',
                border: `1px solid ${isPharmacy ? '#99F6E4' : '#BFDBFE'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isPharmacy ? '#00A896' : '#002244',
                flexShrink: 0
              }}
            >
              <Award size={isMobile ? 20 : 24} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Status and Ref Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    background: '#ECFDF5',
                    color: '#065F46',
                    border: '1px solid #A7F3D0',
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '2.5px 8px',
                    borderRadius: '999px',
                    letterSpacing: '0.03em'
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
                  ACTIVE & VERIFIED
                </span>

                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>
                  Ref: <strong style={{ color: 'var(--text-heading)' }}>{profile.licenseNo}</strong>
                </span>
              </div>

              <h3
                style={{
                  fontSize: isMobile ? '15px' : '17px',
                  fontWeight: '800',
                  color: 'var(--text-heading)',
                  lineHeight: 1.35,
                  margin: '4px 0 0 0',
                  wordBreak: 'break-word'
                }}
              >
                {isPharmacy ? 'Drug Distribution & Courier Logistics Authorization' : 'NABL Certified Phlebotomist Credential'}
              </h3>
            </div>
          </div>

          {/* Description */}
          <p
            style={{
              fontSize: isMobile ? '12.5px' : '13px',
              color: 'var(--text-muted)',
              lineHeight: 1.55,
              margin: '2px 0 0 0'
            }}
          >
            {isPharmacy
              ? `Authorized for transport and doorstep handover of Schedule H & H1 medications under the National Pharmacy Field Logistics Guidelines. License Ref: ${profile.licenseNo}.`
              : `Certified Medical Laboratory Technologist & Venipuncture Specialist compliant with ISO 15189 / NABL requirements for biological specimen handling. License Ref: ${profile.licenseNo}.`}
          </p>

          {/* Structured Key Specs Grid for Phone & Desktop */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '8px',
              marginTop: '4px'
            }}
          >
            {isPharmacy ? (
              <>
                <div
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '8px 10px'
                  }}
                >
                  <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Vehicle
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-heading)', marginTop: '2px', wordBreak: 'break-word' }}>
                    {profile.vehicle}
                  </div>
                </div>

                <div
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '8px 10px'
                  }}
                >
                  <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Cold Bag ID
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: '#00A896', marginTop: '2px', whiteSpace: 'nowrap' }}>
                    CB-MYS-042
                  </div>
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '8px 10px'
                  }}
                >
                  <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Cold-Box Sensor
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: '#00A896', marginTop: '2px', whiteSpace: 'nowrap' }}>
                    {profile.coldBoxTemp || '3.6°C (Optimal)'}
                  </div>
                </div>

                <div
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '8px 10px'
                  }}
                >
                  <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Biohazard Kit
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-heading)', marginTop: '2px' }}>
                    Inspected & Verified
                  </div>
                </div>
              </>
            )}
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
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: isMobile ? '10px' : '16px',
              fontSize: '13px'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: isMobile ? '#F8FAFC' : 'transparent',
                padding: isMobile ? '10px 12px' : '0',
                borderRadius: isMobile ? '10px' : '0',
                border: isMobile ? '1px solid #E2E8F0' : 'none'
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: '#EEF4FB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Phone size={17} color="#002244" />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block', fontWeight: '600' }}>Mobile Number</span>
                <strong style={{ color: 'var(--text-heading)', fontSize: '13.5px', wordBreak: 'break-word' }}>{profile.phone}</strong>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: isMobile ? '#F8FAFC' : 'transparent',
                padding: isMobile ? '10px 12px' : '0',
                borderRadius: isMobile ? '10px' : '0',
                border: isMobile ? '1px solid #E2E8F0' : 'none'
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: '#EEF4FB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Mail size={17} color="#002244" />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block', fontWeight: '600' }}>Email Address</span>
                <strong style={{ color: 'var(--text-heading)', fontSize: '13px', wordBreak: 'break-all' }}>{profile.email}</strong>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: isMobile ? '#F8FAFC' : 'transparent',
                padding: isMobile ? '10px 12px' : '0',
                borderRadius: isMobile ? '10px' : '0',
                border: isMobile ? '1px solid #E2E8F0' : 'none'
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: '#EEF4FB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <MapPin size={17} color="#002244" />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block', fontWeight: '600' }}>Address & City</span>
                <strong style={{ color: 'var(--text-heading)', fontSize: '13px', wordBreak: 'break-word' }}>{profile.address}, {profile.city} ({profile.pincode})</strong>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: isMobile ? '#F8FAFC' : 'transparent',
                padding: isMobile ? '10px 12px' : '0',
                borderRadius: isMobile ? '10px' : '0',
                border: isMobile ? '1px solid #E2E8F0' : 'none'
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: '#E6F8F5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Bike size={17} color="#00A896" />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block', fontWeight: '600' }}>Field Vehicle</span>
                <strong style={{ color: 'var(--text-heading)', fontSize: '13px', wordBreak: 'break-word' }}>{profile.vehicle}</strong>
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
