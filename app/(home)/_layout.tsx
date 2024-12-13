import { router, Stack } from "expo-router";
import "../../global.css";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Alert } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';


export default function HomeLayout() {
  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Cerrar Sesión", onPress: () =>{
          console.log("Sesión cerrada"); 
          router.push("/");
        }}
      ]
    );
  };

  return (
    <GestureHandlerRootView>
      <Drawer
        screenOptions={{
        headerStyle: {
          backgroundColor: '#0A3D62',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        }
      }}>
        <Drawer.Screen
           name="index"
           options={{
             headerShown: true,
             drawerLabel: 'Home',
             title: 'Activo',
             drawerIcon: () => <Ionicons name="home" size={24} color="black" />
           }}
        />
        <Drawer.Screen
           name="historyalerts"
           options={{
             headerShown: true,
             drawerLabel: 'Historial de alertas',
             title: 'Mis Alertas',
             drawerIcon: () => <Ionicons name="alert-circle" size={24} color="black" />
            }}
        />
        <Drawer.Screen
           name="historynotification"
           options={{
             headerShown: true,
             drawerLabel: 'Historial de notificaciones',
             title: 'Notificaciones',
             drawerIcon: () => <Ionicons name="notifications" size={24} color="black" />
            }}
        />
        <Drawer.Screen
           name="perfil"
           options={{
             headerShown: true,
             drawerLabel: 'Perfil',
             title: 'Mi perfil',
             drawerIcon: () => <Ionicons name="person" size={24} color="black" />
           }}
        />
      </Drawer>  
    </GestureHandlerRootView>
  );
}