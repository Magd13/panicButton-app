import { View, Text, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';

// Definición de tipos
type TipoAlerta = "precaucion" | "peligro";
type EstadoAlerta = "activa" | "resuelta";

interface Alerta {
  id: number;
  tipo: TipoAlerta;
  fecha: string;
  ubicacion: string;
  estado: EstadoAlerta;
  descripcion: string;
}

interface EstilosAlerta {
  icono: string;
  contenedor: string;
  texto: string;
  color: string;
}

interface PropsTarjetaAlerta {
  alerta: Alerta;
}

// Datos de ejemplo para simular las alertas
const alertasEjemplo: Alerta[] = [
  {
    id: 1,
    tipo: "precaucion",
    fecha: "2024-12-16",
    ubicacion: "Zona Norte, Sector A",
    estado: "activa",
    descripcion: "Posible inundación en la zona"
  },
  {
    id: 2,
    tipo: "peligro",
    fecha: "2024-12-15",
    ubicacion: "Zona Sur, Sector B",
    estado: "resuelta",
    descripcion: "Incendio controlado"
  }
];

const TarjetaAlerta: React.FC<PropsTarjetaAlerta> = ({ alerta }) => {
  const estilosAlerta: Record<TipoAlerta, EstilosAlerta> = {
    precaucion: {
      icono: "warning",
      contenedor: "border-l-4 border-yellow-500",
      texto: "text-yellow-700",
      color: "#f59e0b"
    },
    peligro: {
      icono: "alert-circle",
      contenedor: "border-l-4 border-red-500",
      texto: "text-red-700",
      color: "#ef4444"
    }
  };

  const estilosEstado: Record<EstadoAlerta, string> = {
    activa: "bg-green-100 text-green-800",
    resuelta: "bg-gray-100 text-gray-800"
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
        <Text className={`px-2 py-1 rounded-full text-sm ${estilosEstado[alerta.estado]}`}>
          {alerta.estado}
        </Text>
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

export default function Historyalerts() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aquí puedes cargar las alertas desde tu API o base de datos
    // Por ahora usaremos los datos de ejemplo
    setAlertas(alertasEjemplo);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text>Cargando alertas...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4 py-4">
        {alertas.map((alerta) => (
          <TarjetaAlerta key={alerta.id} alerta={alerta} />
        ))}
      </ScrollView>
    </View>
  );
}