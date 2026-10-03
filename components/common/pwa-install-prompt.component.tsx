import { useState, type FC } from "react";
import Image from "next/image";
import { Download, Share, X, Smartphone, MonitorCheck } from "lucide-react";
import usePWAInstall from "@/hooks/common/use-pwa-install.hook";
import clsx from "clsx";

interface IPWAInstallPromptProps {
  className?: string;
  variant?: "floating" | "inline" | "header" | "footer";
}

export const PWAInstallPrompt: FC<IPWAInstallPromptProps> = ({
  className,
  variant = "floating",
}) => {
  const {
    canInstall,
    isInstalled,
    deviceType,
    showIOSInstruction,
    promptInstall,
    dismissPrompt,
  } = usePWAInstall();

  const [showInfoModal, setShowInfoModal] = useState(false);

  // If already running in standalone PWA mode, hide prompts
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (canInstall) {
      const installed = await promptInstall();
      if (!installed) {
        setShowInfoModal(true);
      }
    } else {
      setShowInfoModal(true);
    }
  };

  const renderInfoModal = () => {
    if (!showInfoModal) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all border border-gray-100">
          <button
            type="button"
            onClick={() => setShowInfoModal(false)}
            className="absolute top-4 right-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="relative size-12 shrink-0 rounded-xl bg-orange-50 p-1.5 border border-orange-100 shadow-2xs">
              <Image
                src="/icons/shopinger-app-logo.png"
                alt="Shopinger App Logo"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                Install Shopinger App
              </h3>
              <p className="text-xs font-medium text-gray-500">
                Faster shopping & instant home screen access
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3 border-t border-gray-100 pt-4 text-xs">
            {deviceType === "ios" ? (
              <div className="rounded-xl bg-blue-50/90 p-4 border border-blue-200/80 text-blue-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-blue-900 text-sm">
                  <Share className="size-4 text-blue-600" />
                  <span>iOS (iPhone / iPad) Instructions</span>
                </div>
                <ol className="list-decimal pl-4 space-y-1.5 text-blue-900 font-medium leading-relaxed">
                  <li>
                    Tap the <strong>Share</strong> button <Share className="inline size-3 text-blue-600 align-baseline" /> in your Safari or Chrome toolbar.
                  </li>
                  <li>
                    Scroll down and select <strong>Add to Home Screen</strong>.
                  </li>
                  <li>
                    Tap <strong>Add</strong> at top right to install.
                  </li>
                </ol>
              </div>
            ) : deviceType === "android" ? (
              <div className="rounded-xl bg-orange-50/90 p-4 border border-orange-200/80 text-orange-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#FF5300] text-sm">
                  <Smartphone className="size-4 text-[#FF5300]" />
                  <span>Android Instructions</span>
                </div>
                <ol className="list-decimal pl-4 space-y-1.5 text-gray-800 font-medium leading-relaxed">
                  <li>
                    Tap the 3 dots menu <strong>(⋮)</strong> at top right of your browser.
                  </li>
                  <li>
                    Select <strong>Install App</strong> or <strong>Add to Home Screen</strong>.
                  </li>
                  <li>
                    Confirm by tapping <strong>Install</strong>.
                  </li>
                </ol>
              </div>
            ) : (
              <div className="rounded-xl bg-gray-50 p-4 border border-gray-200 text-gray-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
                  <MonitorCheck className="size-4 text-[#FF5300]" />
                  <span>Desktop (Chrome / Edge / Brave) Instructions</span>
                </div>
                <ol className="list-decimal pl-4 space-y-1.5 text-gray-700 font-medium leading-relaxed">
                  <li>
                    Click the <strong>Install App (↓)</strong> icon on the right side of address bar.
                  </li>
                  <li>
                    Or open browser menu <strong>(⋮)</strong> and select <strong>Install Shopinger</strong>.
                  </li>
                </ol>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => setShowInfoModal(false)}
              className="w-full rounded-xl bg-[#FF5300] py-3 text-sm font-bold text-white shadow-md hover:bg-orange-600 active:scale-95 transition-all cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      </div>
    );
  };

  // FOOTER VARIANT (Mobile Only: lg:hidden)
  if (variant === "footer") {
    return (
      <>
        <div className={clsx("w-full lg:hidden my-3 px-4", className)}>
          <button
            type="button"
            onClick={handleInstallClick}
            className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#FF5300] px-5 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-orange-600 active:scale-95 cursor-pointer"
            aria-label="Install Shopinger App"
          >
            <Download className="size-4 text-white" strokeWidth={2.5} />
            <span className="text-white font-bold">Install Shopinger App</span>
          </button>
        </div>
        {renderInfoModal()}
      </>
    );
  }

  // HEADER VARIANT
  if (variant === "header") {
    return (
      <>
        <button
          type="button"
          onClick={handleInstallClick}
          className={clsx(
            "flex items-center gap-1.5 rounded-full bg-[#FF5300] px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-orange-600 active:scale-95 cursor-pointer shrink-0 lg:hidden",
            className,
          )}
          aria-label="Install Shopinger App"
        >
          <Download className="size-3.5 text-white" strokeWidth={2.5} />
          <span className="text-white font-bold">Install App</span>
        </button>
        {renderInfoModal()}
      </>
    );
  }

  // Floating & Inline return null if cannot install and not iOS
  if (!canInstall && !showIOSInstruction) {
    return null;
  }

  if (variant === "inline") {
    return (
      <>
        <div
          className={clsx(
            "flex items-center justify-between gap-3 rounded-xl border border-orange-200/80 bg-orange-50/60 p-3 sm:p-4 shadow-2xs lg:hidden",
            className,
          )}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative size-10 shrink-0 overflow-hidden rounded-xl bg-white p-1 shadow-2xs">
              <Image
                src="/icons/shopinger-app-logo.png"
                alt="Shopinger App"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                Shopinger App
              </h4>
              <p className="text-3xs sm:text-2xs text-gray-600 truncate">
                {showIOSInstruction
                  ? "Tap Share ➔ Add to Home Screen"
                  : "Install for faster shopping & exclusive offers"}
              </p>
            </div>
          </div>

          {canInstall ? (
            <button
              type="button"
              onClick={handleInstallClick}
              className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#FF5300] px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-orange-600 active:scale-95 cursor-pointer"
            >
              <Download className="size-3.5 text-white" />
              <span className="text-white font-bold">Install</span>
            </button>
          ) : showIOSInstruction ? (
            <div className="flex shrink-0 items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-2xs font-bold text-gray-700 border border-gray-200">
              <Share className="size-3.5 text-blue-500" />
              <span>Add to Home Screen</span>
            </div>
          ) : null}
        </div>
        {renderInfoModal()}
      </>
    );
  }

  // DEFAULT FLOATING BANNER (Mobile Only: lg:hidden)
  return (
    <>
      <div
        className={clsx(
          "fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl border border-orange-200/90 bg-white/95 p-3.5 sm:p-4 shadow-xl backdrop-blur-md transition-all duration-300 lg:hidden",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative size-11 sm:size-12 shrink-0 overflow-hidden rounded-xl bg-white p-1 shadow-2xs border border-orange-100">
              <Image
                src="/icons/shopinger-app-logo.png"
                alt="Shopinger App"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="rounded-md bg-orange-100 px-1.5 py-0.5 text-3xs font-extrabold text-[#FF5300] uppercase tracking-wider">
                  Official App
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-extrabold text-gray-900 truncate mt-0.5">
                Install Shopinger
              </h4>
              <p className="text-3xs sm:text-2xs font-medium text-gray-600 leading-tight">
                {showIOSInstruction
                  ? "Tap the Share button below, then select 'Add to Home Screen'."
                  : "Enjoy faster browsing, instant updates & seamless checkout."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={dismissPrompt}
            className="shrink-0 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 active:scale-90 transition-all cursor-pointer"
            aria-label="Close install prompt"
          >
            <X className="size-4" strokeWidth={2.5} />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={dismissPrompt}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Not now
          </button>

          {canInstall && (
            <button
              type="button"
              onClick={handleInstallClick}
              className="flex items-center gap-1.5 rounded-lg bg-[#FF5300] px-4 py-1.5 text-xs font-bold text-white shadow-md transition-all hover:bg-orange-600 active:scale-95 cursor-pointer"
            >
              <Download className="size-3.5 text-white" strokeWidth={2.5} />
              <span className="text-white font-bold">Download App</span>
            </button>
          )}

          {showIOSInstruction && (
            <div className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-2xs font-bold text-blue-700 border border-blue-200">
              <Share className="size-3.5 text-blue-600" />
              <span>Share ➔ Add to Home Screen</span>
            </div>
          )}
        </div>
      </div>
      {renderInfoModal()}
    </>
  );
};

export default PWAInstallPrompt;
