import AsyncStorage from '@react-native-async-storage/async-storage';
import http from './http';

// Rutas relativas - http.tsx agregará el API_URL base
const URL_USER = '/usuario';
const URL_AUTH = '/password';

type LoginCredentials = {
  username: string;
  password: string;
};

type LoginResponse = {
  jwt: string;
  username: string;
  message?: string;
};

type Usuario = {
  username: string;
  password: string;
  email?: string;
  [key: string]: any;
};

type ResetPasswordData = {
  email: string;
  token: string;
  newPassword: string;
};

export const usuarioApi = {
  registrarUsuario: async (usuario: Usuario) => {
    try {
      const { data } = await http.post(`${URL_USER}/registrar-admin`, usuario, { skipAuth: true });
      return data;
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw new Error('Error al registrar usuario');
    }
  },

  login: async (usuario: LoginCredentials): Promise<LoginResponse> => {
    try {
      console.log('🔐 Intentando login con:', { username: usuario.username });
      const { data } = await http.post(`${URL_USER}/login`, usuario, { skipAuth: true });
      console.log('✅ Login exitoso:', data);
      return data;
    } catch (error: any) {
      console.error('❌ Error de login completo:', error);
      console.error('❌ Error message:', error?.message);
      throw error;
    }
  },

  eliminarCuenta: async (nombreNegocio: string) => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      const response = await fetch(`${URL_USER}/${nombreNegocio}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al eliminar cuenta:', error);
      throw error;
    }
  },

  refreshToken: async (refreshToken?: string) => {
    try {
      const storedRefreshToken = refreshToken || await AsyncStorage.getItem('refreshToken');
      
      const { data } = await http.post(`${URL_USER}/refresh`, { 
        refreshToken: storedRefreshToken 
      });
      return data;
    } catch (error) {
      console.error('Error al refrescar token:', error);
      throw new Error('Error al refrescar token');
    }
  },

  forgotPassword: async (email: string) => {
    try {
      const { data } = await http.post(
        `${URL_AUTH}/password/forgot`,
        { email: String(email || '').trim() },
        { skipAuth: true }
      );
      return data;
    } catch (error) {
      console.error('Error al solicitar recupero de contraseña:', error);
      throw error;
    }
  },

  resetPassword: async ({ email, token, newPassword }: ResetPasswordData) => {
    try {
      const { data } = await http.post(
        `${URL_AUTH}/password/reset`,
        {
          email: String(email || '').trim(),
          token: String(token || '').trim(),
          newPassword,
        },
        { skipAuth: true }
      );
      return data;
    } catch (error) {
      console.error('Error al reiniciar contraseña:', error);
      throw error;
    }
  },
};

export default usuarioApi;
