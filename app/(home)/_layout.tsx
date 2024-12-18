  import { router, Stack } from "expo-router";
  import "../../global.css";
  import { GestureHandlerRootView } from 'react-native-gesture-handler';
  import { Drawer } from 'expo-router/drawer';
  import { Alert } from "react-native";
  import Ionicons from '@expo/vector-icons/Ionicons';
  import { useEffect, useState } from "react";
  import * as SecureStore from 'expo-secure-store';
import { Double } from "react-native/Libraries/Types/CodegenTypes";
import { useAlert } from "../../providers/alertContext";

  interface AlertData {
    id:number;
    usuarioId: number;
    tipo_alert:string;
    mensaje:string;
    latitud:Double;
    longitud:Double;
    fecha_alerta:string;
    estado_alerta:boolean;
    foto_usuario:string;
  }

  export default function HomeLayout() {
    const { alertData, setAlertData } = useAlert();
    const [headerBackgroundColor, setHeaderBackgroundColor] = useState<string>('#0A3D62');
    const [headerTitle, setHeaderTitle] = useState<string>('Home');

    useEffect(() => {
      const loadAlertData = async () => {
        try {
          const alertJson = await SecureStore.getItemAsync('alertActual');
          if (alertJson) {
            const parsedAlertData = JSON.parse(alertJson);
            setAlertData(parsedAlertData);
          }
        } catch (error) {
          console.error('Error al cargar los datos de la alerta:', error);
        }
      };
      loadAlertData();
    }, [setAlertData]);

    
    useEffect(() => {
      if (alertData) {
        const newHeaderBackgroundColor = alertData.estado_alerta
          ? alertData.tipo_alert === 'Emergencia'
            ? '#ff0800' 
            : alertData.tipo_alert === 'Precaución'
            ? '#ff8400' 
            : '#0A3D62' 
          : '#0A3D62'; 
    
        const newHeaderTitle = alertData.estado_alerta
          ? alertData.tipo_alert === 'Emergencia'
            ? 'Alerta Emergente'
            : 'Alerta de Precaución'
          : 'Home'; 
    
        setHeaderBackgroundColor(newHeaderBackgroundColor);
        setHeaderTitle(newHeaderTitle);
      } else {
        setHeaderBackgroundColor('#0A3D62'); 
        setHeaderTitle('Home');
      }
    }, [alertData]);

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
              backgroundColor: headerBackgroundColor,
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
                drawerLabel: headerTitle,
                title: headerTitle,
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