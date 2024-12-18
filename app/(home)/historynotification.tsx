import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { useState, useEffect } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import React from "react";
import { getAllNotifications } from '../../services/notificationService';


// Definición de tipos
type TipoNotificacion = "informativa" | "alerta" | "emergencia";
type EstadoNotificacion = "leida" | "no_leida";

interface Notificacion {
  id: number;
  tipo: TipoNotificacion;
  fecha: string;
  hora: string;
  titulo: string;
  mensaje: string;
  estado: EstadoNotificacion;
}

interface EstilosNotificacion {
  icono: string;
  contenedor: string;
  texto: string;
  color: string;
}

interface PropsTarjetaNotificacion {
  notificacion: Notificacion;
}

// Datos de ejemplo
const notificacionesEjemplo: Notificacion[] = [
  {
    id: 1,
    tipo: "emergencia",
    fecha: "17 Dic 2024",
    hora: "15:30",
    titulo: "Alerta de Seguridad",
    mensaje: "Se ha detectado una alerta de pánico en tu zona",
    estado: "no_leida"
  },
  {
    id: 2,
    tipo: "alerta",
    fecha: "17 Dic 2024",
    hora: "14:45",
    titulo: "Actualización de Estado",
    mensaje: "Una alerta cercana ha sido resuelta",
    estado: "leida"
  },
  {
    id: 3,
    tipo: "informativa",
    fecha: "17 Dic 2024",
    hora: "12:00",
    titulo: "Recordatorio",
    mensaje: "Mantén actualizados tus contactos de emergencia",
    estado: "leida"
  }
];

const TarjetaNotificacion: React.FC<PropsTarjetaNotificacion> = ({ notificacion }) => {
  const estilosNotificacion: Record<TipoNotificacion, EstilosNotificacion> = {
    informativa: {
      icono: "information-circle",
      contenedor: "border-l-4 border-blue-500",
      texto: "text-blue-700",
      color: "#3b82f6"
    },
    alerta: {
      icono: "warning",
      contenedor: "border-l-4 border-yellow-500",
      texto: "text-yellow-700",
      color: "#f59e0b"
    },
    emergencia: {
      icono: "alert-circle",
      contenedor: "border-l-4 border-red-500",
      texto: "text-red-700",
      color: "#ef4444"
    }
  };

  const estilosEstado: Record<EstadoNotificacion, string> = {
    leida: "bg-gray-100 text-gray-600",
    no_leida: "bg-blue-100 text-blue-800 font-semibold"
  };

  return (
    <View 
      className={`bg-white p-4 rounded-lg shadow-md mb-4 
      ${estilosNotificacion[notificacion.tipo].contenedor}
      ${notificacion.estado === 'no_leida' ? 'bg-blue-50' : 'bg-white'}`}
    >
      <View className="flex flex-row items-center justify-between mb-2">
        <View className="flex flex-row items-center space-x-2">
          <Ionicons 
            name={estilosNotificacion[notificacion.tipo].icono as any} 
            size={24} 
            color={estilosNotificacion[notificacion.tipo].color}
          />
          <Text className="font-semibold text-lg">
            {notificacion.titulo}
          </Text>
        </View>
        <Text className={`px-2 py-1 rounded-full text-xs ${estilosEstado[notificacion.estado]}`}>
          {notificacion.estado === 'no_leida' ? 'Nueva' : 'Leída'}
        </Text>
      </View>
      
      <Text className="text-gray-600 mb-2 ml-8">
        {notificacion.mensaje}
      </Text>
      
      <View className="border-t border-gray-200 pt-2 mt-2">
        <View className="flex flex-row justify-between">
          <Text className="text-sm text-gray-500">
            {notificacion.fecha}
          </Text>
          <Text className="text-sm text-gray-500">
            {notificacion.hora}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default function Historynotification() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotificaciones = async () => {
    try {
      const data = await getAllNotifications();
      // Ordenar por fecha más reciente
      const notificacionesOrdenadas = data.sort((a, b) => 
        new Date(b.fecha + ' ' + b.hora).getTime() - 
        new Date(a.fecha + ' ' + a.hora).getTime()
      );
      setNotificaciones(notificacionesOrdenadas);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las notificaciones');
      console.error('Error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotificaciones();
  };

  useEffect(() => {
    fetchNotificaciones();
  }, []);

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-red-500 mb-4">Error: {error}</Text>
        <TouchableOpacity 
          className="bg-blue-500 px-6 py-3 rounded-lg"
          onPress={fetchNotificaciones}
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
        <Text className="mt-4 text-gray-600">Cargando notificaciones...</Text>
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
        {notificaciones.length === 0 ? (
          <View className="flex-1 justify-center items-center py-8">
            <Text className="text-gray-500 text-lg">No hay notificaciones disponibles</Text>
          </View>
        ) : (
          notificaciones.map((notificacion) => (
            <TarjetaNotificacion 
              key={notificacion.id} 
              notificacion={notificacion} 
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}