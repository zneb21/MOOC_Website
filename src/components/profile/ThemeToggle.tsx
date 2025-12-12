import { useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sun, Moon } from "lucide-react";

function PremiumShell({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;

    const px = x / r.width;
    const py = y / r.height;

    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);

    const rotY = (px - 0.5) * 10;
    const rotX = (0.5 - py) * 10;
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
        "hover:-translate-y-1.5 hover:ring-1 hover:ring-[color:var(--accent-soft)]",
      ].join(" ")}
      style={{ transform: "perspective(900px) rotateX(var(--rx)) rotateY(var(--ry))" }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute -inset-[1px] rounded-2xl premium-shimmer" />
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-2xl premium-spotlight opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative p-6">{children}</div>

      <style>{`
        .premium-card { --rx:0deg; --ry:0deg; --mx:50%; --my:50%; }
        .premium-shimmer{
          border-radius: 1rem;
          background: linear-gradient(90deg,
            transparent 0%,
            color-mix(in srgb, var(--accent) 26%, transparent) 25%,
            rgba(255,255,255,.06) 45%,
            transparent 60%,
            color-mix(in srgb, var(--accent) 18%, transparent) 75%,
            transparent 100%
          );
          mix-blend-mode: overlay;
          animation: shimmerMove 2.2s linear infinite;
          padding: 1px;
          box-sizing: border-box;
        }
        @keyframes shimmerMove { 0% { transform: translateX(-12%); } 100% { transform: translateX(12%); } }
        .premium-spotlight{
          background: radial-gradient(280px circle at var(--mx) var(--my),
            hsla(var(--accent-hue, 160), 90%, 60%, .16), transparent 60%);
        }
      `}</style>
    </div>
  );
}

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <PremiumShell>
      <h2 className="font-display text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-6">
        Appearance
      </h2>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isDark ? (
            <Moon className="w-5 h-5 text-zinc-700 dark:text-zinc-200" />
          ) : (
            <Sun className="w-5 h-5 text-zinc-700 dark:text-zinc-200" />
          )}
          <div>
            <Label htmlFor="theme-toggle" className="text-base font-medium cursor-pointer text-zinc-900 dark:text-zinc-50">
              Dark Mode
            </Label>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              {isDark ? "Currently using dark theme" : "Currently using light theme"}
            </p>
          </div>
        </div>

        <Switch
          id="theme-toggle"
          checked={isDark}
          onCheckedChange={toggleTheme}
          className="data-[state=checked]:bg-primary"
        />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => !isDark || toggleTheme()}
          className={`relative p-4 rounded-xl border transition-all ${
            !isDark ? "border-[color:var(--accent)]" : "border-black/10 dark:border-white/10 hover:bg-muted/40 dark:hover:bg-white/5"
          }`}
        >
          <div className="bg-[hsl(40,30%,97%)] rounded-lg p-3 space-y-2">
            <div className="h-2 w-12 bg-[hsl(170,45%,28%)] rounded" />
            <div className="h-2 w-16 bg-[hsl(35,20%,88%)] rounded" />
            <div className="h-2 w-10 bg-[hsl(38,70%,55%)] rounded" />
          </div>
          <p className="text-xs font-medium text-zinc-900 dark:text-zinc-50 mt-2">Light</p>
        </button>

        <button
          type="button"
          onClick={() => isDark || toggleTheme()}
          className={`relative p-4 rounded-xl border transition-all ${
            isDark ? "border-[color:var(--accent)]" : "border-black/10 dark:border-white/10 hover:bg-muted/40 dark:hover:bg-white/5"
          }`}
        >
          <div className="bg-[hsl(25,25%,10%)] rounded-lg p-3 space-y-2">
            <div className="h-2 w-12 bg-[hsl(170,40%,45%)] rounded" />
            <div className="h-2 w-16 bg-[hsl(25,15%,20%)] rounded" />
            <div className="h-2 w-10 bg-[hsl(38,60%,50%)] rounded" />
          </div>
          <p className="text-xs font-medium text-zinc-900 dark:text-zinc-50 mt-2">Dark</p>
        </button>
      </div>
    </PremiumShell>
  );
};

export default ThemeToggle;
