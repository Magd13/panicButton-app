import { Stack } from "expo-router";
import "../global.css";


export default function RootLayout() {
  return (
    <Stack 
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0A3D62',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        }
      }}>
      <Stack.Screen 
        name="index"
        options={{
          headerShown: false,
        }}
      />
      
      <Stack.Screen 
        name="Login"
        options={{
          title: 'Iniciar Sesión',
        }}
      />
      <Stack.Screen
        name='(home)'
        options={{
          title: 'Home',
          headerShown: false,          
        }}
      />
      <Stack.Screen 
        name="Register"
        options={{
          title: 'Crear Cuenta',
        }}
      />
    </Stack>
  );
}