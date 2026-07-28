import React from "react";

import p1 from "../assets/partner/l1.png";
import p2 from "../assets/partner/l2.png";
import p3 from "../assets/partner/l3.png";
import p4 from "../assets/partner/l4.png";
import p5 from "../assets/partner/l5.png";
import p6 from "../assets/partner/l6.png";
import p7 from "../assets/partner/l7.png";
import p8 from "../assets/partner/l8.png";
import p9 from "../assets/partner/l9.png";
import p10 from "../assets/partner/l10.png";
import p11 from "../assets/partner/l11.png";
import p12 from "../assets/partner/l12.jpeg";
import p13 from "../assets/partner/l13.png";
import p14 from "../assets/partner/l14.png";

const PartnerMarque = () => {
  const partners = [
    p1,
    p2,
    p3,
    p4,
    p5,
    p6,
    p7,
    p8,
    p9,
    p10,
    p11,
    p12,
    p13,
    p14,
  ];

  return (
    <section className="relative overflow-hidden bg-[var(--color-primary-bg)] py-14 font-arimo">
      <div className="relative flex overflow-hidden">
        <div className="flex shrink-0 animate-[marqueeForward_55s_linear_infinite] items-center gap-16 pr-8">
          {[...partners, ...partners].map((logo, index) => (
            <LogoCard key={index} logo={logo} />
          ))}
        </div>

        <div className="flex shrink-0 animate-[marqueeForward_55s_linear_infinite] items-center gap-16 pr-8">
          {[...partners, ...partners].map((logo, index) => (
            <LogoCard key={index} logo={logo} />
          ))}
        </div>
      </div>

      <div className="relative mt-8 flex overflow-hidden">
        <div className="flex shrink-0 animate-[marqueeBackward_60s_linear_infinite] items-center gap-16 pr-8">
          {[...partners]
            .reverse()
            .concat(partners)
            .map((logo, index) => (
              <LogoCard key={index} logo={logo} small />
            ))}
        </div>

        <div className="flex shrink-0 animate-[marqueeBackward_60s_linear_infinite] items-center gap-16 pr-8">
          {[...partners]
            .reverse()
            .concat(partners)
            .map((logo, index) => (
              <LogoCard key={index} logo={logo} small />
            ))}
        </div>
      </div>

      <style>{`

@keyframes marqueeForward {

  from {
    transform: translate3d(0,0,0);
  }

  to {
    transform: translate3d(-100%,0,0);
  }

}


@keyframes marqueeBackward {

  from {
    transform: translate3d(-100%,0,0);
  }

  to {
    transform: translate3d(0,0,0);
  }

}

`}</style>
    </section>
  );
};

const LogoCard = ({ logo, small }) => {
  return (
    <div
      className={`
        group
        flex
        shrink-0
        items-center
        justify-center
        shadow-sm
        transition-all
        duration-700
        ease-out
        hover:shadow-xl

        ${small ? "h-auto w-auto" : "h-auto w-auto"}

      `}
    >
      <img
        src={logo}
        alt="Partner logo"
        className="
          max-h-12
          max-w-[120px]
          object-contain
          select-none
          pointer-events-none
          transition-transform
          duration-700
          ease-out
          group-hover:scale-110
        "
      />
    </div>
  );
};

export default PartnerMarque;
