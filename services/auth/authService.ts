import axios from '../axiosClient';
import * as SecureStore from 'expo-secure-store';
import { LoginRequest, RegisterRequest, UserResponse } from './interfacesAuth';
import { loginSuccess, logOut } from '../../redux/store/authSlice';
import { AppDispatch } from '../../redux/store';

export const login = async (data: LoginRequest, dispatch: AppDispatch): Promise<Boolean> => {
  try {
    const response = await axios.post<UserResponse>('/auth/login', data);
    if (response.status === 201) {
      const { access_token, payload } = response.data;
      await SecureStore.setItemAsync('token', access_token)
      dispatch(loginSuccess({token: access_token, user: payload}))
      return true
    }
    return false
  } catch (error:any) {
    if (error.response){
      console.log('error>', error.response.data.message)
      throw new Error(error.respose.data || 'Error en el inicio de sesión');
    } else {
      throw new Error('No se pudo conectar con el servidor')
    }
  }
}

export const logout = async (dispatch: AppDispatch) => {
  await SecureStore.deleteItemAsync('token');
  dispatch(logOut());
};

export const register = async (data: RegisterRequest): Promise<UserResponse> => {
  try {
    console.log('registrando...')
    const response = await axios.post<UserResponse>('/users/register', data);
    return response.data;
  } catch (error: any) {
    console.log('error', error.response.message)
    if (error.response) {
      throw new Error(error.response.data.message || 'Error al registrar usuario');
    } else {
      throw new Error('No se pudo conectar con el servidor');
    }
  }
};
