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
  Sparkles,
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

  // ✅ Scroll / top-of-page detection
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  // Avatar config (same logic as your AvatarSelector)
  const avatarConfig = useMemo(
    () => ({
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
    }),
    []
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarContent = () => {
    if (!user) return null;

    if (user.avatarId && avatarConfig[user.avatarId as keyof typeof avatarConfig]) {
      const config = avatarConfig[user.avatarId as keyof typeof avatarConfig];
      const IconComponent = config.icon;

      return (
        <AvatarFallback className={cn(config.bg, "text-primary-foreground")}>
          <IconComponent className="w-5 h-5" />
        </AvatarFallback>
      );
    }

    return (
      <>
        <AvatarImage src={user.avatarUrl} />
        <AvatarFallback className="bg-primary text-primary-foreground text-base">
          {getInitials(user.fullName)}
        </AvatarFallback>
      </>
    );
  };

  // ✅ Scroll listener: shrink + top detection
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 8);
      setIsAtTop(y <= 2);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ✅ Inject CSS (glass menu, animation, separators)
  useEffect(() => {
    const separatorColor = "rgba(255, 255, 255, 0.12)";

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
        background: rgba(6, 18, 12, 0.78);
        border: 1px solid rgba(255, 255, 255, 0.12);
        box-shadow: 0 10px 28px rgba(0, 0, 0, 0.28),
                    inset 0 0 0 1px rgba(255,255,255,0.08);
        color: rgba(255,255,255,0.92);
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

    return () => {
      void document.head.removeChild(style);
    };
  }, []);

  const handleLogout = () => {
    logout();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    navigate("/");
  };

  // Theme colors (warm ivory + muted gold)
  const TEXT_IVORY = "text-[#F3F4EF]";
  const TEXT_ACTIVE = "text-[#FFE8B0]";
  const TEXT_HOVER = "hover:text-[#F4B942]";

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300",
        // ✅ Top vs scrolled opacity (improves readability over hero)
        isAtTop ? "bg-emerald-950/75" : "bg-emerald-950/88",
        "backdrop-blur-xl border-white/10",
        isScrolled
          ? "shadow-[0_10px_30px_rgba(0,0,0,0.26)]"
          : "shadow-[0_6px_24px_rgba(0,0,0,0.18)]"
      )}
    >
      {/* ✅ #1 best readability fix: contrast scrim */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/40 via-black/18 to-transparent" />

      <div className={cn("w-full px-4 sm:px-6 lg:px-8 transition-all duration-300", isScrolled ? "py-0" : "py-1")}>
        <div className={cn("grid grid-cols-3 items-center transition-all duration-300", isScrolled ? "h-16" : "h-20")}>
          {/* LEFT — LOGO */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group select-none">
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  "bg-primary shadow-soft transition-transform duration-300",
                  "group-hover:scale-[1.04]"
                )}
              >
                <GraduationCap className="w-7 h-7 text-primary-foreground transition-transform duration-300 group-hover:rotate-[-6deg]" />
              </div>

              <div className="hidden sm:block">
                <span className="font-display text-2xl font-extrabold tracking-tight text-white/95 group-hover:text-white transition-colors">
                  Silay<span className="text-gradient">Learn</span>
                </span>
              </div>
            </Link>
          </div>

          {/* CENTER — NAV (floating capsule + always-on pills + better contrast) */}
          <div className="hidden md:flex items-center justify-center">
            <div
              className={cn(
                "flex items-center gap-2 px-2 py-2 rounded-2xl",
                "bg-black/25 backdrop-blur-xl border border-white/10",
                "shadow-[0_12px_32px_rgba(0,0,0,0.22)]"
              )}
            >
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      // ✅ typography tweaks (weight/spacing) + tiny shadow for readability
                      "relative px-5 py-2 rounded-xl transition-all duration-300",
                      "text-[15px] font-bold tracking-wide",
                      "drop-shadow-[0_1px_1px_rgba(0,0,0,0.55)]",
                      // ✅ always-on pill background for each item
                      "bg-black/15 hover:bg-black/25",
                      // ✅ colors
                      isActive ? `${TEXT_ACTIVE} bg-white/20` : `${TEXT_IVORY} ${TEXT_HOVER}`,
                      // ✅ stronger active indicator (not just color)
                      isActive && "ring-1 ring-[#F4B942]/45 border border-[#F4B942]/25",
                      // ✅ underline accent
                      "after:absolute after:left-1/2 after:-bottom-1 after:h-[2px] after:w-0 after:-translate-x-1/2 after:rounded-full after:bg-[#F4B942] after:transition-all after:duration-300 hover:after:w-8",
                      isActive && "after:w-10"
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* RIGHT — PROFILE / AUTH */}
          <div className="hidden md:flex items-center justify-end gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-3 px-3 hover:bg-white/10">
                    <Avatar className="w-10 h-10 border border-white/15 shadow-[0_6px_16px_rgba(0,0,0,0.18)]">
                      {getAvatarContent()}
                    </Avatar>

                    <span className={cn("text-base font-medium max-w-[150px] truncate", TEXT_IVORY, "drop-shadow-[0_1px_1px_rgba(0,0,0,0.55)]")}>
                      {user.fullName}
                    </span>

                    <ChevronDown className="w-5 h-5 text-white/70" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-56 origin-top-right rounded-xl p-2 animate-dropdown glass-menu"
                >
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-white/95">{user.fullName}</p>
                    <p className="text-xs text-white/70">{user.email}</p>
                  </div>

                  <DropdownMenuSeparator className="fade-separator" />

                  <DropdownMenuItem asChild className="focus:bg-white/10">
                    <Link to="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="focus:bg-white/10">
                    <Link to="/courses" className="cursor-pointer">
                      <BookOpen className="w-4 h-4 mr-2" />
                      My Courses
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="focus:bg-white/10">
                    <Link to="/profile" className="cursor-pointer">
                      <Settings className="w-4 h-4 mr-2" />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="fade-separator" />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-300 focus:text-red-200 focus:bg-white/10"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild className={cn(TEXT_IVORY, "hover:text-white hover:bg-white/10 drop-shadow-[0_1px_1px_rgba(0,0,0,0.55)]")}>
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
            className={cn(
              "md:hidden p-2 rounded-lg transition-colors justify-self-end",
              "hover:bg-white/10",
              "text-[#F3F4EF] drop-shadow-[0_1px_1px_rgba(0,0,0,0.55)]"
            )}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* MOBILE NAV (also always-on pills + ivory/gold) */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-white/10 animate-fade-in">
            <div className="flex flex-col gap-2">
              <div className="px-1">
                <div className="rounded-2xl bg-black/25 backdrop-blur-xl border border-white/10 p-2">
                  {navLinks.map((link) => {
                    const isActive = location.pathname === link.path;

                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "block px-4 py-2 rounded-xl transition-all duration-300",
                          "text-[15px] font-bold tracking-wide",
                          "drop-shadow-[0_1px_1px_rgba(0,0,0,0.55)]",
                          "bg-black/15 hover:bg-black/25",
                          isActive ? "text-[#FFE8B0] bg-white/20 ring-1 ring-[#F4B942]/45 border border-[#F4B942]/25" : "text-[#F3F4EF] hover:text-[#F4B942]"
                        )}
                      >
                        {link.name}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/10 px-1">
                <Button variant="outline" asChild className="w-full">
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    Log In
                  </Link>
                </Button>

                <Button variant="teal" asChild className="w-full">
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    Sign Up
                  </Link>
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
