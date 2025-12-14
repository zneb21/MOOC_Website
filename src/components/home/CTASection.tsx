import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Reveal from "@/components/home/Reveal";

const CTASection = () => {
  return (
    <section className="relative py-20 lg:py-28 bg-primary overflow-hidden">
      {/* ambient blobs */}
      <div className="absolute -top-16 left-10 w-80 h-80 bg-[#F4B942]/16 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-400/14 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      {/* subtle texture */}
      <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:22px_22px]" />

      {/* fade into footer */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-emerald-950/60 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Reveal>
          <div className="max-w-3xl mx-auto text-center rounded-3xl p-8 sm:p-10 bg-white/12 dark:bg-white/9 backdrop-blur-2xl border border-white/15 shadow-[0_28px_90px_rgba(0,0,0,0.35)] transition-all duration-500">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 border border-white/15 mb-6 shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
              <GraduationCap className="w-8 h-8 text-[#F4B942]" />
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Start Your <span className="text-[#F4B942]">Learning Journey?</span>
            </h2>

            <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of Filipino learners discovering local culture, traditional skills,
              and heritage. Your path to becoming an expert starts here.
            </p>

            {/* CTA BUTTONS */}
            <div className="flex flex-wrap justify-center gap-6">
              {/* Primary CTA */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="gold"
                  size="xl"
                  asChild
                  className="relative overflow-hidden group shadow-[0_18px_45px_rgba(0,0,0,0.3)]"
                >
                  <Link to="/register" className="flex items-center gap-3">
                    {/* shimmer */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-700" />

                    <Sparkles className="w-5 h-5 text-white" />
                    <span className="relative z-10">Get Started Free</span>
                    <ArrowRight className="relative z-10 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </motion.div>

              {/* Secondary CTA */}
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="hero-outline"
                  size="xl"
                  asChild
                  className="relative border-white/25 bg-white/5 hover:bg-white/10 backdrop-blur-xl"
                >
                  <Link to="/courses" className="relative group">
                    <span className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#F4B942]/40 to-teal-400/40 opacity-0 blur group-hover:opacity-100 transition" />
                    <span className="relative">Explore Courses</span>
                  </Link>
                </Button>
              </motion.div>
            </div>

            <p className="text-white/60 text-sm mt-10">
              No credit card required • Free starter courses available
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default CTASection;