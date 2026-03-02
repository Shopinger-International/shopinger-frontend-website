import Head from "next/head";
// types
import type { NextPageWithLayout } from "@/pages/_app";

// local components
import LoginInfoSection from "@/components/login/login-info-section.component";
import LoginForm from "@/components/login/login-form.component";
import Tooltip from "@/components/common/tooltip.component";

// icons
import { MessageCircleQuestionIcon } from "lucide-react";

const Login: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Login | Shopinger</title>
        <meta
          name="description"
          content="Sign in securely to your account to manage orders, track deliveries, and continue shopping with ease."
          key="desc"
        />
      </Head>
      <div className="relative flex h-screen w-full items-center justify-center bg-[#FFE2D0]">
        <div className="absolute top-6 right-6">
          <Tooltip
            placement="bottom"
            content={
              <div className="w-max rounded-lg border border-gray-200 bg-white p-3 shadow-md">
                <p className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-900">
                  <MessageCircleQuestionIcon className="h-4 w-4 text-orange-500" />
                  Need help?
                </p>

                <a
                  href="tel:+919415761434"
                  className="block rounded-md bg-orange-50 px-3 py-1.5 text-sm font-semibold text-orange-600 transition-colors hover:bg-orange-100"
                >
                  +91 9415761434
                </a>
              </div>
            }
          >
            {({}) => (
              <button className="flex items-center justify-between gap-2 rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-medium text-white shadow-md">
                <MessageCircleQuestionIcon className="size-4 fill-white text-orange-500" />
                <span>Need Help</span>
              </button>
            )}
          </Tooltip>
        </div>
        <div className="flex h-full w-full max-w-5xl overflow-hidden border border-gray-300 shadow-lg lg:h-max lg:w-max lg:rounded-3xl">
          <LoginInfoSection />
          <LoginForm />
        </div>
      </div>
    </>
  );
};

export default Login;
