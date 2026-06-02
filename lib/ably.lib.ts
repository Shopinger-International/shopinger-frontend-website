import * as Ably from "ably";
import Axios from "@/lib/axios/private.lib";

// types
import { TokenRequest } from "ably";

function createAblyClient() {
  return new Ably.Realtime({
    authCallback: async (tokenParams, callback) => {
      try {
        const { data } = await Axios.get<TokenRequest>(`/ably/token`);
        console.log("value of data", data);
        callback(null, data);
      } catch (err) {
        callback(err as Ably.ErrorInfo, null);
      }
    },
  });
}

export { createAblyClient };
