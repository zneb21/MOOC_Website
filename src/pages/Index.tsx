import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedCourses from "@/components/home/FeaturedCourses";
import CTASection from "@/components/home/CTASection";
import LiquidEther from "@/components/ui/liquidether";

const Index = () => {
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
              mouseForce={25}
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
      <main>
        <HeroSection />
        <CategoriesSection />
        <FeaturedCourses />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
