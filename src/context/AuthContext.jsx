import React, { createContext, useContext, useState, useEffect } from 'react';
import { CAPTAINS } from '../data/mockData';
import { soundEffects } from '../utils/audio';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Load saved state or default
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('mediunify_auth') === 'true';
  });

  const [captainType, setCaptainType] = useState(() => {
    return localStorage.getItem('mediunify_captain_type') || 'pharmacy';
  });

  const [dutyStatus, setDutyStatus] = useState(() => {
    return localStorage.getItem('mediunify_duty_status') || 'ONLINE';
  });

  const [deviceMode, setDeviceMode] = useState(() => {
    return localStorage.getItem('mediunify_device_mode') || 'responsive'; // 'responsive' | 'mobile_frame'
  });

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem(`mediunify_profile_${captainType}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return CAPTAINS[captainType];
      }
    }
    return CAPTAINS[captainType];
  });

  // Keep profile in sync when captainType changes
  useEffect(() => {
    const saved = localStorage.getItem(`mediunify_profile_${captainType}`);
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
        return;
      } catch (e) {}
    }
    setProfile(CAPTAINS[captainType]);
  }, [captainType]);

  const login = (type, credentials = {}) => {
    const selectedType = type || captainType;
    setCaptainType(selectedType);
    setIsAuthenticated(true);
    setDutyStatus('ONLINE');
    localStorage.setItem('mediunify_auth', 'true');
    localStorage.setItem('mediunify_captain_type', selectedType);
    localStorage.setItem('mediunify_duty_status', 'ONLINE');
    
    soundEffects.playSuccess();
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('mediunify_auth');
    soundEffects.playAlert();
  };

  const switchRole = (type) => {
    if (type !== 'pharmacy' && type !== 'lab') return;
    setCaptainType(type);
    localStorage.setItem('mediunify_captain_type', type);
    const loadedProfile = CAPTAINS[type];
    setProfile(loadedProfile);
    soundEffects.playAlert();
  };

  const toggleDutyStatus = () => {
    const nextStatus = dutyStatus === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
    setDutyStatus(nextStatus);
    localStorage.setItem('mediunify_duty_status', nextStatus);
    if (nextStatus === 'ONLINE') {
      soundEffects.playSuccess();
    } else {
      soundEffects.playAlert();
    }
  };

  const toggleDeviceMode = () => {
    const nextMode = deviceMode === 'responsive' ? 'mobile_frame' : 'responsive';
    setDeviceMode(nextMode);
    localStorage.setItem('mediunify_device_mode', nextMode);
  };

  const updateProfile = (updatedFields) => {
    setProfile(prev => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem(`mediunify_profile_${captainType}`, JSON.stringify(updated));
      return updated;
    });
    soundEffects.playSuccess();
  };

  const register = (formData) => {
    const newCaptainType = formData.captainType || 'pharmacy';
    const newProfile = {
      id: `CAP-${newCaptainType === 'pharmacy' ? 'PH' : 'LAB'}-${Math.floor(1000 + Math.random() * 9000)}`,
      type: newCaptainType,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      gender: formData.gender,
      dob: formData.dob,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      rating: 5.0,
      totalDeliveries: 0,
      totalCollections: 0,
      vehicle: formData.vehicle || 'Hero Electric Bike (KA-09-XX-0000)',
      verificationStatus: 'Under Instant Verification (Field Ready)',
      licenseNo: formData.licenseNo || 'VERIFIED-ID-9901',
      status: 'ONLINE',
      joinedDate: 'September 2026'
    };

    localStorage.setItem(`mediunify_profile_${newCaptainType}`, JSON.stringify(newProfile));
    setCaptainType(newCaptainType);
    setProfile(newProfile);
    soundEffects.playSuccess();
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        captainType,
        dutyStatus,
        profile,
        deviceMode,
        login,
        logout,
        switchRole,
        toggleDutyStatus,
        toggleDeviceMode,
        updateProfile,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
