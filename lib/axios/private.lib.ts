// lib/axios/private.ts
import axios from "axios";

const baseConfig = {
  baseURL: `${process.env.NEXT_PUBLIC_BASE_API_URL}/web`,
  timeout: 15000,
};
const Axios = axios.create({
  ...baseConfig,
});

// Attach token
Axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token"); // or cookie

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle auth errors
Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // logout / redirect
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default Axios;
