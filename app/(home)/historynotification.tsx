import { View, Text, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import React from "react";

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

  useEffect(() => {
    // Aquí podrías cargar las notificaciones desde tu API
    setNotificaciones(notificacionesEjemplo);
    setLoading(false);
  }, []);

  return (
    <View className="flex-1 bg-gray-50">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Text>Cargando notificaciones...</Text>
        </View>
      ) : (
        <ScrollView className="flex-1 px-4 py-4">
          {notificaciones.map((notificacion) => (
            <TarjetaNotificacion 
              key={notificacion.id} 
              notificacion={notificacion} 
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}