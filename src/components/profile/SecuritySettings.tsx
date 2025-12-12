import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, LogOut, Trash2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
        className,
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
            color-mix(in srgb, var(--accent) 24%, transparent) 25%,
            rgba(255,255,255,.06) 45%,
            transparent 60%,
            color-mix(in srgb, var(--accent) 16%, transparent) 75%,
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

const SecuritySettings = () => {
  const { user, logout, resetPassword, deleteAccount } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isResetting, setIsResetting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleResetPassword = async () => {
    if (!user?.email) return;

    setIsResetting(true);
    const { error } = await resetPassword(user.email);

    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
    } else {
      toast({ title: "Password reset email sent", description: "Check your inbox for the password reset link." });
    }

    setIsResetting(false);
  };

  const handleLogout = () => {
    logout();
    toast({ title: "Signed out", description: "You have been signed out successfully." });
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    if (!passwordConfirm) {
      toast({ title: "Error", description: "Please enter your password to confirm.", variant: "destructive" });
      return;
    }

    setIsDeleting(true);
    const { error } = await deleteAccount(passwordConfirm);
    setIsDeleting(false);
    setIsDialogOpen(false);

    if (error) {
      toast({ title: "Deletion Failed", description: error, variant: "destructive" });
    } else {
      toast({ title: "Account Deleted", description: "Your account has been permanently removed." });
      navigate("/");
    }
  };

  return (
    <div className="space-y-8">
      {/* Password Security */}
      <PremiumCard>
        <h3 className="font-display text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-6">
          Password Security
        </h3>

        <div className="space-y-4">
          <Label htmlFor="password" className="text-zinc-900 dark:text-zinc-100">
            Current Password
          </Label>

          <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
            <Input
              id="password"
              type="password"
              value="••••••••"
              disabled
              className="h-12 bg-muted/40 dark:bg-white/5 border border-black/10 dark:border-white/10 text-zinc-700 dark:text-zinc-300 flex-1"
            />
            <Button
              variant="outline"
              onClick={handleResetPassword}
              disabled={isResetting}
              className="sm:w-auto w-full border-black/10 dark:border-white/10"
            >
              <KeyRound className="w-4 h-4 mr-2" />
              {isResetting ? "Sending..." : "Reset Password"}
            </Button>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-300">
            A password reset link will be sent to your email ({user?.email || "N/A"}).
          </p>
        </div>
      </PremiumCard>

      {/* Danger Zone */}
      <PremiumCard className="border-destructive/30 dark:border-destructive/40 hover:ring-1 hover:ring-destructive/30">
        <h2 className="font-display text-xl font-semibold text-destructive mb-6">
          Danger Zone
        </h2>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center border-b pb-4 border-black/10 dark:border-white/10">
            <p className="text-base text-zinc-900 dark:text-zinc-50 font-medium">Sign Out</p>
            <Button variant="outline" onClick={handleLogout} className="border-black/10 dark:border-white/10">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          <div className="flex justify-between items-start pt-2">
            <div>
              <p className="text-base text-destructive font-medium">Delete Account</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">
                Permanently delete your account and all associated data. This action is irreversible.
              </p>
            </div>

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex-shrink-0">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border border-black/10 dark:border-white/10">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center text-destructive">
                    <AlertTriangle className="w-6 h-6 mr-2 text-destructive" />
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-zinc-600 dark:text-zinc-300">
                    This action cannot be undone. Please confirm by typing your password below.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-2">
                  <Label htmlFor="delete-confirm-password" className="text-zinc-900 dark:text-zinc-100">
                    Your Password
                  </Label>
                  <Input
                    id="delete-confirm-password"
                    type="password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    disabled={isDeleting}
                    placeholder="Enter your current password"
                    className="h-12 bg-white/70 dark:bg-zinc-900/60 border border-black/10 dark:border-white/10 text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={isDeleting || passwordConfirm.length === 0}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    {isDeleting ? "Deleting..." : "Confirm Deletion"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </PremiumCard>
    </div>
  );
};

export default SecuritySettings;
