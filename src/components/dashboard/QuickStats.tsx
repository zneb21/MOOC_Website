import { BookOpen, Clock, CheckCircle } from "lucide-react";
import { Enrollment } from "@/data/mockData";
import { Paintbrush } from "lucide-react";
import { useRef } from "react";
interface QuickStatsProps {
  enrollments: Enrollment[];
}

const QuickStats = ({ enrollments }: QuickStatsProps) => {
  const totalCourses = enrollments.length;
  const inProgress = enrollments.filter((e) => e.progress > 0 && e.progress < 100).length;
  const completed = enrollments.filter((e) => e.progress === 100).length;

  const stats = [
    {
      icon: BookOpen,
      label: "Enrolled",
      value: totalCourses,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Clock,
      label: "In Progress",
      value: inProgress,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: CheckCircle,
      label: "Completed",
      value: completed,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];
  
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

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <PremiumCard
          key={stat.label}
          className="animate-fade-up"
          style={{ animationDelay: `${(index + 1) * 100}ms` }}
        >
          <div className="p-4">
          <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center mb-3`}>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        </PremiumCard>
      ))}
    </div>
  );
};

export default QuickStats;
