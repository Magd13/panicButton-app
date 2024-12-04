import { Asset } from "expo-asset";
import { Link, Stack } from "expo-router";
import { View, Text, Image, TouchableOpacity,TextInput } from "react-native";


export default function LoginScreem() {
  
  return (
    <View className="flex-1 items-center justify-center bg-gray-100 px-6">
      <Stack.Screen
        options={{
          title: 'Login',
          headerStyle: { backgroundColor: '#f4511e'},
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          }
        }}
      />
      <Image
        source={require("../assets/images/logo.png")}
        className="w-36 h-36 mb-6"
        resizeMode= "contain"
      />
      <Text className="text-2x1 font-bold text-gray-800 mb-6">
        Hola, Bienvenid@
      </Text>
      <TextInput
        className="w-full bg-white py-3 px-4 rounded-lg border border-gray-300 mb-4"
        placeholder="Ingrese su numero de cedula"
        placeholderTextColor="#a1a1a1"
        keyboardType="numeric"
        autoCapitalize="none"
      />
      <TextInput
        className="w-full bg-white py-3 px-4 rounded-lg border border-gray-300 mb-4"
        placeholder="Contraseña"
        placeholderTextColor="#a1a1a1"
        secureTextEntry
      />

      <TouchableOpacity className="w-full bg-blue-500 py-3 rounded-lg mb-4">
        <Text className="text-center text-white text-lg font-semibold">
          Iniciar Sesion
        </Text>
      </TouchableOpacity>
      <View className="flex-row justify-between w-full mt-2">
        <TouchableOpacity>
          <Text className="text-blue-500 text-sm ">
            Olvidaste tu contraseña?
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Link href="/Register">Crear cuenta</Link>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export const meta = {
  title: "Botón de Pánico", // Cambia el título aquí
};