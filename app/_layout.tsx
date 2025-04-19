import { Stack } from "expo-router";
import "../global.css";
import { AlertProvider } from "../providers/alertContext";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../redux/store';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AlertProvider>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: '#0A3D62',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen
              name="index"
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="login"
              options={{ title: 'Iniciar Sesión' }}
            />

            <Stack.Screen
              name="(home)"
              options={{ title: 'Home', headerShown: false }}
            />

            <Stack.Screen
              name="register"
              options={{ title: 'Crear Cuenta' }}
            />
          </Stack>
        </AlertProvider>
      </PersistGate>
    </Provider>
  );
}
