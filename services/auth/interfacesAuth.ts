export interface LoginRequest {
    cedula: string;
    contraseña: string;
}

export interface RegisterRequest {
    nombre: string;
    apellido: string;
    cedula: string;
    fecha_nacimiento: string;
    email: string;
    telefono: string;
    password: string;
    fecha_registro: string;
    contacto_emergencia: string;
    tipo_sangre: string;
    foto_perfil: string | null;
}

export interface UserResponse {
    access_token: string;
    payload: {
        id: string;
        nombre: string;
        apellido: string;
        cedula: string;
        email: string;
        telefono: string;
        password: string;
        fecha_registro: string;
        fecha_nacimiento: Date;
        contacto_emergencia: string;
        tipo_sangre: string;
    }
}