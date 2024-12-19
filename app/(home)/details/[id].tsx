import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Location from 'expo-location';

interface LocationType {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
}

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
  const [currentLocation, setCurrentLocation] = useState<LocationType | null>(null);
  const [loading, setLoading] = useState(true);
  const [routeSegments, setRouteSegments] = useState<RoutePoint[][]>([]);

  // Ubicación de la alerta (punto fijo en Quito)
  const alertLocation: AlertLocation = {
    latitude: -0.2201641,
    longitude: -78.5123274,
    address: 'Av. 6 de Diciembre y Patria, Quito, Ecuador'
  };

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
  const generateRealisticRoute = () => {
    if (!currentLocation) return [];

    // Puntos principales de la ruta
    const mainPoints: RoutePoint[] = [
      {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        type: 'main'
      },
      // Primer punto intermedio principal
      {
        latitude: currentLocation.latitude + (alertLocation.latitude - currentLocation.latitude) * 0.25,
        longitude: currentLocation.longitude + (alertLocation.longitude - currentLocation.longitude) * 0.33,
        type: 'main'
      },
      // Segundo punto intermedio principal
      {
        latitude: currentLocation.latitude + (alertLocation.latitude - currentLocation.latitude) * 0.6,
        longitude: currentLocation.longitude + (alertLocation.longitude - currentLocation.longitude) * 0.75,
        type: 'main'
      },
      // Destino
      {
        latitude: alertLocation.latitude,
        longitude: alertLocation.longitude,
        type: 'main'
      }
    ];

    // Generar segmentos de ruta con puntos intermedios
    const segments: RoutePoint[][] = [];
    
    for (let i = 0; i < mainPoints.length - 1; i++) {
      const start = mainPoints[i];
      const end = mainPoints[i + 1];
      const segment = [start];

      // Añadir puntos intermedios para cada segmento
      const intermediatePoints = 8;
      for (let j = 1; j < intermediatePoints; j++) {
        const fraction = j / intermediatePoints;
        
        // Añadir variación para curvas naturales
        const variance = 0.0001 * Math.sin(fraction * Math.PI);
        
        segment.push({
          latitude: start.latitude + (end.latitude - start.latitude) * fraction + variance,
          longitude: start.longitude + (end.longitude - start.longitude) * fraction + variance,
          type: 'intermediate'
        });
      }
      
      segment.push(end);
      segments.push(segment);
    }

    return segments;
  };

  // Actualizar los segmentos de ruta cuando cambie la ubicación
  useEffect(() => {
    if (currentLocation) {
      const segments = generateRealisticRoute();
      setRouteSegments(segments);
    }
  }, [currentLocation]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-gray-600">Cargando ubicación...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} className="flex-1">
      {/* Header */}
      <View className="w-full p-4 bg-red-500">
        <Text className="text-white text-xl font-bold text-center">
          Alerta Activa
        </Text>
      </View>

      {/* Alert Info */}
      <View className="p-4 bg-white">
        <Text className="text-lg font-semibold mb-2">Información de la Alerta</Text>
        <View className="space-y-2">
          <Text className="text-gray-700">
            <Text className="font-medium">Fecha: </Text>
            {new Date().toLocaleString()}
          </Text>
          <Text className="text-gray-700">
            <Text className="font-medium">Ubicación de emergencia: </Text>
            {alertLocation.address}
          </Text>
          <Text className="text-gray-700">
            <Text className="font-medium">Estado: </Text>
            <Text className="text-red-500">Activa</Text>
          </Text>
        </View>
      </View>

      {/* Map */}
      {currentLocation && (
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
              <View style={{
                padding: 5,
                backgroundColor: 'white',
                borderRadius: 50,
                borderWidth: 3,
                borderColor: '#2196F3',
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
              }}>
                <Ionicons name="location-sharp" size={24} color="#2196F3" />
              </View>
            </Marker>

            {/* Marcador de la alerta */}
            <Marker
              coordinate={alertLocation}
              title="Ubicación de emergencia"
              description={alertLocation.address}
            >
              <View style={{
                padding: 5,
                backgroundColor: 'white',
                borderRadius: 50,
                borderWidth: 3,
                borderColor: '#FF0000',
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
              }}>
                <Ionicons name="warning" size={24} color="#FF0000" />
              </View>
            </Marker>

            {/* Rutas segmentadas */}
            {routeSegments.map((segment, index) => (
              <Polyline
                key={index}
                coordinates={segment}
                strokeColor="#FF0000"
                strokeWidth={3}
                lineDashPattern={[5]}
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
          {currentLocation ? 'Ruta sugerida hacia la ubicación de emergencia' : 'Cargando ruta...'}
        </Text>
      </View>
    </View>
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