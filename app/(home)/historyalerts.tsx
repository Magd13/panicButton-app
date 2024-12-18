import { 
  View, 
  Text, 
  ScrollView, 
  ActivityIndicator, 
  TouchableOpacity,
  RefreshControl,
  Alert 
} from "react-native";
import { useState, useEffect } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import { getAllAlerts, deleteAlert } from '../../services/alertService';
import * as Location from 'expo-location';

// Interfaces
interface Alert {
  id: number;
  usuarioId: number;
  tipo_alert: "Emergencia" | "Precaución";
  mensaje: string;
  latitud: number;
  longitud: number;
  fecha_alerta: string;
}

interface AlertaUI {
  id: number;
  tipo: "precaucion" | "peligro";
  fecha: string;
  ubicacion: string;
  estado: "activa" | "resuelta";
  descripcion: string;
}

interface EstilosAlerta {
  icono: string;
  contenedor: string;
  texto: string;
  color: string;
}

interface PropsTarjetaAlerta {
  alerta: AlertaUI;
  onDelete: (id: number) => void;
}

// Componente TarjetaAlerta
const TarjetaAlerta: React.FC<PropsTarjetaAlerta> = ({ alerta, onDelete }) => {
  const estilosAlerta: Record<"precaucion" | "peligro", EstilosAlerta> = {
    precaucion: {
      icono: "warning-outline",
      contenedor: "border-l-4 border-yellow-500",
      texto: "text-yellow-700",
      color: "#f59e0b"
    },
    peligro: {
      icono: "alert-circle-outline",
      contenedor: "border-l-4 border-red-500",
      texto: "text-red-700",
      color: "#ef4444"
    }
  };

  const estilosEstado: Record<"activa" | "resuelta", string> = {
    activa: "bg-green-100 text-green-800",
    resuelta: "bg-gray-100 text-gray-800"
  };

  const handleDeletePress = () => {
    Alert.alert(
      "Eliminar Alerta",
      "¿Estás seguro de que deseas eliminar esta alerta?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: () => onDelete(alerta.id),
          style: "destructive"
        }
      ]
    );
  };

  return (
    <View className={`bg-white p-4 rounded-lg shadow-md mb-4 ${estilosAlerta[alerta.tipo].contenedor}`}>
      <View className="flex flex-row items-center justify-between mb-2">
        <View className="flex flex-row items-center space-x-2">
          <Ionicons 
            name={estilosAlerta[alerta.tipo].icono as any} 
            size={24} 
            color={estilosAlerta[alerta.tipo].color}
          />
          <Text className={`font-semibold capitalize ${estilosAlerta[alerta.tipo].texto}`}>
            {alerta.tipo}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Text className={`px-2 py-1 rounded-full text-sm ${estilosEstado[alerta.estado]} mr-2`}>
            {alerta.estado}
          </Text>
          <TouchableOpacity onPress={handleDeletePress}>
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
      
      <Text className="text-gray-600 mb-2">{alerta.descripcion}</Text>
      
      <View className="border-t border-gray-200 pt-2 mt-2">
        <View className="flex flex-row justify-between">
          <Text className="text-sm text-gray-500">
            {alerta.fecha}
          </Text>
          <Text className="text-sm text-gray-500">
            {alerta.ubicacion}
          </Text>
        </View>
      </View>
    </View>
  );
};

// Componente principal Historyalerts
export default function Historyalerts() {
  const [alertas, setAlertas] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [direcciones, setDirecciones] = useState<Record<string, string>>({});

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

  const fetchAlertas = async () => {
    try {
      const alertasData = await getAllAlerts();
      setAlertas(alertasData);
      
      // Obtener direcciones para cada alerta
      const direccionesTemp: Record<string, string> = {};
      for (const alerta of alertasData) {
        const direccion = await obtenerDireccion(alerta.latitud, alerta.longitud);
        direccionesTemp[alerta.id] = direccion;
      }
      setDirecciones(direccionesTemp);
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las alertas');
      console.error('Error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDeleteAlert = async (id: number) => {
    try {
      await deleteAlert(id);
      setAlertas(alertas.filter(alerta => alerta.id !== id));
    } catch (error) {
      Alert.alert(
        "Error",
        "No se pudo eliminar la alerta. Por favor, intenta de nuevo."
      );
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAlertas();
  };

  useEffect(() => {
    fetchAlertas();
  }, []);

  // Función para formatear la fecha
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para convertir el tipo de alerta del backend al formato de la UI
  const convertirTipoAlerta = (tipo: string): "precaucion" | "peligro" => {
    return tipo === "Precaución" ? "precaucion" : "peligro";
  };

  // Función para convertir los datos de la API al formato de la UI
  const convertirAlerta = (alerta: Alert): AlertaUI => ({
    id: alerta.id,
    tipo: convertirTipoAlerta(alerta.tipo_alert),
    fecha: formatearFecha(alerta.fecha_alerta),
    ubicacion: direcciones[alerta.id] || `${alerta.latitud.toFixed(6)}, ${alerta.longitud.toFixed(6)}`,
    estado: "activa",
    descripcion: alerta.mensaje
  });

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-red-500 mb-4">Error: {error}</Text>
        <TouchableOpacity 
          className="bg-blue-500 px-6 py-3 rounded-lg"
          onPress={fetchAlertas}
        >
          <Text className="text-white font-medium">Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-gray-600">Cargando alertas...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView 
        className="flex-1 px-4 py-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#0000ff"]}
          />
        }
      >
        {alertas.length === 0 ? (
          <View className="flex-1 justify-center items-center py-8">
            <Text className="text-gray-500 text-lg">No hay alertas disponibles</Text>
          </View>
        ) : (
          alertas.map((alerta) => (
            <TarjetaAlerta 
              key={alerta.id} 
              alerta={convertirAlerta(alerta)}
              onDelete={handleDeleteAlert}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}