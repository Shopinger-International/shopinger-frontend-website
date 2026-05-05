import type { IAddress } from "@/types/address";

export type IGender = "male" | "female" | "other"

type IUser = {
  id: number;
  name: string;
  country_code: number;
  dob: string;
  gender:IGender;
  email: string;
  fcm_token: string;
  phone: string;
  role: string;
  user_addresses: Array<IAddress>;
};

export default IUser;
