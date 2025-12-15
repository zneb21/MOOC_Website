import { Link } from "react-router-dom";
import { GraduationCap, Facebook, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-emerald-950/95 text-primary-foreground border-t border-white/10 shadow-[0_-20px_60px_rgba(0,0,0,0.35)]">
      {/* subtle premium dot texture */}
      <div className="absolute inset-0 -z-10 opacity-[0.06] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:22px_22px]" />

      {/* soft top fade (helps separate from section above) */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/25 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 items-start">
          {/* Brand */}
          <div className="pt-1 text-center md:text-left">
            <Link to="/" className="flex items-center justify-center md:justify-start gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                <GraduationCap className="w-6 h-6 text-white/90" />
              </div>
              <span className="font-display text-xl font-extrabold tracking-tight text-white/95">
                Silay<span className="text-gradient">Learn</span>
              </span>
            </Link>

            <div className="w-10 h-[2px] bg-[#F4B942]/70 rounded-full mb-4 mx-auto md:mx-0" />

            <p className="text-white/70 text-sm leading-relaxed max-w-[260px] mx-auto md:mx-0">
              Empowering Filipino learners through localized education. Discover the richness of Ilonggo
              culture and Philippine heritage.
            </p>
          </div>

          {/* Quick Links */}
          <div className="pt-1 text-center md:text-left">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white/90 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-1.5">
              {["Home", "Courses", "About", "Contact"].map((link) => (
                <li key={link}>
                  <Link
                    to={link === "Home" ? "/" : `/${link.toLowerCase()}`}
                    className="text-white/65 hover:text-[#F4B942] transition-colors text-sm"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="pt-1 text-center md:text-left">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white/90 mb-4">
              Categories
            </h3>
            <ul className="space-y-1.5">
              {["Tourism", "Filipino Cooking", "Agriculture", "Craftsmanship"].map((cat) => (
                <li key={cat}>
                  <Link
                    to="/courses"
                    className="text-white/65 hover:text-[#F4B942] transition-colors text-sm"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="pt-1 text-center md:text-left">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white/90 mb-4">
              Contact Us
            </h3>

            <ul className="space-y-3">
              <li className="flex items-center justify-center md:justify-start gap-3 text-white/65 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0 text-white/70" />
                <span>Iloilo City, Philippines</span>
              </li>

              <li className="flex items-center justify-center md:justify-start gap-3 text-white/65 text-sm">
                <Mail className="w-4 h-4 flex-shrink-0 text-white/70" />
                <a
                  href="mailto:hello@silaylearn.ph"
                  className="hover:text-[#F4B942] transition-colors"
                >
                  hello@silaylearn.ph
                </a>
              </li>

              <li className="flex items-center justify-center md:justify-start gap-3 text-white/65 text-sm">
                <Phone className="w-4 h-4 flex-shrink-0 text-white/70" />
                <span>+63 912 345 6789</span>
              </li>
            </ul>

            <div className="flex justify-center md:justify-start gap-3 mt-5">
              <a
                href="#"
                aria-label="Facebook"
                className="w-10 h-10 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center
                           hover:bg-[#F4B942]/15 hover:border-[#F4B942]/25 hover:text-[#F4B942]
                           transition-all duration-200 hover:scale-105"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-center">
          <p className="text-white/50 text-sm">© 2024 SilayLearn. All rights reserved.</p>

          <div className="flex gap-4">
            <Link to="#" className="text-white/50 hover:text-white/80 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="text-white/50 hover:text-white/80 text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
