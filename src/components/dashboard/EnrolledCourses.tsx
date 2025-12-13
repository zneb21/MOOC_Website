import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, ArrowRight } from "lucide-react";
import { Enrollment } from "@/data/mockData";
import { Paintbrush } from "lucide-react";
import { useRef } from "react";

interface EnrolledCoursesProps {
  enrollments: Enrollment[];
}

  
type Accent = {
  name: string;
  accent: string; // main border/glow
  soft: string; // ring + shimmer tint
  hue: string; // spotlight hue
};

const ACCENTS: Accent[] = [
  { name: "Emerald", accent: "hsl(160 84% 39%)", soft: "hsla(160, 84%, 39%, .35)", hue: "160" },
  { name: "Teal", accent: "hsl(173 80% 40%)", soft: "hsla(173, 80%, 40%, .35)", hue: "173" },
  { name: "Sky", accent: "hsl(199 89% 48%)", soft: "hsla(199, 89%, 48%, .35)", hue: "199" },
  { name: "Violet", accent: "hsl(262 83% 58%)", soft: "hsla(262, 83%, 58%, .35)", hue: "262" },
  { name: "Amber", accent: "hsl(38 92% 50%)", soft: "hsla(38, 92%, 50%, .35)", hue: "38" },
];

function applyAccent(accent: Accent) {
  const root = document.documentElement;
  root.style.setProperty("--accent", accent.accent);
  root.style.setProperty("--accent-soft", accent.soft);
  root.style.setProperty("--accent-hue", accent.hue);
}

function getSavedAccent(): Accent {
  const raw = localStorage.getItem("user_accent");
  if (!raw) return ACCENTS[0];
  try {
    const parsed = JSON.parse(raw) as Accent;
    // basic validation fallback
    if (!parsed?.accent || !parsed?.soft || !parsed?.hue) return ACCENTS[0];
    return parsed;
  } catch {
    return ACCENTS[0];
  }
}

// ---------------------------------------------
// Premium Card (Tilt + Shimmer + Spotlight)
// ---------------------------------------------
function PremiumCard({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;

    const px = x / r.width;
    const py = y / r.height;

    // spotlight position
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);

    // tilt (Apple-like)
    const rotY = (px - 0.5) * 10; // left/right
    const rotX = (0.5 - py) * 10; // up/down
    el.style.setProperty("--rx", `${rotX.toFixed(2)}deg`);
    el.style.setProperty("--ry", `${rotY.toFixed(2)}deg`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
    el.style.setProperty("--mx", `50%`);
    el.style.setProperty("--my", `50%`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={[
        "premium-card group relative rounded-2xl border backdrop-blur-xl transition-all duration-300",
        "bg-white/60 border-black/10 shadow-soft",
        "dark:bg-zinc-950/55 dark:border-white/10 dark:shadow-[0_18px_60px_rgba(0,0,0,0.65)]",
        "hover:-translate-y-1.5 hover:shadow-[0_24px_80px_rgba(0,0,0,0.18)] dark:hover:shadow-[0_28px_90px_rgba(0,0,0,0.75)]",
        "hover:ring-1 hover:ring-[color:var(--accent-soft)]",
        className,
      ].join(" ")}
      style={{
        transform: "perspective(900px) rotateX(var(--rx)) rotateY(var(--ry))",
        ...style,
      }}
    >
      {/* shimmer border */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute -inset-[1px] rounded-2xl premium-shimmer" />
      </div>

      {/* cursor spotlight */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl premium-spotlight opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative">{children}</div>

      {/* scoped styles */}
      <style>{`
        .premium-card { --rx:0deg; --ry:0deg; --mx:50%; --my:50%; }
        .premium-shimmer{
          border-radius: 1rem;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(255,255,255,.18) 25%,
            rgba(255,255,255,.05) 45%,
            transparent 60%,
            rgba(255,255,255,.12) 75%,
            transparent 100%
          );
          mix-blend-mode: overlay;
          filter: blur(0.3px);
          animation: shimmerMove 2.2s linear infinite;
          mask: linear-gradient(#000, #000) content-box, linear-gradient(#000, #000);
          -webkit-mask: linear-gradient(#000, #000) content-box, linear-gradient(#000, #000);
          padding: 1px;
          box-sizing: border-box;
        }
        .premium-card:hover .premium-shimmer{
          background: linear-gradient(90deg,
            transparent 0%,
            color-mix(in srgb, var(--accent) 28%, transparent) 25%,
            rgba(255,255,255,.06) 45%,
            transparent 60%,
            color-mix(in srgb, var(--accent) 20%, transparent) 75%,
            transparent 100%
          );
        }
        @keyframes shimmerMove {
          0% { transform: translateX(-12%); opacity: .55; }
          100% { transform: translateX(12%); opacity: .55; }
        }
        .premium-spotlight{
          background: radial-gradient(
            280px circle at var(--mx) var(--my),
            hsla(var(--accent-hue, 160), 90%, 60%, .18),
            transparent 60%
          );
        }
      `}</style>
    </div>
  );
}

// ---------------------------------------------
// Accent Picker UI
// ---------------------------------------------
function AccentPicker({
  value,
  onChange,
}: {
  value: Accent;
  onChange: (a: Accent) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Paintbrush className="w-4 h-4 text-zinc-700 dark:text-zinc-200" />
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          Accent color
        </p>
        <span className="text-xs text-zinc-500 dark:text-zinc-300/80">
          ({value.name})
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {ACCENTS.map((a) => {
          const active = a.name === value.name;
          return (
            <button
              key={a.name}
              type="button"
              onClick={() => onChange(a)}
              className={[
                "relative h-9 w-9 rounded-full border transition-all",
                "border-black/10 dark:border-white/10",
                "hover:scale-[1.06] active:scale-[0.98]",
                active ? "ring-2 ring-[color:var(--accent)]" : "",
              ].join(" ")}
              style={{ background: a.accent }}
              aria-label={`Set accent to ${a.name}`}
            >
              <span className="sr-only">{a.name}</span>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-zinc-600 dark:text-zinc-300">
        This only affects UI styling (saved on this device).
      </p>
    </div>
  );
}

const EnrolledCourses = ({ enrollments }: EnrolledCoursesProps) => {
  if (enrollments.length === 0) {
    return (
      <PremiumCard className="bg-card rounded-2xl p-8 shadow-soft animate-fade-up delay-300">
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">
            No courses yet!
          </h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Start your learning journey by exploring our course catalog and discovering Philippine culture and heritage.
          </p>
          <Button variant="teal" asChild>
            <Link to="/courses">Browse Courses</Link>
          </Button>
        </div>
      </PremiumCard>
    );
  }

  return (
    <PremiumCard className="bg-card rounded-2xl p-6 shadow-soft animate-fade-up delay-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-semibold text-foreground">
          My Enrolled Courses
        </h2>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/courses" className="text-primary">
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {enrollments.map((enrollment, index) => (
          <div
            key={enrollment.id}
            className="group bg-muted/50 rounded-xl overflow-hidden hover:shadow-medium transition-all duration-300"
            style={{ animationDelay: `${(index + 4) * 100}ms` }}
          >
            <div className="aspect-video relative overflow-hidden">
              <img
                src={enrollment.image}
                alt={enrollment.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2">
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-background/90 text-foreground">
                  {enrollment.category}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                {enrollment.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {enrollment.instructor}
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">{enrollment.progress}%</span>
                </div>
                <Progress value={enrollment.progress} className="h-2" />
              </div>
                <Button
                  variant={enrollment.progress === 100 ? "outline" : "teal"}
                  size="sm"
                  className="w-full mt-4"
                  asChild
                >
                  <Link
                    to={
                      enrollment.progress === 100
                        ? `/courses/${enrollment.courseId}`                 // still go to preview
                        : `/course/${enrollment.courseId}/lesson/0-0`       // 🔹 jump to LessonView
                    }
                  >
                    {enrollment.progress === 100 ? "Review Course" : "Continue Learning"}
                  </Link>
                </Button>

            </div>
          </div>
        ))}
      </div>
    </PremiumCard>
  );
};

export default EnrolledCourses;
