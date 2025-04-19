import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';

const Axios: AxiosInstance = axios.create({
    baseURL: 'http://192.168.100.4:3000',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
})

Axios.interceptors.request.use(async config => {
  const token = await SecureStore.getItemAsync('token');

  const noAuthRoutes = ['/users/register', '/auth/login'];

  const isNoAuthRoute = noAuthRoutes.some(route => config.url?.includes(route));

  if (token && !isNoAuthRoute) {
    config.headers.Authorization = `${token}`;
  }

  return config;
});

Axios.interceptors.response.use (
    (response) => response,
    (error) => {
        if (error.response) {
          console.error('Error en la respuesta:', error.response.data);
        } else if (error.request) {
          console.error('Error en la solicitud:', error.request);
        } else {
          console.error('Error general:', error.message);
        }
        return Promise.reject(error);
    }
);

export default Axios;