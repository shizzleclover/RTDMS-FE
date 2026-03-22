import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user, loading } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (loading) return;

    let newSocket;

    if (user) {
      const token = localStorage.getItem('token');
      newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
        auth: { token },
        transports: ['websocket', 'polling']
      });

      newSocket.on('connect', () => {
        console.log(`Socket connected: ${newSocket.id}`);
      });

      newSocket.on('connect_error', (err) => {
        console.error('Socket connection error:', err.message);
      });

      setSocket(newSocket);
    }

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [user, loading]);

  // Separate function strictly for unauthenticated customers listening to tracking rooms
  const connectPublicSocket = () => {
    if (!socket) {
      const publicSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
        transports: ['websocket', 'polling']
      });
      return publicSocket;
    }
    return socket;
  };

  return (
    <SocketContext.Provider value={{ socket, connectPublicSocket }}>
      {children}
    </SocketContext.Provider>
  );
};
