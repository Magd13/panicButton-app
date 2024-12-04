import { View, TextInput, Image, Text } from "react-native";




export default function Register() {

    return (
        <View className="flex-1 item-center justify-center bg-gray-100 px-6">
            <Image
                source={require("../assets/images/logo.png")}
                className="w-36 h-36 mb-6"
                resizeMode= "contain"
            />
            <Text className="text-2x1 font-bold text-gray-800 mb-6">
                Llena todos los campos del siguiente formulario
            </Text>
            <TextInput
                className="w-full bg-white py-3 px-4 rounded-lg border border-gray-300 mb-4"
                placeholder="Ingrese su numero de cedula"
                placeholderTextColor="#a1a1a1"
                keyboardType="numeric"
            />
        </View>
    )
}