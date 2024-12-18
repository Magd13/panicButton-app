import axios from './axiosClient';
import * as SecureStore from 'expo-secure-store';

interface LoginRequest {
    cedula: string;
    contraseña: string;
}

interface RegisterRequest {
    cedula: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    contraseña: string;
}

interface UserResponse {
    user: {
        id: string;
        nombre: string;
        apellido: string;
        cedula: string;
        email: string;
        telefono: string;
        contraseña: string;
        fecha_registro: string;
        fecha_nacimiento: Date;
        contacto_emergencia1: string;
        contacto_emergencia2: string;
        tipo_sangre: string;
    }
}

export const login = async (data:LoginRequest): Promise<Boolean> => {
    try {
        const response = await axios.post<UserResponse>('/api/users/login', data);
        if (response.status === 200) {
            const user = response.data;
            await SecureStore.setItemAsync('userData', JSON.stringify(user));
            return true
        } else {
            return false
        }
    } catch (error:any) {
        if (error.response){
            throw new Error(error.respose.data || 'Error en el inicio de sesión');
        } else {
            throw new Error('No se pudo conectar con el servidor')
        }
    }
}

export const register = async (data: RegisterRequest): Promise<UserResponse> => {
    try {
        const response = await axios.post<UserResponse>('/api/users/register', data);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Error al registrar usuario');
        } else {
            throw new Error('No se pudo conectar con el servidor');
        }
    }
};
