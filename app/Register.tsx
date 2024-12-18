import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Button, Image, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { router } from "expo-router";
import { register } from "../services/authService";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

interface ValidationErrors {
  nombre?: string;
  apellido?: string;
  cedula?: string;
  email?: string;
  telefono?: string;
  contraseña?: string;
  confirmarContraseña?: string;
  fecha_registro?: string;
  fecha_nacimiento?: string;
  contacto_emergencia1?: string;
  contacto_emergencia2?: string;
  tipo_sangre?: string;
  foto_perfil?: string | null;
}

interface RegisterData {
  nombre: string;
  apellido: string;
  cedula: string;
  email: string;
  telefono: string;
  contraseña: string;
  fecha_registro: string;
  fecha_nacimiento: string;
  contacto_emergencia1: string;
  contacto_emergencia2: string;
  tipo_sangre: string;
  foto_perfil: string | null;
}

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    email: '',
    telefono: '',
    contraseña: '',
    confirmarContraseña:'',
    fecha_nacimiento: '',
    contacto_emergencia1: '',
    contacto_emergencia2: '',
    tipo_sangre: '',
    foto_perfil: "",
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

    // Validación de confirmación de contraseña
    if (formData.contraseña !== formData.confirmarContraseña) {
      newErrors.confirmarContraseña = 'Las contraseñas no coinciden';
    }

    // Validación para la fecha de nacimiento
    if (!formData.fecha_nacimiento) {
      newErrors.fecha_nacimiento = 'La fecha de nacimiento es obligatoria';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.fecha_nacimiento)) {
      newErrors.fecha_nacimiento = 'La fecha de nacimiento debe tener el formato YYYY-MM-DD';
    }

    // Validación para contactos de emergencia
    if (!formData.contacto_emergencia1) {
      newErrors.contacto_emergencia1 = 'El contacto de emergencia 1 es obligatorio';
    } else if (!/^\d{10}$/.test(formData.contacto_emergencia1)) {
      newErrors.contacto_emergencia1 = 'El número debe contener 10 dígitos';
    }
    if (!formData.contacto_emergencia2) {
      newErrors.contacto_emergencia2 = 'El contacto de emergencia 2 es obligatorio';
    } else if (!/^\d{10}$/.test(formData.contacto_emergencia2)) {
      newErrors.contacto_emergencia2 = 'El número debe contener 10 dígitos';
    }

    // Validación para tipo de sangre
    if (!formData.tipo_sangre) {
      newErrors.tipo_sangre = 'El tipo de sangre es obligatorio';
    }

    // Validación para foto
    if (!formData.foto_perfil) {
      newErrors.foto_perfil = 'Debe subir o tomar una foto';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePickImage = async () => {
    const options = ['Tomar foto', 'Seleccionar desde galería', 'Cancelar'];
    Alert.alert(
      'Seleccionar imagen',
      '¿Cómo deseas añadir la imagen?',
      [
        {
          text: options[0], // Tomar foto
          onPress: async () => {
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            if (!permissionResult.granted) {
              alert('Se requiere permiso para acceder a la cámara.');
              return;
            }
            const pickerResult = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
            });
  
            if (!pickerResult.canceled && pickerResult.assets.length > 0) {
              const base64Image = await convertImageToBase64(pickerResult.assets[0].uri);
              setFormData({ ...formData, foto_perfil: base64Image }); // Guardar en Base64
            }
          },
        },
        {
          text: options[1], // Seleccionar desde galería
          onPress: async () => {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
              alert('Se requiere permiso para acceder a la galería.');
              return;
            }
            const pickerResult = await ImagePicker.launchImageLibraryAsync({
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
            });
  
            if (!pickerResult.canceled && pickerResult.assets.length > 0) {
              const base64Image = await convertImageToBase64(pickerResult.assets[0].uri);
              setFormData({ ...formData, foto_perfil: base64Image }); // Guardar en Base64
            }
          },
        },
        { text: options[2], style: 'cancel' }, // Cancelar
      ]
    );
  };

  const convertImageToBase64 = async (uri: string): Promise<string> => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error('Error al convertir la imagen a Base64:', error);
      throw new Error('No se pudo procesar la imagen seleccionada.');
    }
  };

  const handleRegister = async () => {
    if (validateForm()) {
      try {
        const registerData: RegisterData = {
          ...formData,
          fecha_registro: new Date().toISOString().split('T')[0]
        };
        const response = await register(registerData);
        if (response) {
          router.push('/Login');
        }
      } catch (error) {
        setErrors({
          email: 'Error al registrar el usuario'
        });
      }
    }else {
      console.log('Errores de validación:', errors); 
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
          <View className="mb-6">
            <TextInput
              className={`w-full bg-white py-3 px-4 rounded-lg border ${
                errors.contraseña ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Repite la Contraseña"
              secureTextEntry
              value={formData.confirmarContraseña}
              onChangeText={(text) => setFormData({ ...formData, confirmarContraseña: text })}
            />
            {errors.confirmarContraseña && renderError(errors.confirmarContraseña)}
          </View>
           {/* Fecha de nacimiento */}
           <View className="mb-4">
            <TextInput
              className={`w-full bg-white py-3 px-4 rounded-lg border ${
                errors.fecha_nacimiento ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Fecha de nacimiento (YYYY-MM-DD)"
              keyboardType="numeric"
              value={formData.fecha_nacimiento}
              onChangeText={(text) => {
                // Remover cualquier carácter no numérico
                const numericText = text.replace(/[^0-9]/g, '');
              
                // Insertar los guiones automáticamente según la longitud del texto
                let formattedText = numericText;
                if (numericText.length > 4) {
                  formattedText = `${numericText.slice(0, 4)}-${numericText.slice(4)}`;
                }
                if (numericText.length > 6) {
                  formattedText = `${formattedText.slice(0, 7)}-${numericText.slice(6)}`;
                }
              
                // Actualizar el valor formateado
                setFormData({ ...formData, fecha_nacimiento: formattedText });
              }}
            />
            {errors.fecha_nacimiento && renderError(errors.fecha_nacimiento)}
          </View>

          {/* Contacto de emergencia 1 */}
          <View className="mb-4">
            <TextInput
              className={`w-full bg-white py-3 px-4 rounded-lg border ${
                errors.contacto_emergencia1 ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Contacto de emergencia 1"
              keyboardType="numeric"
              maxLength={10}
              value={formData.contacto_emergencia1}
              onChangeText={(text) => setFormData({ ...formData, contacto_emergencia1: text.replace(/[^0-9]/g, '') })}
            />
            {errors.contacto_emergencia1 && renderError(errors.contacto_emergencia1)}
          </View>

          {/* Contacto de emergencia 2 */}
          <View className="mb-4">
            <TextInput
              className={`w-full bg-white py-3 px-4 rounded-lg border ${
                errors.contacto_emergencia2 ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Contacto de emergencia 2 "
              keyboardType="numeric"
              maxLength={10}
              value={formData.contacto_emergencia2}
              onChangeText={(text) => setFormData({ ...formData, contacto_emergencia2: text.replace(/[^0-9]/g, '') })}
            />
            {errors.contacto_emergencia2 && renderError(errors.contacto_emergencia2)}
          </View>

          {/* Tipo de sangre */}
          <View className="mb-4">
            <Picker
              selectedValue={formData.tipo_sangre}
              onValueChange={(itemValue: any) => setFormData({ ...formData, tipo_sangre: itemValue })}
              style={{ height: 50, width: '100%', backgroundColor: 'white', borderRadius: 8 }}
            >
              <Picker.Item label="Seleccione el tipo de sangre" value="" />
              <Picker.Item label="A+" value="A+" />
              <Picker.Item label="A-" value="A-" />
              <Picker.Item label="B+" value="B+" />
              <Picker.Item label="B-" value="B-" />
              <Picker.Item label="AB+" value="AB+" />
              <Picker.Item label="AB-" value="AB-" />
              <Picker.Item label="O+" value="O+" />
              <Picker.Item label="O-" value="O-" />
            </Picker>
            {errors.tipo_sangre && renderError(errors.tipo_sangre)}
          </View>

          {/* Subir foto */}
          <View className="flex-1 items-center justify-center mb-4">
            <Button title="Tomar o subir foto" onPress={handlePickImage} />
            {formData.foto_perfil && (
              <Image source={{ uri: `data:image/jpeg;base64,${formData.foto_perfil}` }} className="w-24 h-24 rounded-full mt-4" />
            )}
            {errors.foto_perfil && renderError(errors.foto_perfil)}
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
            onPress={() => router.push('/Login')}
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