import { router } from "expo-router";
import "../../global.css";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Alert } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { createContext, useState, useContext } from 'react';

function DrawerNavigator() {
  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar Sesión", onPress: () => {
            console.log("Sesión cerrada");
            router.push("/");
          }
        }
      ]
    );
  };

  return (
    <Drawer
      screenOptions={{
        headerStyle: {
          backgroundColor: '#EF4444',
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
      <Drawer.Screen
        name="editProfile" // Debe coincidir con el nombre del archivo
        options={{
          headerShown: true,
          drawerLabel: 'Editar Perfil',
          title: 'Editar Perfil',
          drawerItemStyle: { display: 'none' }, // Ocultar en el drawer
          drawerIcon: () => <Ionicons name="create" size={24} color="black" />
        }}
      />
    </Drawer>

  );
}

export default function HomeLayout() {

  return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <DrawerNavigator  />
      </GestureHandlerRootView>
  );
}