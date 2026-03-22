import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Package, Truck, ArrowRight, CheckCircle, Clock, MapPin } from '@phosphor-icons/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../../components/map/MapFix';

import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';

export default function TrackDelivery() {
  const { trackingId: routeParamId } = useParams();
  const [searchInput, setSearchInput] = useState(routeParamId || '');
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { connectPublicSocket } = useSocket();
  const [socketInstance, setSocketInstance] = useState(null);

  useEffect(() => {
    if (routeParamId) {
      handleTrack(routeParamId);
    }
    // eslint-disable-next-line
  }, [routeParamId]);

  useEffect(() => {
    if (!delivery) return;

    let s = socketInstance;
    if (!s) {
      s = connectPublicSocket();
      setSocketInstance(s);
    }

    const roomId = delivery._id;
    s.emit('tracking:join', roomId);

    const handleLocation = (data) => {
      setDelivery(prev => ({
        ...prev,
        currentLocation: {
          type: "Point",
          coordinates: [data.location.lng, data.location.lat]
        }
      }));
    };

    const handleStatus = (data) => {
      setDelivery(prev => ({ ...prev, status: data.status }));
    };

    s.on('tracking:update', handleLocation);
    s.on('delivery:statusChanged', handleStatus);

    return () => {
      s.off('tracking:update', handleLocation);
      s.off('delivery:statusChanged', handleStatus);
    };
  }, [delivery?._id]);

  const handleTrack = async (id = searchInput) => {
    if (!id) return;
    setLoading(true);
    setError('');
    setDelivery(null);
    try {
      const res = await api.get(`/delivery/track/${id}`);
      setDelivery(res.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Tracking ID not found in system.');
    } finally {
      setLoading(false);
    }
  };

  const mapCenter = delivery?.currentLocation?.coordinates?.length === 2 
    ? [delivery.currentLocation.coordinates[1], delivery.currentLocation.coordinates[0]] 
    : delivery?.pickupLocation?.coordinates?.length === 2
      ? [delivery.pickupLocation.coordinates[1], delivery.pickupLocation.coordinates[0]]
      : [6.5244, 3.3792]; 

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col text-slate-900 pb-24">
       <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
           <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
             <div className="bg-sky-500 text-white rounded-md p-1">
               <Package size={18} weight="fill" />
             </div>
             RTDMS Tracker
           </Link>
           {!routeParamId && (
             <Link to="/login">
               <Button variant="ghost" className="text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors h-9 px-4 rounded-md">
                 Log In
               </Button>
             </Link>
           )}
         </div>
       </nav>

       <main className="flex-1 px-4 sm:px-6 lg:px-8 flex flex-col items-center pt-12 sm:pt-16">
         <div className="w-full max-w-5xl space-y-10">
           
           <div className="text-center space-y-4 max-w-xl mx-auto">
             <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">Track Parcel</h1>
             <p className="text-base text-slate-500">Enter your tracking ID for live status and location data.</p>
             
             <div className="flex bg-white rounded-lg shadow-sm border border-slate-200 mt-6 h-12 overflow-hidden focus-within:ring-2 focus-within:ring-sky-500/20 focus-within:border-sky-500 transition-shadow">
               <div className="flex-1 flex items-center pl-4 bg-transparent">
                 <Input 
                   placeholder="e.g. TRK-ABC123XYZ" 
                   value={searchInput}
                   onChange={(e) => setSearchInput(e.target.value)}
                   className="flex-1 border-0 shadow-none focus-visible:ring-0 bg-transparent h-full px-2 text-sm sm:text-base font-mono uppercase text-slate-800 placeholder:text-slate-400"
                   onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                 />
               </div>
               <Button onClick={() => handleTrack()} disabled={loading} className="h-full px-6 rounded-none bg-sky-600 hover:bg-sky-700 text-white font-medium text-sm transition-colors border-l border-sky-700/50">
                 {loading ? <span className="animate-pulse">Locating...</span> : (
                   <span className="flex items-center gap-2">Track <ArrowRight size={16} weight="bold" /></span>
                 )}
               </Button>
             </div>
             {error && <div className="text-red-600 font-medium text-sm mt-3">{error}</div>}
           </div>

           {delivery && (
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-8 flex flex-col border-t-4 border-t-sky-500">
               <div className="grid grid-cols-1 lg:grid-cols-12 relative">
                 
                 {/* Details Pane */}
                 <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-white border-b lg:border-b-0 lg:border-r border-slate-200 z-10 h-full">
                   <div>
                     <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                       <div className={`h-12 w-12 rounded-lg flex items-center justify-center border ${
                         delivery.status === 'delivered' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
                         delivery.status === 'in_transit' ? 'bg-sky-50 border-sky-200 text-sky-600' :
                         'bg-amber-50 border-amber-200 text-amber-600'
                       }`}>
                         {delivery.status === 'delivered' ? <CheckCircle size={24} weight="fill" /> :
                          delivery.status === 'in_transit' ? <Truck size={24} weight="fill" /> :
                          <Clock size={24} weight="fill" />}
                       </div>
                       <div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Shipment Status</p>
                         <h2 className="text-xl font-bold text-slate-900">
                           {delivery.status === 'delivered' ? 'Delivered' :
                            delivery.status === 'in_transit' ? 'In Transit' : 'Pending Allocation'}
                         </h2>
                       </div>
                     </div>

                     <div className="space-y-6">
                        <div className="relative pl-7">
                          <div className="absolute left-[3px] top-1.5 w-2 h-2 rounded-full bg-slate-200 border border-slate-300"></div>
                          <div className="absolute left-[6px] top-4 bottom-[-24px] w-px bg-slate-200"></div>
                          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Origin</p>
                          <p className="font-semibold text-sm text-slate-700 leading-snug">{delivery.pickupLocation.address}</p>
                        </div>
                        <div className="relative pl-7">
                          <div className="absolute left-[3px] top-1.5 w-2 h-2 rounded-full bg-sky-500 shadow-sm shadow-sky-500/20"></div>
                          <p className="text-[11px] font-semibold text-sky-600 uppercase tracking-widest mb-1">Destination</p>
                          <p className="font-bold text-base text-slate-900 leading-snug">{delivery.dropoffLocation.address}</p>
                        </div>
                     </div>
                   </div>

                   <div className="mt-8 bg-slate-50 p-4 rounded-lg border border-slate-200">
                     <div className="flex flex-col gap-3">
                       <div className="flex justify-between items-center text-sm">
                         <span className="text-slate-500 font-medium">Tracking ID</span>
                         <span className="font-mono font-semibold text-slate-900 uppercase">{delivery.trackingId}</span>
                       </div>
                       <div className="flex justify-between items-center text-sm">
                         <span className="text-slate-500 font-medium">Assigned Rider</span>
                         <span className="font-semibold text-slate-900">{delivery.rider?.name || 'Pending'}</span>
                       </div>
                     </div>
                   </div>
                 </div>

                 {/* Map Pane */}
                 <div className="lg:col-span-7 h-[400px] lg:h-auto w-full bg-slate-100 relative z-0">
                   <MapContainer center={mapCenter} zoom={14} className="h-full w-full absolute inset-0 z-0">
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                      />
                      {delivery.status !== 'pending' && (
                        <Marker position={mapCenter}>
                          <Popup>
                            <div className="font-sans text-center">
                              <p className="text-sky-600 text-[10px] font-bold tracking-widest mb-0.5 uppercase">Live Position</p>
                              <p className="text-slate-900 font-semibold text-sm">{delivery.status === 'delivered' ? 'Dropped Off' : 'In Transit'}</p>
                            </div>
                          </Popup>
                        </Marker>
                      )}
                      {delivery.dropoffLocation?.coordinates && (
                         <Marker position={[delivery.dropoffLocation.coordinates[1], delivery.dropoffLocation.coordinates[0]]}>
                           <Popup><strong>Dropoff Location</strong><br/>{delivery.dropoffLocation.address}</Popup>
                         </Marker>
                      )}
                   </MapContainer>
                 </div>
               </div>
             </div>
           )}
         </div>
       </main>
    </div>
  );
}
