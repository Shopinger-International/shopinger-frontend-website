import Head from "next/head";
import { useState } from "react";

// types
import type { NextPageWithLayout } from "@/pages/_app";
import type { ReactElement } from "react";

// layout
import MainLayout from "@/components/layout/main-layout.component";
import ProtectedLayout from "@/components/layout/protected-layout.component";

// local components
import AlertPopup from "@/components/common/alert-popup.component";
import FAQItem from "@/components/profile/faq-item.component";
import ProfileForm from "@/components/profile/profile-form.component";

// api hooks
import useSoftDeleteUser from "@/hooks/axios/profile/use-delete-user-mutation.hook";

// data
import profile_faqs from "@/data/profile/faq.data";

type IAlertModalState = {
  open: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
};
const ProfilePage: NextPageWithLayout = () => {
  const delete_user_mutation = useSoftDeleteUser();
  const [alert_popup_state, setAlertPopupState] = useState<IAlertModalState>({
    open: false,
  });
  const openDeleteConfirmationModal = () => {
    return new Promise((resolve, reject) => {
      setAlertPopupState({
        open: true,
        onSuccess: () => {
          resolve("confirmed");
        },
        onCancel: () => {
          reject("rejected");
        },
      });
    });
  };

  return (
    <>
      <Head>
        <title>Your Account | Shopinger</title>
        <meta
          name="description"
          content="View and manage your account details securely on Shopinger."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AlertPopup
        title="Do you really want to delete this account?"
        open={alert_popup_state.open}
        handleAlertPopupState={(open) => {
          setAlertPopupState({
            open,
          });
        }}
        handleConfirmation={() => {
          alert_popup_state.onSuccess?.();
          setAlertPopupState({
            open: false,
          });
        }}
        handleCancellation={() => {
          alert_popup_state.onCancel?.();
          setAlertPopupState({
            open: false,
          });
        }}
      />
      <section className="min-h-screen w-full bg-gray-50 py-4">
        <div className="mx-auto mt-(--header-height) max-w-6xl px-4">
          <div className="w-full rounded-xl border border-gray-300 bg-white">
            <ProfileForm />
            <div className="mt-10 border-t border-gray-200 p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">FAQs</h2>

              <div className="space-y-1">
                {profile_faqs.map((faq, idx) => (
                  <FAQItem
                    key={idx}
                    question={faq.question}
                    answer={faq.answer}
                  />
                ))}
              </div>
            </div>
            <div className="mt-10 border-t border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Danger Zone
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                Permanently delete your account and all associated data.
              </p>

              <button
                type="button"
                onClick={() => {
                  openDeleteConfirmationModal()
                    .then(() => {
                      delete_user_mutation.mutate();
                    })
                    .catch(() => {
                      console.log("got error");
                    });
                }}
                className="mt-4 rounded-lg border border-red-500 px-4 py-2 text-sm font-medium text-red-500 transition outline-none hover:bg-red-50"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </section>
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
