import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { getUserApi, loginUserApi, TLoginData } from '../utils/burger-api';
import { setCookie } from '../utils/cookie';

type AuthState = {
  user: TUser | null;
  isAuthChecked: boolean;
  loginError: string | null;
  loginLoading: boolean;
};

const initialState: AuthState = {
  user: null,
  isAuthChecked: false,
  loginError: null,
  loginLoading: false
};

// Проверка авторизации при старте
export const checkUserAuth = createAsyncThunk('auth/checkUser', async () => {
  const response = await getUserApi();
  return response.user;
});

// Вход в систему
export const loginUser = createAsyncThunk(
  'auth/login',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      const res = await loginUserApi(data);
      // Сохраняем токены в localStorage и cookie
      localStorage.setItem('refreshToken', res.refreshToken);
      setCookie('accessToken', res.accessToken);
      return res.user;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка входа');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload; //  после регистрации можно было сразу сохранить пользователя в Redux
    }
  },
  extraReducers: (builder) => {
    builder
      // checkUserAuth - Проверка авторизации при старте
      .addCase(
        checkUserAuth.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.user = action.payload;
          state.isAuthChecked = true;
        }
      )
      .addCase(checkUserAuth.rejected, (state) => {
        state.user = null;
        state.isAuthChecked = true; // Уточнить - даже при ошибке авторизации мы считаем проверку завершенной, чтобы не показывать загрузку бесконечно
      })
      // loginUser - Вход в систему
      .addCase(loginUser.pending, (state) => {
        state.loginLoading = true;
        state.loginError = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.loginLoading = false;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginLoading = false;
        state.loginError = action.payload as string;
      });
  }
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
