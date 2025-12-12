import { useState, useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import AvatarSelector from "./AvatarSelector";
import { format, parseISO } from "date-fns";
import { Paintbrush } from "lucide-react";

// ---------------------------------------------
// Accent (per-user, localStorage)
// ---------------------------------------------
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
}: {
  children: React.ReactNode;
  className?: string;
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

const ProfileForm = () => {
  const authContext = useAuth();
  const { toast } = useToast();

  const [accent, setAccent] = useState<Accent>(() => getSavedAccent());

  useEffect(() => {
    applyAccent(accent);
    localStorage.setItem("user_accent", JSON.stringify(accent));
  }, [accent]);

  if (!authContext || authContext.isLoading) {
    return <div className="p-6 text-zinc-700 dark:text-zinc-200">Loading profile data.</div>;
  }

  const { user, updateProfile } = authContext;

  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [selectedAvatar, setSelectedAvatar] = useState<string | number | null>(
    user?.avatarId || null
  );

  useEffect(() => {
    setFullName(user?.fullName || "");
    setSelectedAvatar(user?.avatarId || null);
  }, [user]);

  const handleAvatarCommit = async (newAvatarId: string | null) => {
    setSelectedAvatar(newAvatarId);

    setIsLoading(true);
    const { error } = await updateProfile({
      fullName: fullName,
      avatarId: newAvatarId,
    });
    setIsLoading(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Avatar Update Failed",
        description: error,
      });
    } else {
      toast({
        title: "Avatar Updated",
        description: "Your new avatar has been saved successfully.",
        variant: "default",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await updateProfile({
      fullName: fullName,
      avatarId: selectedAvatar,
    });

    setIsLoading(false);

    if (error) {
      toast({ variant: "destructive", title: "Update Failed", description: error });
    } else {
      toast({ title: "Success!", description: "Profile updated.", variant: "default" });
    }
  };

  const isDirty = fullName !== user?.fullName || selectedAvatar !== user?.avatarId;

  return (
    <div className="space-y-8">
      
      {/* 1. AVATAR */}
      <PremiumCard className="p-6">
        <h3 className="font-display text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-6">
          Your Avatar
        </h3>

        <AvatarSelector selectedAvatar={selectedAvatar as string} onSelect={handleAvatarCommit} />

        <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-4">
          Click the avatar to change your look. Changes are saved instantly.
        </p>
      </PremiumCard>

      {/* 2. PERSONAL INFO */}
      <PremiumCard className="p-6">
        <h3 className="font-display text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-6">
          Personal Information
        </h3>

        <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
          {/* Full Name */}
          <div className="space-y-2">
            <Label className="text-zinc-900 dark:text-zinc-100" htmlFor="fullName">
              Full Name
            </Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-12 bg-white/70 dark:bg-zinc-900/60 border border-black/10 dark:border-white/10 text-zinc-900 dark:text-zinc-100"
              disabled={isLoading}
            />
          </div>

          {/* Email (Read-Only) */}
          <div className="space-y-2">
            <Label className="text-zinc-900 dark:text-zinc-100" htmlFor="email">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={user?.email || "N/A"}
              disabled
              className="h-12 bg-muted/40 dark:bg-white/5 border border-black/10 dark:border-white/10 text-zinc-700 dark:text-zinc-300"
            />
            <p className="text-xs text-zinc-600 dark:text-zinc-300">
              Your email is your primary login identifier.
            </p>
          </div>

          {/* Account Type */}
          <div className="space-y-2">
            <Label className="text-zinc-900 dark:text-zinc-100">Account Type</Label>
            <div className="h-12 px-4 flex items-center rounded-lg bg-muted/40 dark:bg-white/5 border border-black/10 dark:border-white/10 text-zinc-700 dark:text-zinc-300">
              <span className="capitalize font-medium">{user?.role || "Learner"}</span>
            </div>
          </div>

          {/* Member Since */}
          <div className="space-y-2">
            <Label className="text-zinc-900 dark:text-zinc-100">Member Since</Label>
            <div className="h-12 px-4 flex items-center rounded-lg bg-muted/40 dark:bg-white/5 border border-black/10 dark:border-white/10 text-zinc-700 dark:text-zinc-300">
              <span className="text-sm">
                {user?.createdAt ? format(parseISO(user.createdAt), "MMMM dd, yyyy") : "N/A"}
              </span>
            </div>
          </div>

          {/* Submit */}
          <div className="md:col-span-2 pt-2">
            <Button
              type="submit"
              variant="teal"
              className="h-12 w-full max-w-xs transition-all duration-300"
              disabled={isLoading || !isDirty}
              style={{
                // let your button match accent subtly
                boxShadow: "0 0 0 1px var(--accent-soft), 0 18px 60px rgba(0,0,0,.15)",
              }}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </PremiumCard>
    </div>
  );
};

export default ProfileForm;
