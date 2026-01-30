// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@/pages/_app";

// local components
import LoginInfoSection from "@/components/login/login-info-section.component";
import LoginForm from "@/components/login/login-form.component";

const Login: NextPageWithLayout = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#FFE2D0]">
      <div className="flex h-full w-full max-w-5xl overflow-hidden border border-gray-300 shadow-lg lg:h-max lg:w-max lg:rounded-3xl">
        <LoginInfoSection />
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
