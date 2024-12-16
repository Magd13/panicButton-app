import { useState, useEffect } from "react";
import * as SecureStore from 'expo-secure-store';
import { View, Text, Image, TouchableOpacity } from "react-native";



export default function Perfil() {
    const [userData, setUserData] = useState<any>(null);

    useEffect(()=> {
        const loadDataUser = async () => {
            try {
                const storedUserData = await SecureStore.getItemAsync('userData')
                if (storedUserData) {
                    const parsedData = JSON.parse(storedUserData);
                    setUserData(parsedData);
                }
            }catch (error) {
                console.error('Error al cargar los datos del usuario:', error);
            }
        };
        loadDataUser();
    },[]);

    if (!userData) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Cargando datos del usuario...</Text>
            </View>
        );
    }

    const calculateAge = (birthDate: string) => {
        const birthYear = new Date(birthDate).getFullYear();
        const currentYear = new Date().getFullYear();
        return currentYear - birthYear;
    };

    return (
        
            <View className="flex-1 bg-gray-100 p-4">
                {/* Cabecera del perfil */}
                <View className="flex flex-row items-center mb-6">
                    <Image
                        source={{ uri:`data:image/jpeg;base64,${userData.foto_perfil}`}} // Aquí va la URL de la foto de usuario
                        className="w-24 h-24 rounded-full border-4 border-blue-600"
                    />
                    <View className="ml-4">
                        <Text className="text-2xl font-bold text-blue-800">{userData.nombre} {userData.apellido}</Text>
                        <Text className="text-sm text-gray-600">Edad: {calculateAge(userData.fecha_nacimiento)} | Tipo de Sangre: {userData.tipo_sangre}</Text>
                        <Text className="text-sm text-gray-600">Telefono: {userData.telefono} | Email: {userData.email}</Text>
                    </View>
                </View>

                {/* Información de contacto */}
                <View className="mb-6">
                    <Text className="text-lg font-semibold text-blue-800">Contacto de Emergencia</Text>
                    <View className="mt-4">
                        <Text className="text-sm text-gray-700">{userData.contacto_emergencia1}</Text>
                        <Text className="text-sm text-gray-700">{userData.contacto_emergencia2}</Text>
                    </View>
                </View>

                {/* Botón para editar el perfil */}
                <TouchableOpacity
                    className="bg-blue-600 p-3 rounded-lg mb-4"
                    onPress={() => { /* Lógica para editar el perfil */ }}
                >
                    <Text className="text-white text-center text-lg">Editar Perfil</Text>
                </TouchableOpacity>

               
                {/* Botón para cerrar sesión */}
                <TouchableOpacity
                    className="bg-red-600 p-3 rounded-lg"
                    onPress={() => { /* Lógica para cerrar sesión */ }}
                >
                    <Text className="text-white text-center text-lg">Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
        
    );
}
