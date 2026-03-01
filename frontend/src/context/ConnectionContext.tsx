import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConnectionInfo } from '../types';
import api from '../services/api';

interface ConnectionContextType {
  connection: ConnectionInfo;
  setConnection: (info: ConnectionInfo) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export const ConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connection, setConnection] = useState<ConnectionInfo>({
    isConnected: false,
    databaseName: null,
  });
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const checkSession = async () => {
    try {
      const res = await api.get('/session');

      setConnection({
        isConnected: true,
        databaseName: res.data.databaseName,
        sessionExpiry: res.data.expiry
      });

    } catch {
      setConnection({
        isConnected: false,
        databaseName: null
      });
    }

    setIsLoading(false);
  };

  checkSession();
}, []);

  const updateConnection = (info: ConnectionInfo) => {
    const newInfo = { ...info };
    if (info.isConnected && !info.sessionExpiry) {
      // Set expiry to 30 minutes from now if not already set
      newInfo.sessionExpiry = Date.now() + 30 * 60 * 1000;
    }
    
    setConnection(newInfo);
    if (newInfo.isConnected) {
      localStorage.setItem('mongodb_connection', JSON.stringify(newInfo));
    } else {
      localStorage.removeItem('mongodb_connection');
    }
  };

const logout = async () => {
  try {
    await api.post('/logout');

    setConnection({
      isConnected: false,
      databaseName: null,
    });
    window.location.reload();
  } catch (error) {
    console.error('Logout failed', error);
  }
};

  return (
    <ConnectionContext.Provider value={{ connection, setConnection: updateConnection, logout, isLoading }}>
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => {
  const context = useContext(ConnectionContext);
  if (context === undefined) {
    throw new Error('useConnection must be used within a ConnectionProvider');
  }
  return context;
};
