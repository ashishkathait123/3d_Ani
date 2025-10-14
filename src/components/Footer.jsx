import React from "react";

const Footer = () => {
  // 👇 Provide your icon paths or imports here
  const socialIcons = [
    { name: "X", src: "/icons/x.svg", link: "https://x.com/" },
    { name: "Discord", src: "/icons/d.svg", link: "https://discord.com/" },
    { name: "LinkedIn", src: "/icons/L.svg", link: "https://linkedin.com/" },
    { name: "Telegram", src: "/icons/t.svg", link: "https://t.me/" },
    { name: "Facebook", src: "/icons/f.svg", link: "https://facebook.com/" },
  ];

  return (
    <footer
      className="absolute bottom-0 left-0 right-0 h-[254px] md:h-28 bg-black/40 backdrop-blur-md border-t border-white/10 text-white z-50 
                 px-8 py-3 flex flex-col md:flex-row items-center justify-between"
    >
      {/* LEFT SECTION */}
      <div className="flex flex-col justify-between items-start h-full">
        <div className="flex flex-col items-start pt-1">
 <img
            src="/logo/logo.png"  // <--- your logo path here
            alt="Mugafi Logo"
            className="h-6 md:h-8 object-contain brightness-110"
          />          <p className="text-xs text-white/50 font-light tracking-wider mt-0.5 whitespace-nowrap">
            AI-Powered Multiverse of Imagination
          </p>
        </div>
        <p className="text-[10px] text-white/40 mb-1">© 2025 MUGAFI</p>
      </div>

      {/* MIDDLE SECTION - SOCIAL ICONS */}
      <div className="flex flex-grow justify-center items-center space-x-4 md:space-x-6 h-full w-full">
        {socialIcons.map(({ name, src, link }) => (
          <a
            key={name}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${name} link`}
            className="w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform duration-200"
          >
            <img
              src={src}
              alt={name}
              className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity"
            />
          </a>
        ))}
      </div>

      {/* RIGHT SECTION */}
      <div className="flex flex-col items-end text-right h-full justify-between w-auto">
        <div className="flex flex-col items-end pt-1">
          <span className="text-[10px] font-mono tracking-widest text-white/70 mb-1">LINKS</span>
          <div className="flex flex-wrap justify-end space-x-3 text-xs font-light text-white/70 whitespace-nowrap">
            {["HOME", "PRODUCT", "GALLERY", "DAO", "COMMUNITY", "COMPANY >"].map((item) => (
              <a key={item} href="#" className="hover:text-red-500 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>

        <div className="flex space-x-4 text-xs font-light text-white/50 mb-1">
          <a href="#" className="hover:text-red-500 transition-colors">
            TERMS
          </a>
          <a href="#" className="hover:text-red-500 transition-colors">
            PRIVACY
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
