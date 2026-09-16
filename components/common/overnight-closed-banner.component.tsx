import { useEffect, useState } from "react";

const isClosedHours = () => {
  const hour = new Date().getHours();

  return hour >= 22 || hour < 7;
};

const OvernightClosedBanner = () => {
  const [show_banner, setShowBanner] = useState(false);

  useEffect(() => {
    const updateBannerVisibility = () => {
      setShowBanner(isClosedHours());
    };

    updateBannerVisibility();

    const interval = setInterval(updateBannerVisibility, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (!show_banner) {
    return null;
  }

  return (
    <div className="relative z-10 w-full overflow-hidden bg-[#111827] px-4 py-5 text-white sm:py-6">
      {/* Stars */}
      <span className="star star-1">✦</span>
      <span className="star star-2">✦</span>
      <span className="star star-3">✦</span>
      <span className="star star-4">✦</span>
      <span className="star star-5">✦</span>
      <span className="star star-6">✦</span>
      <span className="star star-7">✦</span>
      <span className="star star-8">✦</span>

      <div className="relative z-10 mx-auto flex max-w-5xl items-center justify-center gap-4">
        {/* Moon */}
        <div className="relative h-12 w-12 shrink-0 rounded-full bg-[#f8fafc] sm:h-14 sm:w-14">
          <div className="absolute -right-1 top-1 h-11 w-11 rounded-full bg-[#111827] sm:h-[52px] sm:w-[52px]" />
        </div>

        {/* Text */}
        <div className="text-center">
          <h2 className="text-base font-semibold sm:text-lg">
            Shopinger is closed for the night
          </h2>

          <p className="mt-1 text-xs text-gray-300 sm:text-sm">
            We&apos;ll be back at 7:00 AM
          </p>
        </div>
      </div>

      <style jsx>{`
        .star {
          position: absolute;
          color: #f8fafc;
          font-size: 14px;
          opacity: 0.45;
          animation: twinkle 2.8s ease-in-out infinite;
        }

        .star-1 {
          left: 7%;
          top: 22%;
          animation-delay: 0s;
        }

        .star-2 {
          left: 18%;
          bottom: 18%;
          font-size: 10px;
          animation-delay: 0.7s;
        }

        .star-3 {
          left: 31%;
          top: 18%;
          font-size: 9px;
          animation-delay: 1.3s;
        }

        .star-4 {
          left: 44%;
          bottom: 17%;
          font-size: 11px;
          animation-delay: 0.4s;
        }

        .star-5 {
          right: 34%;
          top: 15%;
          font-size: 9px;
          animation-delay: 1.7s;
        }

        .star-6 {
          right: 22%;
          bottom: 20%;
          font-size: 11px;
          animation-delay: 0.9s;
        }

        .star-7 {
          right: 10%;
          top: 23%;
          font-size: 14px;
          animation-delay: 2.1s;
        }

        .star-8 {
          left: 56%;
          top: 10%;
          font-size: 8px;
          animation-delay: 1.1s;
        }

        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.25;
            transform: scale(0.8);
          }

          50% {
            opacity: 1;
            transform: scale(1.15);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .star {
            animation: none;
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
};

export default OvernightClosedBanner;