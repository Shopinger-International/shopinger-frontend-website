import axios from "axios";

const baseConfig = (prefix: string) => {
  return {
    baseURL: `${process.env.NEXT_PUBLIC_BASE_API_URL}${prefix}`,
    timeout: 15000,
  };
};
const webAxios = (prefix?: string) => {
  return axios.create({
    ...baseConfig(prefix ? prefix : "/web"),
  });
};
export default webAxios;
