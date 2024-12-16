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
    }
}

export const login = async (data:LoginRequest): Promise<Boolean> => {
    try {
        console.log('Envio de front:',data)
        const response = await axios.post<UserResponse>('/api/users/login', data);
        console.log("Respuesta de login",response)
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
        console.log('Envio de front:', data);
        const response = await axios.post<UserResponse>('/api/users/register', data);
        console.log(response.data);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Error al registrar usuario');
        } else {
            throw new Error('No se pudo conectar con el servidor');
        }
    }
};
