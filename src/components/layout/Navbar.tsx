import { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Settings,
  LogOut,
  ChevronDown,
  // NEW: Import icons for the avatar system
  Smile,
  Heart,
  Star,
  Zap,
  Leaf,
  Coffee,
  Music,
  Palette,
  Globe,
  Sun,
  Moon,
  Sparkles,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Courses", path: "/courses" },
  { name: "About", path: "/about" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Navbar automatically re-renders when 'user' changes
  const { toast } = useToast();

  // NEW: Configuration to map avatarId to Icons and Colors
  // This matches the logic in your AvatarSelector.tsx
  const avatarConfig = useMemo(() => ({
    smile: { icon: Smile, bg: "bg-secondary" },
    heart: { icon: Heart, bg: "bg-coral" },
    star: { icon: Star, bg: "bg-gold" },
    zap: { icon: Zap, bg: "bg-accent" },
    leaf: { icon: Leaf, bg: "bg-primary" },
    coffee: { icon: Coffee, bg: "bg-coral-light" },
    music: { icon: Music, bg: "bg-teal" },
    palette: { icon: Palette, bg: "bg-gold-light" },
    book: { icon: BookOpen, bg: "bg-primary" },
    globe: { icon: Globe, bg: "bg-teal-light" },
    sun: { icon: Sun, bg: "bg-secondary" },
    sparkles: { icon: Sparkles, bg: "bg-gold" },
  }), []);

  // Helper to get the correct Avatar component based on ID
  const getAvatarContent = () => {
    if (!user) return null;

    // 1. If user has a selected Avatar ID (e.g. 'smile', 'heart')
    if (user.avatarId && avatarConfig[user.avatarId as keyof typeof avatarConfig]) {
      const config = avatarConfig[user.avatarId as keyof typeof avatarConfig];
      const IconComponent = config.icon;
      
      return (
        <AvatarFallback className={cn(config.bg, "text-primary-foreground")}>
          <IconComponent className="w-5 h-5" />
        </AvatarFallback>
      );
    }

    // 2. Fallback: Image URL or Initials
    return (
      <>
        <AvatarImage src={user.avatarUrl} />
        <AvatarFallback className="bg-primary text-primary-foreground text-base">
          {getInitials(user.fullName)}
        </AvatarFallback>
      </>
    );
  };

  // Inject CSS directly into <head>
  useEffect(() => {
    const separatorColor = 'rgba(0, 0, 0, 0.1)'; 

    const css = `
      @keyframes dropdown {
        0% { opacity: 0; transform: translateY(-10px) scale(0.95); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
      }

      .animate-dropdown {
        animation: dropdown 0.18s ease-out;
      }

      .glass-menu {
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        background: rgba(255, 255, 255, 0.25);
        border: 1px solid rgba(255, 255, 255, 0.35);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), 
                    inset 0 0 0 1px rgba(255,255,255,0.2);
      }

      .bg-glass-pill {
        background: rgba(255, 255, 255, 0.18);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        box-shadow:
          inset 0 0 0 1px rgba(255,255,255,0.25),
          0 4px 12px rgba(0,0,0,0.08);
        transition: all 0.25s ease;
      }
      
      .fade-separator {
        height: 1px;
        margin: 6px 12px;
        background: linear-gradient(
          to right,
          transparent 0%,
          ${separatorColor} 20%,
          ${separatorColor} 80%,
          transparent 100%
        );
        background-color: transparent !important;
        border: none !important;
      }
    `;

    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    return () => { void document.head.removeChild(style); };
  }, []);

  const handleLogout = () => {
    logout();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    navigate("/");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 items-center h-20">

          {/* LEFT — LOGO */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-soft">
                <GraduationCap className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <span className="font-display text-2xl font-bold text-foreground">
                  Silay<span className="text-primary">Learn</span>
                </span>
              </div>
            </Link>
          </div>

          {/* CENTER — NAV BUTTONS */}
          <div className="hidden md:flex items-center justify-center gap-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "relative px-5 py-2 text-base font-semibold rounded-xl transition-all duration-300",
                    isActive
                      ? "text-primary bg-glass-pill"
                      : "text-muted-foreground hover:text-primary hover:bg-glass-pill"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* RIGHT — PROFILE DROPDOWN */}
          <div className="hidden md:flex items-center justify-end gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-3 px-3">
                    {/* UPDATED: Dynamic Avatar rendering */}
                    <Avatar className="w-10 h-10 border border-border/50">
                      {getAvatarContent()}
                    </Avatar>

                    <span className="text-base font-medium max-w-[150px] truncate">
                      {user.fullName}
                    </span>

                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>

                {/* GLASS + ANIMATED DROPDOWN */}
                <DropdownMenuContent
                  align="end"
                  className="w-56 origin-top-right rounded-xl p-2 animate-dropdown glass-menu"
                >
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.fullName}</p>
                    <p className="text-xs text-foreground opacity-70">{user.email}</p>
                  </div>

                  <DropdownMenuSeparator className="fade-separator" />

                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/courses" className="cursor-pointer">
                      <BookOpen className="w-4 h-4 mr-2" />
                      My Courses
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <Settings className="w-4 h-4 mr-2" />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="fade-separator" />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-destructive"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Log In</Link>
                </Button>

                <Button variant="teal" asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors justify-self-end"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* MOBILE NAV */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-base font-medium transition-colors",
                    location.pathname === link.path
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {link.name}
                </Link>
              ))}

              <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
                <Button variant="outline" asChild className="w-full">
                  <Link to="/login">Log In</Link>
                </Button>

                <Button variant="teal" asChild className="w-full">
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;