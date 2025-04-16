import React, { createContext, useState } from 'react';

export interface RegisterUser {
  nombre: string;
  apellido: string;
  cedula: string;
  email: string;
  telefono: string;
  contrasena: string;
  fecha_registro: string;
  fecha_nacimiento: string;
  contacto_emergencia1: string;
  contacto_emergencia2: string;
  tipo_sangre: string;
  foto_perfil: string | null;

}

interface RegisterContextProps {
  registerUser: RegisterUser;
  setRegisterUser: React.Dispatch<React.SetStateAction<RegisterUser>>;
}

export const RegisterContext = createContext<RegisterContextProps | null>(null);

export function RegisterProvider({children}:{children:React.ReactNode}){
  const [registerUser, setRegisterUser] = useState<RegisterUser>({
    nombre: '',
    apellido: '',
    cedula: '',
    email: '',
    telefono: '',
    contrasena: '',
    fecha_registro: '',
    fecha_nacimiento: '',
    contacto_emergencia1: '',
    contacto_emergencia2: '',
    tipo_sangre: '',
    foto_perfil: '',
  });
  return (
    <RegisterContext.Provider value={{registerUser, setRegisterUser}}>
      {children}
    </RegisterContext.Provider>
  );
}