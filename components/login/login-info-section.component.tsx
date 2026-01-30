// types
import type { FC } from "react";

// local components
import LoginFeatureCard from "@/components/login/login-feature-card.component";

// icons
import { Van, Pill, Smartphone } from "lucide-react";

const LoginInfoSection: FC = () => {
  return (
    <div className="hidden min-h-155 w-max max-w-108 flex-col gap-3 bg-orange-500 p-9 lg:flex">
      <div className="space-y-2">
        <h1 className="text-xl font-bold text-white">
          Welcome to{" "}
          <span className="underline underline-offset-2">Shopinger</span>
        </h1>
        <p className="text-md font-medium text-white">
          Your one-stop shop for everything you need,
          <br /> delivered fast!
        </p>
      </div>

      {/* Feature Cards */}
      <div className="mt-2 flex flex-col gap-4">
        {[
          {
            image_src:
              "https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?q=80&w=1715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            label: "Fast On-Call Delivery",
            para: "Get your orders delivered quickly to your doorstep",
            icon: Van,
          },
          {
            image_src:
              "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=2079&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            label: "Pharmacy Products",
            para: "Access to wide range of medicines and health products",
            icon: Pill,
          },
          {
            image_src:
              "https://images.unsplash.com/photo-1596558450268-9c27524ba856?q=80&w=1625&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            label: "Mobile Phones",
            para: "Latest smartphones and accessories available",
            icon: Smartphone,
          },
        ].map((feature_data) => (
          <LoginFeatureCard {...feature_data} />
        ))}
      </div>
    </div>
  );
};

export default LoginInfoSection;
