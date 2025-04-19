
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserResponse } from "../../services/auth/interfacesAuth"


interface AuthState {
  isAuthenticated: boolean
  token: string | null;
  user: {
    id: string
    nombre: string;
    apellido: string;
    cedula: string;
    email: string;
    telefono: string;
    fecha_registro: string;
    fecha_nacimiento: Date;
    contacto_emergencia: string;
    tipo_sangre: string;
  } | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
};

const userSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ token: string; user: AuthState['user']}>){
      state.isAuthenticated = true
      state.token = action.payload.token
      state.user = action.payload.user
    },
    logOut(state){
      state.isAuthenticated = false
      state.token = null
      state.user = null
    },
  },
});

export const { loginSuccess, logOut } = userSlice.actions;
export default userSlice.reducer;
