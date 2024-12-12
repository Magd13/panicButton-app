import { Stack } from "expo-router";
import "../../global.css";

export default function HomeLayout() {
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
        name="perfil"
        options={{
          title: 'Mi perfil',
        }}
      />

      <Stack.Screen 
        name="historyalerts"
        options={{
          title: 'Historial de Alertas',
        }}
      />
      <Stack.Screen 
        name="historynotification"
        options={{
          title: 'Historial de notificaciones',
        }}
      />
    </Stack>
  );
}