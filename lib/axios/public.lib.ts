import axios from "axios";

const baseConfig = {
  baseURL: `${process.env.NEXT_PUBLIC_BASE_API_URL}/public`,
  timeout: 15000,
};
const publicAxios = axios.create({
  ...baseConfig,
});

export default publicAxios;
