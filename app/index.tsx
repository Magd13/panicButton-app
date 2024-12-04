import { Asset } from "expo-asset";
import { Link, Stack } from "expo-router";
import { View, Text, Image, TouchableOpacity,TextInput } from "react-native";


export default function HomeScreem() {
  
  return (
    <View className="flex-1 items-center justify-center bg-gray-100 px-6">
      <Stack.Screen
        options={{
          title: 'Panic Button',
          headerStyle: { backgroundColor: '#f4511e'},
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          }
        }}
      />
      <Image
        source={require("../assets/images/demo.gif")}
        className="w-80 h-80 mb-6"
        resizeMode= "contain"
      />
      <Text className="text-xl font-semibold text-gray-800 mb-6 text-center">
        ¡Activa tu seguridad personal con un doble clic en el botón de encendido de tu teléfono! 
      </Text>
      <TouchableOpacity className="w-full bg-blue-500 py-4 rounded-lg mb-4">
        <Link href="/Login">
          <Text className="text-center text-white text-lg font-semibold">
            Iniciar Sesión
          </Text>
        </Link>
      </TouchableOpacity>
    </View>
    
  );
}

export const meta = {
  title: "Botón de Pánico", // Cambia el título aquí
};