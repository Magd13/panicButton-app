import { Asset } from "expo-asset";
import { Link, Stack, router } from "expo-router";  // Añadimos router
import { View, Text, Image, TouchableOpacity, TextInput, Alert } from "react-native";
import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import {login } from '../services/auth/authService'
import { validateCedula, validatePassword } from "../utils/validators";
import ModalComponent from "../components/ModalComponent";

interface ValidationErrors {
  cedula?: string;
  contraseña?: string;
  general?: string;
}

export default function LoginScreen() {
  const [cedula, setCedula] = useState<string>('');
  const [contraseña, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const[modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [typeModal, setTypeModal] = useState<'error'|'success'>('success')
  const closeModal = () => setModalVisible(false)


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
      if (response)
        setModalMessage('Ingreso Exitoso')
        setTypeModal('success')
        setModalVisible(true)
      setTimeout(()=>{
          setModalVisible(false)
          router.push('/(home)');
        },2000)
    }catch (error:any) {
      const errorMessage = typeof error.message === 'string' 
        ? error.message.split(',')[0]  
        : error.message;

      setModalMessage(errorMessage);
      setTypeModal('error');
      setModalVisible(true);
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
        {errors.general && renderError(errors.general)}
        
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
        <ModalComponent
          visible={modalVisible}
          message={modalMessage}
          type={typeModal}
          onClose={closeModal}
        />
      </View>
    </View>
  );
}

