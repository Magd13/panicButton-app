import axios, { AxiosInstance } from 'axios';

const Axios: AxiosInstance = axios.create({
    baseURL: 'http://192.168.100.4:3000',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
})

Axios.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

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