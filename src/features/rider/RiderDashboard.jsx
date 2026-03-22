import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { Button } from '../../components/ui/button';
import { SignOut, Crosshair, MapPin, Package, CheckCircle, NavigationArrow, List, X, Moped } from '@phosphor-icons/react';
import api from '../../services/api';

export default function RiderDashboard() {
  const { user, logout } = useAuth();
  const { socket } = useSocket();
  const [task, setTask] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchMyTask();
    // eslint-disable-next-line
  }, []);

  const fetchMyTask = async () => {
    try {
      const res = await api.get('/deliveries/rider-deliveries');
      const mine = res.data.data.filter(d => 
        d.rider?._id === user._id && d.status !== 'delivered'
      );
      if (mine.length > 0) {
        setTask(mine[0]); 
      } else {
        setTask(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      await api.put(`/deliveries/${task._id}/status`, { status: newStatus });
      setTask({ ...task, status: newStatus });
      
      if(newStatus === 'delivered' && tracking) {
        toggleTracking();
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const toggleTracking = () => {
    if (tracking) {
      navigator.geolocation.clearWatch(watchId);
      setTracking(false);
      setWatchId(null);
    } else {
      if ('geolocation' in navigator) {
        const id = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            if (socket && task) {
               socket.emit('rider:updateLocation', {
                 deliveryId: task._id,
                 lat: latitude,
                 lng: longitude
               });
            }
          },
          (error) => console.error(error),
          { enableHighAccuracy: true, maximumAge: 0 }
        );
        setWatchId(id);
        setTracking(true);
      } else {
        alert('Geolocation is not supported by your device.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24">
      {/* Rider Mobile Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
         <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between">
           <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
             <div className="bg-sky-500 text-white rounded-md p-1">
               <Package size={18} weight="fill" />
             </div>
             RTDMS Rider
           </div>
           
           <div className="flex items-center gap-2">
             <span className="text-sm font-medium text-slate-600 hidden sm:inline mr-2">{user?.name}</span>
             <Button variant="ghost" size="icon" onClick={logout} className="text-slate-500 hover:text-red-700 hover:bg-red-50 h-9 w-9 rounded-md transition-colors">
               <SignOut size={18} weight="bold" />
             </Button>
           </div>
         </div>
       </nav>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex sm:hidden">
          <div className="fixed inset-0 bg-slate-900/60" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-[280px] w-full bg-white shadow-xl">
             <div className="absolute top-4 right-3 z-10">
               <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-500 h-8 w-8 rounded-full">
                 <X size={20} weight="bold" />
               </Button>
             </div>
             
             <div className="h-16 flex items-center px-5 border-b border-slate-200">
               <div className="flex items-center gap-2.5 font-bold text-[17px] tracking-tight text-slate-900">
                 <div className="bg-sky-500 text-white rounded-md p-1.5 shadow-sm"><Package size={18} weight="bold" /></div>
                 Rider Portal
               </div>
             </div>
             
             <div className="flex-1 overflow-y-auto py-5 px-3 flex flex-col gap-1.5">
               <div className="px-2 mb-2 text-[11px] font-bold tracking-wider text-slate-400">OPERATIONS</div>
               <div onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-lg text-[15px] bg-slate-100 text-slate-900 font-semibold cursor-pointer">
                  <Moped size={20} className="text-slate-500" /> Task Manifest
               </div>
             </div>

             <div className="p-4 border-t border-slate-200 bg-slate-50">
               <div className="flex items-center gap-3 px-2 py-2 mb-3">
                  <div className="h-9 w-9 bg-white border border-slate-200 text-slate-600 rounded-full flex items-center justify-center font-bold text-sm shadow-sm">{user?.name?.charAt(0) || 'R'}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate text-slate-900">{user?.name || 'Rider'}</p>
                    <p className="text-xs text-slate-500 truncate">Driver Identity</p>
                  </div>
               </div>
               <Button onClick={logout} className="w-full justify-start bg-white text-red-600 hover:bg-red-50 hover:text-red-700 border border-slate-200 shadow-sm text-sm font-medium rounded-lg h-10 px-3">
                  <SignOut size={18} className="mr-2 text-red-400" /> End Shift (Log Out)
               </Button>
             </div>
          </div>
        </div>
      )}

      <main className="px-4 max-w-xl mx-auto w-full pt-6 sm:pt-10">
        
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
           <div>
             <h2 className="text-2xl font-bold tracking-tight text-slate-900">Task Manifest</h2>
             <p className="text-sm text-slate-500 mt-1">Hello, {user.name}. Manage your delivery.</p>
           </div>
           {!task && (
             <Button onClick={fetchMyTask} variant="outline" className="h-9 text-sm font-medium">
               Refresh
             </Button>
           )}
        </div>

        {!task ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-10 text-center flex flex-col items-center mt-8">
            <div className="h-14 w-14 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center mb-4">
               <Package size={28} weight="duotone" className="text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No Active Assignments</h3>
            <p className="text-slate-500 text-sm max-w-[250px]">Stand by for dispatch. Routes assigned to you will appear here.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-4">
               
            <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50/50">
              <div className="flex justify-between items-center mb-6">
                 <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                   task.status === 'in_transit' ? 'bg-sky-50 text-sky-700 border border-sky-100/50' : 'bg-amber-50 text-amber-700 border border-amber-100/50'
                 }`}>
                   {task.status.replace('_', ' ')}
                 </span>
                 <span className="text-[11px] font-mono font-medium text-slate-500 uppercase">ID: {task.trackingId}</span>
              </div>
              
              <div className="relative pl-7 space-y-6">
                 <div className="absolute left-[3px] top-1.5 w-2 h-2 rounded-full bg-slate-200 border border-slate-300 z-10"></div>
                 <div className="absolute left-[6px] top-4 bottom-[-24px] w-px bg-slate-200 z-0"></div>
                 
                 <div className="relative">
                   <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">Pickup Location</p>
                   <p className="font-semibold text-base text-slate-800 leading-snug">{task.pickupLocation?.address || task.pickupAddress || 'Unknown Origin'}</p>
                 </div>
                 
                 <div className="relative">
                   <div className="absolute -left-[25px] top-1.5 w-2 h-2 rounded-full bg-sky-500 shadow-sm shadow-sky-500/20 z-10"></div>
                   <p className="text-[11px] font-semibold text-sky-600 uppercase tracking-widest mb-0.5">Dropoff Target</p>
                   <p className="font-bold text-xl text-slate-900 leading-snug">{task.dropoffLocation?.address || task.deliveryAddress || 'Unknown Destination'}</p>
                 </div>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex flex-col gap-3">
              {task.status === 'picked_up' && (
                <Button 
                  onClick={() => updateStatus('in_transit')}
                  className="w-full h-12 rounded-lg font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-sm transition-colors text-sm"
                >
                  Confirm Pickup / Start Route
                </Button>
              )}
              {task.status === 'in_transit' && (
                <>
                  <Button 
                    onClick={toggleTracking}
                    variant={tracking ? "destructive" : "default"}
                    className={`w-full h-12 rounded-lg font-semibold text-sm shadow-sm transition-colors flex items-center justify-center gap-2 ${
                      tracking ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {tracking ? (
                      <><Crosshair size={18} className="animate-spin-slow" weight="bold" /> Stop GPS Broadcast</>
                    ) : (
                      <><NavigationArrow size={18} weight="fill" /> Broadcast Live GPS</>
                    )}
                  </Button>
                  <Button 
                    onClick={() => updateStatus('delivered')}
                    variant="outline"
                    className="w-full h-12 rounded-lg font-semibold text-sm border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={20} weight="fill" />
                    Complete Delivery
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
