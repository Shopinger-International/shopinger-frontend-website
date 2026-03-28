import type { IAddress } from "@/types/address";
type IUser = {
  id: number;
  name: string;
  country_code: string;
  dob: string;
  email: string;
  fcm_token: string;
  phone: string;
  role: string;
  user_addresses: Array<IAddress>;
};

export default IUser;
