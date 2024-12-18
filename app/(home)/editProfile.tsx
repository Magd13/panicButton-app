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
    Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import Ionicons from '@expo/vector-icons/Ionicons';
import { updateUserProfile } from '../../services/userService';
import { Picker } from '@react-native-picker/picker';

interface FormData {
    nombre: string;
    apellido: string;
    cedula: string;
    email: string;
    telefono: string;
    fecha_registro: Date;
    fecha_nacimiento: string;
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
    const [formData, setFormData] = useState<FormData>(() => ({
        ...JSON.parse(params.userData as string),
        fecha_registro: new Date()
    }));

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
        const newErrors: { [key: string]: string } = {};
        if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
        if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es obligatorio';
        if (!formData.email.includes('@')) newErrors.email = 'Email inválido';
        if (formData.telefono.length < 10) newErrors.telefono = 'Teléfono inválido';
        if (!formData.tipo_sangre) newErrors.tipo_sangre = 'Tipo de sangre es obligatorio';

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        try {
            setLoading(true);
            const userData = JSON.parse(params.userData as string);
            const updatedData = {
                ...formData,
                fecha_nacimiento: userData.fecha_nacimiento,
                fecha_registro: new Date().toISOString().split('T')[0]
            };

            await updateUserProfile(formData.cedula, updatedData);
            await SecureStore.setItemAsync('userData', JSON.stringify(updatedData));
            Alert.alert('Éxito', 'Perfil actualizado correctamente', [
                { text: 'OK', onPress: () => router.replace('/perfil') }
            ]);
        } catch (error) {
            Alert.alert('Error', 'No se pudo actualizar el perfil');
        } finally {
            setLoading(false);
        }
    };

    const renderInput = (field: keyof FormData, label: string, icon: string, keyboardType = 'default', required = false) => (
        <View className="mb-4">
            <Text className="text-gray-600 mb-1 font-medium">
                {label} {required && <Text className="text-red-500">*</Text>}
            </Text>
            <View className={`bg-white py-3 px-4 rounded-lg border ${errors[field] ? 'border-red-500' : 'border-gray-300'}`}>
                <View className="flex-row items-center">
                    <Ionicons name={icon as any} size={20} color="#4b5563" className="mr-2" />
                    <TextInput
                        className="flex-1 text-base text-gray-700"
                        value={formData[field]?.toString()}
                        onChangeText={text => setFormData(prev => ({ ...prev, [field]: text }))}
                        placeholder={`Ingresa ${label.toLowerCase()}`}
                        keyboardType={keyboardType as any}
                        autoCapitalize="none"
                    />
                </View>
            </View>
            {errors[field] && (
                <Text className="text-red-500 text-xs mt-1">{errors[field]}</Text>
            )}
        </View>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1 bg-gray-100"
        >
            <ScrollView 
                className="flex-1"
                contentContainerStyle={{ padding: 24 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="items-center mb-8">
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
                        className="mt-3 bg-blue-500 px-4 py-2 rounded-lg flex-row items-center"
                    >
                        <Ionicons name="camera-outline" size={20} color="white" />
                        <Text className="text-white ml-2 font-medium">Cambiar foto</Text>
                    </TouchableOpacity>
                </View>

                {renderInput('nombre', 'Nombre', 'person-outline', 'default', true)}
                {renderInput('apellido', 'Apellido', 'person-outline', 'default', true)}
                {renderInput('email', 'Email', 'mail-outline', 'email-address', true)}
                {renderInput('telefono', 'Teléfono', 'call-outline', 'phone-pad', true)}
                {renderInput('contacto_emergencia1', 'Contacto de Emergencia 1', 'call-outline', 'phone-pad', true)}
                {renderInput('contacto_emergencia2', 'Contacto de Emergencia 2', 'call-outline', 'phone-pad')}

                <View className="mb-4">
                    <Text className="text-gray-600 mb-1 font-medium">
                        Tipo de Sangre <Text className="text-red-500">*</Text>
                    </Text>
                    <View className="bg-white rounded-lg border border-gray-300 overflow-hidden">
                        <Picker
                            selectedValue={formData.tipo_sangre}
                            onValueChange={value => setFormData(prev => ({ ...prev, tipo_sangre: value }))}
                            style={{ backgroundColor: 'white' }}
                        >
                            <Picker.Item label="Seleccione el tipo de sangre" value="" />
                            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(tipo => (
                                <Picker.Item key={tipo} label={tipo} value={tipo} />
                            ))}
                        </Picker>
                    </View>
                    {errors.tipo_sangre && (
                        <Text className="text-red-500 text-xs mt-1">{errors.tipo_sangre}</Text>
                    )}
                </View>

                <View className="mt-8 mb-12">
                    {/* Botón de Guardar */}
                    <TouchableOpacity
                        className={`w-full bg-blue-600 p-4 rounded-xl shadow-lg flex-row justify-center items-center mb-4 ${loading ? 'opacity-50' : ''}`}
                        onPress={handleUpdate}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="white" /> : (
                            <>
                                <Ionicons name="save-outline" size={24} color="white" />
                                <Text className="text-white font-bold text-lg ml-2">
                                    Guardar Cambios
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>

                    {/* Botón de Cancelar */}
                    <TouchableOpacity
                        className="w-full bg-white border-2 border-gray-300 p-4 rounded-xl shadow-sm flex-row justify-center items-center"
                        onPress={() => router.back()}
                        disabled={loading}
                    >
                        <Ionicons name="close-outline" size={24} color="#4B5563" />
                        <Text className="text-gray-600 font-bold text-lg ml-2">
                            Cancelar
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}