import React from "react";

// --- Data for this Hero Section ---
const heroData = {
  title: " The Future of Excellence with Mugafi Today",
//   subtitle: "with Mugafi Today",
  visualSrc: "/partners/111.png", // your background image
  partners: [
    {
      name: "SINGAPORE FINTECH FESTIVAL™",
      src: "/partners/111.png", // ✅ replace with your image path
    },
    {
      name: "IMDb",
      src: "/partners/222.png", // ✅ replace with your image path
    },
    {
      name: "FESTIVAL DE CANNES",
      src: "/partners/333.png", // ✅ replace with your image path
    },
  ],
};

// --- Partner Logo Component ---
const PartnerLogo = ({ src, name }) => (
  <div className="my-2 p-4 hover:bg-white/10 transition-all duration-300 flex items-center justify-center h-16 w-36 sm:h-20 sm:w-48">
    {src ? (
      <img
        src={src}
        alt={name}
        className="max-h-full max-w-full object-contain"
      />
    ) : (
      <span className="text-white/70 text-xs sm:text-sm tracking-widest">
        {name}
      </span>
    )}
  </div>
);

// --- Main Component ---
const HeroSection2 = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
  {/* ✅ Gradient background layer */}
  <div
  className="absolute inset-0 z-0"
  // style={{
  //   background:
  //     "radial-gradient(circle at 60% 20% , rgba(255, 60, 60, 1) 0%, rgba(0, 0, 0, 1) 70%)",
  //   backgroundRepeat: "no-repeat",
  //   backgroundSize: "cover",
  //   backgroundPosition: "center",
  // }}
></div>


  {/* ✅ Foreground content */}
  <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 p-4">
    <div className="text-center mb-16 mt-20 sm:mt-0">
      <h1 className="text-3xl sm:text-5xl font-light mb-1">
        {heroData.title}
      </h1>
      <p className="text-xl sm:text-3xl font-light text-white/90">
        {heroData.subtitle}
      </p>
    </div>

    <div className="flex flex-wrap justify-center items-center mt-8 pt-8">
      {heroData.partners.map((partner, index) => (
        <PartnerLogo key={index} src={partner.src} name={partner.name} />
      ))}
    </div>
  </div>
</div>

  );
};

export default HeroSection2;
