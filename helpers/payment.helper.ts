// types
import type { IAddress } from "@/types/address";

const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const handlePayment = async ({
  order_id,
  amount,
  currency,
  selected_address,
  total_items,
  successHandler,
  user_phone,
}: {
  order_id: number;
  amount: number;
  currency: string;
  selected_address: IAddress;
  total_items: number;
  user_phone: string;
  successHandler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
}) => {
  const isLoaded = await loadRazorpay();

  if (!isLoaded) {
    alert("Razorpay SDK failed to load");
    return;
  }

  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAYKEY_ID,
    amount: amount,
    currency: currency,
    order_id: order_id,
    description: `Cart Checkout - ${total_items}`,
    remember_customer: true,
    handler: successHandler,
    prefill: {
      name: "Ashish Prajapati",
      email: "flutechants@gmail.com",
      contact: user_phone,
    },

    notes: {
      address: selected_address?.formatted_address,
    },
  };

  const rzp = new (window as any).Razorpay(options);

  rzp.on("payment.failed", function (response: any) {
    console.log("value of error", response.error);
  });

  rzp.open();
};

export { handlePayment };
