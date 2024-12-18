import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { updateUserProfile } from '../../services/userService';

import { Picker } from '@react-native-picker/picker';
interface FormData {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    fecha_registro: Date;
    contacto_emergencia1: string;
    contacto_emergencia2: string;
    tipo_sangre: string;
    foto_perfil: string;
}

export default function EditProfile() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

   

    const [formData, setFormData] = useState<FormData>(() => {
        const userData = JSON.parse(params.userData as string);
        return {
            nombre: userData.nombre?.toString() || '',
            apellido: userData.apellido?.toString() || '',
            cedula:userData.cedula?.toString() || '',
            email: userData.email?.toString() || '',
            telefono: userData.telefono?.toString() || '',
            fecha_registro: userData.fecha_registro  ? new Date(userData.fecha_registro) : new Date(),
            contacto_emergencia1: userData.contacto_emergencia1?.toString() || '',
            contacto_emergencia2: userData.contacto_emergencia2?.toString() || '',
            tipo_sangre: userData.tipo_sangre?.toString() || '',
            foto_perfil: userData.foto_perfil?.toString() || ''
        };
    });

    const validateForm = () => {
        if (!formData.nombre.trim()) {
            Alert.alert('Error', 'El nombre es obligatorio');
            return false;
        }
        if (!formData.apellido.trim()) {
            Alert.alert('Error', 'El apellido es obligatorio');
            return false;
        }
        if (!formData.email.includes('@')) {
            Alert.alert('Error', 'Ingresa un email válido');
            return false;
        }
        if (formData.telefono.length < 10) {
            Alert.alert('Error', 'El teléfono debe tener al menos 10 dígitos');
            return false;
        }
        if (!formData.tipo_sangre) {
            Alert.alert('Error', 'El tipo de sangre es obligatorio');
            return false;
        }
        return true;
    };

    const handlePickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso denegado', 'Necesitamos permisos para acceder a tu galería');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
                base64: true,
            });

            if (!result.canceled && result.assets[0].base64) {
                setFormData(prev => ({
                    ...prev,
                    foto_perfil: result.assets[0].base64 || ''
                }));
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo cargar la imagen');
        }
    };

    const handleUpdate = async () => {
        if (!validateForm()) return;
        
        try {
            setLoading(true);

            const updatedFormData = {
                ...formData,
                fecha_registro: new Date().toISOString().split('T')[0]
            };

            const updatedUser = await updateUserProfile(JSON.parse(params.userData as string).cedula, updatedFormData);
            
            Alert.alert(
                'Éxito',
                'Perfil actualizado correctamente',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            router.back();
                        }
                    }
                ]
            );
        } catch (error) {
            console.error('Error al actualizar:', error);
            Alert.alert(
                'Error',
                error instanceof Error ? error.message : 'No se pudo actualizar el perfil'
            );
        } finally {
            setLoading(false);
        }
    };

    const BloodTypeField = ({ value, onChange, error }: any) => {
        return (
            <View className="mb-4">
                <Text className="text-gray-600 mb-1">
                    Tipo de Sangre <Text className="text-red-500">*</Text>
                </Text>
                <View className="flex-row items-center bg-white rounded-lg border border-gray-300">
                    {/* Ícono a la izquierda */}
                    <View className="p-3">
                        <Ionicons name="water-outline" size={20} color="#4b5563" />
                    </View>
                    {/* Picker */}
                    <Picker
                        selectedValue={value}
                        onValueChange={(itemValue) => onChange(itemValue)}
                        style={{ flex: 1, height: 50 }}
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
                </View>
                {/* Mostrar error si existe */}
                {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
            </View>
        );
    };

    const handleInputChange = (name: string, value: any) => {
        setFormData({ ...formData, [name]: value });
    };

    const InputField = ({ 
        field,
        label,
        icon,
        keyboardType = 'default',
        required = false
    }: {
        field: keyof FormData;
        label: string;
        icon: string;
        keyboardType?: 'default' | 'email-address' | 'phone-pad';
        required?: boolean;
    }) => (
        <View className="mb-4">
            <Text className="text-gray-600 mb-1">
                {label} {required && <Text className="text-red-500">*</Text>}
            </Text>
            <View className="flex-row items-center bg-white rounded-lg border border-gray-300">
                <View className="p-2">
                    <Ionicons 
                        name={icon as any} 
                        size={20} 
                        color="#4b5563"
                    />
                </View>
                <TextInput
                    className="flex-1 p-2 text-base text-gray-700"
                    value={field === 'fecha_registro' ? formData?.[field]?.toLocaleDateString() || '' : formData?.[field] || ''}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, [field]: text }))}
                    keyboardType={keyboardType}
                    editable={!loading && field !== 'fecha_registro'} 
                    placeholder={`Ingresa ${label.toLowerCase()}`}
                />
            </View>
        </View>
    );

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? "padding" : "height"} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <ScrollView  contentContainerStyle={{ flexGrow: 1 }}
                        keyboardShouldPersistTaps="handled">
                <View className="p-4">
                    {/* Foto de perfil */}
                    <View className="items-center mb-6">
                        <Image
                            source={{ 
                                uri: formData.foto_perfil 
                                    ? `data:image/jpeg;base64,${formData.foto_perfil}`
                                    : 'https://via.placeholder.com/150'
                            }}
                            className="w-32 h-32 rounded-full border-4 border-blue-600"
                        />
                        <TouchableOpacity 
                            onPress={handlePickImage}
                            className="mt-2 bg-blue-500 px-4 py-2 rounded-lg flex-row items-center"
                            disabled={loading}
                        >
                            <Ionicons name="camera-outline" size={20} color="white" />
                            <Text className="text-white ml-2">Cambiar foto</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Campos del formulario */}
                    <InputField
                        field="nombre"
                        label="Nombre"
                        icon="person-outline"
                        required
                    />
                    <InputField
                        field="apellido"
                        label="Apellido"
                        icon="person-outline"
                        required
                    />
                    <InputField
                        field="email"
                        label="Email"
                        icon="mail-outline"
                        keyboardType="email-address"
                        required
                    />
                    <InputField
                        field="telefono"
                        label="Teléfono"
                        icon="call-outline"
                        keyboardType="phone-pad"
                        required
                    />
                    <InputField
                        field="contacto_emergencia1"
                        label="Contacto de Emergencia 1"
                        icon="call-outline"
                        keyboardType="phone-pad"
                        required
                    />
                    <InputField
                        field="contacto_emergencia2"
                        label="Contacto de Emergencia 2"
                        icon="call-outline"
                        keyboardType="phone-pad"
                    />
                    <BloodTypeField
                        value={formData.tipo_sangre}
                        onChange={(value: any) => handleInputChange('tipo_sangre', value)}
                        error={errors.tipo_sangre}
                    />

                    {/* Botones */}
                    <View className="mt-6 space-y-3">
                        <TouchableOpacity
                            className={`bg-blue-600 p-4 rounded-lg flex-row justify-center items-center ${loading ? 'opacity-50' : ''}`}
                            onPress={handleUpdate}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <>
                                    <Ionicons name="save-outline" size={20} color="white" />
                                    <Text className="text-white font-semibold ml-2">
                                        Guardar Cambios
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="bg-gray-500 p-4 rounded-lg flex-row justify-center items-center"
                            onPress={() => router.back()}
                            disabled={loading}
                        >
                            <Ionicons name="close-outline" size={20} color="white" />
                            <Text className="text-white font-semibold ml-2">
                                Cancelar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}