
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserResponse } from "../../services/auth/interfacesAuth"


interface AuthState {
  isAuthenticated: boolean
  token: string | null;
  user: UserResponse | null
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
    loginSuccess(state, action: PayloadAction<{ token: string; user: UserResponse}>){
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
