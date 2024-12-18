// src/providers/alertContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AlertData {
  id: number;
  usuarioId: number;
  tipo_alert: string;
  mensaje: string;
  latitud: number;
  longitud: number;
  fecha_alerta: string;
  estado_alerta: boolean;
  foto_usuario: string;
}

interface AlertContextProps {
  alertData: AlertData | null;
  setAlertData: (alert: AlertData | null) => void;
  clearAlert: () => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alertData, setAlertData] = useState<AlertData | null>(null);

  const clearAlert = () => {
    setAlertData(null); 
  };

  return (
    <AlertContext.Provider value={{ alertData, setAlertData, clearAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextProps => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlertContext must be used within an AlertProvider');
  }
  return context;
};
