import React, { useEffect, useState } from 'react';
import { Users, Moped, MapPin, Truck } from '@phosphor-icons/react';
import api from '../../services/api';

export default function ManageRiders() {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    api.get('/users/riders')
      .then(res => setRiders(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center p-12">
      <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-end">
         <div>
           <h1 className="text-2xl font-bold tracking-tight text-slate-900">Fleet Network</h1>
           <p className="text-sm text-slate-500 mt-1">Manage active courier dispatchers and observe network capacity.</p>
         </div>
       </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
         {riders.map(r => (
           <div key={r._id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="h-12 w-12 bg-sky-50 border border-sky-100/50 text-sky-600 rounded-lg flex items-center justify-center">
                   <Moped size={24} weight="duotone" />
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100/50">
                  Active Driver
                </span>
              </div>
              
              <div className="mb-4">
                 <p className="font-semibold text-slate-900 truncate">{r.name}</p>
                 <p className="text-xs text-slate-500 font-medium truncate mt-0.5">{r.email}</p>
                 {r.phone && <p className="text-xs text-slate-500 font-mono mt-1">{r.phone}</p>}
              </div>

              <div className="mt-auto border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-500 font-medium">
                 <span className="flex items-center gap-1.5"><Truck size={14} weight="bold"/> Standard Class</span>
                 <span className="font-mono text-[11px] text-slate-400">ID: {r._id.substring(r._id.length - 6)}</span>
              </div>
           </div>
         ))}
       </div>
    </div>
  )
}
