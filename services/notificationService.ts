// notificationService.ts
import axios from './axiosClient';
import { Alert } from './alertService'; // Importa la interfaz Alert de tu alertService

// Interfaces para el servicio de notificaciones
export interface Notificacion {
  id: number;
  tipo: "informativa" | "alerta" | "emergencia";
  fecha: string;
  hora: string;
  titulo: string;
  mensaje: string;
  estado: "leida" | "no_leida";
}

// Función para convertir una alerta en notificación
const convertirAlertaANotificacion = (alerta: Alert): Notificacion => {
  const fecha = new Date(alerta.fecha_alerta);
  
  return {
    id: alerta.id,
    tipo: alerta.tipo_alert === "Emergencia" ? "emergencia" : "alerta",
    fecha: fecha.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }),
    hora: fecha.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    titulo: `Alerta de ${alerta.tipo_alert}`,
    mensaje: alerta.mensaje || `Se ha reportado una ${alerta.tipo_alert.toLowerCase()} en la zona`,
    estado: "no_leida"
  };
};

// Obtener todas las notificaciones
export const getAllNotifications = async (): Promise<Notificacion[]> => {
  try {
    const response = await axios.get<Alert[]>('/api/alerts/');
    return response.data.map(convertirAlertaANotificacion);
  } catch (error: any) {
    throw new Error('Error al obtener las notificaciones');
  }
};