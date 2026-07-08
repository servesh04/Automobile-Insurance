import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './routes/PrivateRoute'

import Home from './pages/public/Home'
import Login from './pages/public/Login'
import Register from './pages/public/Register'
import ForgotPassword from './pages/public/ForgotPassword'
import ResetPassword from './pages/public/ResetPassword'
import MyPolicy from './pages/customer/MyPolicy'
import MyClaims from './pages/customer/MyClaims'
import MyProfile from './pages/customer/MyProfile'
import EditProfile from './pages/customer/EditProfile'
import ApplyPolicy from './pages/customer/ApplyPolicy'
import FileClaim from './pages/customer/FileClaim'
import Dashboard from './pages/officer/Dashboard'
import Customers from './pages/officer/Customers'
import CustomerDetail from './pages/officer/CustomerDetail'
import Vehicles from './pages/officer/Vehicles'
import VehicleDetail from './pages/officer/VehicleDetail'
import Policies from './pages/officer/Policies'
import PolicyDetail from './pages/officer/PolicyDetail'
import Claims from './pages/officer/Claims'
import ClaimDetail from './pages/officer/ClaimDetail'

import { NotificationProvider } from './context/NotificationContext'

const STAFF = ['Admin', 'Agent']
const ALL = ['Admin', 'Agent', 'Customer']

export default function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <Routes>
          {/* public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* customer */}
          <Route path="/customer/my-policy" element={<PrivateRoute requiredRoles={ALL}><MyPolicy /></PrivateRoute>} />
          <Route path="/customer/my-claims" element={<PrivateRoute requiredRoles={ALL}><MyClaims /></PrivateRoute>} />
          <Route path="/customer/profile" element={<PrivateRoute requiredRoles={ALL}><MyProfile /></PrivateRoute>} />
          <Route path="/customer/profile/edit" element={<PrivateRoute requiredRoles={ALL}><EditProfile /></PrivateRoute>} />
          <Route path="/customer/apply" element={<PrivateRoute requiredRoles={ALL}><ApplyPolicy /></PrivateRoute>} />
          <Route path="/customer/file-claim" element={<PrivateRoute requiredRoles={ALL}><FileClaim /></PrivateRoute>} />

          {/* officer */}
          <Route path="/officer/dashboard" element={<PrivateRoute requiredRoles={STAFF}><Dashboard /></PrivateRoute>} />
          <Route path="/officer/customers" element={<PrivateRoute requiredRoles={STAFF}><Customers /></PrivateRoute>} />
          <Route path="/officer/customers/:id" element={<PrivateRoute requiredRoles={STAFF}><CustomerDetail /></PrivateRoute>} />
          <Route path="/officer/vehicles" element={<PrivateRoute requiredRoles={STAFF}><Vehicles /></PrivateRoute>} />
          <Route path="/officer/vehicles/:id" element={<PrivateRoute requiredRoles={STAFF}><VehicleDetail /></PrivateRoute>} />
          <Route path="/officer/policies" element={<PrivateRoute requiredRoles={STAFF}><Policies /></PrivateRoute>} />
          <Route path="/officer/policies/:id" element={<PrivateRoute requiredRoles={STAFF}><PolicyDetail /></PrivateRoute>} />
          <Route path="/officer/claims" element={<PrivateRoute requiredRoles={STAFF}><Claims /></PrivateRoute>} />
          <Route path="/officer/claims/:id" element={<PrivateRoute requiredRoles={STAFF}><ClaimDetail /></PrivateRoute>} />

          <Route path="/unauthorized" element={<div style={{ textAlign: 'center', padding: '80px', fontFamily: 'DM Sans,sans-serif' }}><h2>Access denied</h2><a href="/" style={{ color: '#A63D2F' }}>Go home</a></div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </NotificationProvider>
  )
}