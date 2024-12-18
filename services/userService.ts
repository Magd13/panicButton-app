import axios from './axiosClient';
import * as SecureStore from 'expo-secure-store';

// Interfaces
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

export interface UserData {
    id: number;
    cedula: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    contraseña?: string;
    fecha_registro?: string;
    fecha_nacimiento: string;
    contacto_emergencia1: string;
    contacto_emergencia2: string;
    tipo_sangre: string;
    foto_perfil?: string;
}

// Función auxiliar para comprimir imágenes base64
const compressImage = (base64Image: string) => {
    if (!base64Image) return '';
    // Limitar el tamaño para SecureStore
    return base64Image.length > 2048 ? base64Image.substring(0, 2048) : base64Image;
};

// Función para manejar el almacenamiento en SecureStore
const updateSecureStore = async (userData: UserData) => {
    try {
        const essentialData = {
            id: userData.id,
            cedula: userData.cedula,
            nombre: userData.nombre,
            apellido: userData.apellido,
            email: userData.email,
            telefono: userData.telefono,
            fecha_nacimiento: userData.fecha_nacimiento,
            contacto_emergencia1: userData.contacto_emergencia1,
            contacto_emergencia2: userData.contacto_emergencia2,
            tipo_sangre: userData.tipo_sangre,
            foto_perfil: userData.foto_perfil ? compressImage(userData.foto_perfil) : undefined
        };
        await SecureStore.setItemAsync('userData', JSON.stringify(essentialData));
    } catch (error) {
        console.error('Error al actualizar SecureStore:', error);
        throw new Error('Error al guardar los datos localmente');
    }
};

// Login
export const login = async (data: LoginRequest): Promise<boolean> => {
    try {
        const response = await axios.post<UserData>('/api/users/login', data);
        if (response.status === 200) {
            await updateSecureStore(response.data);
            return true;
        }
        return false;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data || 'Error en el inicio de sesión');
        }
        throw new Error('No se pudo conectar con el servidor');
    }
};

// Registro
export const register = async (data: RegisterRequest): Promise<UserData> => {
    try {
        const response = await axios.post<UserData>('/api/users/register', data);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Error al registrar usuario');
        }
        throw new Error('No se pudo conectar con el servidor');
    }
};

// Actualizar perfil
export const updateUserProfile = async (cedula: string, data: Partial<UserData>): Promise<UserData> => {
    try {
        // Preparar los datos para enviar
        const updateData = {
            nombre: data.nombre,
            apellido: data.apellido,
            email: data.email,
            telefono: data.telefono,
            contacto_emergencia1: data.contacto_emergencia1,
            contacto_emergencia2: data.contacto_emergencia2,
            tipo_sangre: data.tipo_sangre
        };

        // Solo incluir foto_perfil si se modificó
        if (data.foto_perfil) {
            updateData['foto_perfil'] = compressImage(data.foto_perfil);
        }

        console.log('Enviando actualización:', updateData);

        const response = await axios.put<UserData>(
            `/api/users/${cedula}`,
            updateData,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 15000 // 15 segundos
            }
        );
        
        console.log('Respuesta actualización:', response.data);

        // Actualizar SecureStore
        if (response.data) {
            await updateSecureStore(response.data);
        }
        
        return response.data;
    } catch (error: any) {
        console.error('Error detallado en updateUserProfile:', error);
        if (error.response) {
            throw new Error(`Error al actualizar el perfil: ${error.response.data.message || error.response.statusText}`);
        }
        throw new Error('No se pudo conectar con el servidor');
    }
};

// Obtener datos del usuario
export const getUserData = async (): Promise<UserData | null> => {
    try {
        const userData = await SecureStore.getItemAsync('userData');
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        return null;
    }
};

// Cerrar sesión
export const logout = async (): Promise<void> => {
    try {
        await SecureStore.deleteItemAsync('userData');
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        throw new Error('Error al cerrar sesión');
    }
};

// Obtener usuario por cédula
export const getUserByCedula = async (cedula: string): Promise<UserData> => {
    try {
        const response = await axios.get<UserData>(`/api/users/${cedula}`);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Error al obtener usuario');
        }
        throw new Error('No se pudo conectar con el servidor');
    }
};

// Eliminar cuenta
export const deleteAccount = async (id: number): Promise<boolean> => {
    try {
        await axios.delete(`/api/users/${id}`);
        await SecureStore.deleteItemAsync('userData');
        return true;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Error al eliminar la cuenta');
        }
        throw new Error('No se pudo conectar con el servidor');
    }
};