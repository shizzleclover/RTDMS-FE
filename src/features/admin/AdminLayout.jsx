import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SquaresFour, Package, Users, SignOut, MapTrifold, Briefcase, List, X } from '@phosphor-icons/react';
import { Button } from '../../components/ui/button';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Overview', path: '/admin', icon: <SquaresFour size={20} />, exact: true },
    { name: 'Deliveries', path: '/admin/deliveries', icon: <Package size={20} /> },
    { name: 'Fleet Network', path: '/admin/riders', icon: <Users size={20} /> },
    { name: 'Live Map', path: '/admin/map', icon: <MapTrifold size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col z-20 hidden lg:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="flex items-center gap-2.5 font-bold text-[17px] tracking-tight text-slate-900">
            <div className="bg-sky-500 text-white rounded-md p-1.5 shadow-sm">
              <Package size={18} weight="bold" />
            </div>
            RTDMS
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-5 px-4 flex flex-col gap-1.5">
          <div className="px-2 mb-2 text-xs font-semibold text-slate-400 hidden sm:block">MAIN MENU</div>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-[15px] transition-colors ${
                  isActive 
                    ? 'bg-slate-100 text-slate-900 font-semibold' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {React.cloneElement(item.icon, { weight: "regular", className: "text-slate-500" })}
              {item.name}
            </NavLink>
          ))}
        </div>

        <div className="p-4 border-t border-slate-200">
           <div className="flex items-center gap-3 px-2 py-2 mb-3">
              <div className="h-9 w-9 bg-slate-100 border border-slate-200 text-slate-600 rounded-full flex items-center justify-center font-bold text-sm">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-slate-900">{user?.name || 'Administrator'}</p>
                <p className="text-xs text-slate-500 truncate">Admin Workspace</p>
              </div>
           </div>
           <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-sm font-medium rounded-lg h-10 px-3">
              <SignOut size={18} className="mr-2" /> Sign Out
           </Button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Sidebar drawer */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl">
             <div className="absolute top-4 right-4 z-10">
               <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-500 hover:bg-slate-100 h-9 w-9 rounded-full">
                 <X size={20} weight="bold" />
               </Button>
             </div>
             
             <div className="h-16 flex items-center px-6 border-b border-slate-200">
               <div className="flex items-center gap-2.5 font-bold text-[17px] tracking-tight text-slate-900">
                 <div className="bg-sky-500 text-white rounded-md p-1.5 shadow-sm">
                   <Package size={18} weight="bold" />
                 </div>
                 RTDMS
               </div>
             </div>
             
             <div className="flex-1 overflow-y-auto py-5 px-4 flex flex-col gap-1.5">
               <div className="px-2 mb-2 text-[11px] font-bold tracking-wider text-slate-400">NAVIGATION</div>
               {navItems.map((item) => (
                 <NavLink
                   key={item.name}
                   to={item.path}
                   end={item.exact}
                   onClick={() => setIsMobileMenuOpen(false)}
                   className={({ isActive }) =>
                     `flex items-center gap-3 px-3 py-3 rounded-lg font-medium text-[15px] transition-colors ${
                       isActive 
                         ? 'bg-slate-100 text-slate-900 font-semibold' 
                         : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                     }`
                   }
                 >
                   {React.cloneElement(item.icon, { weight: "regular", className: "text-slate-500" })}
                   {item.name}
                 </NavLink>
               ))}
             </div>

             <div className="p-4 border-t border-slate-200 bg-slate-50">
               <div className="flex items-center gap-3 px-2 py-2 mb-3">
                  <div className="h-9 w-9 bg-white border border-slate-200 text-slate-600 rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                    {user?.name?.charAt(0) || 'A'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate text-slate-900">{user?.name || 'Administrator'}</p>
                    <p className="text-xs text-slate-500 truncate">Admin Workspace</p>
                  </div>
               </div>
               <Button onClick={handleLogout} className="w-full justify-start bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 shadow-sm text-sm font-medium rounded-lg h-10 px-3">
                  <SignOut size={18} className="mr-2 text-slate-400" /> Sign Out
               </Button>
             </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">
        
        {/* Mobile Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:hidden z-20">
          <div className="flex items-center gap-1">
             <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)} className="mr-1 text-slate-600 hover:bg-slate-100 rounded-md">
               <List size={24} />
             </Button>
             <div className="flex items-center gap-2 text-slate-900 font-bold text-[17px]">
               <div className="h-7 w-7 bg-sky-500 text-white rounded flex items-center justify-center shadow-sm">
                 <Package size={15} weight="bold" />
               </div>
               RTDMS
             </div>
          </div>
          <div className="flex items-center">
             <div className="h-8 w-8 bg-slate-100 border border-slate-200 text-slate-600 rounded-full flex items-center justify-center font-bold text-sm mr-3">
               {user?.name?.charAt(0) || 'A'}
             </div>
             <Button variant="ghost" size="icon" onClick={handleLogout} className="h-9 w-9 rounded-full text-slate-500 hover:bg-slate-100">
               <SignOut size={20} />
             </Button>
          </div>
        </header>

        {/* Header Ribbon for desktop */}
        <header className="h-16 bg-white border-b border-slate-200 hidden lg:flex items-center px-8 z-10 shrink-0">
           <div className="flex items-center gap-2 text-sm text-slate-500">
             <Briefcase size={16} /> Workspace <span className="text-slate-300">/</span> <span className="font-medium text-slate-900">Admin</span>
           </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-8 lg:p-10">
          <div className="max-w-6xl w-full mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
