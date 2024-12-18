import React, { useState } from 'react';
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
    Platform
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { updateUserProfile } from '../../services/userService';

interface FormData {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    contacto_emergencia1: string;
    contacto_emergencia2: string;
    tipo_sangre: string;
    foto_perfil: string;
}

export default function EditProfile() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<FormData>(() => {
        const userData = JSON.parse(params.userData as string);
        return {
            nombre: userData.nombre?.toString() || '',
            apellido: userData.apellido?.toString() || '',
            email: userData.email?.toString() || '',
            telefono: userData.telefono?.toString() || '',
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
                    foto_perfil: result.assets[0].base64
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
            const updatedUser = await updateUserProfile(JSON.parse(params.userData as string).cedula, formData);
            
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
                    value={formData[field]}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, [field]: text }))}
                    keyboardType={keyboardType}
                    editable={!loading}
                    placeholder={`Ingresa ${label.toLowerCase()}`}
                />
            </View>
        </View>
    );

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
        >
            <ScrollView className="flex-1 bg-gray-50">
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
                    <InputField
                        field="tipo_sangre"
                        label="Tipo de Sangre"
                        icon="water-outline"
                        required
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
        </KeyboardAvoidingView>
    );
}