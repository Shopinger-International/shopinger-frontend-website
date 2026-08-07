import Link from "next/link";
import { useState, useRef, useEffect } from "react";
// types
import type { FC } from "react";

// icons
import { CreditCard, ChevronRight } from "lucide-react";

// helpers
import clsx from "clsx";

const EasyEMIFloatingCta: FC = () => {
  const container_ref = useRef<HTMLAnchorElement>(null);
  const [is_expanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: TouchEvent | MouseEvent) => {
      if (
        container_ref.current &&
        !container_ref.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };
    const handleScroll = () => {
      setIsExpanded(false);
    };

    is_expanded && document.addEventListener("touchstart", handleClickOutside);
    is_expanded && document.addEventListener("mousedown", handleClickOutside);
    is_expanded &&
      window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      is_expanded &&
        document.removeEventListener("touchstart", handleClickOutside);
      is_expanded &&
        document.removeEventListener("mousedown", handleClickOutside);
      is_expanded && window.removeEventListener("scroll", handleScroll);
    };
  }, [is_expanded]);
  return (
    <Link
      ref={container_ref}
      href={`https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_PHONE}`}
      target="_blank"
      rel="noopener noreferrer nofollow"
      onClick={(event) => {
        if (!is_expanded) {
          event.preventDefault();
          setIsExpanded(true);
        }
      }}
      aria-label="Contact us on WhatsApp for Easy EMI options"
      className="fixed right-4 bottom-16 z-50 flex items-center rounded-full border border-white bg-gray-900 p-2 text-white shadow-lg ring-1 ring-white/10 transition-all duration-300 ease-in-out active:scale-95 lg:hidden"
    >
      <CreditCard
        className="size-5 shrink-0 text-orange-500"
        strokeWidth={1.5}
        aria-hidden="true"
      />

      <div
        className={clsx(
          "flex items-center gap-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out",
          is_expanded
            ? "max-w-xs pr-1 pl-2 opacity-100"
            : "max-w-0 pr-0 pl-0 opacity-0",
        )}
      >
        <span className="text-xs font-semibold">
          Easy EMI <span className="text-orange-500">@ 0%</span>
        </span>
        <ChevronRight
          className="size-4 shrink-0 text-orange-500"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
};

export default EasyEMIFloatingCta;
