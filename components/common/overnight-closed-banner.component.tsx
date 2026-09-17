
import { useEffect, useState } from "react";

// TESTING OVERRIDE — true karne se banner hamesha dikhega (time/localStorage ignore hoga)
const FORCE_SHOW_FOR_TESTING = false;

const OPEN_TIME_LABEL = "7:00 AM";

const isClosedHours = () => {
  const hour = new Date().getHours();
  return hour >= 22 || hour < 7;
};

const getTodayKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
};

// chhote background stars (dots)
const STAR_DOTS = [
  { left: "6%", top: "70%", o: 0.5 },
  { left: "11%", top: "22%", o: 0.35 },
  { left: "17%", top: "85%", o: 0.4 },
  { left: "27%", top: "16%", o: 0.45 },
  { left: "34%", top: "78%", o: 0.3 },
  { left: "45%", top: "24%", o: 0.4 },
  { left: "52%", top: "82%", o: 0.35 },
  { left: "58%", top: "18%", o: 0.45 },
  { left: "64%", top: "70%", o: 0.3 },
  { left: "69%", top: "30%", o: 0.4 },
];

const GoldStar = ({ className = "", size = 18, delay = "0s" }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={`banner-twinkle ${className}`}
    style={{ animationDelay: delay }}
    aria-hidden="true"
  >
    <path
      d="M12 1.8l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17l-6.1 3.4 1.4-6.8L2.2 8.9l6.9-.8L12 1.8z"
      fill="#F5B72E"
    />
  </svg>
);

const OvernightClosedBanner = () => {
  const [show_banner, setShowBanner] = useState(false);

  useEffect(() => {
    if (FORCE_SHOW_FOR_TESTING) {
      setShowBanner(true);
      return;
    }

    const banner_closed_date = localStorage.getItem(
      "overnight_closed_banner_closed_date"
    );

    if (banner_closed_date === getTodayKey()) {
      setShowBanner(false);
      return;
    }

    const updateBannerVisibility = () => setShowBanner(isClosedHours());

    updateBannerVisibility();
    const interval = setInterval(updateBannerVisibility, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleClose = () => {
    if (!FORCE_SHOW_FOR_TESTING) {
      localStorage.setItem("overnight_closed_banner_closed_date", getTodayKey());
    }
    setShowBanner(false);
  };

  if (!show_banner) return null;

  return (
    // navbar ke turant neeche — rope wahin se visible latakti hai
    <div className="relative z-[200] top-32 w-full pb-5">
      {/* Poora assembly ek saath jhoolta hai (ropes + board) */}
      <div className="banner-hang relative mx-auto w-full max-w-6xl px-4 pt-[52px]">
        {/* ===== Ropes ===== */}
        {/* left rope — navbar ke bottom edge se visible latakti hui */}
        <div className="pointer-events-none absolute left-[46px] top-0 z-[-300] h-[62px] w-[7px] -translate-x-1/2 rounded-b-full bg-[linear-gradient(to_bottom,#ff8a2b,#f2650a)] shadow-[1px_0_2px_rgba(0,0,0,0.25)] sm:left-[54px]" />
        {/* right rope */}
        <div className="pointer-events-none absolute right-[46px] top-0 z-[-300] h-[62px] w-[7px] translate-x-1/2 rounded-b-full bg-[linear-gradient(to_bottom,#ff8a2b,#f2650a)] shadow-[1px_0_2px_rgba(0,0,0,0.25)] sm:right-[54px]" />

        {/* ===== Banner board ===== */}
        <div className="relative z-10 overflow-hidden rounded-[26px] border-b-[5px] border-[#ff7a18] bg-[#171f3a] shadow-[0_20px_45px_-15px_rgba(0,0,0,0.55)]">
          {/* background gradient */}
          <div className="absolute inset-0 bg-[linear-gradient(115deg,#1d2647_0%,#171f3a_50%,#0f1528_100%)]" />

          {/* background star dots */}
          {STAR_DOTS.map((s, i) => (
            <span
              key={i}
              className="absolute h-[2px] w-[2px] rounded-full bg-white"
              style={{ left: s.left, top: s.top, opacity: s.o }}
            />
          ))}

          {/* Eyelets (rope rings) */}
          <div className="absolute left-[30px] top-3 z-20 h-5 w-5 rounded-full border-[4px] border-[#ff7a18] bg-[#111a30] sm:left-[38px]" />
          <div className="absolute right-[30px] top-3 z-20 h-5 w-5 rounded-full border-[4px] border-[#ff7a18] bg-[#111a30] sm:right-[38px]" />

          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close banner"
            className="absolute right-3 top-2 z-30 flex h-7 w-7 items-center justify-center rounded-full text-xl leading-none text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            ×
          </button>

          {/* ===== Content ===== */}
          <div className="relative z-10 flex flex-col items-center gap-5 px-6 py-7 sm:px-12 sm:py-8 md:flex-row md:justify-between md:gap-8">
            {/* Left: moon + text */}
            <div className="flex items-center gap-5 sm:gap-7">
              <div className="relative h-[70px] w-[70px] shrink-0 sm:h-[104px] sm:w-[104px]">
                <div className="absolute bottom-0 left-1/2 h-3 w-[70%] -translate-x-1/2 rounded-[50%] bg-black/30 blur-[6px]" />
                <div
                  className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,#fdf0b8_0%,#f8d873_45%,#e9a832_100%)] drop-shadow-[0_0_18px_rgba(245,190,60,0.35)]"
                  style={{
                    maskImage:
                      "radial-gradient(circle at 74% 36%, transparent 0 46%, black 47%)",
                    WebkitMaskImage:
                      "radial-gradient(circle at 74% 36%, transparent 0 46%, black 47%)",
                  }}
                />
                <GoldStar className="absolute -right-2 top-1 sm:-right-3" size={16} delay="0s" />
                <GoldStar className="absolute -right-4 top-1/2 sm:-right-6" size={20} delay="0.8s" />
                <GoldStar className="absolute -left-4 top-6 sm:-left-6" size={13} delay="1.4s" />
                <GoldStar className="absolute -left-3 bottom-1 sm:-left-5" size={11} delay="2s" />
                <GoldStar className="absolute -right-1 -bottom-1" size={12} delay="1.1s" />
              </div>

              <div className="text-left">
                <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
                  Sorry, we&apos;re closed
                </h2>
                <p className="mt-1.5 text-sm text-[#b9c2da] sm:text-lg">
                  Order now. Deliveries resume at {OPEN_TIME_LABEL}.
                </p>
              </div>
            </div>

            {/* Right: cream badge */}
            <div className="flex w-full items-center justify-between gap-4 rounded-2xl bg-[#fdf2df] px-5 py-3 sm:gap-6 sm:px-7 sm:py-4 md:w-auto">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#1b2340] sm:text-sm">
                  We&apos;ll be back at
                </p>
                <p className="text-3xl font-extrabold leading-none text-[#ff7a18] sm:text-[42px]">
                  {OPEN_TIME_LABEL}
                </p>
              </div>

              <svg
                viewBox="0 0 64 48"
                className="h-10 w-12 shrink-0 sm:h-14 sm:w-16"
                fill="none"
                stroke="#ff7a18"
                strokeWidth="3.4"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M32 6v6" />
                <path d="M16 12l4 4" />
                <path d="M48 12l-4 4" />
                <path d="M20 34a12 12 0 0 1 24 0" />
                <path d="M6 34h8" />
                <path d="M50 34h8" />
                <path d="M4 42h56" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* ropes ke top point se latakta hua swing */
        .banner-hang {
          transform-origin: 50% 0;
          animation: banner-drop 900ms cubic-bezier(0.22, 1.2, 0.36, 1) 1 both,
            banner-swing 5s ease-in-out 900ms infinite;
          will-change: transform;
        }

        @keyframes banner-drop {
          0% {
            transform: translateY(-22px) rotate(0deg);
            opacity: 0;
          }
          60% {
            transform: translateY(4px) rotate(0.8deg);
            opacity: 1;
          }
          100% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes banner-swing {
          0%,
          100% {
            transform: rotate(-0.55deg);
          }
          50% {
            transform: rotate(0.55deg);
          }
        }

        :global(.banner-twinkle) {
          animation: twinkle 2.6s ease-in-out infinite;
        }
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.55;
            transform: scale(0.88);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .banner-hang {
            animation: none;
          }
          :global(.banner-twinkle) {
            animation: none;
            opacity: 0.9;
          }
        }
      `}</style>
    </div>
  );
};

export default OvernightClosedBanner;
