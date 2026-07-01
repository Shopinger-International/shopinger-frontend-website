// types
import type { FC } from "react";

// local components
import FooterSocial from "@/components/footer/footer-social.component";

// icons
import { Phone, Mail } from "lucide-react";

const FooterAddress: FC = () => {
  return (
    <>
      {/* Corporate Address */}
      <div className="col-span-2 space-y-3 lg:col-span-1">
        <h4 className="font-semibold text-white uppercase">
          Corporate Office Address
        </h4>
        <address className="text-sm text-white/80 not-italic">
          Shopinger International Private Limited
          <br />
          Bharvaliya Bujurg, Near Maurya Complex,
          <br />
          Taramandal, Gorakhpur,
          <br />
          Uttar Pradesh – 273015, India
        </address>
        <a
          href="tel:+919415761434"
          className="flex items-center gap-2 transition-colors hover:text-white"
        >
          <Phone size={16} />
          <span>+91 94157 61434</span>
        </a>

        <a
          href="mailto:info@shopinger.co.in"
          className="flex items-center gap-2 transition-colors hover:text-white"
        >
          <Mail size={16} />
          <span className="break-all">info@shopinger.co.in</span>
        </a>
      </div>

      {/* Registered Address */}
      <div className="col-span-2 space-y-3 lg:col-span-1">
        <h4 className="text-sm font-semibold text-white uppercase">
          Registered Office Address
        </h4>

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
