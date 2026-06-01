import * as Ably from "ably";
import Axios from "@/lib/axios/private.lib";

function createAblyClient(order_id: number) {
  return new Ably.Realtime({
    authCallback: async (tokenParams, callback) => {
      try {
        const { data } = await Axios.get(`/ably/token/${order_id}`);
        console.log("value of data", data);
        callback(null, data);
      } catch (err) {
        callback(err, null);
      }
    },
  });
}

export { createAblyClient };
