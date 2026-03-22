import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapFix';
import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';

export default function LiveMap() {
  const { socket } = useSocket();
  const [activeDeliveries, setActiveDeliveries] = useState({});
  const defaultCenter = [6.5244, 3.3792]; // Lagos, Nigeria default
  
  useEffect(() => {
    // Fetch all currently active deliveries to place initial markers
    const fetchActive = async () => {
      try {
        const res = await api.get('/delivery');
        const inTransit = res.data.data.filter(d => d.status === 'in_transit' && d.currentLocation?.coordinates?.length === 2);
        
        const mapData = {};
        inTransit.forEach(d => {
           mapData[d._id] = {
             lat: d.currentLocation.coordinates[1],
             lng: d.currentLocation.coordinates[0],
             riderName: d.rider?.name || 'Rider',
             trackingId: d.trackingId
           };
        });
        setActiveDeliveries(mapData);
      } catch (err) {
        console.error('Failed to fetch active deliveries', err);
      }
    };
    fetchActive();
  }, []);

  useEffect(() => {
    if (!socket) return;
    
    const handleLocationUpdate = (data) => {
      // payload: { deliveryId, location: { lat, lng }, timestamp }
      setActiveDeliveries(prev => ({
        ...prev,
        [data.deliveryId]: {
          ...prev[data.deliveryId],
          lat: data.location.lat,
          lng: data.location.lng,
          lastUpdated: data.timestamp
        }
      }));
    };

    socket.on('delivery:locationUpdate', handleLocationUpdate);
    
    return () => {
      socket.off('delivery:locationUpdate', handleLocationUpdate);
    };
  }, [socket]);

  return (
    <div className="h-[calc(100vh-12rem)] w-full rounded-3xl overflow-hidden border border-border shadow-sm">
      <MapContainer center={defaultCenter} zoom={12} className="h-full w-full z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {Object.entries(activeDeliveries).map(([deliveryId, data]) => (
          <Marker key={deliveryId} position={[data.lat, data.lng]}>
            <Popup>
              <div className="font-sans font-bold text-sm">
                <p className="text-primary tracking-wide text-xs mb-1">RIDER</p>
                <p>{data.riderName}</p>
                <p className="text-xs text-muted-foreground font-medium mt-1">ID: {data.trackingId}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
