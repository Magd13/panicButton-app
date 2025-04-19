export interface StepOneData {
  nombre: string;
  apellido: string;
  cedula: string;
  fecha_nacimiento: string;
}

export interface StepOneErrors {
  nombre?: string;
  apellido?: string;
  cedula?: string;
  fecha_nacimiento?: string;
}

export interface StepTwoData {
  email: string;
  telefono: string;
  password: string;
  confirmPassword: string
}

export interface StepTwoErrors {
  email?: string;
  telefono?: string;
  password?: string;
  confirmPassword?: string;
}

export interface StepThreeData {
  fecha_registro: string;
  contacto_emergencia: string;
  tipo_sangre: string;
  foto_perfil: string | null;
}

export interface StepThreeErrors {
  fecha_registro?: string;
  contacto_emergencia?: string;
  tipo_sangre?: string;
  foto_perfil?: string | null;
}