import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { PhpLogin } from './pages/PhpLogin';
import { PhpRegister } from './pages/PhpRegister';
import { Templates } from './pages/Templates';
import { Services } from './pages/Services';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Dashboard } from './pages/dashboard/Dashboard';
import { OrdersList } from './pages/dashboard/OrdersList';
import { OrderDetail } from './pages/dashboard/OrderDetail';
import { NewOrder } from './pages/dashboard/NewOrder';
import { Profile } from './pages/dashboard/Profile';
import { AccountSettings } from './pages/dashboard/AccountSettings';
import { Reports } from './pages/dashboard/Reports';
import { AuditTrail } from './pages/dashboard/AuditTrail';
import { Customers } from './pages/dashboard/Customers'; // ✅ Import the Customers component
import { usePhpAuthStore } from './store/phpAuthStore';

function App() {
  const { isAuthenticated, getSession } = usePhpAuthStore();

  useEffect(() => {
    getSession();
  }, [getSession]);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="php-login" element={<PhpLogin />} />
          <Route path="php-register" element={<PhpRegister />} />
          <Route path="templates" element={<Templates />} />
          <Route path="services" element={<Services />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* Protected dashboard routes */}
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? <DashboardLayout /> : <Navigate to="/php-login" replace />
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<OrdersList />} />
          <Route path="orders/:orderId" element={<OrderDetail />} />
          <Route path="new-order" element={<NewOrder />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<AccountSettings />} />
          <Route path="reports" element={<Reports />} />
          <Route path="audit" element={<AuditTrail />} />
          <Route path="customers" element={<Customers />} /> {/* ✅ Real Customers component */}
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
