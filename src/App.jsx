import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Landing from './features/landing/Landing';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import { useAuth } from './context/AuthContext';

import AdminLayout from './features/admin/AdminLayout';
import Dashboard from './features/admin/Dashboard';
import Deliveries from './features/admin/Deliveries';
import ManageRiders from './features/admin/ManageRiders';
import LiveMap from './components/map/LiveMap';
import RiderDashboard from './features/rider/RiderDashboard';

import CustomerDash from './features/customer/CustomerDash';
import TrackDelivery from './features/customer/TrackDelivery';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Redirect root to dashboard if already logged in
  const PublicRoute = ({ children }) => {
    if (user) {
      if (user.role === 'admin') return <Navigate to="/admin" replace />;
      if (user.role === 'rider') return <Navigate to="/rider" replace />;
      if (user.role === 'customer') return <Navigate to="/customer" replace />;
    }
    return children;
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/track" element={<TrackDelivery />} />
      <Route path="/track/:trackingId" element={<TrackDelivery />} />
      
      {/* Admin Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="deliveries" element={<Deliveries />} />
          <Route path="riders" element={<ManageRiders />} />
          <Route path="map" element={<div className="p-8 space-y-6"><h1 className="text-3xl font-extrabold tracking-tight">Fleet Map</h1><LiveMap /></div>} />
        </Route>
      </Route>

      {/* Rider Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['rider']} />}>
        <Route path="/rider" element={<RiderDashboard />} />
      </Route>

      {/* Customer Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
        <Route path="/customer/*" element={<CustomerDash />} />
      </Route>
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
