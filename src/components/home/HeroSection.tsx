import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, BookOpen } from "lucide-react";
import heroImage from "@/assets/hero-iloilo.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16 lg:pt-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Beautiful Iloilo rice terraces at sunset"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-accent/20 rounded-full blur-3xl animate-float delay-300" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-4 py-2 mb-6 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-primary-foreground/90 text-sm font-medium">
              Learn Filipino Culture & Skills
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground leading-tight mb-6 animate-fade-up delay-100">
            Discover the Heart of{" "}
            <span className="text-secondary">Ilonggo</span>{" "}
            Heritage
          </h1>

          {/* Description */}
          <p className="text-primary-foreground/80 text-lg sm:text-xl leading-relaxed mb-8 animate-fade-up delay-200">
            Immerse yourself in localized learning centered on Philippine culture, 
            Iloilo tourism, traditional crafts, and authentic Filipino cuisine. 
            Start your journey today.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 animate-fade-up delay-300">
            <Button variant="hero" size="xl" asChild>
              <Link to="/courses" className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Start Learning
              </Link>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <Link to="/courses" className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Browse Courses
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-primary-foreground/20 animate-fade-up delay-400">
            {[
              { value: "50+", label: "Local Courses" },
              { value: "2,000+", label: "Learners" },
              { value: "20+", label: "Expert Instructors" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-2xl sm:text-3xl font-bold text-secondary">
                  {stat.value}
                </div>
                <div className="text-primary-foreground/70 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
