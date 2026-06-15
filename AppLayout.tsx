import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, CheckSquare, User as UserIcon, LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import clsx from 'clsx';

export default function AppLayout() {
  const { user, logout, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center dark:bg-gray-900"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Profile', href: '/profile', icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 flex overflow-hidden relative">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={clsx(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white/5 backdrop-blur-2xl border-r border-white/5 transform transition-transform duration-300 ease-in-out md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 flex-shrink-0 items-center px-6 border-b border-white/5 gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-teal-400 rounded-lg flex items-center justify-center shadow-lg">
            <CheckSquare className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">TaskMaster</span>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden ml-auto text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex flex-col overflow-y-auto h-[calc(100vh-4rem)]">
          <nav className="flex-1 space-y-1 px-4 py-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={clsx(
                    isActive
                      ? 'bg-white/10 text-white rounded-xl'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 rounded-xl',
                    'group flex items-center px-4 py-3 text-sm font-medium transition-all'
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={clsx(
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-white',
                      'mr-3 h-5 w-5 flex-shrink-0 transition-colors'
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-white/5 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-semibold text-teal-400 italic">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-slate-500">Standard User</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 text-slate-500 hover:text-red-400 transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-col flex-1 z-10 md:pl-64 h-full relative">
        <header className="h-16 px-4 md:px-8 border-b border-white/5 flex flex-shrink-0 items-center justify-between bg-white/5 backdrop-blur-md">
          <button
            type="button"
            className="text-slate-400 hover:text-white md:hidden mr-4"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex flex-1 justify-end items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-slate-400 hover:text-white transition-colors"
                title="Toggle visual style (Optional)"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
