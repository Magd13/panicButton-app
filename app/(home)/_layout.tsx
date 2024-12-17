import { router } from "expo-router";
import "../../global.css";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Alert } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { createContext, useState, useContext } from 'react';

// Definir el tipo para el contexto
interface AlertContextType {
  panicActivated: boolean;
  setPanicActivated: (value: boolean) => void;
}

// Crear el contexto
export const AlertContext = createContext<AlertContextType>({
  panicActivated: false,
  setPanicActivated: () => null,
});

// Hook personalizado
export const useAlert = () => useContext(AlertContext);

function DrawerNavigator({ panicActivated }: { panicActivated: boolean }) {
  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Cerrar Sesión", onPress: () => {
          console.log("Sesión cerrada"); 
          router.push("/");
        }}
      ]
    );
  };

  return (
    <Drawer
      screenOptions={{
        headerStyle: {
          backgroundColor: panicActivated ? '#EF4444' : '#0A3D62',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          headerShown: true,
          drawerLabel: 'Home',
          title: panicActivated ? 'Alerta enviada' : 'Activo',
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
      <Drawer.Screen
        name="Ruta de Alerta"
        options={{
          headerShown: true,
          drawerLabel: 'Ruta de Alerta',
          title: 'Ruta de Alerta',
          drawerIcon: () => <Ionicons name="person" size={24} color="black" />
        }}
      />
    </Drawer>
  );
}

export default function HomeLayout() {
  const [panicActivated, setPanicActivated] = useState(false);

  return (
    <AlertContext.Provider value={{ panicActivated, setPanicActivated }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <DrawerNavigator panicActivated={panicActivated} />
      </GestureHandlerRootView>
    </AlertContext.Provider>
  );
}