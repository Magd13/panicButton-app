import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Alert, ActivityIndicator, TouchableOpacity } from "react-native";
import MapView, {Marker} from "react-native-maps/lib";
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Location from 'expo-location';
import '../../global.css';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
interface LocationType {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }

export default function MapPage() {
    const [location, setLocation ] = useState<LocationType | null>(null);
    const [loading, setLoading] = useState(true);
    const [panicActivated, setPanicActivated] = useState(false); 

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
    },[]);

    const toggleButtonPanicMode = () => {
        if (panicActivated) {
            console.log("Alarma encendida")
        } else {
            console.log("Alarma apagada")
        }
        setPanicActivated(!panicActivated)
    }

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
                        <Ionicons name="radio-button-on-sharp" size={30} color="green" />
                    </Marker>
                </MapView>
            ):(
                <AlertText/>
            )}
            <View className="absolute bottom-10 w-full items-center">
                <TouchableOpacity
                    onPress={toggleButtonPanicMode}
                    className="p-4 bg-gray-200 rounded-full"
                >
                    <FontAwesome5 name="power-off" 
                    size={28} 
                    color={panicActivated ? "green" : "red"}
                    />
                </TouchableOpacity>
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
  });

function AlertText() {
    return <Text className="text-center text-red-500">No se pudo cargar la ubicación.</Text>;
  }