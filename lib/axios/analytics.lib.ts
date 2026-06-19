import axios from "axios";

// types
import type { CreateAxiosDefaults } from "axios";

const baseConfig: CreateAxiosDefaults = {
  baseURL: `${process.env.NEXT_PUBLIC_BASE_API_URL}/analytics`,
  timeout: 15000,
  withCredentials: true,
};
const analyticsAxios = axios.create({
  ...baseConfig,
});

// Handle auth errors
analyticsAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
    }

    return Promise.reject(error);
  },
);

export default analyticsAxios;
