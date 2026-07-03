import Head from "next/head";
// types
import type { NextPageWithLayout } from "@/pages/_app";
import type { ReactElement } from "react";
import type { GetServerSideProps } from "next";

// layout
import MainLayout from "@/components/layout/main-layout.component";
import ProtectedLayout from "@/components/layout/protected-layout.component";

// local components
import NavigationCard from "@/components/account/navigation-card.component";

// helpers
import { getUser } from "@/hooks/axios/common/use-user-details.hook";

// hooks
import useLogoutMutation from "@/hooks/axios/login/use-logout-mutation.hook";

const AccountPage: NextPageWithLayout = () => {
  const logout_mutation = useLogoutMutation();
  return (
    <>
      <Head>
        <title>Your Account | Shopinger</title>

        <meta
          name="description"
          content="View and manage your account details, orders, addresses, and settings securely on Shopinger."
          key="desc"
        />

        <meta
          name="keywords"
          content="user account, profile, orders, addresses, account settings, Shopinger"
        />

        {/* Private page */}
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <section className="min-h-screen w-full py-4">
        <div className="mx-auto mt-(--header-height) max-w-6xl space-y-4 px-4">
          {/* <div className="mb-6 flex items-center justify-between"></div> */}
          <h1 className="text-xl font-semibold sm:text-2xl">Your Account</h1>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <NavigationCard
              title="Your Orders"
              description="Track, return, or cancel orders, download invoices, and buy items again"
              href="/order-history"
            >
              <span className="text-2xl">📦</span>
            </NavigationCard>

            <NavigationCard
              title="Your Addresses"
              description="Add, edit, or remove delivery addresses and set a default address"
              href="/manage-address"
            >
              <span className="text-2xl">📍</span>
            </NavigationCard>

            <NavigationCard
              title="Your Profile"
              description="Update your personal details like name, email, and phone number"
              href="/profile"
            >
              <span className="text-2xl">👤</span>
            </NavigationCard>

            <NavigationCard
              title="Your Reviews"
              description="View, edit, or delete your product reviews and ratings"
              href="/your-reviews"
            >
              <span className="text-2xl">⭐</span>
            </NavigationCard>

            <NavigationCard
              title="Your Cart"
              description="Review items in your cart, update quantities, or proceed to checkout"
              href="/cart-checkout"
            >
              <span className="text-2xl">🛒</span>
            </NavigationCard>
          </div>
          <button
            onClick={() => logout_mutation.mutate()}
            disabled={logout_mutation.isPending}
            className="w-full rounded-md bg-red-500 py-2 font-semibold text-white disabled:bg-red-300 lg:hidden"
          >
            Logout
          </button>
        </div>
      </section>
    </>
  );
};

export default AccountPage;

AccountPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <ProtectedLayout>
      <MainLayout show_bottom_navigation={true}>{page}</MainLayout>
    </ProtectedLayout>
  );
};

export const getServerSideProps = (async (context) => {
  const cookie = context.req.headers.cookie ?? "";
  try {
    await getUser(cookie);
    return {
      props: {},
    };
  } catch (error: any) {
    const status = error?.response?.status;

    if (status === 404) {
      return {
        redirect: {
          destination: "/404",
          permanent: false,
        },
      };
    }

    if (status === 401) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    // fallback: generic error page
    return {
      redirect: {
        destination: "/500",
        permanent: false,
      },
    };
  }
}) satisfies GetServerSideProps;
