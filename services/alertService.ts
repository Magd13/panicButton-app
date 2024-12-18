import { Double } from 'react-native/Libraries/Types/CodegenTypes';
import axios from './axiosClient';
import * as SecureStore from 'expo-secure-store';

export interface RegisterRequest {
    usuarioId: number;
    tipo_alert: string;
    mensaje: string;
    latitud: Double;
    longitud: Double;
    fecha_alerta: string;
    estado_alerta: boolean;
    foto_usuario:string;
}

export interface AlertResponse {
    id:number;
    usuarioId: number;
    tipo_alert:string;
    mensaje:string;
    latitud:Double;
    longitud:Double;
    fecha_alerta:string;
    estado_alerta:boolean;
    foto_usuario:string;
}

export const register = async (data: RegisterRequest): Promise<AlertResponse> => {
    try {
        const response = await axios.post<AlertResponse>('/api/alerts/register',data);
        if(response.status===201){
            console.log('Alerta posteada exitosamente');
            return response.data
        } else {
            throw new Error('Error al registrar la alerta');
        }
    }catch(error:any){
        if (error.response) {
            throw new Error(error.response.data.message || 'Error al registrar alerta');
        } else {
            throw new Error('No se pudo conectar con el servidor');
        }
    }
}

export const cambiarEstado = async (data: AlertResponse): Promise<Boolean> => {
    try {
        const response = await axios.put(`/api/alerts/${data.id}`, {
            estado_alerta: false,
        })
        if (response.status === 200) {
            console.log('Estado de la alerta actualizado con éxito');
            await SecureStore.deleteItemAsync('alertActual');
            return true;
        } else {
            console.error('Error al actualizar el estado de la alerta:', response.data);
            return false;
        }
    } catch (error) {
        console.error('Error al enviar la solicitud PUT:', error);
        return false;
    }
};