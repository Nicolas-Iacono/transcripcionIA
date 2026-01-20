import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type RequestConfig = {
  skipAuth?: boolean;
};

class HttpClient {
  private async getHeaders(skipAuth: boolean = false): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (!skipAuth) {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async get<T = any>(url: string, config?: RequestConfig): Promise<{ data: T }> {
    try {
      const headers = await this.getHeaders(config?.skipAuth);
      const response = await fetch(`${API_URL}${url}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('HTTP GET Error:', error);
      throw error;
    }
  }

  async post<T = any>(url: string, body?: any, config?: RequestConfig): Promise<{ data: T }> {
    try {
      const headers = await this.getHeaders(config?.skipAuth);
      const fullUrl = `${API_URL}${url}`;
      
      console.log('🌐 POST Request:', {
        url: fullUrl,
        body: body,
        skipAuth: config?.skipAuth
      });
      
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response body:', errorText);
        
        let errorData: any = {};
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        
        const errorMessage = errorData.message || errorData.error || `HTTP error! status: ${response.status}`;
        console.error('❌ Error message from backend:', errorMessage);
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ Response data:', data);
      return { data };
    } catch (error) {
      console.error('HTTP POST Error:', error);
      throw error;
    }
  }

  async put<T = any>(url: string, body?: any, config?: RequestConfig): Promise<{ data: T }> {
    try {
      const headers = await this.getHeaders(config?.skipAuth);
      const response = await fetch(`${API_URL}${url}`, {
        method: 'PUT',
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('HTTP PUT Error:', error);
      throw error;
    }
  }

  async delete<T = any>(url: string, config?: RequestConfig): Promise<{ data: T }> {
    try {
      const headers = await this.getHeaders(config?.skipAuth);
      const response = await fetch(`${API_URL}${url}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('HTTP DELETE Error:', error);
      throw error;
    }
  }
}

const http = new HttpClient();
export default http;
