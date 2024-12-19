import React, { useEffect, useState } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Location from 'expo-location';
import { AlertResponse, getAlertById } from '../../../services/alertService';
import { LocationType } from '../index';

interface AlertLocation {
    latitude: number;
    longitude: number;
    address: string;
}

interface RoutePoint {
    latitude: number;
    longitude: number;
    type?: 'main' | 'intermediate';
}

export default function AlertRouteScreen() {
  const { id } = useLocalSearchParams();
  const [currentLocation, setCurrentLocation] = useState<LocationType | null>(null);
  const [loading, setLoading] = useState(true);
  const [routeSegments, setRouteSegments] = useState<RoutePoint[][]>([]);
  const [alertData, setAlertData ] = useState<AlertResponse | null>(null);
  const [alertLocatio, setAlertLocation] = useState<AlertLocation | null>(null);
  const [alertAddress, setAlertAddress] = useState<string>('Cargando dirección...');


  const obtenerDireccion = async (latitud: number, longitud: number): Promise<string> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return `${latitud.toFixed(6)}, ${longitud.toFixed(6)}`;
      }

      const result = await Location.reverseGeocodeAsync({
        latitude: latitud,
        longitude: longitud
      });

      if (result[0]) {
        const direccion = result[0];
        return `${direccion.street || ''} ${direccion.name || ''}, ${direccion.district || direccion.city || ''}`.trim();
      }

      return `${latitud.toFixed(6)}, ${longitud.toFixed(6)}`;
    } catch (error) {
      console.error('Error al obtener dirección:', error);
      return `${latitud.toFixed(6)}, ${longitud.toFixed(6)}`;
    }
  };

  // Ubicación de la alerta (punto fijo en Quito)
  const alertLocation: AlertLocation = {
    latitude: -0.2201641,
    longitude: -78.5123274,
    address: 'Av. 6 de Diciembre y Patria, Quito, Ecuador'
  };
  //Obtener datos del alerta
  useEffect(() => {
    const getAlert = async () => {
      try {
        const data = await getAlertById(Number(id));
        setAlertData(data);
         const direccion = await obtenerDireccion(data.latitud, data.longitud);
         console.log("Dirc",direccion)
        setAlertAddress(direccion);
        if(currentLocation) {
          const segments = generateRealisticRoute(
            currentLocation,
            {latitude:data.latitud, longitude: data.longitud}
          );
          setRouteSegments(segments);
        }
      }catch (error) {
        console.error('Error fetching alert data:', error);
        Alert.alert('Error', 'No se pudieron obtener los datos de la alerta');
      }
    };
    if(id && currentLocation) {
      getAlert();
    }
  },[id, currentLocation])

  

  // Obtener la ubicación actual
  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permisos denegados',
            'Se requiere permisos para acceder a tu ubicación'
          );
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });
        setLoading(false);
      } catch (error) {
        console.error('Error obteniendo la ubicación:', error);
        Alert.alert('Error', 'No se pudo obtener la ubicación.');
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  // Generar una ruta más realista
  const generateRealisticRoute = (start: LocationType, end: { latitude: number; longitude: number }) => {
    const segments: RoutePoint[][] = [];
    const totalSegments = 3; 

    for (let i = 0; i < totalSegments; i++) {
      const segmentStart = i === 0 ? start : {
        latitude: start.latitude + (end.latitude - start.latitude) * (i / totalSegments),
        longitude: start.longitude + (end.longitude - start.longitude) * (i / totalSegments)
      };

      const segmentEnd = i === totalSegments - 1 ? end : {
        latitude: start.latitude + (end.latitude - start.latitude) * ((i + 1) / totalSegments),
        longitude: start.longitude + (end.longitude - start.longitude) * ((i + 1) / totalSegments)
      };

      const segment = createDetailedSegment(
        segmentStart as RoutePoint,
        segmentEnd as RoutePoint,
        10 
      );
      segments.push(segment);
    }

    return segments;
  };

  // Función para crear un segmento detallado con puntos intermedios
  const createDetailedSegment = (start: RoutePoint, end: RoutePoint, points: number) => {
    const segment: RoutePoint[] = [start];
    
    for (let i = 1; i < points - 1; i++) {
      const fraction = i / points;
      // Añadir variación sinusoidal para simular curvas naturales
      const variance = 0.0002 * Math.sin(fraction * Math.PI * 2);
      
      segment.push({
        latitude: start.latitude + (end.latitude - start.latitude) * fraction + variance,
        longitude: start.longitude + (end.longitude - start.longitude) * fraction + variance,
        type: 'intermediate'
      });
    }
    
    segment.push(end);
    return segment;
  };

  // Actualizar los segmentos de ruta cuando cambie la ubicación
  useEffect(() => {
    if (currentLocation && alertData) {
      const segments = generateRealisticRoute( currentLocation,
        {latitude:alertData.latitud, longitude: alertData.longitud});
      setRouteSegments(segments);
    }
  }, [currentLocation, alertData]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  
  return (
    <>
      <Stack.Screen 
        options={{
          headerTitle: "Ruta de Alerta",
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#ef4444',
          }
        }} 
      />
      <View style={styles.container} className="flex-1">
        {/* Alert Info */}
        <View className="p-4 bg-white">
          <Text className="text-lg font-semibold mb-2">Información de la Alerta</Text>
          <View className="space-y-2">
            <Text className="text-gray-700">
              <Text className="font-medium">Fecha: </Text>
              {alertData?.fecha_alerta || 'Cargando...'}
            </Text>
            <Text className="text-gray-700">
              <Text className="font-medium">Ubicación de emergencia: </Text>
              {alertAddress}
            </Text>
            <Text className="text-gray-700">
              <Text className="font-medium">Estado: </Text>
              <Text className="text-red-500">{alertData?.estado_alerta ? 'Activa' : 'Desactivada'}</Text>
            </Text>
          </View>
        </View>

        {/* Map */}
        {currentLocation && alertData && (
          <View className="flex-1">
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }}
            >
              {/* Marcador de ubicación actual */}
              <Marker
                coordinate={{
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                }}
                title="Tu ubicación actual"
              >
                <Ionicons name="radio-button-on-sharp" size={30} color="blue" />
              </Marker>

              {/* Marcador de la alerta */}
              <Marker
                coordinate={{
                  latitude: alertData.latitud,
                  longitude: alertData.longitud,
                }}
                title="Ubicación de emergencia"
                description={alertAddress}
              >
                <Ionicons name="warning" size={30} color="red" />
              </Marker>

              {/* Rutas segmentadas */}
              {routeSegments.map((segment, index) => (
                <Polyline
                  key={index}
                  coordinates={segment}
                  strokeColor="#FF0000"
                  strokeWidth={4}
                  lineDashPattern={[1]}
                />
              ))}
            </MapView>
          </View>
        )}

        {/* Bottom Info */}
        <View className="p-4 bg-white">
          <Text className="text-red-500 text-center font-bold">
            ¡Persona en situación de peligro!
          </Text>
          <Text className="text-gray-600 text-center text-sm mt-1">
            {currentLocation && alertData ? 'Ruta sugerida hacia la ubicación de emergencia' : 'Cargando ruta...'}
          </Text>
        </View>
      </View>
    </>
  );
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