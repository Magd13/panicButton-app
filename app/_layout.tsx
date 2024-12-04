import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <Stack 
      screenOptions={{
        headerShown: false, // Esto oculta el encabezado en todas las pantallas
      }}>
      <Stack.Screen 
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="Register"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}