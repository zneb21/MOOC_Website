// src/pages/Presentations.tsx
import { useState, useEffect, useCallback } from "react"; 
import { 
  ChevronLeft, ChevronRight, BookOpen, Users, GraduationCap,
  Globe, MessageSquare, Database, Code, Layout, UserCircle, Settings,
  Layers, Server, Heart, Sparkles, Image as ImageIcon, Check, Terminal,
  Cpu, Shield
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// --- IMPORT SCREENSHOTS ---
// These paths match your file tree in src/pages/screenshots/
import img6 from "./screenshots/6.jpg";
import img7 from "./screenshots/7.jpg";
import img8 from "./screenshots/8.jpg";
import img9 from "./screenshots/9.png";   // Note: .png based on your screenshot
import img10 from "./screenshots/10.png"; // Note: .png
import img11 from "./screenshots/11.png"; // Note: .png
import img12 from "./screenshots/12.png";
import img13 from "./screenshots/13.jpg";
// Assuming 14 exists as jpg based on your dashboard upload, 
// if it's missing from the folder, please add it as 14.jpg
import img14 from "./screenshots/14.jpg"; 

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
  screenshotUrl?: string; 
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
    content: "SilayLearn is a modern, user-friendly learning platform that shares and explores Iloilo's rich culture. It offers interactive lessons on tourism, cooking, agriculture, and craftsmanship.",
    icon: <Heart className="w-12 h-12" />,
    accent: "primary",
    features: ["Interactive Lessons", "AI Learning Assistant", "Cultural Education"],
    cardStyle: "split",
  },
  {
    id: 3,
    title: "Project Description",
    content: "The MOOC web app is a modern, easy-to-use platform focused on teaching Iloilo's culture, heritage, and identity. It offers courses on local traditions, food, history, festivals, and cultural practices.",
    icon: <Layers className="w-12 h-12" />,
    accent: "accent",
    features: ["Course Enrollment", "Progress Tracking", "Interactive Learning", "Local Heritage"],
    cardStyle: "centered",
  },
  {
    id: 4,
    title: "Cultural Relevance",
    content: "The website promotes localized online learning by focusing specifically on Iloilo's cultural identity. It offers courses about Iloilo cuisine, tourist spots, crafts, agriculture, and traditions.",
    icon: <Globe className="w-12 h-12" />,
    accent: "secondary",
    features: ["Iloilo Cuisine", "Tourist Spots", "Traditional Crafts", "Local Agriculture"],
    cardStyle: "grid",
  },
  {
    id: 5,
    title: "Technical Implementation",
    subtitle: "Features Overview",
    content: "Built with modern technologies including React.js, Vite, and Tailwind CSS. The platform features secure authentication, course management, progress tracking, and an AI-powered learning assistant.",
    icon: <Code className="w-12 h-12" />,
    accent: "primary",
    features: ["React.js & Vite", "Secure Auth", "AI Assistant", "Real-time Progress"],
    cardStyle: "tech",
  },
  {
    id: 6,
    title: "Home Page",
    subtitle: "Gateway to Learning",
    content: "The Home Page gives users an overview of the platform, featuring highlighted courses and clear buttons like 'Start Learning'.",
    icon: <Layout className="w-12 h-12" />,
    accent: "accent",
    stats: [
      { label: "Local Courses", value: "50+" },
      { label: "Learners", value: "2,000+" },
      { label: "Expert Instructors", value: "20+" },
    ],
    cardStyle: "showcase",
    hasScreenshot: true,
    screenshotUrl: img6, 
  },
  {
    id: 7,
    title: "Course Page",
    subtitle: "Explore & Discover",
    content: "The Courses Page allows users to browse all available courses filtered by categories such as Iloilo tourism, cooking, agriculture, or craftsmanship.",
    icon: <BookOpen className="w-12 h-12" />,
    accent: "primary",
    features: ["Tourism", "Cooking", "Language", "History"],
    cardStyle: "showcase",
    hasScreenshot: true,
    screenshotUrl: img7,
  },
  {
    id: 8,
    title: "Course Preview",
    subtitle: "Detailed Information",
    content: "The Course Details Page shows the course's objectives, available modules, and key information before enrollment. It includes an 'Enroll Now' button for easy registration.",
    icon: <GraduationCap className="w-12 h-12" />,
    accent: "secondary",
    features: ["Course Objectives", "Module Overview", "Easy Enrollment", "Guarantee"],
    cardStyle: "showcase",
    hasScreenshot: true,
    screenshotUrl: img8,
  },
  {
    id: 9,
    title: "Learning Module",
    subtitle: "Interactive Study Area",
    content: "The Learning Module Page is the main study area where users access video lessons, text content, downloads, and interactive tools.",
    icon: <Sparkles className="w-12 h-12" />,
    accent: "accent",
    features: ["Video Lessons", "Text Content", "Downloads", "Interactive Tools"],
    cardStyle: "showcase",
    hasScreenshot: true,
    screenshotUrl: img9,
  },
  {
    id: 10,
    title: "About Page",
    subtitle: "Our Purpose & Mission",
    content: "The About Page outlines the platform's purpose, mission, vision, values, and advocacy. It emphasizes accessible lessons centered on Iloilo culture.",
    icon: <Heart className="w-12 h-12" />,
    accent: "primary",
    features: ["Rooted in Iloilo", "Community-driven", "Quality-first"],
    cardStyle: "showcase",
    hasScreenshot: true,
    screenshotUrl: img10,
  },
  {
    id: 11,
    title: "Authentication",
    subtitle: "Login & Registration",
    content: "The Login and Registration Pages let users securely sign in or create accounts, providing a personalized experience.",
    icon: <UserCircle className="w-12 h-12" />,
    accent: "secondary",
    features: ["Secure Sign In", "Easy Registration", "Personalized Experience"],
    cardStyle: "showcase",
    hasScreenshot: true,
    screenshotUrl: img11,
  },
  {
    id: 12,
    title: "AI Assistant",
    subtitle: "Meet Roxy",
    content: "The AI Assistant, available on lesson pages, helps users by answering questions, providing summaries, and translating content into Filipino or Hiligaynon.",
    icon: <MessageSquare className="w-12 h-12" />,
    accent: "accent",
    features: ["Answer Questions", "Summaries", "Translation", "Cultural Context"],
    cardStyle: "showcase",
    hasScreenshot: true,
    screenshotUrl: img12,
  },
  {
    id: 13,
    title: "User Profile",
    subtitle: "Account Settings",
    content: "The User Profile Page lets users manage their account information, including name, email, profile picture, password, and biography.",
    icon: <Settings className="w-12 h-12" />,
    accent: "primary",
    features: ["Personal Info", "Customization", "Dark Mode", "Security"],
    cardStyle: "showcase",
    hasScreenshot: true,
    screenshotUrl: img13,
  },
  {
    id: 14,
    title: "User Dashboard",
    subtitle: "Track Your Progress",
    content: "The User Dashboard shows enrolled courses with progress bars, completion badges, and 'Continue Learning' shortcuts.",
    icon: <Users className="w-12 h-12" />,
    accent: "secondary",
    features: ["Progress Tracking", "Badges", "Recommendations"],
    cardStyle: "showcase",
    hasScreenshot: true,
    screenshotUrl: img14,
  },
  {
    id: 15,
    title: "CRUD Operations",
    subtitle: "Data Management",
    content: "The system's CRUD functionality connects user actions to a MySQL database via PHP. Create, Read, Update, and Delete operations ensure smooth course delivery.",
    icon: <Database className="w-12 h-12" />,
    accent: "accent",
    features: ["Create Accounts", "Read Content", "Update Progress", "Delete Data"],
    cardStyle: "timeline",
  },
  {
    id: 16,
    title: "Technical Stack",
    subtitle: "Technologies Used",
    content: "Built with React.js, Vite, Tailwind CSS for the frontend. Backend powered by PHP and Python Flask. MySQL handles data storage.",
    icon: <Terminal className="w-12 h-12" />,
    accent: "primary",
    features: ["React.js & Vite", "Tailwind CSS", "PHP & Python", "MySQL Database"],
    cardStyle: "tech",
  },
  {
    id: 17,
    title: "Technologies",
    subtitle: "Development Tools",
    content: "Frontend: React.js, Vite, Tailwind CSS. Programming: JavaScript (ES6), JSX, TypeScript. Backend: PHP, Python Flask.",
    icon: <Server className="w-12 h-12" />,
    accent: "secondary",
    features: ["VS Code", "phpMyAdmin", "XAMPP", "GitHub"],
    cardStyle: "grid",
  },
  {
    id: 18,
    title: "Database Integration",
    subtitle: "MySQL Architecture",
    content: "MySQL is the primary relational database keeping all course, user, and progress data. Organized tables enable all essential MOOC features.",
    icon: <Database className="w-12 h-12" />,
    accent: "accent",
    features: ["User Management", "Course Storage", "Progress Tracking", "API Integration"],
    cardStyle: "minimal",
  },
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

  // Dynamic colors
  const accentColors = {
    primary: "from-primary to-primary-light",
    secondary: "from-secondary to-secondary-light",
    accent: "from-accent to-accent-light",
  };
  
  const textColors = {
    primary: "text-primary",
    secondary: "text-secondary",
    accent: "text-accent",
  };

  const borderColors = {
    primary: "border-primary/20",
    secondary: "border-secondary/20",
    accent: "border-accent/20",
  };

  const bgColors = {
    primary: "bg-primary/5",
    secondary: "bg-secondary/5",
    accent: "bg-accent/5",
  };

  // Render slide content based on cardStyle
  const renderCardContent = () => {
    switch (slide.cardStyle) {
      // 1. Hero: Center focus with large icon background
      case "hero":
        return (
          <div className="relative min-h-[500px] flex flex-col items-center justify-center text-center p-8 md:p-12 overflow-hidden">
             {/* Decorative Background Icon */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-[0.03] text-foreground pointer-events-none transform scale-150`}>
                {slide.icon}
            </div>
            
            <div className={`relative z-10 w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br ${accentColors[accent]} flex items-center justify-center shadow-glow mb-8 animate-float`}>
              <div className="text-white drop-shadow-md">{slide.icon}</div>
            </div>
            <h1 className="relative z-10 font-display text-5xl md:text-7xl font-bold text-foreground mb-4 tracking-tight">{slide.title}</h1>
            {slide.subtitle && (
              <p className={`relative z-10 font-body text-xl md:text-2xl bg-gradient-to-r ${accentColors[accent]} bg-clip-text text-transparent font-semibold mb-6`}>
                {slide.subtitle}
              </p>
            )}
            <p className="relative z-10 font-body text-lg text-muted-foreground max-w-2xl leading-relaxed">{slide.content}</p>
          </div>
        );

      // 2. Split: Left text, Right list
      case "split":
        return (
          <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12 h-full items-center">
            <div className="flex flex-col justify-center">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${accentColors[accent]} flex items-center justify-center shadow-glow mb-6`}>
                <div className="text-white">{slide.icon}</div>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">{slide.title}</h1>
              <p className="font-body text-lg text-muted-foreground leading-relaxed">{slide.content}</p>
            </div>
            <div className="flex flex-col gap-4">
              {slide.features?.map((feature, idx) => (
                <div key={idx} className={`p-5 rounded-2xl bg-card border ${borderColors[accent]} hover:border-primary/50 transition-colors shadow-sm flex items-center gap-4 group`}>
                  <div className={`w-10 h-10 rounded-full ${bgColors[accent]} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                     <Check className={`w-5 h-5 ${textColors[accent]}`} />
                  </div>
                  <span className="font-body text-lg font-medium text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        );

      // 3. Grid: 2x2 Bento Box Style
      case "grid":
        return (
          <div className="p-8 md:p-12 h-full flex flex-col">
            <div className="text-center mb-10">
                <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-xl ${bgColors[accent]}`}>
                        {slide.icon}
                    </div>
                </div>
                <h1 className="font-display text-4xl font-bold mb-2">{slide.title}</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">{slide.content}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              {slide.features?.map((feature, idx) => (
                <div key={idx} className="relative overflow-hidden group p-6 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/50 hover:border-primary/30 transition-all duration-300">
                    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${textColors[accent]}`}>
                        <Globe className="w-16 h-16 -mr-4 -mt-4" />
                    </div>
                    <div className="relative z-10 flex items-start gap-4 h-full">
                        <div className={`mt-1 p-2 rounded-lg ${bgColors[accent]}`}>
                           <Check className={`w-4 h-4 ${textColors[accent]}`} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-1">{feature}</h3>
                            <p className="text-sm text-muted-foreground">Detailed insights about {feature.toLowerCase()}.</p>
                        </div>
                    </div>
                </div>
              ))}
            </div>
          </div>
        );

      // 4. Tech: Terminal / Code Editor Look
      case "tech":
        return (
          <div className="p-8 md:p-12 h-full flex flex-col md:flex-row gap-8 items-center">
             <div className="flex-1">
                <div className={`inline-flex p-3 rounded-2xl ${bgColors[accent]} mb-6`}>
                    {slide.icon}
                </div>
                <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{slide.title}</h1>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">{slide.content}</p>
                <div className="flex flex-wrap gap-2">
                    {slide.features?.slice(0,2).map((tag, i) => (
                        <span key={i} className="px-3 py-1 rounded-full border border-border text-xs font-mono text-muted-foreground uppercase tracking-wider">{tag}</span>
                    ))}
                </div>
             </div>
             
             {/* Terminal Visual */}
             <div className="flex-1 w-full max-w-md">
                <div className="rounded-xl overflow-hidden bg-[#1e1e1e] shadow-2xl border border-white/10 font-mono text-sm relative">
                    {/* Terminal Header */}
                    <div className="bg-[#2d2d2d] px-4 py-2 flex gap-2 items-center border-b border-white/5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                        <div className="ml-2 text-xs text-white/40">stack.config.js</div>
                    </div>
                    {/* Terminal Body */}
                    <div className="p-6 text-blue-300 space-y-3">
                        <div className="flex">
                            <span className="text-pink-400 mr-2">const</span>
                            <span className="text-yellow-200">stack</span>
                            <span className="text-white mx-2">=</span>
                            <span className="text-white">{"{"}</span>
                        </div>
                        {slide.features?.map((feat, idx) => (
                             <div key={idx} className="pl-6 flex items-center">
                                <span className="text-white/60 mr-2">{idx + 1}:</span>
                                <span className="text-green-300">"{feat}"</span>,
                             </div>
                        ))}
                        <div className="text-white">{"}"}</div>
                        <div className="flex items-center gap-2 mt-4 text-white/50">
                             <span className="text-green-500">➜</span>
                             <span className="animate-pulse">_</span>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        );

      // 5. Timeline: Vertical steps (For CRUD/Flows)
      case "timeline":
        return (
            <div className="p-8 md:p-12 h-full flex flex-col">
                <div className="text-center mb-8">
                     <h1 className="font-display text-4xl font-bold mb-2">{slide.title}</h1>
                     <p className="text-muted-foreground">{slide.content}</p>
                </div>
                <div className="flex-1 flex flex-col justify-center relative pl-4">
                    {/* Vertical Line */}
                    <div className={`absolute left-[27px] top-4 bottom-4 w-0.5 bg-gradient-to-b ${accentColors[accent]} opacity-30`}></div>
                    
                    <div className="space-y-6">
                        {slide.features?.map((step, idx) => (
                            <div key={idx} className="relative flex items-center gap-6 group">
                                <div className={`w-14 h-14 rounded-full border-4 border-card bg-background z-10 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 ${textColors[accent]}`}>
                                    {idx === 0 ? <Database className="w-6 h-6" /> : 
                                     idx === 1 ? <BookOpen className="w-6 h-6" /> :
                                     idx === 2 ? <Cpu className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
                                </div>
                                <div className="bg-muted/30 hover:bg-muted/60 transition-colors p-4 rounded-xl border border-border/50 flex-1">
                                    <h3 className="font-bold text-lg">{step}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );

      // 6. Centered/Minimal: High Impact
      case "centered":
      case "minimal":
        return (
           <div className="p-8 md:p-12 h-full flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className={`absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] ${accentColors[accent]}`}></div>
                
                <div className={`relative w-20 h-20 rounded-2xl ${bgColors[accent]} flex items-center justify-center mb-6`}>
                    {slide.icon}
                </div>
                
                <h1 className="relative font-display text-4xl md:text-6xl font-bold mb-6">{slide.title}</h1>
                <p className="relative text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                    {slide.content}
                </p>
                
                <div className="relative flex flex-wrap justify-center gap-3">
                    {slide.features?.map((feat, idx) => (
                        <span key={idx} className={`px-4 py-2 rounded-full border ${borderColors[accent]} bg-background/50 backdrop-blur-sm text-sm font-medium`}>
                            {feat}
                        </span>
                    ))}
                </div>
           </div>
        );

      // Default / Showcase (Image layout)
      default:
        return (
          <div className="p-8 md:p-12">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">{slide.title}</h1>
            {slide.subtitle && <p className="mb-4 text-primary font-medium">{slide.subtitle}</p>}
            <p className="font-body text-lg text-muted-foreground mb-6">{slide.content}</p>
            
            {slide.stats && (
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {slide.stats.map((stat, i) => (
                        <div key={i} className="text-center p-4 bg-muted/30 rounded-xl border border-border/50">
                            <div className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${accentColors[accent]} bg-clip-text text-transparent`}>
                                {stat.value}
                            </div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>
            )}
            
            {slide.features && (
              <div className="grid grid-cols-2 gap-4 mt-8">
                {slide.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Check className={`w-4 h-4 ${textColors[accent]}`} />
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <>
      <Navbar />
      <main className="bg-background text-foreground overflow-hidden">
        <div className="min-h-screen flex items-center justify-center px-4 py-20 md:py-24">
          <div className="w-full max-w-4xl relative group/container">
            
            {/* --- PREVIOUS BUTTON --- */}
            <button
              onClick={prevSlide}
              className="absolute top-1/2 -translate-y-1/2 z-30 
                left-2 md:-left-24 lg:-left-32
                w-12 h-12 md:w-16 md:h-16 
                rounded-full 
                bg-background/20 backdrop-blur-md border border-border/50
                text-muted-foreground hover:text-primary
                shadow-lg hover:shadow-[0_0_30px_rgba(var(--primary),0.3)] hover:border-primary/50
                flex items-center justify-center 
                transition-all duration-300 ease-out
                active:scale-95 hover:scale-110 group"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 transition-transform duration-300 group-hover:-translate-x-1" />
            </button>

            {/* --- NEXT BUTTON --- */}
            <button
              onClick={nextSlide}
              className="absolute top-1/2 -translate-y-1/2 z-30 
                right-2 md:-right-24 lg:-right-32
                w-12 h-12 md:w-16 md:h-16 
                rounded-full 
                bg-background/20 backdrop-blur-md border border-border/50
                text-muted-foreground hover:text-primary
                shadow-lg hover:shadow-[0_0_30px_rgba(var(--primary),0.3)] hover:border-primary/50
                flex items-center justify-center 
                transition-all duration-300 ease-out
                active:scale-95 hover:scale-110 group"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            {/* --- CARD CONTAINER --- */}
            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-card border border-border shadow-card transition-all duration-500 h-auto min-h-[550px] flex flex-col">
              <div className={`h-2 bg-gradient-to-r ${accentColors[accent]}`} />

              <div className="flex-1">
                {renderCardContent()}
              </div>

              {/* Screenshot Section */}
              {slide.hasScreenshot && (
                <div className="px-8 md:px-12 pb-8 mt-auto">
                  {slide.screenshotUrl ? (
                    // ACTUAL IMAGE
                    <div className="rounded-2xl overflow-hidden border border-border/50 shadow-sm aspect-video relative group">
                      <img
                        src={slide.screenshotUrl}
                        alt={`${slide.title} Screenshot`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-tr ${accentColors[accent]} opacity-0 group-hover:opacity-10 transition-opacity duration-500 mix-blend-overlay`}></div>
                    </div>
                  ) : (
                    // FALLBACK PLACEHOLDER
                    <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-muted to-muted/30 border-2 border-dashed border-border aspect-video flex items-center justify-center relative group hover:border-primary/40 transition-colors">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
                      <div className="text-center z-10 p-6">
                        <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${accentColors[accent]} flex items-center justify-center opacity-40 group-hover:opacity-60 transition-opacity shadow-medium`}>
                          <ImageIcon className="w-10 h-10 text-primary-foreground" />
                        </div>
                        <p className="text-base font-body font-medium text-muted-foreground">
                          {slide.title} Screenshot
                        </p>
                        <p className="text-sm text-muted-foreground/60 mt-1">
                          Image not found. Check slide data path.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center gap-2 mt-8 md:mt-12 flex-wrap px-8">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx, idx > currentSlide ? "right" : "left")}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentSlide
                      ? "w-8 bg-gradient-to-r from-primary to-secondary shadow-glow"
                      : "w-2 bg-muted-foreground/30 hover:bg-primary/50"
                  }`}
                />
              ))}
            </div>
            <p className="font-body text-xs text-muted-foreground/40 text-center mt-4 uppercase tracking-widest">
              Use arrow keys to navigate
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Presentation;