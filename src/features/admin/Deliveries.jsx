import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Plus, MapPin, Package, Moped, ArrowRight } from '@phosphor-icons/react';
import api from '../../services/api';

export default function Deliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [delRes, ridersRes] = await Promise.all([
        api.get('/delivery'),
        api.get('/users/riders')
      ]);
      setDeliveries(delRes.data.data);
      setRiders(ridersRes.data.data);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  const assignRider = async (deliveryId, riderId) => {
    if (!riderId) return;
    setAssigningId(deliveryId);
    try {
      await api.put(`/delivery/${deliveryId}/assign`, { riderId });
      setDeliveries(prev => prev.map(d => 
        d._id === deliveryId ? { ...d, status: 'picked_up', rider: riders.find(r => r._id === riderId) } : d
      ));
    } catch (err) {
      console.error('Assignment failed', err);
    } finally {
      setAssigningId(null);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center p-12">
       <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Delivery Tasks</h1>
          <p className="text-sm text-slate-500 mt-1">Manage network dispatch and rider assignments.</p>
        </div>
        <Button className="h-10 px-4 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-sm font-semibold shadow-sm transition-colors flex items-center gap-2">
          <Plus size={16} weight="bold" /> Create Delivery
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {deliveries.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
             <div className="h-12 w-12 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center mb-4 border border-slate-200">
               <Package size={24} weight="duotone" />
             </div>
             <p className="text-slate-900 font-semibold mb-1">No active deliveries</p>
             <p className="text-sm text-slate-500">There are currently no deliveries in the system constraints.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {/* Table Header Equivalent */}
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 px-6 bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <div className="col-span-1">ID</div>
              <div className="col-span-3">Pickup</div>
              <div className="col-span-3">Dropoff</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-3">Rider Assignment</div>
            </div>

            {deliveries.map((delivery) => (
              <div key={delivery._id} className="p-4 px-6 flex flex-col md:grid md:grid-cols-12 gap-4 items-start md:items-center hover:bg-slate-50/50 transition-colors">
                  
                  {/* Tracking ID */}
                  <div className="col-span-1 flex items-center gap-3 w-full md:w-auto">
                    <div className="h-8 w-8 bg-slate-100 rounded flex items-center justify-center text-slate-400 shrink-0">
                      <Package size={16} weight="fill" />
                    </div>
                    <p className="text-xs font-mono font-medium text-slate-600 truncate md:hidden">
                      {delivery.trackingId}
                    </p>
                  </div>

                  {/* Desktop Only Tracking ID col-span */}
                  <div className="hidden md:block col-span-1">
                    <span className="text-xs font-mono font-medium text-slate-600 truncate block w-full" title={delivery.trackingId}>
                       {delivery.trackingId.substring(0, 8)}...
                    </span>
                  </div>

                  {/* Pickup */}
                  <div className="col-span-3 w-full md:pr-4">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1 md:hidden">Pickup</p>
                    <p className="font-semibold text-sm text-slate-900 truncate" title={delivery.pickupLocation.address}>
                      {delivery.pickupLocation.address}
                    </p>
                  </div>
                  
                  {/* Dropoff */}
                  <div className="col-span-3 w-full md:pr-4">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1 md:hidden">Dropoff</p>
                    <p className="font-semibold text-sm text-slate-900 truncate" title={delivery.dropoffLocation.address}>
                      {delivery.dropoffLocation.address}
                    </p>
                  </div>
                  
                  {/* Status */}
                  <div className="col-span-2 w-full">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1 md:hidden">Status</p>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                      delivery.status === 'delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/50' :
                      delivery.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-100/50' :
                      'bg-sky-50 text-sky-700 border border-sky-100/50'
                    }`}>
                      {delivery.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Assignment */}
                  <div className="col-span-2 md:col-span-3 w-full mt-2 md:mt-0">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 md:hidden">Assignment</p>
                    {delivery.status === 'pending' ? (
                      <select 
                        className="w-full h-9 px-3 rounded-md border border-slate-200 bg-white text-slate-900 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 cursor-pointer"
                        onChange={(e) => {
                          const rId = e.target.value;
                          if(rId) assignRider(delivery._id, rId);
                        }}
                        defaultValue=""
                        disabled={assigningId === delivery._id}
                      >
                        <option value="" disabled>Unassigned (Click to assign)</option>
                        {riders.map(r => (
                          <option key={r._id} value={r._id}>Available: {r.name}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 bg-slate-100 text-slate-500 rounded-md flex items-center justify-center">
                          <Moped size={14} weight="fill" />
                        </div>
                        <span className="text-sm font-medium text-slate-700 truncate">{delivery.rider?.name || 'Rider Assigned'}</span>
                      </div>
                    )}
                  </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
