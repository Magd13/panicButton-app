import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native';
import { router } from 'expo-router';

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F2F2F2' }}>
      {/* Encabezado */}
      <View style={{
        width: '100%',
        backgroundColor: '#0A3D62',
        paddingVertical: 16,
        paddingHorizontal: 24,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}>
        <Text style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: '#FFFFFF',
          textAlign: 'center',
        }}>
          Botón de Pánico Community
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }}>
        <View style={{
          flexDirection: 'column',
          alignItems: 'center',
          paddingHorizontal: 24,
          paddingVertical: 32,
          gap: 32,
        }}>
          {/* Video placeholder */}
          <View style={{
            width: '100%',
            aspectRatio: 16 / 9,
            backgroundColor: '#FFFFFF',
            borderWidth: 2,
            borderColor: '#E0E0E0',
            borderRadius: 8,
            overflow: 'hidden',
          }}>
            <Image 
              source={require('../assets/images/demo.gif')}
              style={{
                width: '100%',
                height: '100%',
              }}
              resizeMode="cover"
            />
          </View>

          {/* Descripción de la App */}
          <View style={{ width: '100%' }}>
            <Text style={{
              color: '#2C2C2C',
              fontSize: 18,
              textAlign: 'center',
              lineHeight: 24,
            }}>
              Mantén tu seguridad al alcance de tu mano con nuestra aplicación Botón de Pánico Community. 
              Con un simple doble clic en el botón de encendido de tu teléfono, podrás activar una alerta 
              inmediata que notificará a tus contactos de confianza y servicios de emergencia. Nuestra comunidad 
              trabaja unida para crear un entorno más seguro para todos. Únete a la red de protección comunitaria 
              y mantente conectado con quienes más te importan en momentos de necesidad.
            </Text>
          </View>

          {/* Botón de Iniciar Sesión */}
          <TouchableOpacity 
            style={{
              width: '100%',
              backgroundColor: '#0A3D62',
              paddingVertical: 16,
              borderRadius: 8,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
            onPress={() => router.push("/Login")}
            activeOpacity={0.8}
          >
            <Text style={{
              color: '#FFFFFF',
              fontSize: 18,
              fontWeight: '600',
              textAlign: 'center',
            }}>
              Iniciar Sesión
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}