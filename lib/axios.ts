import axios from "axios";
const Axios = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_API_URL}/products`,
});

export default Axios;
