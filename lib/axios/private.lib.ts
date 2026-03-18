// lib/axios/private.ts
import axios from "axios";

// types
import type { CreateAxiosDefaults } from "axios";

const baseConfig: CreateAxiosDefaults = {
  baseURL: `${process.env.NEXT_PUBLIC_BASE_API_URL}/web`,
  timeout: 15000,
  withCredentials: true,
};
const Axios = axios.create({
  ...baseConfig,
});

// Handle auth errors
Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
    }

    return Promise.reject(error);
  },
);

export default Axios;
