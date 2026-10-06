import type { FC } from "react";
import Image from "next/image";

const MedicalHeaderBanner: FC = () => {
  return (
    <div className="-mx-4 -mt-3 sm:-mx-0 sm:-mt-0 w-[calc(100%+2rem)] sm:w-full overflow-hidden rounded-none p-0 border-none">
      <div className="relative aspect-[700/232] w-full rounded-none overflow-hidden">
        <Image
          src="/images/medical/banner-poster.png"
          alt="Shopinger Medical - Care for you. All in one place. Doctors, medicines and lab tests."
          fill
          priority
          sizes="100vw"
          className="object-cover rounded-none"
        />
      </div>
    </div>
  );
};

export default MedicalHeaderBanner;
