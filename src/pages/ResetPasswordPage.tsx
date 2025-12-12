import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, CheckCircle, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// --- API Endpoint: Targeting the Flask Backend (app.py) on port 5000 ---
const AUTH_API_URL = "http://localhost:5000/api/auth";
// -----------------------------------------------------------------------

const ResetPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);

  useEffect(() => {
    if (!token) {
      toast({
        title: "Error",
        description: "Missing password reset token.",
        variant: "destructive",
      });
      navigate("/forgot-password");
    }
  }, [token, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "Validation Error",
        description: "The new password and confirmation password do not match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${AUTH_API_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description:
            data.message || "Your password has been reset successfully.",
          variant: "default",
        });
        setIsPasswordReset(true);
      } else {
        const errorMessage =
          data.message ||
          "Failed to reset password. The link may be invalid or expired.";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Reset Password API error:", error);
      toast({
        title: "Network Error",
        description: "Could not connect to the server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16 lg:pt-20 min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
          <p className="text-white/70">Checking token…</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16 lg:pt-20 min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
        {/* About-page ambience */}
        <div className="absolute inset-0 -z-10 bg-emerald-950/90" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-black/55 via-emerald-950/70 to-black/55" />
        <div className="absolute -top-28 left-12 -z-10 w-80 h-80 bg-[#F4B942]/12 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 -z-10 w-72 h-72 bg-teal-400/12 rounded-full blur-3xl" />
        <div className="absolute inset-0 -z-10 opacity-[0.07] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/45 via-transparent to-black/30 pointer-events-none" />

        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 mb-3 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
              <KeyRound className="w-7 h-7 text-[#F4B942]" />
            </div>
            <h1 className="text-3xl font-bold font-display text-white">
              Set New Password
            </h1>
            <p className="text-white/65 mt-2">
              Use the form below to create your new account password.
            </p>
          </div>

          <div className="relative rounded-3xl bg-black/20 backdrop-blur-2xl border border-white/10 shadow-[0_28px_90px_rgba(0,0,0,0.55)] p-7 sm:p-8 overflow-hidden">
            <div className="pointer-events-none absolute -inset-x-24 -inset-y-24 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-30" />

            {isPasswordReset ? (
              <div className="space-y-6 text-center relative">
                <CheckCircle className="w-10 h-10 text-emerald-300 mx-auto" />
                <p className="text-lg font-medium text-white">
                  Password Successfully Updated!
                </p>
                <p className="text-white/65">
                  You can now use your new password to sign in.
                </p>
                <Button
                  className="
                    w-full h-12
                    bg-[#F4B942] text-black
                    hover:bg-[#e6a92f] active:bg-[#d99f2c]
                    shadow-[0_16px_40px_rgba(0,0,0,0.25)]
                  "
                  asChild
                >
                  <Link to="/login">Proceed to Sign In</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 relative">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-white/80">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="
                        h-12 pr-12
                        bg-white/5 border-white/15 text-white placeholder:text-white/40
                        focus-visible:ring-emerald-300/40
                      "
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-12 px-3 text-white/60 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white/80">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className={cn(
                        `
                        h-12 pr-12
                        bg-white/5 border-white/15 text-white placeholder:text-white/40
                        focus-visible:ring-emerald-300/40
                      `,
                        {
                          "border-red-500":
                            newPassword &&
                            confirmPassword &&
                            newPassword !== confirmPassword,
                        }
                      )}
                      disabled={isLoading}
                    />
                    {/* invisible for alignment (keeps your original structure) */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-12 px-3 opacity-0 pointer-events-none"
                    />
                  </div>

                  {newPassword &&
                    confirmPassword &&
                    newPassword !== confirmPassword && (
                      <p className="text-sm text-red-400">
                        Passwords do not match.
                      </p>
                    )}
                </div>

                <Button
                  type="submit"
                  className="
                    w-full h-12
                    bg-[#F4B942] text-black
                    hover:bg-[#e6a92f] active:bg-[#d99f2c]
                    shadow-[0_16px_40px_rgba(0,0,0,0.25)]
                  "
                  disabled={
                    isLoading ||
                    newPassword !== confirmPassword ||
                    !newPassword
                  }
                >
                  {isLoading ? "Updating Password..." : "Update Password"}
                </Button>
              </form>
            )}

            <div className="text-center mt-6">
              <Link
                to="/login"
                className="text-sm text-white/55 hover:text-white transition-colors inline-flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;
