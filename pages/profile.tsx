import Head from "next/head";
// types
import type { NextPageWithLayout } from "@/pages/_app";
import type { ReactElement } from "react";

// layout
import MainLayout from "@/components/layout/main-layout.component";
import ProtectedLayout from "@/components/layout/protected-layout.component";

const ProfilePage: NextPageWithLayout = () => {
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
      <div>
        <h1>testing</h1>
      </div>
    </>
  );
};

export default ProfilePage;

ProfilePage.getLayout = function getLayout(page: ReactElement) {
  return (
    <ProtectedLayout>
      <MainLayout>{page}</MainLayout>
    </ProtectedLayout>
  );
};
