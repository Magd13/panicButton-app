import axios from './axiosClient';
import * as SecureStore from 'expo-secure-store';
import * as Location from 'expo-location';

// Interfaces para las alertas
interface AlertRequest {
    usuarioId: number;
    tipo_alert: "Emergencia" | "Precaución";
    mensaje?: string;
    latitud: number;
    longitud: number;
    fecha_alerta?: string;
}

export interface Alert {
    id: number;
    usuarioId: number;
    tipo_alert: "Emergencia" | "Precaución";
    mensaje: string;
    latitud: number;
    longitud: number;
    fecha_alerta: string;
}

// Obtener usuario actual del SecureStore
const getCurrentUser = async () => {
    const userData = await SecureStore.getItemAsync('userData');
    if (!userData) throw new Error('No hay usuario autenticado');
    return JSON.parse(userData);
};

// Crear una nueva alerta
export const createAlert = async (data: AlertRequest): Promise<Alert> => {
    try {
        const response = await axios.post<Alert>('/api/alerts/register', data);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Error al crear la alerta');
        } else {
            throw new Error('No se pudo conectar con el servidor');
        }
    }
};

// Obtener todas las alertas (para el feed general)
export const getAllAlerts = async (): Promise<Alert[]> => {
    try {
        const response = await axios.get<Alert[]>('/api/alerts/');
        return response.data.sort((a, b) => 
            new Date(b.fecha_alerta).getTime() - new Date(a.fecha_alerta).getTime()
        );
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Error al obtener las alertas');
        } else {
            throw new Error('No se pudo conectar con el servidor');
        }
    }
};

// Obtener una alerta específica
export const getAlertById = async (id: number): Promise<Alert> => {
    try {
        const response = await axios.get<Alert>(`/api/alerts/${id}`);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Error al obtener la alerta');
        } else {
            throw new Error('No se pudo conectar con el servidor');
        }
    }
};

// Obtener alertas del usuario actual
export const getUserAlerts = async (): Promise<Alert[]> => {
    try {
        const user = await getCurrentUser();
        const response = await axios.get<Alert[]>(`/api/alerts/user/${user.id}`);
        return response.data.sort((a, b) => 
            new Date(b.fecha_alerta).getTime() - new Date(a.fecha_alerta).getTime()
        );
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Error al obtener las alertas del usuario');
        } else {
            throw new Error('No se pudo conectar con el servidor');
        }
    }
};

// Actualizar una alerta
export const updateAlert = async (id: number, data: Partial<AlertRequest>): Promise<Alert> => {
    try {
        const response = await axios.put<Alert>(`/api/alerts/${id}`, data);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Error al actualizar la alerta');
        } else {
            throw new Error('No se pudo conectar con el servidor');
        }
    }
};

// Eliminar una alerta
export const deleteAlert = async (id: number): Promise<boolean> => {
    try {
        await axios.delete(`/api/alerts/${id}`);
        return true;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Error al eliminar la alerta');
        } else {
            throw new Error('No se pudo conectar con el servidor');
        }
    }
};

// Obtener ubicación actual
const getCurrentLocation = async (): Promise<{ latitude: number; longitude: number }> => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        throw new Error('Se requiere permiso para acceder a la ubicación');
    }

    const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
    });

    return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
    };
};

// Crear una alerta de emergencia con la ubicación actual
export const createEmergencyAlert = async (mensaje?: string): Promise<Alert> => {
    try {
        const user = await getCurrentUser();
        const location = await getCurrentLocation();

        const alertData: AlertRequest = {
            usuarioId: user.id,
            tipo_alert: "Emergencia",
            mensaje: mensaje || "¡Emergencia!",
            latitud: location.latitude,
            longitud: location.longitude
        };

        return await createAlert(alertData);
    } catch (error: any) {
        throw new Error('Error al crear alerta de emergencia: ' + error.message);
    }
};

// Obtener alertas cercanas
export const getNearbyAlerts = async (radio: number = 5): Promise<Alert[]> => {
    try {
        const location = await getCurrentLocation();
        const allAlerts = await getAllAlerts();
        
        // Filtrar alertas dentro del radio (en kilómetros)
        return allAlerts.filter(alerta => {
            const distancia = calcularDistancia(
                location.latitude,
                location.longitude,
                alerta.latitud,
                alerta.longitud
            );
            return distancia <= radio;
        });
    } catch (error: any) {
        throw new Error('Error al obtener alertas cercanas: ' + error.message);
    }
};

// Función auxiliar para calcular distancia entre coordenadas (fórmula de Haversine)
const calcularDistancia = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
};