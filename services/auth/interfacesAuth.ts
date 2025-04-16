export interface LoginRequest {
    cedula: string;
    contraseña: string;
}

export interface RegisterRequest {
    cedula: string;
    password: string;
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