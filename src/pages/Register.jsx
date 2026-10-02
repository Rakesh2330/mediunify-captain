import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Phone, 
  Mail, 
  Lock, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Camera, 
  CheckCircle2, 
  ArrowLeft,
  Pill,
  Activity,
  ShieldCheck
} from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '1996-05-15',
    gender: 'Male',
    address: '',
    city: 'Mysuru',
    state: 'Karnataka',
    pincode: '570001',
    idType: 'Driving License',
    idNumber: '',
    captainType: 'pharmacy'
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    register(formData);
    setIsSuccess(true);

    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  const handlePreFill = (type) => {
    if (type === 'pharmacy') {
      setFormData({
        name: 'Rohan Deshpande',
        phone: '+91 98860 41209',
        email: 'rohan.pharmacy@mediunify.com',
        password: 'password123',
        confirmPassword: 'password123',
        dob: '1997-11-20',
        gender: 'Male',
        address: '#19, 3rd Stage, Kuvempunagar',
        city: 'Mysuru',
        state: 'Karnataka',
        pincode: '570023',
        idType: 'Drug Logistics Certification & DL',
        idNumber: 'KA-09-2023-88410',
        captainType: 'pharmacy'
      });
    } else {
      setFormData({
        name: 'Asha M. Gowda (BMLT)',
        phone: '+91 97410 55190',
        email: 'asha.lab@mediunify.com',
        password: 'password123',
        confirmPassword: 'password123',
        dob: '1995-03-14',
        gender: 'Female',
        address: 'Flat 301, Orchid Residency, Vijayanagar',
        city: 'Mysuru',
        state: 'Karnataka',
        pincode: '570017',
        idType: 'NABL Certified Phlebotomy Reg',
        idNumber: 'NABL-BL-2022-7719',
        captainType: 'lab'
      });
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F4F7FB',
        padding: '32px 16px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          background: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          padding: '36px',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-card)'
        }}
      >
        {/* Top brand */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>
            <ArrowLeft size={16} />
            <span>Back to Login</span>
          </Link>

          <img src="/logo.png" alt="MediUnify" style={{ height: '34px' }} />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-heading)' }}>
            Captain Onboarding Registration
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Join the MediUnify verified field fleet. Quick digital onboarding with instant ID review.
          </p>
        </div>

        {/* Quick Demo Pre-fill */}
        <div style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: 'var(--radius-md)', marginBottom: '24px', border: '1px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#002244' }}>Demo Auto-fill:</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handlePreFill('pharmacy')}
              style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', color: '#065F46', cursor: 'pointer' }}
            >
              Fill Pharmacy Captain
            </button>
            <button
              type="button"
              onClick={() => handlePreFill('lab')}
              style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', color: '#0369A1', cursor: 'pointer' }}
            >
              Fill Lab Test Captain
            </button>
          </div>
        </div>

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '36px 16px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#DCFCE7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <CheckCircle2 size={36} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-heading)' }}>
              Registration Successful!
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '8px', maxWidth: '380px', margin: '8px auto 20px auto' }}>
              Your captain application has been registered with ID verification. Redirecting you to the login screen...
            </p>
            <button onClick={() => navigate('/login')} className="btn btn-primary">
              Go to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ padding: '10px 14px', background: '#FEE2E2', color: '#B91C1C', borderRadius: '8px', fontSize: '13px', fontWeight: '600', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            {/* Captain Type Selection */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-heading)', marginBottom: '8px' }}>
                Applying for Captain Role *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <label
                  style={{
                    border: formData.captainType === 'pharmacy' ? '2px solid #00A896' : '1px solid #E2E8F0',
                    background: formData.captainType === 'pharmacy' ? '#E6F8F5' : '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="captainType"
                    value="pharmacy"
                    checked={formData.captainType === 'pharmacy'}
                    onChange={handleChange}
                    style={{ accentColor: '#00A896' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', fontSize: '13px', color: '#002244' }}>
                      <Pill size={15} color="#00A896" />
                      <span>Pharmacy Captain</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                      Medicine pickup & doorstep delivery
                    </div>
                  </div>
                </label>

                <label
                  style={{
                    border: formData.captainType === 'lab' ? '2px solid #002244' : '1px solid #E2E8F0',
                    background: formData.captainType === 'lab' ? '#EEF4FB' : '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="captainType"
                    value="lab"
                    checked={formData.captainType === 'lab'}
                    onChange={handleChange}
                    style={{ accentColor: '#002244' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', fontSize: '13px', color: '#002244' }}>
                      <Activity size={15} color="#002244" />
                      <span>Lab Test Captain</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                      Diagnostic blood & sample collection
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Personal Details Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-heading)', marginBottom: '4px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Verma"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-heading)', marginBottom: '4px' }}>
                  Mobile Number (OTP linked) *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>
            </div>

            {/* Email & Date of Birth */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-heading)', marginBottom: '4px' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="captain@mediunify.com"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-heading)', marginBottom: '4px' }}>
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="dob"
                    required
                    value={formData.dob}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '10px 8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-heading)', marginBottom: '4px' }}>
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '10px 8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', background: 'white' }}
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Passwords */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-heading)', marginBottom: '4px' }}>
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-heading)', marginBottom: '4px' }}>
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>
            </div>

            {/* Address */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-heading)', marginBottom: '4px' }}>
                Full Residential Address *
              </label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                placeholder="Door No, Street Name, Area"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
              />
            </div>

            {/* City, State, Pincode */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-heading)', marginBottom: '4px' }}>
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-heading)', marginBottom: '4px' }}>
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-heading)', marginBottom: '4px' }}>
                  Pincode *
                </label>
                <input
                  type="text"
                  name="pincode"
                  required
                  value={formData.pincode}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>
            </div>

            {/* ID Verification Section */}
            <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '700', color: 'var(--text-heading)', marginBottom: '10px' }}>
                <ShieldCheck size={16} color="#00A896" />
                <span>Identity & Verification Information</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#64748B', marginBottom: '4px' }}>
                    Document Type
                  </label>
                  <input
                    type="text"
                    name="idType"
                    value={formData.idType}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#64748B', marginBottom: '4px' }}>
                    Document / Registration ID No.
                  </label>
                  <input
                    type="text"
                    name="idNumber"
                    required
                    value={formData.idNumber}
                    onChange={handleChange}
                    placeholder="e.g. DL-KA-2024-91823"
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginBottom: '14px' }}
            >
              REGISTER AS CAPTAIN
            </button>

            <div style={{ textAlign: 'center' }}>
              <Link
                to="/login"
                style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-primary-navy)', textDecoration: 'none' }}
              >
                Already have an account? Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
