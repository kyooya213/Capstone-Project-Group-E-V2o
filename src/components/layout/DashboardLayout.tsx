import React, { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  FileText, 
  Users, 
  Settings, 
  Bell, 
  ChevronDown, 
  Menu, 
  X,
  User,
  BarChart3,
  Shield,
  Server
} from 'lucide-react';
import { usePhpAuthStore } from '../../store/phpAuthStore';
import { cn } from '../../lib/utils';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        'flex items-center px-4 py-3 text-sm font-medium rounded-md mb-1',
        isActive
          ? 'bg-blue-700 text-white'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      )}
      onClick={onClick}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </Link>
  );
};

export const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, isAuthenticated } = usePhpAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/php-login" replace />;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const customerNavItems = [
    { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/dashboard/orders', icon: <ShoppingBag size={20} />, label: 'My Orders' },
    { to: '/dashboard/new-order', icon: <FileText size={20} />, label: 'New Order' },
    { to: '/dashboard/profile', icon: <User size={20} />, label: 'Profile' },
    { to: '/dashboard/settings', icon: <Settings size={20} />, label: 'Account Settings' },
  ];

  const adminNavItems = [
    { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/dashboard/orders', icon: <ShoppingBag size={20} />, label: 'All Orders' },
    { to: '/dashboard/customers', icon: <Users size={20} />, label: 'Customers' },
    { to: '/dashboard/reports', icon: <BarChart3 size={20} />, label: 'Reports' },
    { to: '/dashboard/audit', icon: <Shield size={20} />, label: 'Audit Trail' },
    { to: '/dashboard/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  const navItems = user?.role === 'customer' ? customerNavItems : adminNavItems;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-gray-600 bg-opacity-50 transition-opacity md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out md:relative md:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-5 border-b">
            <Link to="/" className="flex items-center text-xl font-bold text-blue-700">
              TarpPrint
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                <Server size={12} className="inline" />
              </span>
            </Link>
            <button
              className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              onClick={toggleSidebar}
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavItem
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  onClick={() => setIsSidebarOpen(false)}
                />
              ))}
            </nav>
          </div>
          
          <div className="p-4 border-t">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
                <Users size={20} className="text-blue-700" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 flex items-center">
                  {user?.role}
                  <Server size={12} className="ml-1" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <button
              className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              onClick={toggleSidebar}
            >
              <Menu size={20} />
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                PHP/XAMPP Backend
              </div>
              
              <button className="relative p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                <Bell size={20} />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              </button>
              
              <div className="relative">
                <button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <span className="text-gray-700">{user?.name}</span>
                  <ChevronDown size={16} className="ml-1 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};