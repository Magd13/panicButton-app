import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Button, Image, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { router } from "expo-router";
import { register } from "../services/auth/authService";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import ModalComponent from "../components/ModalComponent";
import { validateCedula, validatePassword, validateEmail } from "../utils/validators";

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
  fecha_nacimiento: string;
  contacto_emergencia1: string;
  contacto_emergencia2: string;
  tipo_sangre: string;
  foto_perfil: string | null;
}

export default function RegisterScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    fecha_nacimiento: '',
    email: '',
    telefono: '',
    password: '',
    confirmarContraseña:'',
    contacto_emergencia: '',
    tipo_sangre: '',
    foto_perfil: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const[modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [typeModal, setTypeModal] = useState<'error'|'success'>('success')
  const closeModal = () => setModalVisible(false)

  const validateCellphone = (telefono:string):boolean => {
    const telfRegex = /^[0-9]{10}$/;
    return telfRegex.test(telefono)
  }

  const validateStep1 = ():boolean => {
    const newErrors: ValidationErrors = {};
    if(!formData.nombre.trim()){
      newErrors.nombre = 'El nombre es obligatorio'
    }
    if(!formData.apellido.trim()){
      newErrors.apellido = 'El apellido es obligatorio'
    }
    if(!formData.cedula.trim()){
      newErrors.cedula = 'El numero de cedula es obligatorio'
    } else if(!validateCedula(formData.cedula)) {
      newErrors.cedula = 'El numero de cedula no es valido'
    }
    if (!formData.fecha_nacimiento) {
      newErrors.fecha_nacimiento = 'La fecha de nacimiento es obligatoria';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.fecha_nacimiento)) {
      newErrors.fecha_nacimiento = 'El formato debe ser YYYY-MM-DD';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const validateStep2 = (): boolean => {
    const newErrors: ValidationErrors = {};
    if (!formData.email) {
      newErrors.email = 'El email es obligatorio';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'El email debe ser válido';
    }
    if(!formData.telefono) {
      newErrors.telefono = 'El numero de telefono es obligatorio'
    } else if(!validateCellphone) {
      newErrors.telefono = 'El numero de telefono no es valido'
    }
    if (!formData.password) {
      newErrors.contraseña = 'La contraseña no puede estar vacía';
    } else if (!validatePassword(formData.password)) {
      newErrors.contraseña = 'La contraseña debe contener mayúscula, minúscula, número y carácter especial';
    }
    if (formData.password !== formData.confirmarContraseña) {
      newErrors.confirmarContraseña = 'Las contraseñas no coinciden';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: ValidationErrors = {};
    if (!formData.contacto_emergencia) {
      newErrors.contacto_emergencia1 = 'El contacto de emergencia es obligatorio';
    } else if (!/^\d{10}$/.test(formData.contacto_emergencia)) {
      newErrors.contacto_emergencia1 = 'El número debe contener 10 dígitos';
    }
    if (!formData.tipo_sangre) {
      newErrors.tipo_sangre = 'El tipo de sangre es obligatorio';
    }
    if (!formData.foto_perfil) {
      newErrors.foto_perfil = 'Debe subir o tomar una foto';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
      setErrors({});
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
      setErrors({});
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
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
              quality: 0.5,
            });
  
            if (!pickerResult.canceled && pickerResult.assets.length > 0) {
              const resizedImage = await ImageManipulator.manipulateAsync(
                pickerResult.assets[0].uri,
                [{ resize: { width: 600 } }], 
                { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
              );
              const base64Image = await convertImageToBase64(resizedImage.uri);
              setFormData({ ...formData, foto_perfil: base64Image }); 
            }
          },
        },
        {
          text: options[1], 
          onPress: async () => {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
              alert('Se requiere permiso para acceder a la galería.');
              return;
            }
            const pickerResult = await ImagePicker.launchImageLibraryAsync({
              allowsEditing: true,
              aspect: [4, 3],
              quality: 0.5,
            });
  
            if (!pickerResult.canceled && pickerResult.assets.length > 0) {
              const resizedImage = await ImageManipulator.manipulateAsync(
                pickerResult.assets[0].uri,
                [{ resize: { width: 600 } }], 
                { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
              );
              const base64Image = await convertImageToBase64(resizedImage.uri);
              setFormData({ ...formData, foto_perfil: base64Image }); 
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
    if (validateStep3()) {
      try {
        const response = await register(formData);
        if (response) {
          setModalMessage('Registro Exitoso')
          setTypeModal('success')
          setModalVisible(true)
          setTimeout(()=>{
            setModalVisible(false)
            router.push('/Login');
          }, 2000)
        }
      } catch (error:any) {
        const errorMessage = typeof error.message === 'string' 
          ? error.message.split(',')[0]  
          : error.message;

        setModalMessage(errorMessage);
        setTypeModal('error');
        setModalVisible(true);
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
      style={{ flex: 1, backgroundColor: '#F3F4F6' }}
    >
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 }}>
            Crear Cuenta
          </Text>

          {/* Renderizado condicional según el paso */}
          {currentStep === 1 && (
            <View>
              {/* Datos Personales */}
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
                onChangeText={(text) => setFormData({ ...formData, nombre: text })}
              />
              {errors.nombre && renderError(errors.nombre)}

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
                onChangeText={(text) => setFormData({ ...formData, apellido: text })}
              />
              {errors.apellido && renderError(errors.apellido)}

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
                onChangeText={(text) =>
                  setFormData({ ...formData, cedula: text.replace(/[^0-9]/g, '') })
                }
              />
              {errors.cedula && renderError(errors.cedula)}

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
                onChangeText={(text) => {
                  // Formateo automático de la fecha
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
              {errors.fecha_nacimiento && renderError(errors.fecha_nacimiento)}
            </View>
          )}

          {currentStep === 2 && (
            <View>
              {/* Credenciales */}
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
                onChangeText={(text) => setFormData({ ...formData, email: text })}
              />
              {errors.email && renderError(errors.email)}
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
                onChangeText={(text) => setFormData({ ...formData, telefono: text })}
              />
              <TextInput
                style={{
                  backgroundColor: '#FFF',
                  padding: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: errors.contraseña ? '#D8000C' : '#ccc',
                  marginBottom: 8,
                }}
                placeholder="Contraseña"
                secureTextEntry
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
              />
              {errors.contraseña && renderError(errors.contraseña)}

              <TextInput
                style={{
                  backgroundColor: '#FFF',
                  padding: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: errors.confirmarContraseña ? '#D8000C' : '#ccc',
                  marginBottom: 8,
                }}
                placeholder="Confirmar Contraseña"
                secureTextEntry
                value={formData.confirmarContraseña}
                onChangeText={(text) => setFormData({ ...formData, confirmarContraseña: text })}
              />
              {errors.confirmarContraseña && renderError(errors.confirmarContraseña)}
            </View>
          )}

          {currentStep === 3 && (
            <View>
              {/* Datos adicionales */}
              <TextInput
                style={{
                  backgroundColor: '#FFF',
                  padding: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: errors.contacto_emergencia1 ? '#D8000C' : '#ccc',
                  marginBottom: 8,
                }}
                placeholder="Contacto de emergencia"
                keyboardType="numeric"
                maxLength={10}
                value={formData.contacto_emergencia}
                onChangeText={(text) =>
                  setFormData({ ...formData, contacto_emergencia: text.replace(/[^0-9]/g, '') })
                }
              />
              {errors.contacto_emergencia1 && renderError(errors.contacto_emergencia1)}

              <Picker
                selectedValue={formData.tipo_sangre}
                onValueChange={(itemValue: any) => setFormData({ ...formData, tipo_sangre: itemValue })}
                style={{ height: 50, width: '100%', backgroundColor: '#FFF', borderRadius: 8, marginBottom: 8 }}
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

              <View style={{ alignItems: 'center', marginBottom: 8 }}>
                <Button title="Tomar o subir foto" onPress={handlePickImage} />
                {formData.foto_perfil && (
                  <Image
                    source={{ uri: `data:image/jpeg;base64,${formData.foto_perfil}` }}
                    style={{ width: 96, height: 96, borderRadius: 48, marginTop: 8 }}
                  />
                )}
                {errors.foto_perfil && renderError(errors.foto_perfil)}
              </View>
            </View>
          )}

          {/* Botones de navegación */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16, gap:16 }}>
            {currentStep > 1 && (
              <Button title="Anterior" onPress={handlePrevious} />
            )}
            {currentStep < 3 ? (
              <Button title="Siguiente" onPress={handleNext} />
            ) : (
              <Button title="Registrarse" onPress={handleRegister} />
            )}
          </View>
        </View>
      </ScrollView>
      <ModalComponent
        visible={modalVisible}
        message={modalMessage}
        type={typeModal}
        onClose={closeModal}
      />
    </KeyboardAvoidingView>
  );
}