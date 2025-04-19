import React, { useState } from 'react';
import { validateCellphone, validateEmail, validatePassword } from '../../../utils/validators';
import { TextInput,Text, View } from 'react-native';

interface ValidationErrors {
  email?: string;
  telefono?: string;
  password?: string;
  confirmPassword?: string;
}

interface Props {
  formData: { email: string; telefono: string; password: string; confirmPassword: string };
  setFormData: React.Dispatch<React.SetStateAction<{ email: string; telefono: string; password: string; confirmPassword: string }>>;
  errors: ValidationErrors;
}

const RegisterStepTwo = ({ formData, setFormData, errors }: Props) => {
  return (
    <View>        
      <TextInput
        style={{
          backgroundColor: '#FFF',
          padding: 12,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: errors.email ? '#D8000C' : '#ccc',
          marginBottom: 8,
        }}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={formData.email}
        onChangeText={text => setFormData({ ...formData, email: text })}
      />
      {errors.email && <Text style={{ color: 'red' }}>{errors.email}</Text>}
      <TextInput
         style={{
          backgroundColor: '#FFF',
          padding: 12,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: errors.telefono ? '#D8000C' : '#ccc',
          marginBottom: 8,
        }}

        placeholder="Telefono"
        keyboardType="phone-pad"
        autoCapitalize="none"
        value={formData.telefono}
        onChangeText={text => setFormData({ ...formData, telefono: text })}
      />
      {errors.telefono && <Text style={{ color: 'red' }}>{errors.telefono}</Text>}
      <TextInput
        style={{
          backgroundColor: '#FFF',
          padding: 12,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: errors.password ? '#D8000C' : '#ccc',
          marginBottom: 8,
        }}
        placeholder="Contraseña"
        secureTextEntry
        value={formData.password}
        onChangeText={text => setFormData({ ...formData, password: text })}
      />
      {errors.password && <Text style={{ color: 'red' }}>{errors.password}</Text>}
    
      <TextInput
        style={{
          backgroundColor: '#FFF',
          padding: 12,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: errors.confirmPassword ? '#D8000C' : '#ccc',
          marginBottom: 8,
        }}
        placeholder="Confirmar Contraseña"
        secureTextEntry
        value={formData.confirmPassword}
        onChangeText={text => setFormData({ ...formData, confirmPassword: text })}
      />
      {errors.confirmPassword && <Text style={{ color: 'red' }}>{errors.confirmPassword}</Text>}
    </View>
  )
}

export default RegisterStepTwo