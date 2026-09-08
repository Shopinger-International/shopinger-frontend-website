import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import Image from "next/image";
import { FC, useState } from "react";
import { FaCheck, FaInstagram, FaRegCopy, FaWhatsapp } from "react-icons/fa6";
import { BiLogoGmail } from "react-icons/bi";
import { X } from "lucide-react";

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
              <X />
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
                  <FaCheck color="green" />
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
                <FaRegCopy size={20} />
              </ShareButton>
              {/* WhatsApp */}
              <ShareButton label="WhatsApp" onClick={shareOnWhatsApp}>
                <FaWhatsapp color="green" size={20} />
              </ShareButton>

              {/* Gmail */}
              <ShareButton label="Gmail" onClick={shareOnGmail}>
                <BiLogoGmail color="red" size={20} />
              </ShareButton>

              {/* Instagram */}
              <ShareButton label="Instagram" onClick={shareOnInstagram}>
                <FaInstagram color="F33358" size={20} />
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
