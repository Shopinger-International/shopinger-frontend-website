// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@/pages/_app";

// local components
import LoginInfoSection from "@/components/login/login-info-section.component";
import LoginForm from "@/components/login/login-form.component";

const Login: NextPageWithLayout = () => {
  return (
    <div className="h-screen w-full bg-[#FFE2D0] px-4">
      <div className="max-w-8xl mx-auto flex h-full items-center justify-center">
        <div className="flex w-max overflow-hidden rounded-3xl shadow-lg">
          <LoginInfoSection />
          <LoginForm />
        </div>
      </div>
    </div>
  );
};
export default Login;
