import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, BookOpen, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-iloilo.jpg";
import SectionSeparator from "@/components/home/SectionSeparator";

const HeroSection = () => {
  const bgRef = useRef<HTMLDivElement | null>(null);
  const blob1Ref = useRef<HTMLDivElement | null>(null);
  const blob2Ref = useRef<HTMLDivElement | null>(null);

  // ✅ (1) Layered parallax (safe + subtle)
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (bgRef.current) bgRef.current.style.transform = `translate3d(0, ${y * 0.12}px, 0)`;
      if (blob1Ref.current) blob1Ref.current.style.transform = `translate3d(0, ${y * 0.06}px, 0)`;
      if (blob2Ref.current) blob2Ref.current.style.transform = `translate3d(0, ${y * 0.04}px, 0)`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-16 lg:pt-20 overflow-hidden">
      {/* background layer (parallax target) */}
      <div ref={bgRef} className="absolute inset-0 z-0 will-change-transform">
        <img src={heroImage} alt="Iloilo" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-950/70 to-emerald-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
      </div>

      {/* extra blobs */}
      <div ref={blob1Ref} className="absolute top-20 right-8 w-80 h-80 bg-[#F4B942]/18 rounded-full blur-3xl will-change-transform" />
      <div ref={blob2Ref} className="absolute bottom-24 left-10 w-64 h-64 bg-teal-400/14 rounded-full blur-3xl will-change-transform" />
      <div className="absolute top-1/3 left-1/2 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl -translate-x-1/2" />

      {/* texture */}
      <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:22px_22px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 bg-white/10 backdrop-blur-xl border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.20)]">
            <Sparkles className="w-4 h-4 text-[#F4B942]" />
            <span className="text-white/90 text-sm font-semibold tracking-wide">
              Learn Filipino Culture & Skills
            </span>
          </div>

          {/* hero glass card */}
          <div className="rounded-3xl p-7 sm:p-9 bg-white/8 dark:bg-white/7 backdrop-blur-2xl border border-white/12 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-5">
              Discover the Heart of <span className="text-[#F4B942]">Ilonggo</span> Heritage
            </h1>

            <p className="text-white/80 text-lg sm:text-xl leading-relaxed mb-8">
              Immerse yourself in localized learning centered on Philippine culture, Iloilo tourism,
              traditional crafts, and authentic Filipino cuisine.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
              variant="gold"
              size="xl"
              asChild
              className="shadow-[0_16px_40px_rgba(0,0,0,0.25)]"
            >
  

                <Link to="/courses" className="flex items-center gap-2">
                  <Play className="w-5 h-5 mr-2"/>
                  Start Learning
                </Link>
              </Button>

              <Button
                size="xl"
                variant="outline"
                asChild
                className="
                  group relative overflow-hidden
                  bg-white/10 text-white
                  border border-white/25
                  hover:bg-white/15 hover:border-white/40
                  shadow-[0_12px_32px_rgba(0,0,0,0.25)]
                  backdrop-blur-md
                "
              >
                <Link to="/courses" className="relative inline-flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />

                  {/* text + animated underline */}
                  <span className="relative">
                    Browse Courses
                    <span
                      className="
                        pointer-events-none absolute left-0 -bottom-1 h-[2px] w-full
                        origin-left scale-x-0
                        bg-white/80
                        transition-transform duration-300
                        group-hover:scale-x-100
                      "
                    />
                  </span>

                  {/* subtle glow line (bottom) */}
                  <span
                    className="
                      pointer-events-none absolute bottom-0 left-0 h-[2px] w-full
                      opacity-0 transition-opacity duration-300
                      group-hover:opacity-100
                      bg-gradient-to-r from-transparent via-white/55 to-transparent
                    "
                  />
                </Link>
              </Button>


            </div>

            <div className="grid grid-cols-3 gap-6 mt-10 pt-6 border-t border-white/15">
              {[
                { value: "50+", label: "Local Courses" },
                { value: "2,000+", label: "Learners" },
                { value: "20+", label: "Expert Instructors" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-display text-2xl sm:text-3xl font-bold text-[#F4B942]">{s.value}</div>
                  <div className="text-white/65 text-sm">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-6 text-white/55 text-sm">
            Learn at your pace • Culture-first • Beginner friendly
          </p>
        </div>
      </div>

      {/* wave end */}
      <div className="absolute bottom-0 left-0 right-0">
        <SectionSeparator />
      </div>
    </section>
  );
};

export default HeroSection;
