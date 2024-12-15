import { Stack } from "expo-router";
import { View, Text, Image, TouchableOpacity } from "react-native";

export default function Perfil() {
    return (
        
            <View className="flex-1 bg-gray-100 p-4">
                {/* Cabecera del perfil */}
                <View className="flex flex-row items-center mb-6">
                    <Image
                        source={{ uri: "https://placekitten.com/200/200" }} // Aquí va la URL de la foto de usuario
                        className="w-24 h-24 rounded-full border-4 border-blue-600"
                    />
                    <View className="ml-4">
                        <Text className="text-2xl font-bold text-blue-800">Juan Pérez</Text>
                        <Text className="text-sm text-gray-600">Edad: 30 | Tipo de Sangre: O+</Text>
                    </View>
                </View>

                {/* Información de contacto */}
                <View className="mb-6">
                    <Text className="text-lg font-semibold text-blue-800">Contacto de Emergencia</Text>
                    <View className="mt-4">
                        <Text className="text-sm text-gray-700">Contacto 1: María López - 555-1234</Text>
                        <Text className="text-sm text-gray-700">Contacto 2: Pedro Ruiz - 555-5678</Text>
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
