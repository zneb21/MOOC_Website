import { useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
//LiquidEther Background
import LiquidEther from "@/components/ui/liquidether";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Heart,
  Users,
  Globe,
  Award,
  Target,
  Eye,
  Sparkles,
  MapPin,
  Camera,
} from "lucide-react";

import Reveal from "@/components/home/Reveal";
import SectionSeparator from "@/components/home/SectionSeparator";

// ✅ Using your existing images as "cultural strip" placeholders
import tourismImage from "@/assets/course-tourism.jpg";
import cookingImage from "@/assets/course-cooking.jpg";
import agricultureImage from "@/assets/course-agriculture.jpg";
import craftsImage from "@/assets/course-crafts.jpg";
import heroImage from "@/assets/hero-iloilo.jpg";

/* --------------------------------
   helpers
--------------------------------- */
function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

/* --------------------------------
   PremiumTiltCard
   - mouse-follow tilt
   - shimmer border on hover
   - ring emerald on hover
   - dark-mode glass colors fixed
--------------------------------- */
type PremiumTiltCardProps = {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  maxTilt?: number;
};

function PremiumTiltCard({
  children,
  className,
  innerClassName,
  maxTilt = 10,
}: PremiumTiltCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [hovered, setHovered] = useState(false);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);

  const springRx = useSpring(rx, { stiffness: 260, damping: 22 });
  const springRy = useSpring(ry, { stiffness: 260, damping: 22 });

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dx = x / rect.width - 0.5;
    const dy = y / rect.height - 0.5;

    rx.set(-dy * maxTilt);
    ry.set(dx * maxTilt);
  }

  function onEnter() {
    setHovered(true);
  }

  function onLeave() {
    setHovered(false);
    rx.set(0);
    ry.set(0);
  }

  return (
    <div className={cn("relative", className)} style={{ perspective: 1100 }}>
      {/* shimmer border layer */}
      <motion.div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 rounded-3xl p-[1px]",
          hovered ? "opacity-100" : "opacity-0"
        )}
        style={{
          background:
            "linear-gradient(120deg, rgba(16,185,129,0), rgba(110,231,183,.35), rgba(16,185,129,0))",
          backgroundSize: "200% 200%",
        }}
        animate={
          hovered
            ? { backgroundPosition: ["0% 50%", "200% 50%"] }
            : { backgroundPosition: "0% 50%" }
        }
        transition={
          hovered
            ? { duration: 1.6, repeat: Infinity, ease: "linear" }
            : { duration: 0.2 }
        }
      />

      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        style={{
          rotateX: springRx,
          rotateY: springRy,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ y: -6, scale: 1.03 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="relative"
      >
        {/* ✅ dark-mode card color + readable text base */}
        <div
          className={cn(
            "relative rounded-3xl overflow-hidden backdrop-blur-xl",
            // light mode
            "bg-white/60 border border-black/10",
            "shadow-[0_16px_50px_rgba(0,0,0,0.10)] hover:shadow-[0_30px_100px_rgba(0,0,0,0.20)]",
            // dark mode (fixed)
            "dark:bg-zinc-950/55 dark:border-white/10",
            "dark:shadow-[0_18px_60px_rgba(0,0,0,0.65)] dark:hover:shadow-[0_34px_120px_rgba(0,0,0,0.85)]",
            // hover ring requested
            "hover:ring-1 hover:ring-emerald-300/40",
            innerClassName
          )}
        >
          {/* subtle inner highlight */}
          <div className="pointer-events-none absolute -inset-24 opacity-70">
            <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-white/10 dark:bg-white/5 blur-3xl" />
          </div>

          {children}
        </div>
      </motion.div>
    </div>
  );
}

/* --------------------------------
   data
--------------------------------- */
const teamMembers = [
  {
    name: "Maria Santos",
    role: "Founder & Lead Instructor",
    bio: "Passionate about preserving Ilonggo heritage through education.",
  },
  {
    name: "Ramon Cruz",
    role: "Head of Content",
    bio: "Ensures every course stays authentic, practical, and culturally rooted.",
  },
  {
    name: "Ana Reyes",
    role: "Community Manager",
    bio: "Builds meaningful connections between learners and local experts.",
  },
  {
    name: "Jasper Lim",
    role: "Product & Design",
    bio: "Crafts modern, accessible learning experiences with clean UI systems.",
  },
  {
    name: "Lola Perla",
    role: "Cultural Artisan Mentor",
    bio: "Guides learners through traditional crafts and heritage practices.",
  },
];

const values = [
  {
    icon: Heart,
    title: "Cultural Preservation",
    description:
      "We believe in keeping Filipino traditions alive through education and practice.",
  },
  {
    icon: Users,
    title: "Community First",
    description: "Building strong connections between learners and local experts.",
  },
  {
    icon: Globe,
    title: "Accessible Learning",
    description: "Making quality education available to every Filipino, everywhere.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Delivering the highest quality content from expert local instructors.",
  },
];

const culturalStrip = [
  { src: heroImage, label: "Heritage landscapes" },
  { src: tourismImage, label: "Local tourism & identity" },
  { src: cookingImage, label: "Cuisine & tradition" },
  { src: agricultureImage, label: "Farming knowledge" },
  { src: craftsImage, label: "Craftsmanship & art" },
];

const listVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1 },
};

/* --------------------------------
   page
--------------------------------- */
const About = () => {
  const stats = useMemo(
    () => [
      { icon: MapPin, label: "Rooted in Iloilo" },
      { icon: Users, label: "Community-driven" },
      { icon: Award, label: "Quality-first" },
    ],
    []
  );

  return (
     <div className="relative min-h-screen bg-muted">
       {/* Background Layer */}
       <div
         style={{
           position: "fixed",
           top: 0,
           left: 0,
           width: "100%",
           height: "100vh",
           zIndex: 0,
         }}
         className="liquid-ether-container"
       >
         <LiquidEther
           colors={["#4C8C4A", "#98D198", "#70A370"]}
           mouseForce={30}
           cursorSize={100}
           isViscous={false}
           viscous={30}
           iterationsViscous={32}
           iterationsPoisson={32}
           resolution={0.3}
           isBounce={false}
           autoDemo={true}
           autoSpeed={0.5}
           autoIntensity={2.2}
           takeoverDuration={0.25}
           autoResumeDelay={3000}
           autoRampDuration={0.6}
         />
       </div>
      <Navbar />

      <main className="pt-16 lg:pt-20 relative z-10">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-950 via-emerald-900/80 to-background" />
          <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:22px_22px]" />

          <div className="absolute -top-24 right-10 w-96 h-96 bg-[#F4B942]/18 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-400/14 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-32 left-1/2 w-72 h-72 bg-white/8 rounded-full blur-3xl -translate-x-1/2" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="py-16 sm:py-20 lg:py-24">
              <div className="max-w-3xl mx-auto text-center">
                <Reveal>
                  <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 bg-white/10 backdrop-blur-xl border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.20)]">
                    <Sparkles className="w-4 h-4 text-[#F4B942]" />
                    <span className="text-white/90 text-sm font-semibold tracking-wide">
                      About SilayLearn
                    </span>
                  </div>
                </Reveal>

                <Reveal delayMs={80}>
                  <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                    Empowering learners through{" "}
                    <span className="text-[#F4B942]">Ilonggo heritage</span>
                  </h1>
                </Reveal>

                <Reveal delayMs={140}>
                  <p className="mt-6 text-white/80 text-lg sm:text-xl leading-relaxed">
                    SilayLearn is a localized learning platform centered on Philippine
                    culture, Iloilo heritage, and traditional skills—built to preserve
                    identity while opening modern opportunities.
                  </p>
                </Reveal>

                {/* ✅ these are also cards, so they now look good in dark mode */}
                <Reveal delayMs={220}>
                  <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.25 }}
                    variants={listVariants}
                    className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4"
                  >
                    {stats.map((s) => (
                      <motion.div key={s.label} variants={itemVariants}>
                        <PremiumTiltCard maxTilt={8}>
                          <div className="p-5">
                            <s.icon className="w-5 h-5 text-[#F4B942] mb-2" />
                            <div className="text-white/90 text-sm font-semibold">
                              {s.label}
                            </div>
                          </div>
                        </PremiumTiltCard>
                      </motion.div>
                    ))}
                  </motion.div>
                </Reveal>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <SectionSeparator />
          </div>
        </section>

        {/* MISSION + VISION */}
        <section className="relative py-20 lg:py-28 bg-background overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_1px_1px,black_1px,transparent_0)] [background-size:26px_26px]" />
          <div className="absolute -top-20 left-12 w-64 h-64 bg-[#F4B942]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-12 right-10 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <Reveal>
              <div className="max-w-2xl mx-auto text-center mb-12 lg:mb-16">
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">
                  Our <span className="text-gradient">Purpose</span>
                </h2>
                <p className="text-lg text-zinc-600 dark:text-zinc-300">
                  Built to preserve culture while empowering learners with practical,
                  modern-ready skills.
                </p>
              </div>
            </Reveal>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              variants={listVariants}
              className="grid lg:grid-cols-2 gap-8"
            >
              <motion.div variants={itemVariants}>
                <PremiumTiltCard maxTilt={10}>
                  <div className="p-8 lg:p-10">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 dark:bg-emerald-400/10 flex items-center justify-center mb-6 border border-black/5 dark:border-white/10">
                      <Target className="w-7 h-7 text-emerald-700 dark:text-emerald-300" />
                    </div>

                    <h3 className="font-display text-2xl lg:text-3xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">
                      Our Mission
                    </h3>

                    <p className="leading-relaxed text-zinc-600 dark:text-zinc-300">
                      To provide accessible, high-quality education that celebrates and
                      preserves Filipino and Ilonggo culture—empowering learners with
                      practical skills rooted in heritage.
                    </p>
                  </div>
                </PremiumTiltCard>
              </motion.div>

              <motion.div variants={itemVariants}>
                <PremiumTiltCard maxTilt={10}>
                  <div className="p-8 lg:p-10">
                    <div className="w-14 h-14 rounded-2xl bg-[#F4B942]/15 dark:bg-[#F4B942]/10 flex items-center justify-center mb-6 border border-black/5 dark:border-white/10">
                      <Eye className="w-7 h-7 text-[#F4B942]" />
                    </div>

                    <h3 className="font-display text-2xl lg:text-3xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">
                      Our Vision
                    </h3>

                    <p className="leading-relaxed text-zinc-600 dark:text-zinc-300">
                      To become the leading platform for localized Philippine education—where
                      cultural knowledge is treasured, shared, and passed on for generations.
                    </p>
                  </div>
                </PremiumTiltCard>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CULTURAL IMAGE STRIP */}
        <section className="relative py-12 lg:py-16 bg-background overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,black_1px,transparent_0)] [background-size:26px_26px]" />
          <div className="absolute -top-24 right-8 w-72 h-72 bg-[#F4B942]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <Reveal>
              <div className="max-w-2xl mx-auto text-center mb-8">
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4 bg-black/5 dark:bg-white/5 backdrop-blur-xl border border-black/10 dark:border-white/10">
                  <Camera className="w-4 h-4 text-[#F4B942]" />
                  <span className="text-foreground/80 text-sm font-semibold tracking-wide">
                    Culture in Motion
                  </span>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-zinc-50">
                  A glimpse of what we teach
                </h2>
                <p className="mt-3 text-zinc-600 dark:text-zinc-300">
                  Real-world skills and heritage—captured through places, food, crafts, and community.
                </p>
              </div>
            </Reveal>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={listVariants}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
            >
              {culturalStrip.map((item) => (
                <motion.div key={item.label} variants={itemVariants}>
                  <PremiumTiltCard maxTilt={8} innerClassName="p-0">
                    <div className="relative">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={item.src}
                          alt={item.label}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                      </div>

                      <div className="absolute inset-x-3 bottom-3 rounded-2xl px-3 py-2 bg-white/10 backdrop-blur-2xl border border-white/15">
                        <div className="text-white/90 text-sm font-semibold">{item.label}</div>
                      </div>
                    </div>
                  </PremiumTiltCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* VALUES */}
        <section className="relative py-20 lg:py-28 bg-muted overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_1px_1px,black_1px,transparent_0)] [background-size:26px_26px]" />
          <div className="absolute -top-24 right-10 w-72 h-72 bg-[#F4B942]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-12 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <Reveal>
              <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">
                  Our <span className="text-gradient">Values</span>
                </h2>
                <p className="text-lg text-zinc-600 dark:text-zinc-300">
                  The principles that guide everything we do.
                </p>
              </div>
            </Reveal>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              variants={listVariants}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {values.map((value) => (
                <motion.div key={value.title} variants={itemVariants}>
                  <PremiumTiltCard maxTilt={9}>
                    <div className="p-6">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 dark:bg-emerald-400/10 flex items-center justify-center mb-4 border border-black/5 dark:border-white/10">
                        <value.icon className="w-6 h-6 text-emerald-700 dark:text-emerald-300" />
                      </div>

                      <h3 className="font-display text-lg font-semibold mb-2 text-zinc-900 dark:text-zinc-50">
                        {value.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                        {value.description}
                      </p>
                    </div>
                  </PremiumTiltCard>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <SectionSeparator />
          </div>
        </section>

        {/* TEAM */}
        <section className="relative py-20 lg:py-28 bg-background overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_1px_1px,black_1px,transparent_0)] [background-size:26px_26px]" />
          <div className="absolute -top-20 left-10 w-72 h-72 bg-[#F4B942]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-12 right-10 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <Reveal>
              <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">
                  Meet Our <span className="text-gradient">Team</span>
                </h2>
                <p className="text-lg text-zinc-600 dark:text-zinc-300">
                  A small team with a big mission—culture-first learning for everyone.
                </p>
              </div>
            </Reveal>

            {/* 3 on top + 2 on bottom */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              variants={listVariants}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-6"
            >
              {teamMembers.map((m, i) => (
                <motion.div
                  key={m.name}
                  variants={itemVariants}
                  className={cn(i < 3 ? "md:col-span-2" : "md:col-span-3")}
                >
                  <PremiumTiltCard maxTilt={10}>
                    <div className="p-6 text-center group">
                      {/* ✅ blur is softer + readable even in dark mode */}
                      <div className="transition-[filter] duration-0 blur-[1.1px] opacity-90 group-hover:opacity-100 group-hover:blur-0">
                        {/* avatar micro-interactions */}
                        <div
                          className={cn(
                            "w-20 h-20 rounded-full mx-auto mb-4 grid place-items-center",
                            "bg-gradient-to-br from-emerald-500 to-teal-400",
                            "border border-white/20",
                            "shadow-[0_18px_60px_rgba(16,185,129,0.20)]",
                            "transition-all duration-200",
                            "group-hover:scale-[1.06] group-hover:shadow-[0_22px_80px_rgba(16,185,129,0.35)]"
                          )}
                        >
                          <span className="font-display text-xl font-bold text-emerald-950">
                            {m.name.charAt(0)}
                          </span>
                        </div>

                        <h3 className="font-display text-lg font-semibold mb-1 text-zinc-900 dark:text-zinc-50">
                          {m.name}
                        </h3>
                        <p className="text-emerald-700 dark:text-emerald-300 font-semibold text-xs mb-3">
                          {m.role}
                        </p>
                        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                          {m.bio}
                        </p>
                      </div>
                    </div>
                  </PremiumTiltCard>
                </motion.div>
              ))}
            </motion.div>

            <Reveal delayMs={200}>
              <p className="text-center text-zinc-600 dark:text-zinc-300 text-sm mt-8">
                Hover a card to focus • Mouse-tilt • Shimmer edge • Premium glass depth
              </p>
            </Reveal>
          </div>
        </section>

        {/* ADVOCACY */}
        <section className="relative py-20 lg:py-28 bg-primary overflow-hidden">
          <div className="absolute -top-20 right-10 w-80 h-80 bg-[#F4B942]/16 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-400/14 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
          <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:22px_22px]" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-emerald-950/60 pointer-events-none" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Reveal>
              <PremiumTiltCard
                maxTilt={7}
                innerClassName="bg-white/10 dark:bg-white/10 border-white/15"
              >
                <div className="max-w-4xl mx-auto text-center p-8 sm:p-10">
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                    Our <span className="text-gradient">Advocacy</span>
                  </h2>

                  <p className="text-white/80 text-lg leading-relaxed mb-8">
                    We promote Filipino and Ilonggo education as a means of cultural
                    preservation and economic empowerment. Every course is designed to honor
                    heritage and inspire the next generation of Filipino artisans, farmers,
                    chefs, and tourism ambassadors.
                  </p>

                  <div className="inline-flex items-center gap-2 text-[#F4B942]">
                    <Heart className="w-5 h-5 fill-[#F4B942] color-gradient" />
                    <span className="text-gradient">Made with love in Iloilo, Philippines</span>
                  </div>
                </div>
              </PremiumTiltCard>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
