import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useState } from 'react';
import { router } from "expo-router";

interface ValidationErrors {
  nombre?: string;
  apellido?: string;
  cedula?: string;
  email?: string;
  telefono?: string;
  contraseña?: string;
}

interface RegisterData {
  nombre: string;
  apellido: string;
  cedula: string;
  email: string;
  telefono: string;
  contraseña: string;
  fecha_registro: string;
}

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    email: '',
    telefono: '',
    contraseña: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

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

  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;
    return passwordRegex.test(password);
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validación nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    // Validación apellido
    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es obligatorio';
    }

    // Validación cédula
    if (!formData.cedula) {
      newErrors.cedula = 'El número de cédula no puede estar vacío';
    } else if (!validateCedula(formData.cedula)) {
      newErrors.cedula = 'El número de cédula no es válido';
    }

    // Validación email
    if (!formData.email) {
      newErrors.email = 'El email es obligatorio';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'El email debe ser válido';
    }

    // Validación teléfono
    if (!formData.telefono) {
      newErrors.telefono = 'El teléfono es obligatorio';
    } else if (!/^\d{10}$/.test(formData.telefono)) {
      newErrors.telefono = 'El número de teléfono debe contener 10 dígitos';
    }

    // Validación contraseña
    if (!formData.contraseña) {
      newErrors.contraseña = 'La contraseña no puede estar vacía';
    } else if (!validatePassword(formData.contraseña)) {
      newErrors.contraseña = 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (validateForm()) {
      try {
        const registerData: RegisterData = {
          ...formData,
          fecha_registro: new Date().toISOString().split('T')[0]
        };
        
        // Aquí iría tu lógica de registro
        console.log('Datos de registro:', registerData);
        router.push('/login');
      } catch (error) {
        setErrors({
          email: 'Error al registrar el usuario'
        });
      }
    }
  };

  const renderError = (errorMessage: string) => (
    <View className="w-full bg-red-100 p-2 rounded-lg mb-2">
      <Text className="text-red-600 text-xs text-center">{errorMessage}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-gray-100"
    >
      <ScrollView className="flex-1">
        <View className="flex-1 px-6 py-8">
          <Text className="text-2xl font-bold text-center text-gray-800 mb-8">
            Crear Cuenta
          </Text>

          {/* Nombre */}
          <View className="mb-4">
            <TextInput
              className={`w-full bg-white py-3 px-4 rounded-lg border ${
                errors.nombre ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nombre"
              value={formData.nombre}
              onChangeText={(text) => setFormData({ ...formData, nombre: text })}
            />
            {errors.nombre && renderError(errors.nombre)}
          </View>

          {/* Apellido */}
          <View className="mb-4">
            <TextInput
              className={`w-full bg-white py-3 px-4 rounded-lg border ${
                errors.apellido ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Apellido"
              value={formData.apellido}
              onChangeText={(text) => setFormData({ ...formData, apellido: text })}
            />
            {errors.apellido && renderError(errors.apellido)}
          </View>

          {/* Cédula */}
          <View className="mb-4">
            <TextInput
              className={`w-full bg-white py-3 px-4 rounded-lg border ${
                errors.cedula ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Número de cédula"
              keyboardType="numeric"
              maxLength={10}
              value={formData.cedula}
              onChangeText={(text) => setFormData({ ...formData, cedula: text.replace(/[^0-9]/g, '') })}
            />
            {errors.cedula && renderError(errors.cedula)}
          </View>

          {/* Email */}
          <View className="mb-4">
            <TextInput
              className={`w-full bg-white py-3 px-4 rounded-lg border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
            />
            {errors.email && renderError(errors.email)}
          </View>

          {/* Teléfono */}
          <View className="mb-4">
            <TextInput
              className={`w-full bg-white py-3 px-4 rounded-lg border ${
                errors.telefono ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Teléfono"
              keyboardType="numeric"
              maxLength={10}
              value={formData.telefono}
              onChangeText={(text) => setFormData({ ...formData, telefono: text.replace(/[^0-9]/g, '') })}
            />
            {errors.telefono && renderError(errors.telefono)}
          </View>

          {/* Contraseña */}
          <View className="mb-6">
            <TextInput
              className={`w-full bg-white py-3 px-4 rounded-lg border ${
                errors.contraseña ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Contraseña"
              secureTextEntry
              value={formData.contraseña}
              onChangeText={(text) => setFormData({ ...formData, contraseña: text })}
            />
            {errors.contraseña && renderError(errors.contraseña)}
          </View>

          {/* Botón de registro */}
          <TouchableOpacity 
            className="w-full bg-[#0A3D62] py-3 rounded-lg mb-4"
            onPress={handleRegister}
          >
            <Text className="text-center text-white text-lg font-semibold">
              Registrarse
            </Text>
          </TouchableOpacity>

          {/* Link a Login */}
          <TouchableOpacity 
            onPress={() => router.push('/login')}
            className="mt-4"
          >
            <Text className="text-blue-600 text-sm text-center">
              ¿Ya tienes una cuenta? Inicia sesión
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}