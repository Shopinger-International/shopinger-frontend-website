import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import Image from "next/image";
import { FC, useState } from "react";

type IProps = {
  product_title: string;
  product_image: string;
  product_selling_price: number;
  product_mrp: number;
  show_share_dialog: boolean;
  onShowShareDialog: (open: boolean) => void;
};

const ShareLinkModal: FC<IProps> = ({
  product_title,
  product_image,
  product_mrp,
  product_selling_price,
  onShowShareDialog,
  show_share_dialog,
}) => {
  const [has_copied, setHasCopied] = useState(false);
  const [url, setUrl] = useState("");

  const copyLink = async () => {
    try {
      setUrl(window.location.href);
      await navigator.clipboard.writeText(url);

      setHasCopied(true);

      setTimeout(() => {
        setHasCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const shareOnWhatsApp = () => {
    const text = `Check out ${product_title} on Shopinger\n${url}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareOnGmail = () => {
    const subject = encodeURIComponent(product_title);
    const body = encodeURIComponent(`Check out this product:\n\n${url}`);

    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`,
      "_blank",
      "width=600,height=600",
    );
  };

  const shareOnInstagram = async () => {
    await copyLink();

    // Instagram doesn't provide a normal web URL
    // for directly sharing a website link.
    window.open("https://www.instagram.com/", "_blank");
  };

  const shareNative = async () => {
    if (!navigator.share) {
      await copyLink();
      return;
    }

    try {
      await navigator.share({
        title: product_title,
        text: `Check out ${product_title} on Shopinger`,
        url: url,
      });
    } catch (error) {
      // User closed the native share sheet
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      console.error("Share failed:", error);
    }
  };

  return (
    <Dialog
      open={show_share_dialog}
      onClose={() => onShowShareDialog(false)}
      className="relative z-50"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/55 backdrop-blur-[5px]"
        aria-hidden="true"
      />

      {/* Modal container */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-full max-w-110 overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-2">
            <DialogTitle className="text-[18px] font-bold text-[#17233c]">
              Share this product
            </DialogTitle>

            <button
              type="button"
              onClick={() => onShowShareDialog(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-3xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <Description className="sr-only">
            Share this product with your friends and family.
          </Description>

          {/* Product information */}
          <div className="px-5 py-5">
            <div className="relative flex items-center gap-5">
              {/* Product image */}
              <div className="flex h-26.25 w-26.25 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                <Image
                  src={product_image}
                  alt={product_title}
                  width={50}
                  height={50}
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Product details */}
              <div>
                <h3 className="text-[12px] font-medium text-[#17233c]">
                  {product_title}
                </h3>

                <div className="mt-2 flex items-center gap-3">
                  <span className="text-[16px] font-semibold text-[#17233c]">
                    ₹{product_selling_price}
                  </span>

                  <span className="text-[12px] text-gray-500 line-through">
                    ₹{product_mrp}
                  </span>

                  <span className="text-[17px] font-medium text-[#ff6500]">
                    {Math.round(
                      (Number(product_selling_price) * 100) /
                        Number(product_mrp),
                    ) - 100}
                    % off
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center pb-2">
            {has_copied && (
              <div className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs text-white">
                  ✓
                </span>
                Link copied to clipboard!
              </div>
            )}
          </div>

          <div className="mx-7 border-t border-gray-200" />
          <div className="mx-7 border-t border-gray-200" />

          {/* Social sharing */}
          <div className="px-7 py-2 pb-4">
            <div className="flex items-center justify-between px-3">
              <ShareButton label="Copy Link" onClick={copyLink}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="9" y="9" width="11" height="11" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </ShareButton>
              {/* WhatsApp */}
              <ShareButton label="WhatsApp" onClick={shareOnWhatsApp}>
                <div className="bg-[#25D366]">
                  <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white">
                    <path d="M20.52 3.48A11.87 11.87 0 0 0 12.04 0C5.49 0 .16 5.33.16 11.88c0 2.09.55 4.13 1.59 5.93L.05 24l6.33-1.66a11.86 11.86 0 0 0 5.66 1.44h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.18-1.24-6.17-3.41-8.42ZM12.05 21.77a9.88 9.88 0 0 1-5.04-1.38l-.36-.21-3.76.99 1-3.66-.23-.38a9.88 9.88 0 0 1-1.51-5.25c0-5.46 4.45-9.91 9.92-9.91 2.65 0 5.14 1.03 7.01 2.91a9.84 9.84 0 0 1 2.9 7.01c0 5.47-4.45 9.92-9.91 9.92Zm5.44-7.43c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.46-.89-.79-1.49-1.77-1.67-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.7.63.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
                  </svg>
                </div>
              </ShareButton>

              {/* Facebook */}
              <ShareButton label="Gmail" onClick={shareOnGmail}>
                <svg
                  width="800px"
                  height="800px"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 11.9556C2 8.47078 2 6.7284 2.67818 5.39739C3.27473 4.22661 4.22661 3.27473 5.39739 2.67818C6.7284 2 8.47078 2 11.9556 2H20.0444C23.5292 2 25.2716 2 26.6026 2.67818C27.7734 3.27473 28.7253 4.22661 29.3218 5.39739C30 6.7284 30 8.47078 30 11.9556V20.0444C30 23.5292 30 25.2716 29.3218 26.6026C28.7253 27.7734 27.7734 28.7253 26.6026 29.3218C25.2716 30 23.5292 30 20.0444 30H11.9556C8.47078 30 6.7284 30 5.39739 29.3218C4.22661 28.7253 3.27473 27.7734 2.67818 26.6026C2 25.2716 2 23.5292 2 20.0444V11.9556Z"
                    fill="white"
                  />
                  <path
                    d="M22.0515 8.52295L16.0644 13.1954L9.94043 8.52295V8.52421L9.94783 8.53053V15.0732L15.9954 19.8466L22.0515 15.2575V8.52295Z"
                    fill="#EA4335"
                  />
                  <path
                    d="M23.6231 7.38639L22.0508 8.52292V15.2575L26.9983 11.459V9.17074C26.9983 9.17074 26.3978 5.90258 23.6231 7.38639Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M22.0508 15.2575V23.9924H25.8428C25.8428 23.9924 26.9219 23.8813 26.9995 22.6513V11.459L22.0508 15.2575Z"
                    fill="#34A853"
                  />
                  <path
                    d="M9.94811 24.0001V15.0732L9.94043 15.0669L9.94811 24.0001Z"
                    fill="#C5221F"
                  />
                  <path
                    d="M9.94014 8.52404L8.37646 7.39382C5.60179 5.91001 5 9.17692 5 9.17692V11.4651L9.94014 15.0667V8.52404Z"
                    fill="#C5221F"
                  />
                  <path
                    d="M9.94043 8.52441V15.0671L9.94811 15.0734V8.53073L9.94043 8.52441Z"
                    fill="#C5221F"
                  />
                  <path
                    d="M5 11.4668V22.6591C5.07646 23.8904 6.15673 24.0003 6.15673 24.0003H9.94877L9.94014 15.0671L5 11.4668Z"
                    fill="#4285F4"
                  />
                </svg>
              </ShareButton>

              {/* Instagram */}
              <ShareButton label="Instagram" onClick={shareOnInstagram}>
                <svg
                  fill="#F33358"
                  width="800px"
                  height="800px"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8,2 L16,2 C19.3137085,2 22,4.6862915 22,8 L22,16 C22,19.3137085 19.3137085,22 16,22 L8,22 C4.6862915,22 2,19.3137085 2,16 L2,8 C2,4.6862915 4.6862915,2 8,2 Z M8,4 C5.790861,4 4,5.790861 4,8 L4,16 C4,18.209139 5.790861,20 8,20 L16,20 C18.209139,20 20,18.209139 20,16 L20,8 C20,5.790861 18.209139,4 16,4 L8,4 Z M12,17 C9.23857625,17 7,14.7614237 7,12 C7,9.23857625 9.23857625,7 12,7 C14.7614237,7 17,9.23857625 17,12 C17,14.7614237 14.7614237,17 12,17 Z M12,15 C13.6568542,15 15,13.6568542 15,12 C15,10.3431458 13.6568542,9 12,9 C10.3431458,9 9,10.3431458 9,12 C9,13.6568542 10.3431458,15 12,15 Z M17,8 C16.4477153,8 16,7.55228475 16,7 C16,6.44771525 16.4477153,6 17,6 C17.5522847,6 18,6.44771525 18,7 C18,7.55228475 17.5522847,8 17,8 Z"
                  />
                </svg>
              </ShareButton>
              {/* More / Native share */}
              <ShareButton label="More" onClick={shareNative} outlined>
                <div className="bg-white">
                  <span className="text-[18px] font-bold text-[#17233c]">
                    ···
                  </span>
                </div>
              </ShareButton>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

function ShareButton({
  children,
  label,
  onClick,
  outlined = false,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  outlined?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-21.25 flex-col items-center gap-2 rounded-lg p-1 transition hover:bg-gray-50"
    >
      <div
        className={`flex h-7 w-6 items-center justify-center overflow-hidden rounded-full ${outlined ? "border border-gray-200" : ""} `}
      >
        {children}
      </div>

      <span className="text-[12px] text-[#17233c]">{label}</span>
    </button>
  );
}

export default ShareLinkModal;
