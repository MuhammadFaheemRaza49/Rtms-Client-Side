import axios from 'axios';
import { Platform } from 'react-native';

// In-memory token storage
let authToken = null;
let isLoggingIn = false;

const getBaseUrl = () => {
  if (__DEV__) {
    // adb reverse tcp:3000 tcp:3000 makes localhost work on physical devices via USB
    return 'http://localhost:3000/v1';
  }
  return 'https://api.rtms.dev/v1';
};

// Central axios instance configured with base URL
const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Promise-based lock for auto-login to prevent concurrency race conditions
let loginPromise = null;

const ensureAuth = async () => {
  if (authToken) return;
  
  if (loginPromise) {
    await loginPromise;
    return;
  }
  
  const email = 'platform-admin@rtms.dev';
  console.log(`[AUTH] Attempting auto-login for ${email}...`);
  
  loginPromise = axios.post(`${getBaseUrl()}/auth/login`, {
    email: email,
    password: 'ChangeMe123!',
  }).then(response => {
    if (response.data && response.data.accessToken) {
      authToken = response.data.accessToken;
      console.log('[AUTH] Auto-login successful! Token set.');
    }
    loginPromise = null;
  }).catch(error => {
    console.warn('[AUTH] Auto-login failed. Make sure the NestJS backend is running:', error.message);
    loginPromise = null;
  });
  
  await loginPromise;
};

// Request interceptor to automatically attach authorization header
apiClient.interceptors.request.use(
  async (config) => {
    // Skip auto-login for the auth endpoint itself to prevent loops
    if (config.url && !config.url.includes('/auth/login')) {
      await ensureAuth();
    }
    if (authToken) {
      config.headers['Authorization'] = `Bearer ${authToken}`;
    }
    console.log(`[API REQUEST] Sending ${config.method?.toUpperCase()} to ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to catch and log errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('[AUTH] Token expired or invalid (401). Clearing token and attempting relogin...');
      authToken = null;
      try {
        await ensureAuth();
        if (authToken) {
          originalRequest.headers['Authorization'] = `Bearer ${authToken}`;
          return apiClient(originalRequest);
        }
      } catch (retryError) {
        console.warn('[AUTH] Relogin retry failed:', retryError.message);
      }
    }
    console.warn(`[API ERROR] ${error.config?.method?.toUpperCase()} to ${error.config?.url} failed with status ${error.response?.status}:`, error.response?.data);
    return Promise.reject(error);
  }
);

const requestWithRetry = async (fn) => {
  try {
    return await fn();
  } catch (error) {
    const errStr = String(error).toLowerCase();
    const isRetryable = error.response?.status === 500 || errStr.includes('network') || errStr.includes('econnreset') || errStr.includes('timeout');
    if (isRetryable) {
      console.log(`[API RETRY] Retrying failed request due to connection reset or server issue...`);
      return await fn();
    }
    throw error;
  }
};

const RestApi = {
  setAuthToken: (token) => {
    authToken = token;
  },
  clearAuthToken: () => {
    authToken = null;
  },
  get: async (url, config = {}) => {
    return requestWithRetry(async () => {
      const response = await apiClient.get(url, config);
      return response.data;
    });
  },
  post: async (url, data = {}, config = {}) => {
    return requestWithRetry(async () => {
      const response = await apiClient.post(url, data, config);
      return response.data;
    });
  },
  put: async (url, data = {}, config = {}) => {
    return requestWithRetry(async () => {
      const response = await apiClient.put(url, data, config);
      return response.data;
    });
  },
  delete: async (url, config = {}) => {
    return requestWithRetry(async () => {
      const response = await apiClient.delete(url, config);
      return response.data;
    });
  },
};

export default RestApi;


