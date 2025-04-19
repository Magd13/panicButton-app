import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Button, Image, Alert } from "react-native";

import React, { useState } from 'react';
import { router } from "expo-router";
import { register } from "../../../services/auth/authService";
import ModalComponent from "../../../components/ModalComponent";
import RegisterStepOne from "./dataPersonal";
import RegisterStepTwo from "./dataCredentials";
import RegisterStepThree from "./dataInfoAdditional";
import { StepOneData, StepOneErrors, StepThreeData, StepThreeErrors, StepTwoData, StepTwoErrors } from "./interface";
import { validateCedula, validateCellphone, validateEmail, validatePassword } from "../../../utils/validators";


const RegisterPrincipal = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const[modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [typeModal, setTypeModal] = useState<'error'|'success'>('success')
  const closeModal = () => setModalVisible(false)

  const [stepOneData, setStepOneData] = useState<StepOneData>({
    nombre: '',
    apellido: '',
    cedula: '',
    fecha_nacimiento: '',
  })
  const [stepOneError, setStepOneErrors] = useState<StepOneErrors>({})

  const [stepTwoData, setStepTwoData] = useState<StepTwoData>({
    email: '',
    telefono: '',
    password: '',
    confirmPassword: '',
  })
  const [stepTwoError, setStepTwoErrors] = useState<StepTwoErrors>({})

  const [stepThreeData, setStepThreeData] = useState<StepThreeData>({
    fecha_registro: '',
    contacto_emergencia: '',
    tipo_sangre: '',
    foto_perfil: '',
  })
  const [stepThreeError, setStepThreeErrors] = useState<StepThreeErrors>({})

  const validateStep1 = (): boolean => {
    const errors: StepOneErrors = {};
    if (!stepOneData.nombre.trim()) errors.nombre = 'El nombre es obligatorio';
    if (!stepOneData.apellido.trim()) errors.apellido = 'El apellido es obligatorio';
    if (!stepOneData.cedula.trim()) errors.cedula = 'La cédula es obligatoria';
    else if (!validateCedula(stepOneData.cedula)) errors.cedula = 'Cédula no válida';
    if (!stepOneData.fecha_nacimiento) errors.fecha_nacimiento = 'Fecha de nacimiento obligatoria';
    else if (!/\d{4}-\d{2}-\d{2}/.test(stepOneData.fecha_nacimiento)) errors.fecha_nacimiento = 'Formato YYYY-MM-DD';

    setStepOneErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errors: StepTwoErrors = {};
    if (!stepTwoData.email.trim()) errors.email = 'El correo electrónico es obligatorio';
    else if (!validateEmail(stepTwoData.email)) errors.email = 'Email invalido'
    if (!stepTwoData.telefono.trim()) errors.telefono = 'El numero telefónico es obligatorio';
    else if(!validateCellphone(stepTwoData.telefono)) errors.telefono = 'Telefono invalido'
    if (!stepTwoData.password.trim()) errors.password = 'La contraseña es obligatoria';
    else if (!validatePassword(stepTwoData.password)) errors.password = 'La contraseña debe contener mayúscula, minúscula, número y carácter especial';
    if (stepTwoData.password != stepTwoData.confirmPassword) errors.confirmPassword = 'Las contraseñas no coinciden';

    setStepTwoErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const errors: StepThreeErrors = {};
    if (!stepThreeData.contacto_emergencia) errors.contacto_emergencia = 'El contacto de emergencia es obligatorio';
    else if (!/^\d{10}$/.test(stepThreeData.contacto_emergencia)) errors.contacto_emergencia = 'El número debe contener 10 dígitos';
    if (!stepThreeData.tipo_sangre) errors.tipo_sangre = 'El tipo de sangre es obligatorio';
    if (!stepThreeData.foto_perfil) errors.foto_perfil = 'Debe subir o tomar una foto';
    
    setStepThreeErrors(errors);
    return Object.keys(errors).length === 0;
  };



  const handleNext = () => {
    if (currentStep === 1) {
      if(validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2 ) {
      if(validateStep2()) setCurrentStep(3);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleRegister = async () => {
    if (!validateStep3()) return;
      try {
        const formData = {
          ...stepThreeData,
          ...stepTwoData,
          ...stepOneData,
        }
        const { confirmPassword, ...formDataToSend } = formData;
        const response = await register(formDataToSend);
        if (response) {
          setTypeModal('success')
          setModalMessage('Registro Exitoso')
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
  };

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
          {currentStep === 1 && <RegisterStepOne formData={stepOneData} setFormData={setStepOneData} errors={stepOneError}/>}
          {currentStep === 2 && <RegisterStepTwo formData={stepTwoData} setFormData={setStepTwoData} errors={stepTwoError}/>}
          {currentStep === 3 && <RegisterStepThree formData={stepThreeData} setFormData={setStepThreeData} errors={stepThreeError}/>}
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16, gap:16 }}>
            {currentStep > 1 && (
              <Button title="Regresar" onPress={handlePrevious} />
            )}
            {currentStep < 3 ? (
              <Button title="Continuar" onPress={handleNext} />
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

export default RegisterPrincipal