// src/components/Presentation.tsx
import { useState, useEffect, useCallback } from "react"; 
import { 
  ChevronLeft, ChevronRight, Sun, Moon, BookOpen, Users, GraduationCap,
  Globe, MessageSquare, Database, Code, Layout, UserCircle, Settings,
  Layers, Server, Heart, Sparkles, Image, Check, Zap, Target, Terminal
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  content: string;
  icon: React.ReactNode;
  accent?: "primary" | "secondary" | "accent";
  features?: string[];
  stats?: { label: string; value: string }[];
  cardStyle?: "hero" | "split" | "centered" | "timeline" | "grid" | "minimal" | "tech" | "showcase";
  hasScreenshot?: boolean;
}

// Slides data
const slides: Slide[] = [
  {
    id: 1,
    title: "SilayLearn",
    subtitle: "CC 201 - Final Project | Group 10",
    content: "A learning website all about Iloilo — discover the heart of Ilonggo heritage through interactive courses, cultural lessons, and community-driven learning.",
    icon: <BookOpen className="w-12 h-12" />,
    accent: "secondary",
    cardStyle: "hero",
  },
  {
    id: 2,
    title: "Introduction",
    content: "SilayLearn is a modern, user-friendly learning platform that shares and explores Iloilo's rich culture. It offers interactive lessons on tourism, cooking, agriculture, and craftsmanship, designed for students, teachers, parents, and anyone curious about Iloilo. With an AI learning assistant, the platform makes cultural education engaging, accessible, and enjoyable.",
    icon: <Heart className="w-12 h-12" />,
    accent: "primary",
    features: ["Interactive Lessons", "AI Learning Assistant", "Cultural Education"],
    cardStyle: "split",
  },
  {
    id: 3,
    title: "Project Description",
    content: "The MOOC web app is a modern, easy-to-use platform focused on teaching Iloilo's culture, heritage, and identity. It offers courses on local traditions, food, history, festivals, and cultural practices. Users can enroll in lessons, track progress, and learn interactively with an AI assistant to guide them.",
    icon: <Layers className="w-12 h-12" />,
    accent: "accent",
    features: ["Course Enrollment", "Progress Tracking", "Interactive Learning"],
    cardStyle: "centered",
  },
  {
    id: 4,
    title: "Cultural Relevance",
    content: "The website promotes localized online learning by focusing specifically on Iloilo's cultural identity. It offers courses about Iloilo cuisine, tourist spots, crafts, agriculture, and traditions. The AI Course Assistant explains lessons using Filipino or Hiligaynon with localized examples.",
    icon: <Globe className="w-12 h-12" />,
    accent: "secondary",
    features: ["Iloilo Cuisine", "Tourist Spots", "Traditional Crafts", "Local Agriculture"],
    cardStyle: "grid",
  },
  {
    id: 5,
    title: "Technical Implementation",
    subtitle: "Features Overview",
    content: "Built with modern technologies including React.js, Vite, and Tailwind CSS. The platform features secure authentication, course management, progress tracking, and an AI-powered learning assistant for enhanced user experience.",
    icon: <Code className="w-12 h-12" />,
    accent: "primary",
    features: ["React.js & Vite", "Secure Authentication", "AI Assistant", "Real-time Progress"],
    cardStyle: "tech",
  },
  {
    id: 6,
    title: "Home Page",
    subtitle: "Gateway to Learning",
    content: "The Home Page gives users an overview of the platform, featuring highlighted courses and clear buttons like 'Start Learning' and 'Browse Courses.' It helps users quickly explore lessons or create an account.",
    icon: <Layout className="w-12 h-12" />,
    accent: "accent",
    stats: [
      { label: "Local Courses", value: "50+" },
      { label: "Learners", value: "2,000+" },
      { label: "Expert Instructors", value: "20+" },
    ],
    cardStyle: "showcase",
    hasScreenshot: true,
  },
  {
    id: 7,
    title: "Course Page",
    subtitle: "Explore & Discover",
    content: "The Courses Page allows users to browse all available courses filtered by categories such as Iloilo tourism, cooking, agriculture, or craftsmanship. A search bar helps users quickly find specific lessons.",
    icon: <BookOpen className="w-12 h-12" />,
    accent: "primary",
    features: ["Tourism", "Cooking", "Language", "History"],
    cardStyle: "showcase",
    hasScreenshot: true,
  },
  {
    id: 8,
    title: "Course Preview",
    subtitle: "Detailed Information",
    content: "The Course Details Page shows the course's objectives, available modules, and key information before enrollment. It includes an 'Enroll Now' button for easy registration, helping users understand what the course offers.",
    icon: <GraduationCap className="w-12 h-12" />,
    accent: "secondary",
    features: ["Course Objectives", "Module Overview", "Easy Enrollment", "Money-back Guarantee"],
    cardStyle: "showcase",
    hasScreenshot: true,
  },
  {
    id: 9,
    title: "Learning Module",
    subtitle: "Interactive Study Area",
    content: "The Learning Module Page is the main study area where users access video lessons, text content, downloads, and interactive tools. It presents Iloilo-focused topics in a clear, organized format.",
    icon: <Sparkles className="w-12 h-12" />,
    accent: "accent",
    features: ["Video Lessons", "Text Content", "Downloads", "Interactive Tools"],
    cardStyle: "showcase",
    hasScreenshot: true,
  },
  {
    id: 10,
    title: "About Page",
    subtitle: "Our Purpose & Mission",
    content: "The About Page outlines the platform's purpose, mission, vision, values, and advocacy. It emphasizes accessible lessons centered on Iloilo culture, supporting all types of learners while celebrating Iloilo heritage.",
    icon: <Heart className="w-12 h-12" />,
    accent: "primary",
    features: ["Rooted in Iloilo", "Community-driven", "Quality-first"],
    cardStyle: "showcase",
    hasScreenshot: true,
  },
  {
    id: 11,
    title: "Authentication",
    subtitle: "Login & Registration",
    content: "The Login and Registration Pages let users securely sign in or create accounts, providing a personalized experience. They enable access to course enrollment and interactive features for all learners.",
    icon: <UserCircle className="w-12 h-12" />,
    accent: "secondary",
    features: ["Secure Sign In", "Easy Registration", "Personalized Experience"],
    cardStyle: "showcase",
    hasScreenshot: true,
  },
  {
    id: 12,
    title: "AI Assistant",
    subtitle: "Meet Roxy",
    content: "The AI Assistant, available on lesson pages, helps users by answering questions, providing summaries, and translating content into Filipino or Hiligaynon. It ensures all users can understand lessons fully.",
    icon: <MessageSquare className="w-12 h-12" />,
    accent: "accent",
    features: ["Answer Questions", "Provide Summaries", "Translate Content", "Cultural Context"],
    cardStyle: "showcase",
    hasScreenshot: true,
  },
  {
    id: 13,
    title: "User Profile",
    subtitle: "Account Settings",
    content: "The User Profile Page lets users manage their account information, including name, email, profile picture, password, and biography. Users can personalize their experience and toggle appearance settings.",
    icon: <Settings className="w-12 h-12" />,
    accent: "primary",
    features: ["Personal Information", "Avatar Customization", "Dark Mode Toggle"],
    cardStyle: "showcase",
    hasScreenshot: true,
  },
  {
    id: 14,
    title: "User Dashboard",
    subtitle: "Track Your Progress",
    content: "The User Dashboard shows enrolled courses with progress bars, completion badges, and 'Continue Learning' shortcuts. Users can filter courses, view summary stats, and explore recommended Iloilo-focused lessons.",
    icon: <Users className="w-12 h-12" />,
    accent: "secondary",
    features: ["Progress Tracking", "Completion Badges", "Course Recommendations"],
    cardStyle: "showcase",
    hasScreenshot: true,
  },
  {
    id: 15,
    title: "CRUD Operations",
    subtitle: "Data Management",
    content: "The system's CRUD functionality connects user actions to a MySQL database via PHP. Create, Read, Update, and Delete operations ensure smooth course delivery and effective data management.",
    icon: <Database className="w-12 h-12" />,
    accent: "accent",
    features: ["Create Accounts", "Read Content", "Update Progress", "Delete Data"],
    cardStyle: "timeline",
  },
  {
    id: 16,
    title: "Technical Stack",
    subtitle: "Technologies Used",
    content: "Built with React.js, Vite, Tailwind CSS for the frontend. Backend powered by PHP and Python Flask. MySQL handles data storage. Git and GitHub for version control.",
    icon: <Code className="w-12 h-12" />,
    accent: "primary",
    features: ["React.js & Vite", "Tailwind CSS", "PHP & Python Flask", "MySQL Database"],
    cardStyle: "tech",
  },
  {
    id: 17,
    title: "Technologies",
    subtitle: "Development Tools",
    content: "Frontend: React.js, Vite, Tailwind CSS. Programming: JavaScript (ES6), JSX, TypeScript. Backend: PHP, Python Flask. Database: MySQL. AI Feature: Python Flask API-based assistant.",
    icon: <Server className="w-12 h-12" />,
    accent: "secondary",
    features: ["VS Code", "phpMyAdmin", "XAMPP", "GitHub"],
    cardStyle: "grid",
  },
  {
    id: 18,
    title: "Database Integration",
    subtitle: "MySQL Architecture",
    content: "MySQL is the primary relational database keeping all course, user, and progress data. Organized tables enable all essential MOOC features. Backend API routes handle CRUD operations interacting with these tables.",
    icon: <Database className="w-12 h-12" />,
    accent: "accent",
    features: ["User Management", "Course Storage", "Progress Tracking", "API Integration"],
    cardStyle: "minimal",
  },
  // Add remaining slides here following the same format
];

// Component
const Presentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const goToSlide = useCallback((index: number, dir: "left" | "right") => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(dir);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  const nextSlide = useCallback(() => {
    const next = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
    goToSlide(next, "right");
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    const prev = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    goToSlide(prev, "left");
  }, [currentSlide, goToSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Touch/swipe navigation
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
      }
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [nextSlide, prevSlide]);

  const slide = slides[currentSlide];

  const accent = slide.accent || "primary";

  const accentColors = {
    primary: "from-primary to-primary-light",
    secondary: "from-secondary to-secondary-light",
    accent: "from-accent to-accent-light",
  };

  const accentBg = {
    primary: "bg-primary/10",
    secondary: "bg-secondary/10",
    accent: "bg-accent/10",
  };

  // Render slide content
  const renderCardContent = () => {
    const accent = slide.accent || "primary";

    switch (slide.cardStyle) {
      case "hero":
        return (
          <div className="relative min-h-[500px] flex flex-col items-center justify-center text-center p-8 md:p-12">
            <div className={`w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br ${accentColors[accent]} flex items-center justify-center shadow-glow mb-8`}>
              {slide.icon}
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-4">{slide.title}</h1>
            {slide.subtitle && (
              <p className={`font-body text-xl md:text-2xl bg-gradient-to-r ${accentColors[accent]} bg-clip-text text-transparent font-semibold mb-6`}>
                {slide.subtitle}
              </p>
            )}
            <p className="font-body text-lg text-muted-foreground max-w-2xl leading-relaxed">{slide.content}</p>
          </div>
        );

      case "split":
        return (
          <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
            <div className="flex flex-col justify-center">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${accentColors[accent]} flex items-center justify-center shadow-glow mb-6`}>
                {slide.icon}
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">{slide.title}</h1>
              <p className="font-body text-lg text-muted-foreground leading-relaxed">{slide.content}</p>
            </div>
            <div className="flex flex-col gap-4">
              {slide.features?.map((feature, idx) => (
                <div key={idx} className={`p-6 rounded-2xl ${accentBg[accent]} border border-border/50`}>
                  <div className="flex items-center gap-4">
                    <Check className="w-5 h-5 text-primary-foreground" />
                    <span className="font-body text-lg font-medium text-foreground">{feature}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      // Add other cardStyles here if needed (centered, grid, tech, showcase, etc.)
      default:
        return (
          <div className="p-8 md:p-12">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">{slide.title}</h1>
            {slide.subtitle && <p>{slide.subtitle}</p>}
            <p className="font-body text-lg text-muted-foreground">{slide.content}</p>
          </div>
        );
    }
  };

  return (
    <>
      <Navbar />
      <main className="bg-background text-foreground">
        <div className="min-h-screen flex items-center justify-center px-4 py-20 md:py-24">
          <div className="w-full max-w-4xl relative">
            {/* Navigation */}
            <button onClick={prevSlide} className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center">
              <ChevronLeft className="w-6 h-6 text-muted-foreground" />
            </button>
            <button onClick={nextSlide} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center">
              <ChevronRight className="w-6 h-6 text-muted-foreground" />
            </button>
    
            {/* Card */}
            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-card border border-border shadow-card transition-all duration-500">
  <div className={`h-2 bg-gradient-to-r ${accentColors[accent]}`} />

  {renderCardContent()}

  {/* Screenshot Placeholder */}
  {slide.hasScreenshot && (
    <div className="px-8 md:px-12 pb-8">
      <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-muted to-muted/30 border-2 border-dashed border-border aspect-video flex items-center justify-center relative group hover:border-primary/40 transition-colors">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="text-center z-10 p-6">
          <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${accentColors[accent]} flex items-center justify-center opacity-40 group-hover:opacity-60 transition-opacity shadow-medium`}>
            <Image className="w-10 h-10 text-primary-foreground" />
          </div>
          <p className="text-base font-body font-medium text-muted-foreground">
            {slide.title} Screenshot
          </p>
          <p className="text-sm text-muted-foreground/60 mt-1">
            Replace with actual screenshot
          </p>
        </div>
      </div>
    </div>
  )}
</div>

            {/* Slide Indicators */}
            <div className="flex justify-center gap-2 mt-6 md:mt-8 flex-wrap px-8">
              {slides.map((_, idx) => (
                <button key={idx} onClick={() => goToSlide(idx, idx > currentSlide ? "right" : "left")} className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? "w-8 bg-gradient-to-r from-primary to-secondary" : "w-2 bg-muted-foreground/30"}`} />
              ))}
            </div>
            <p className="font-body text-xs text-muted-foreground/60 text-center mt-4">Use arrow keys or swipe to navigate</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Presentation;