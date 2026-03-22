import React, { useEffect, useState } from 'react';
import { Package, Truck, Clock, CheckCircle, MapTrifold, ArrowRight } from '@phosphor-icons/react';
import { useSocket } from '../../context/SocketContext';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function Dashboard() {
  const { socket } = useSocket();
  const [stats, setStats] = useState({ total: 0, pending: 0, inTransit: 0, delivered: 0 });
  const [recentDeliveries, setRecentDeliveries] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/delivery');
        const deliveries = res.data.data;
        let pending = 0; let inTransit = 0; let delivered = 0;
        deliveries.forEach(d => {
          if (d.status === 'pending') pending++;
          if (d.status === 'picked_up' || d.status === 'in_transit') inTransit++;
          if (d.status === 'delivered') delivered++;
        });

        setStats({ total: deliveries.length, pending, inTransit, delivered });
        setRecentDeliveries(deliveries.slice(0, 5));
      } catch (err) {
        console.error("Failed to load delivery stats", err);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleStatus = (data) => {
      setRecentDeliveries(prev => prev.map(d => d._id === data.deliveryId ? { ...d, status: data.status } : d));
    };
    socket.on('delivery:statusChanged', handleStatus);
    return () => socket.off('delivery:statusChanged', handleStatus);
  }, [socket]);

  const statCards = [
    { title: 'Total Deliveries', value: stats.total, icon: <Package size={24} weight="duotone" className="text-sky-600" />, iconBg: 'bg-sky-50' },
    { title: 'Pending Assignment', value: stats.pending, icon: <Clock size={24} weight="duotone" className="text-amber-600" />, iconBg: 'bg-amber-50' },
    { title: 'In Transit', value: stats.inTransit, icon: <Truck size={24} weight="duotone" className="text-indigo-600" />, iconBg: 'bg-indigo-50' },
    { title: 'Successfully Delivered', value: stats.delivered, icon: <CheckCircle size={24} weight="duotone" className="text-emerald-600" />, iconBg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Overview</h1>
        <p className="text-sm text-slate-500 mt-1">High-level metrics for your logistics network.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center mb-4 ${stat.iconBg}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        <div className="lg:col-span-2">
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
               <h3 className="text-base font-semibold text-slate-900">Recent Deliveries</h3>
               <Link to="/admin/deliveries" className="text-sm font-medium text-sky-600 hover:text-sky-700 flex items-center gap-1 transition-colors">
                 View all <ArrowRight size={14} weight="bold" />
               </Link>
             </div>
             <div>
               {recentDeliveries.length === 0 ? (
                 <div className="p-8 text-center text-sm text-slate-500">No recent deliveries found.</div>
               ) : (
                 <div className="divide-y divide-slate-100 flex flex-col">
                   {recentDeliveries.map((delivery) => (
                     <div key={delivery._id} className="p-4 px-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50/50 transition-colors gap-4">
                       <div className="flex items-center gap-4">
                         <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                           <Package size={20} weight="fill" />
                         </div>
                         <div>
                           <p className="font-semibold text-sm text-slate-900 truncate max-w-[200px] md:max-w-[250px]">{delivery.dropoffLocation.address}</p>
                           <p className="text-xs text-slate-500 mt-0.5 font-medium font-mono uppercase">ID: {delivery.trackingId}</p>
                         </div>
                       </div>
                       <div className="text-left sm:text-right shrink-0">
                         <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                           delivery.status === 'delivered' ? 'bg-emerald-50 text-emerald-700' :
                           delivery.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                           'bg-sky-50 text-sky-700'
                         }`}>
                           {delivery.status.replace('_', ' ')}
                         </span>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
             </div>
           </div>
        </div>
        
        <div className="lg:col-span-1">
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col overflow-hidden">
             <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
               <h3 className="text-base font-semibold text-slate-900">Fleet Operations</h3>
             </div>
             <div className="flex-1 p-6 flex flex-col items-center justify-center text-center bg-slate-50 relative overflow-hidden group">
                {/* Minimal abstract map representation */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #94a3b8 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
                
                <div className="h-16 w-16 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center justify-center mb-5 relative z-10 text-sky-600 transition-transform group-hover:-translate-y-1">
                  <MapTrifold size={28} weight="duotone" />
                </div>
                <h4 className="text-base font-semibold text-slate-900 relative z-10">Live Global Map</h4>
                <p className="text-sm text-slate-500 relative z-10 mt-2 max-w-[200px] mb-6">Track your entire active fleet in real-time.</p>
                <Link to="/admin/map" className="relative z-10">
                   <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-semibold text-sm px-4 py-2 rounded-lg shadow-sm transition-colors">
                     Open Map
                   </button>
                </Link>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
