import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { SignOut, Package, MagnifyingGlass, MapTrifold, MapPinLine } from '@phosphor-icons/react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function CustomerDash() {
  const { user, logout } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const res = await api.get('/delivery');
        setDeliveries(res.data.data);
      } catch (err) {
        console.error('Failed to load my deliveries', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeliveries();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24">
       {/* Standard Minimal Navbar */}
       <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
           <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
             <div className="bg-sky-500 text-white rounded-md p-1">
               <Package size={18} weight="fill" />
             </div>
             RTDMS
           </div>
           
           <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-2 border-r border-slate-200 pr-4">
               <div className="h-8 w-8 bg-slate-100 border border-slate-200 text-slate-700 rounded-full flex items-center justify-center font-bold text-sm">
                 {user?.name?.charAt(0) || 'U'}
               </div>
               <span className="text-sm font-medium text-slate-700">{user?.name}</span>
             </div>
             <Button variant="ghost" onClick={handleLogout} className="text-slate-600 hover:text-red-700 hover:bg-red-50 text-sm font-medium h-9 px-3 transition-colors">
               Log out
             </Button>
           </div>
         </div>
       </nav>
      
      <main className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full pt-8 sm:pt-12">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">My Deliveries</h1>
            <p className="text-sm text-slate-500 mt-1">Track and manage your upcoming and past packages.</p>
          </div>
          <Link to="/track">
             <Button className="h-10 px-4 rounded-lg bg-sky-600 hover:bg-sky-700 text-white shadow-sm font-medium text-sm flex items-center gap-2 transition-colors">
               <MagnifyingGlass size={16} weight="bold" /> Track Open ID
             </Button>
          </Link>
        </div>

        {loading ? (
             <div className="flex justify-center items-center h-64">
               <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
             </div>
        ) : deliveries.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 py-16 text-center flex flex-col items-center">
            <div className="h-16 w-16 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center mb-4">
              <Package size={32} weight="duotone" className="text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No Deliveries Found</h3>
            <p className="text-slate-500 text-sm max-w-sm">You do not currently have any active or past deliveries in the RTDMS network.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {deliveries.map(delivery => (
              <div key={delivery._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
                 
                 <div className="p-5 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-white border border-slate-200 text-slate-500 rounded-lg flex items-center justify-center">
                        <Package size={20} weight="fill" />
                      </div>
                      <div>
                        <p className="text-xs font-mono font-medium text-slate-500 uppercase">ID: {delivery.trackingId}</p>
                        <p className="text-sm font-semibold text-slate-900">Parcel Tracking</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                      delivery.status === 'in_transit' ? 'bg-sky-50 text-sky-700 border border-sky-100/50' : 
                      delivery.status === 'delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/50' :
                      'bg-amber-50 text-amber-700 border border-amber-100/50'
                    }`}>
                      {delivery.status.replace('_', ' ')}
                    </span>
                 </div>
                 
                 <div className="p-5 sm:p-6 flex-1 space-y-6">
                    <div className="relative pl-7">
                      <div className="absolute left-[3px] top-1.5 w-2 h-2 rounded-full bg-slate-200 border border-slate-300"></div>
                      <div className="absolute left-[6px] top-4 bottom-[-24px] w-px bg-slate-200"></div>
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">Origin</p>
                      <p className="font-medium text-sm text-slate-800 leading-snug">{delivery.pickupLocation.address}</p>
                    </div>
                    <div className="relative pl-7">
                      <div className="absolute left-[3px] top-1.5 w-2 h-2 rounded-full bg-sky-500 shadow-sm shadow-sky-500/20"></div>
                      <p className="text-[11px] font-semibold text-sky-600 uppercase tracking-widest mb-0.5">Destination</p>
                      <p className="font-semibold text-base text-slate-900 leading-snug">{delivery.dropoffLocation.address}</p>
                    </div>
                 </div>

                 <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100">
                   <Link to={`/track/${delivery.trackingId}`} className="block">
                      <Button variant="outline" className="w-full h-10 rounded-lg font-medium bg-white text-slate-700 hover:bg-slate-50 border-slate-200 transition-colors shadow-sm text-sm">
                        <MapTrifold size={16} className="mr-2 text-slate-400" weight="bold" /> View Live Map
                      </Button>
                   </Link>
                 </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
