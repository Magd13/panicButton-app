import { useState, useEffect } from "react";
import { 
    View, 
    Text, 
    Image, 
    TouchableOpacity, 
    Alert, 
    ActivityIndicator 
} from "react-native";
import * as SecureStore from 'expo-secure-store';
import { useRouter } from "expo-router";
import { logout } from '../../services/userService';
import Ionicons from '@expo/vector-icons/Ionicons';

// Interfaz para los datos del usuario
interface UserData {
    id: number;
    cedula: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    fecha_nacimiento: string;
    contacto_emergencia1: string;
    contacto_emergencia2: string;
    tipo_sangre: string;
    foto_perfil: string;
}

export default function Perfil() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const loadDataUser = async () => {
        try {
            const storedUserData = await SecureStore.getItemAsync('userData');
            if (storedUserData) {
                const parsedData = JSON.parse(storedUserData);
                setUserData(parsedData);
            }
        } catch (error) {
            console.error('Error al cargar los datos del usuario:', error);
            Alert.alert(
                'Error',
                'No se pudieron cargar los datos del usuario'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDataUser();
    }, []);

    const calculateAge = (birthDate: string) => {
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    };

    const handleEditProfile = () => {
        if (userData) {
            // Con Expo Router, la navegación es diferente
            router.push({
                pathname: "/editProfile",
                params: {
                    userData: JSON.stringify(userData)
                }
            });
        }
    };
    const handleLogout = async () => {
        Alert.alert(
            "Cerrar Sesión",
            "¿Estás seguro que deseas cerrar sesión?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Sí, cerrar sesión",
                    onPress: async () => {
                        try {
                            await logout();
                            // Con Expo Router, redirigimos así
                            router.replace("/");
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo cerrar sesión');
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-100">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text className="mt-4 text-gray-600">Cargando datos del usuario...</Text>
            </View>
        );
    }

    if (!userData) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-100">
                <Text className="text-red-500">No se encontraron datos del usuario</Text>
                <TouchableOpacity
                    className="mt-4 bg-blue-500 px-6 py-3 rounded-lg"
                    onPress={handleLogout}
                >
                    <Text className="text-white">Volver al inicio de sesión</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-100">
            {/* Header con foto de perfil y datos principales */}
            <View className="bg-white p-6 shadow-sm">
                <View className="flex-row items-center">
                    <Image
                        source={{ 
                            uri: userData.foto_perfil 
                                ? `data:image/jpeg;base64,${userData.foto_perfil}`
                                : '/api/placeholder/96/96'
                        }}
                        className="w-24 h-24 rounded-full border-4 border-blue-600"
                    />
                    <View className="ml-4 flex-1">
                        <Text className="text-2xl font-bold text-blue-800">
                            {userData.nombre} {userData.apellido}
                        </Text>
                        <Text className="text-gray-600">
                            {userData.cedula}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Información personal */}
            <View className="px-6 py-4">
                <View className="bg-white rounded-lg shadow-sm p-4 mb-4">
                    <Text className="text-lg font-semibold text-blue-800 mb-3">
                        Información Personal
                    </Text>
                    <View className="space-y-2">
                        <View className="flex-row items-center">
                            <Ionicons name="calendar-outline" size={20} color="#4b5563" />
                            <Text className="ml-2 text-gray-600">
                                Edad: {calculateAge(userData.fecha_nacimiento)} años
                            </Text>
                        </View>
                        <View className="flex-row items-center">
                            <Ionicons name="water-outline" size={20} color="#4b5563" />
                            <Text className="ml-2 text-gray-600">
                                Tipo de Sangre: {userData.tipo_sangre}
                            </Text>
                        </View>
                        <View className="flex-row items-center">
                            <Ionicons name="call-outline" size={20} color="#4b5563" />
                            <Text className="ml-2 text-gray-600">
                                Teléfono: {userData.telefono}
                            </Text>
                        </View>
                        <View className="flex-row items-center">
                            <Ionicons name="mail-outline" size={20} color="#4b5563" />
                            <Text className="ml-2 text-gray-600">
                                Email: {userData.email}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Contactos de emergencia */}
                <View className="bg-white rounded-lg shadow-sm p-4 mb-4">
                    <Text className="text-lg font-semibold text-blue-800 mb-3">
                        Contactos de Emergencia
                    </Text>
                    <View className="space-y-2">
                        <View className="flex-row items-center">
                            <Ionicons name="person-outline" size={20} color="#4b5563" />
                            <Text className="ml-2 text-gray-600">
                                {userData.contacto_emergencia1}
                            </Text>
                        </View>
                        <View className="flex-row items-center">
                            <Ionicons name="person-outline" size={20} color="#4b5563" />
                            <Text className="ml-2 text-gray-600">
                                {userData.contacto_emergencia2}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Botones de acción */}
            <View className="px-6 mt-auto mb-6">
                <TouchableOpacity
                    className="bg-blue-600 p-4 rounded-lg mb-3 flex-row justify-center items-center"
                    onPress={handleEditProfile}
                >
                    <Ionicons name="create-outline" size={20} color="white" />
                    <Text className="text-white text-center text-lg font-semibold ml-2">
                        Editar Perfil
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-red-600 p-4 rounded-lg flex-row justify-center items-center"
                    onPress={handleLogout}
                >
                    <Ionicons name="log-out-outline" size={20} color="white" />
                    <Text className="text-white text-center text-lg font-semibold ml-2">
                        Cerrar Sesión
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}