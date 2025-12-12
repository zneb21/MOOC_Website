import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowRight } from "lucide-react";
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
          <div
            className="max-w-3xl mx-auto text-center rounded-3xl p-8 sm:p-10
                       bg-white/12 dark:bg-white/9 backdrop-blur-2xl border border-white/15
                       shadow-[0_28px_90px_rgba(0,0,0,0.35)]
                       hover:shadow-[0_40px_120px_rgba(0,0,0,0.48)]
                       transition-all duration-500"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 border border-white/15 mb-6 shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
              <GraduationCap className="w-8 h-8 text-[#F4B942]" />
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Start Your <span className="text-[#F4B942]">Learning Journey?</span>
            </h2>

            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of Filipino learners discovering the beauty of local culture, traditional
              skills, and heritage. Your path to becoming an expert starts here.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button
                variant="gold"
                size="xl"
                asChild
                className="shadow-[0_18px_45px_rgba(0,0,0,0.25)] hover:shadow-[0_28px_80px_rgba(0,0,0,0.38)] transition-shadow"
              >
                <Link to="/register" className="flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>

              <Button
                variant="hero-outline"
                size="xl"
                asChild
                className="bg-white/5 hover:bg-white/10 border-white/20"
              >
                <Link to="/courses">Explore Courses</Link>
              </Button>
            </div>

            <p className="text-white/60 text-sm mt-8">
              No credit card required • Free starter courses available
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default CTASection;
