
import axios from "axios";

const baseConfig = {
  baseURL: `${process.env.NEXT_PUBLIC_BASE_API_URL}/web`,
  timeout: 15000,
};
const webAxios = axios.create({
  ...baseConfig,
});

export default webAxios;
