import { Asset } from "expo-asset";
import { Link, Stack, router } from "expo-router";  // Añadimos router
import { View, Text, Image, TouchableOpacity, TextInput, Alert } from "react-native";
import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import {login } from '../services/authService'

// Interfaces para el manejo de errores
interface ValidationErrors {
  cedula?: string;
  contraseña?: string;
  general?: string;
}

export default function LoginScreen() {
  const [cedula, setCedula] = useState<string>('');
  const [contraseña, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Función para validar la cédula ecuatoriana
  const validateCedula = (cedula: string): boolean => {
    if (!/^\d{10}$/.test(cedula)) return false;

    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    const provincia = parseInt(cedula.substring(0, 2));
    
    if (provincia < 1 || provincia > 24) return false;

    const tercerDigito = parseInt(cedula.charAt(2));
    if (tercerDigito > 6) return false;

    let suma = 0;
    for (let i = 0; i < 9; i++) {
      let valor = parseInt(cedula.charAt(i)) * coeficientes[i];
      if (valor > 9) valor -= 9;
      suma += valor;
    }

    const ultimoDigito = parseInt(cedula.charAt(9));
    const digitoVerificador = (10 - (suma % 10)) % 10;

    return ultimoDigito === digitoVerificador;
  };

  const validatePassword = (contraseña: string): boolean => {
    return contraseña.length >= 6;
  };

  const handleLogin = async () => {
    const newErrors: ValidationErrors = {};
    
    if (!cedula.trim()) {
      newErrors.cedula = 'El número de cédula es obligatorio';
    }
    
    if (!contraseña.trim()) {
      newErrors.contraseña = 'La contraseña es obligatoria';
    }

    if (cedula.trim() && !validateCedula(cedula)) {
      newErrors.cedula = cedula.length !== 10 
        ? 'La cédula debe tener exactamente 10 dígitos'
        : 'El número de cédula ingresado no es válido';
    }

    if (contraseña.trim() && !validatePassword(contraseña)) {
      newErrors.contraseña = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      const loginData = { cedula, contraseña};
      const response = await login(loginData);
      router.push('/(home)');
    }catch {
      setErrors({cedula: 'El número de cédula o la contraseña son incorrectos'})
    }

  };

  const renderError = (errorMessage: string) => (
    <View className="w-full bg-red-100 p-2 rounded-lg mb-2">
      <Text className="text-red-600 text-sm text-center">{errorMessage}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100">
      <View className="flex-1 items-center justify-center px-6">
        {/* User Icon */}
        <View className="mb-8">
          <FontAwesome name="user-circle" size={80} color="#0A3D62" />
        </View>

        {/* General Error Message */}
        {errors.general && renderError(errors.general)}
        
        {/* Inputs */}
        <View className="w-full mb-4">
          <TextInput
            className={`w-full bg-white py-3 px-4 rounded-lg border ${
              errors.cedula ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ingrese su número de cédula"
            placeholderTextColor="#a1a1a1"
            keyboardType="numeric"
            maxLength={10}
            value={cedula}
            onChangeText={(text) => {
              setCedula(text.replace(/[^0-9]/g, ''));
              if (errors.cedula) {
                setErrors(prev => ({ ...prev, cedula: undefined }));
              }
            }}
          />
          {errors.cedula && renderError(errors.cedula)}
        </View>

        <View className="w-full mb-4">
          <TextInput
            className={`w-full bg-white py-3 px-4 rounded-lg border ${
              errors.contraseña ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Contraseña"
            placeholderTextColor="#a1a1a1"
            secureTextEntry
            value={contraseña}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.contraseña) {
                setErrors(prev => ({ ...prev, contraseña: undefined }));
              }
            }}
          />
          {errors.contraseña && renderError(errors.contraseña)}
        </View>

        {/* Login Button */}
        <TouchableOpacity 
          className="w-full py-3 rounded-lg mb-4"
          style={{ backgroundColor: '#0A3D62' }}
          onPress={handleLogin}
        >
          <Text className="text-center text-white text-lg font-semibold">
            Iniciar Sesión
          </Text>
        </TouchableOpacity>

        {/* Links */}
        <View className="flex-row justify-between w-full mt-2">
          <TouchableOpacity>
            <Text className="text-blue-600 text-sm">
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Link href="/Register" className="text-blue-600 text-sm">
              Crear cuenta
            </Link>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

