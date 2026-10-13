import { useMutation } from "@tanstack/react-query";

// lib
import webAxios from "@/lib/axios/web.lib";

interface VerifyServiceabilityPayload {
  latitude: number;
  longitude: number;
}

interface VerifyServiceabilityResponse {
  message?: string;
  is_serviceable: boolean;
  data: {
    vendor_id: number;
    delivery_fee: number;
    delivery_time_minutes: number;
    distance_km: number;
    cod_available: boolean;
  };
}

const useVerifyPincodeServiceability = () => {
  return useMutation<
    VerifyServiceabilityResponse,
    Error,
    VerifyServiceabilityPayload
  >({
    mutationKey: ["verify-serviceability"],
    mutationFn: async ({ latitude, longitude }) => {
      const res = await webAxios(
        "/v1/users",
      ).post<VerifyServiceabilityResponse>(`/serviceability/check`, {
        latitude,
        longitude,
      });

      return res.data;
    },
  });
};

export default useVerifyPincodeServiceability;
