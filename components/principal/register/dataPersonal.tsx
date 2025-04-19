import { Text, TextInput, View } from "react-native";
import React, { useState } from 'react';
import { validateCedula } from "../../../utils/validators";

interface ValidationErrors {
  nombre?: string;
  apellido?: string;
  cedula?: string;
  fecha_nacimiento?: string;
}

interface Props {
  formData: { nombre: string; apellido: string; cedula: string; fecha_nacimiento: string };
  setFormData: React.Dispatch<React.SetStateAction<{ nombre: string; apellido: string; cedula: string; fecha_nacimiento: string }>>;
  errors: ValidationErrors;
}

const RegisterStepOne = ({ formData, setFormData, errors }: Props) => {
  return (
    <View>
      <TextInput
        style={{
          backgroundColor: '#FFF',
          padding: 12,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: errors.nombre ? '#D8000C' : '#ccc',
          marginBottom: 8,
        }}
        placeholder="Nombre"
        value={formData.nombre}
        onChangeText={text => setFormData({ ...formData, nombre: text })}
      />
      {errors.nombre && <Text style={{ color: 'red' }}>{errors.nombre}</Text>}
      
      <TextInput
        style={{
          backgroundColor: '#FFF',
          padding: 12,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: errors.apellido ? '#D8000C' : '#ccc',
          marginBottom: 8,
        }}
        placeholder="Apellido"
        value={formData.apellido}
        onChangeText={text => setFormData({ ...formData, apellido: text })}
      />
      {errors.apellido && <Text style={{ color: 'red' }}>{errors.apellido}</Text>}
      
      <TextInput
        style={{
          backgroundColor: '#FFF',
          padding: 12,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: errors.cedula ? '#D8000C' : '#ccc',
          marginBottom: 8,
        }}
        placeholder="Cédula"
        keyboardType="numeric"
        maxLength={10}
        value={formData.cedula}
        onChangeText={text =>
          setFormData({ ...formData, cedula: text.replace(/[^0-9]/g, '') })
        }
      />
      {errors.cedula && <Text style={{ color: 'red' }}>{errors.cedula}</Text>}
      
      <TextInput
        style={{
          backgroundColor: '#FFF',
          padding: 12,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: errors.fecha_nacimiento ? '#D8000C' : '#ccc',
          marginBottom: 8,
        }}
        placeholder="Fecha de nacimiento (YYYY-MM-DD)"
        keyboardType="numeric"
        value={formData.fecha_nacimiento}
        onChangeText={text => {
          const numericText = text.replace(/[^0-9]/g, '');
          let formattedText = numericText;
          if (numericText.length > 4) {
            formattedText = `${numericText.slice(0, 4)}-${numericText.slice(4)}`;
          }
          if (numericText.length > 6) {
            formattedText = `${formattedText.slice(0, 7)}-${numericText.slice(6)}`;
          }
          setFormData({ ...formData, fecha_nacimiento: formattedText });
        }}
      />
      {errors.fecha_nacimiento && <Text style={{ color: 'red' }}>{errors.fecha_nacimiento}</Text>}
    </View>    
  )
}

export default RegisterStepOne