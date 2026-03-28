import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Plus, MapPin, Package, Moped, ArrowRight, X } from '@phosphor-icons/react';
import api from '../../services/api';

export default function Deliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState(null);
  
  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer: '', pickupAddress: '', deliveryAddress: '', packageDescription: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [delRes, ridersRes, usersRes] = await Promise.all([
        api.get('/deliveries'),
        api.get('/users/riders'),
        api.get('/users')
      ]);
      setDeliveries(delRes.data.data);
      setRiders(ridersRes.data.data);
      if (usersRes?.data?.data) {
        setCustomers(usersRes.data.data.filter(u => u.role === 'customer'));
      }
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
      await api.put(`/deliveries/${deliveryId}/assign`, { riderId });
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
          <p className="text-sm text-slate-500 mt-1">Manage network dispatch and delivery agent assignments.</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="h-10 px-4 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-sm font-semibold shadow-sm transition-colors flex items-center gap-2">
          <Plus size={16} weight="bold" /> Create Delivery
        </Button>
      </div>

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           {/* Backdrop */}
           <div className="absolute inset-0 bg-slate-900/60" onClick={() => setIsCreateOpen(false)}></div>
           
           {/* Modal Model */}
           <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative z-10 overflow-hidden flex flex-col h-full max-h-[85vh]">
              <div className="p-5 px-6 border-b border-slate-200 flex items-center justify-between">
                 <h2 className="text-lg font-bold text-slate-900">New Delivery Manifest</h2>
                 <Button variant="ghost" size="icon" onClick={() => setIsCreateOpen(false)} className="h-8 w-8 text-slate-400 hover:text-slate-600 rounded-full">
                   <X size={20} weight="bold" />
                 </Button>
              </div>
              <div className="p-6 flex-1 overflow-y-auto space-y-5">
                 <div className="space-y-1.5">
                   <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Farmer</label>
                   <select 
                     className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                     value={formData.customer} onChange={e => setFormData({...formData, customer: e.target.value})}
                   >
                     <option value="" disabled>Select a farmer account...</option>
                     {customers.map(c => <option key={c._id} value={c._id}>{c.name} ({c.email})</option>)}
                   </select>
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Origin Address</label>
                   <input 
                     className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm shadow-sm placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                     placeholder="e.g. 12 Marina, Lagos" value={formData.pickupAddress} onChange={e => setFormData({...formData, pickupAddress: e.target.value})}
                   />
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Destination Address</label>
                   <input 
                     className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm shadow-sm placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                     placeholder="e.g. 45 Allen Avenue, Ikeja" value={formData.deliveryAddress} onChange={e => setFormData({...formData, deliveryAddress: e.target.value})}
                   />
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Package Manifest</label>
                   <textarea 
                     className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm shadow-sm placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                     placeholder="Tomatoes, yams, leafy greens..." rows="3"
                     value={formData.packageDescription} onChange={e => setFormData({...formData, packageDescription: e.target.value})}
                   />
                 </div>
              </div>
              <div className="p-5 px-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                 <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="h-10 px-5 text-sm bg-white shadow-sm font-semibold rounded-lg text-slate-600">Cancel</Button>
                 <Button 
                   onClick={async () => {
                     if(!formData.customer || !formData.pickupAddress || !formData.deliveryAddress || !formData.packageDescription) return alert("Fill all fields");
                     setSubmitLoading(true);
                     try {
                        // Dummy coords for demonstration
                        const payload = { ...formData, pickupCoords: {lat: 6.5, lng: 3.3}, deliveryCoords: {lat: 6.6, lng: 3.4} };
                        const res = await api.post('/deliveries', payload);
                        setDeliveries([res.data.data, ...deliveries]);
                        setIsCreateOpen(false);
                        setFormData({ customer: '', pickupAddress: '', deliveryAddress: '', packageDescription: '' });
                     } catch(err) { console.error('Create error', err); alert("Failed to create"); }
                     finally { setSubmitLoading(false); }
                   }}
                   disabled={submitLoading} className="h-10 px-5 text-sm bg-sky-600 hover:bg-sky-700 text-white shadow-sm font-semibold rounded-lg"
                 >
                   {submitLoading ? 'Creating...' : 'Finalize Dispatch'}
                 </Button>
              </div>
           </div>
        </div>
      )}

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
              <div className="col-span-3">Agent Assignment</div>
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
                    <p className="font-semibold text-sm text-slate-900 truncate" title={delivery.pickupLocation?.address || delivery.pickupAddress}>
                      {delivery.pickupLocation?.address || delivery.pickupAddress || 'Unknown Origin'}
                    </p>
                  </div>
                  
                  {/* Dropoff */}
                  <div className="col-span-3 w-full md:pr-4">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1 md:hidden">Dropoff</p>
                    <p className="font-semibold text-sm text-slate-900 truncate" title={delivery.dropoffLocation?.address || delivery.deliveryAddress}>
                      {delivery.dropoffLocation?.address || delivery.deliveryAddress || 'Unknown Destination'}
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
                        <span className="text-sm font-medium text-slate-700 truncate">{delivery.rider?.name || 'Agent Assigned'}</span>
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
