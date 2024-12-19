import '../../global.css';
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Alert, ActivityIndicator, TouchableOpacity } from "react-native";
import MapView, {Marker} from "react-native-maps/lib";
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Location from 'expo-location';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import * as SecureStore from 'expo-secure-store';
import {AlertResponse, AlertRequest, cambiarEstado, register} from "../../services/alertService"
import { useAlert } from "../../providers/alertContext";
import { PanGestureHandler, GestureHandlerRootView, GestureEvent, PanGestureHandlerEventPayload} from "react-native-gesture-handler"; 

export interface LocationType {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }

export default function MapPage() {
    const [location, setLocation ] = useState<LocationType | null>(null);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<any>(null);
    const { alertData, setAlertData } = useAlert();
    const [stateButton, setStateButton] = useState(false);
    const { clearAlert } = useAlert(); 
    const [showAlertButtons, setShowAlertButtons] = useState(false);
    const [dragged, setDragged] = useState<number>(0);
    const [isPressed, setIsPressed] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    useEffect(()=>{
        const getLocation = async()=>{
            try {
                const {status} = await Location.requestForegroundPermissionsAsync(); 
                if (status !== 'granted') {
                    Alert.alert('Permisos denegados','Se requiere permisos para acceder a tu ubicación');
                    setLoading(false);
                    return;
                }
                const currentLocation = await Location.getCurrentPositionAsync({});
                setLocation({
                    latitude: currentLocation.coords.latitude,
                    longitude: currentLocation.coords.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                });
                setLoading(false);
            }catch (error) {
                console.error('Error obteniendo la ubicación:', error);
                Alert.alert('Error', 'No se pudo obtener la ubicación.');
                setLoading(false);
            }
        };
        getLocation();
        const loadDataUser = async () => {
            try {
                const storedUserData = await SecureStore.getItemAsync('userData')
                if (storedUserData) {
                    const parsedData = JSON.parse(storedUserData);
                    setUserData(parsedData);
                }
            }catch (error) {
                console.error('Error al cargar los datos del usuario:', error);
            }
        };
        loadDataUser();
    },[]);

    const toggleButtonPanicMode = async (alertType: string) => {
        try {
            if(stateButton) {
                if (location === null) {
                    Alert.alert('Error', 'La ubicación no está disponible.');
                    return; 
                }
                if (!alertData || typeof alertData.id !== 'number') {
                    Alert.alert('Error', 'No se encontró un ID de alerta válido.');
                    return;
                }
                const updateAlert : AlertResponse = {
                    id: alertData.id,
                    usuarioId:userData.id,
                    tipo_alert: alertData.tipo_alert,
                    mensaje:alertData.mensaje,
                    latitud:alertData.latitud,
                    longitud:alertData.longitud,
                    fecha_alerta:alertData.fecha_alerta,
                    estado_alerta: false,
                    foto_usuario: alertData.foto_usuario,
                }
                const response = await cambiarEstado(updateAlert);
                if(response) {
                    Alert.alert('Alerta desactivada', 'La alerta ha sido desactivada con éxito.');
                    setAlertData(null);
                    clearAlert(); 
                    await SecureStore.deleteItemAsync('alertActual');
                    setStateButton(false);
                }
            } else if(!stateButton){
                const now = new Date();
                const formattedDate = now.toISOString();
                const alertMessage = alertType === 'Emergencia' ? 'Alerta activada desde el botón de pánico' : 'Alerta de precaución activada desde el botón de pánico';
                console.log("Tipo", alertType)
                if (!location) {
                    Alert.alert('Error', `No se pudo obtener la ubicación al enviar la alerta de ${alertType}.`);
                    return;
                }
                const registerAlert: AlertRequest = {
                    usuarioId: userData.id,
                    tipo_alert: alertType,
                    mensaje: alertMessage,
                    latitud: location.latitude,
                    longitud: location.longitude,
                    fecha_alerta: formattedDate,
                    estado_alerta: true,
                    foto_usuario: userData.foto_perfil,
                };
                const response = await register(registerAlert);
                if (response) {
                    Alert.alert('Alerta enviada', `La alerta de ${alertType} ha sido enviada con éxito.`);
                    await SecureStore.setItemAsync('alertActual', JSON.stringify(response));
                    setAlertData(response);
                    setStateButton(true);
                }
            } 
        }catch (error) {
            console.error("Error al enviar la alerta:", error);
            Alert.alert("Error", "No se pudo enviar la alerta.");
        }
    }
    
    const handleGestureEvent = (event: GestureEvent<PanGestureHandlerEventPayload>) => {
        const { translationX } = event.nativeEvent;
        setDragged(translationX);
      };
      
      const handleStateChange = (event: GestureEvent<PanGestureHandlerEventPayload>) => {
        const { translationX, state } = event.nativeEvent;
      
        const thresholdPrecaution = -100;
        const thresholdEmergency = 100;
      
        if (state === 5) { 
            setDragged(0); 
            if(stateButton) {
                toggleButtonPanicMode('Desactivacion')
            } else if (translationX < thresholdPrecaution && !stateButton) {
                console.log("Alerta de precaución activada");
                toggleButtonPanicMode("Precaución");
            } else if (translationX > thresholdEmergency && !stateButton) {
                console.log("Alerta de emergencia activada");
                toggleButtonPanicMode("Emergencia");
          }
        }
      };

    const handlePressIn = () => { 
      setShowAlertButtons(true);
    };
    
    const handlePressOut = () => { 
        setShowAlertButtons(false);
        setDragged(0);
    };
    
    const getAlertColor = (typeAlert?: string): string => {
        switch (typeAlert) {
          case "Emergencia":
            return "#ff0800";
          case "Precaución":
            return "#ff8400";
          default:
            return "#0A3D62";
        }
    };
    

    return (
        <View style={styles.container} className="flex-1">
            {loading ? (
                <ActivityIndicator className="flex-1 items-center justify-center" size="large" color="#0000ff" />
            ): location ? (
                <MapView
                    style={styles.map}
                    className="w-full h-screen"
                    initialRegion={location}
                >
                    <Marker coordinate={location} title="Estas aqui">
                        <Ionicons name="radio-button-on-sharp" size={30} color={getAlertColor(alertData?.tipo_alert)}/>
                    </Marker>
                </MapView>
            ):(
                <AlertText/>
            )}
            <View style={styles.alertContainer}>
                { showAlertButtons && (
                    <TouchableOpacity style={styles.exclamationButton}>
                        <FontAwesome5 name="exclamation-triangle" size={28} color="#ff8400" />
                    </TouchableOpacity>
                )}

                <GestureHandlerRootView >
                <PanGestureHandler
                    onGestureEvent={handleGestureEvent}
                    onHandlerStateChange={handleStateChange}
                >
                        <TouchableOpacity
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            style={styles.powerButton}
                        >
                            <FontAwesome5
                                name="power-off"
                                size={35}
                                color={getAlertColor(alertData?.tipo_alert)}
                            />
                        </TouchableOpacity>
                    </PanGestureHandler>
                </GestureHandlerRootView>
                { showAlertButtons && (
                    <TouchableOpacity style={styles.handButton}>
                        <FontAwesome5 name="hands-helping" size={24} color="#ff0800" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
      
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      width: '100%',
      height: '100%',
    },
    alertContainer: {
        position: 'absolute',
        bottom: 10,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    exclamationButton: {
        position: 'relative',
        left: 5,
        padding: 10,
        borderRadius: 30,
    },
    powerButton: {
        position: 'relative',
        bottom: '30%', 
        left: '40%',
        padding: 10,
        borderRadius: 30,
    },
    handButton: {
        position: 'relative',
        right: 5,
        padding: 10,
        borderRadius: 30,
    },
  });

function AlertText() {
    return <Text className="text-center text-red-500">No se pudo cargar la ubicación.</Text>;
  }