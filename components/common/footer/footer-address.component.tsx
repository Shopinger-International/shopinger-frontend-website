// types
import type { FC } from "react";

// local components
import FooterSocial from "@/components/common/footer/footer-social.component";

const FooterAddress: FC = () => {
  return (
    <>
      {/* Corporate Address */}
      <div className="col-span-2 space-y-3 lg:col-span-1">
        <h6 className="font-semibold text-white uppercase">
          Corporate Office Address
        </h6>

        <address className="text-sm font-medium text-white/80 not-italic">
          Shopinger International Private Limited
          <br />
          Patel Nagar, New Delhi – 110008, India
        </address>

        <p className="text-sm font-medium text-white/80">
          CIN: U47912UP2025PTC219935
        </p>

        <p className="text-sm font-medium text-white/80">+91 94157 61434</p>

        <p className="text-sm font-medium text-white/80">
          info@shopinger.co.in
        </p>
      </div>

      {/* Registered Address */}
      <div className="col-span-2 space-y-3 lg:col-span-1">
        <h6 className="text-sm font-semibold text-white uppercase">
          Registered Office Address
        </h6>

        <address className="text-sm text-white/80 not-italic">
          Shopinger International Private Limited
          <br />
          Bharvaliya Bujurg, Near Maurya Complex,
          <br />
          Taramandal, Gorakhpur,
          <br />
          Uttar Pradesh – 273015, India
        </address>

        <p className="text-sm text-white/80">CIN: U47912UP2025PTC219935</p>
        <FooterSocial />
      </div>
    </>
  );
};
export default FooterAddress;
