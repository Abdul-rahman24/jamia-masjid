import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Clock, 
  ClipboardList,
  LogOut,
  Menu,
  X,
  Lock,
  Settings,
  Moon,
  Calendar
} from 'lucide-react';

export default function AdminLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('adminAuth') === 'true'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === '12345678') {
      sessionStorage.setItem('adminAuth', 'true');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-black text-center text-gray-900 mb-8">Admin Access</h2>
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold text-center mb-6">{error}</div>}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[var(--color-primary)]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[var(--color-primary)]"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-[var(--color-primary)] text-white font-bold py-3 rounded-xl hover:bg-emerald-600 transition-colors mt-6"
            >
              Login
            </button>
            <Link to="/" className="block text-center text-sm text-gray-500 mt-4 hover:text-[var(--color-primary)]">
              &larr; Back to Home
            </Link>
          </form>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard',     path: '/admin',              icon: <LayoutDashboard size={20} /> },
    { name: 'Prayer Times',  path: '/admin/prayers',      icon: <Clock size={20} /> },
    { name: 'Announcements', path: '/admin/announcements',icon: <ClipboardList size={20} /> },
    { name: 'Events',        path: '/admin/events',       icon: <Calendar size={20} /> },
    { name: 'Submissions',   path: '/admin/submissions',  icon: <ClipboardList size={20} /> },
    { name: 'Ramadan',       path: '/admin/ramadan',      icon: <Moon size={20} /> },
    { name: 'Site Config',   path: '/admin/settings',     icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 bg-gray-900 text-white w-64 z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex-shrink-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 bg-gray-950">
          <span className="font-bold text-lg text-white">Masjid Admin</span>
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <div className="py-4 px-3 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${
                location.pathname === item.path 
                  ? 'bg-[var(--color-primary)] text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
          
          <div className="pt-8 mt-8 border-t border-gray-800">
            <Link
              to="/"
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-3 rounded-md text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Exit Admin</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 sticky top-0">
          <div className="flex items-center">
            <button
              className="md:hidden text-gray-500 hover:text-gray-900 focus:outline-none mr-4"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800 truncate">
              {navItems.find(i => i.path === location.pathname)?.name || 'Admin'}
            </h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
