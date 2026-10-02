import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AppLayout from './layouts/AppLayout';

// Pages
import Splash from './pages/Splash';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import TaskDetails from './pages/TaskDetails';
import NavigationPage from './pages/Navigation';
import SampleCollection from './pages/SampleCollection';
import PharmacyPickup from './pages/PharmacyPickup';
import PharmacyDelivery from './pages/PharmacyDelivery';
import TaskHistory from './pages/TaskHistory';
import Earnings from './pages/Earnings';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import SettingsPage from './pages/Settings';

// Route Guard
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Authenticated Routes inside Master Layout */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tasks/:id" element={<TaskDetails />} />
          <Route path="/navigation" element={<NavigationPage />} />
          <Route path="/sample-collection" element={<SampleCollection />} />
          <Route path="/pharmacy-pickup" element={<PharmacyPickup />} />
          <Route path="/pharmacy-delivery" element={<PharmacyDelivery />} />
          <Route path="/task-history" element={<TaskHistory />} />
          <Route path="/earnings" element={<Earnings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
