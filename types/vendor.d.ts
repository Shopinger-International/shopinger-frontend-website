interface IVendor {
  id: number;
  name?: string;
  email: string;
  shopname: string;
  address?: string;
  gst_no?: string;
  pickupAddresses?: Array<{
    address?: string;
    state?: string;
  }>;
}
export default IVendor;
