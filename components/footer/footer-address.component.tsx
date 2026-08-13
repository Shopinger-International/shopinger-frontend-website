// types
import type { FC } from "react";

// local components
import FooterSocial from "@/components/footer/footer-social.component";

const FooterAddress: FC = () => {
  return (
    <>
      {/* Registered Address */}
      <div className="col-span-2 space-y-3 lg:col-span-1">
        <h4 className="text-sm font-semibold text-white uppercase">
          Registered Office Address
        </h4>

        <address className="text-sm text-white/80 not-italic">
          Shopinger International Private Limited
          <br />
          Bharvaliya Bujurg,
          <br />
          Taramandal, Gorakhpur,
          <br />
          Uttar Pradesh – 273015, India
        </address>
        <p className="text-sm font-medium text-white/80">
          GSTIN: 09ABPCS7248K1CR
        </p>
      </div>
      {/* Corporate Address */}
      <div className="col-span-2 space-y-3 lg:col-span-1">
        <h4 className="font-semibold text-white uppercase">
          Corporate Office Address
        </h4>

        <address className="text-sm font-medium text-white/80 not-italic">
          Shopinger International Private Limited
          <br />
          T-344, West Patel Nagar, New Delhi – 110008
        </address>

        <p className="text-sm font-medium text-white/80">
          CIN: U47912UP2025PTC219935
        </p>
        <p className="text-sm font-medium text-white/80">
          GSTIN: 07ABPCS7248K1ZK
        </p>

        <FooterSocial />
      </div>
    </>
  );
};
export default FooterAddress;
