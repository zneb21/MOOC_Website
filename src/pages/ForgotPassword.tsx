import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// --- API Endpoint: Targeting the Flask Backend (app.py) on port 5000 ---
const AUTH_API_URL = "http://localhost:5000/api/auth";
// -----------------------------------------------------------------------

// Utility function for basic email format validation
const isValidEmail = (email: string) => {
  return /\S+@\S+\.\S+/.test(email);
};

const ForgotPassword = () => {
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Validation Error",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidEmail(email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${AUTH_API_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Request Sent",
          description:
            data.message ||
            "If an account exists, a password reset link has been sent to your email.",
          variant: "default",
        });
        setIsSubmitted(true);
      } else {
        const errorMessage =
          data.error || data.message || "Failed to initiate password reset.";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Forgot Password API error:", error);
      toast({
        title: "Network Error",
        description: "Could not connect to the server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
              <Mail className="w-7 h-7 text-[#F4B942]" />
            </div>
            <h1 className="text-3xl font-bold font-display text-white">
              Forgot your password?
            </h1>
            <p className="text-white/65 mt-2">
              Enter your email and we’ll send you a reset link.
            </p>
          </div>

          <div className="relative rounded-3xl bg-black/20 backdrop-blur-2xl border border-white/10 shadow-[0_28px_90px_rgba(0,0,0,0.55)] p-7 sm:p-8 overflow-hidden">
            <div className="pointer-events-none absolute -inset-x-24 -inset-y-24 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-30" />

            {isSubmitted ? (
              <div className="space-y-5 text-center relative">
                <CheckCircle2 className="w-10 h-10 text-emerald-300 mx-auto" />
                <p className="text-lg font-medium text-white">
                  Check your inbox
                </p>
                <p className="text-white/65">
                  If an account exists, we sent a reset link to{" "}
                  <span className="text-white">{email}</span>.
                  <br />
                  Don’t forget to check spam/junk.
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
                  <Link to="/login">Back to Sign In</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 relative">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/80">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={handleInputChange}
                    required
                    className="
                      h-12
                      bg-white/5 border-white/15 text-white placeholder:text-white/40
                      focus-visible:ring-emerald-300/40
                    "
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  className="
                    w-full h-12
                    bg-[#F4B942] text-black
                    hover:bg-[#e6a92f] active:bg-[#d99f2c]
                    shadow-[0_16px_40px_rgba(0,0,0,0.25)]
                  "
                  disabled={isLoading}
                >
                  {isLoading ? "Sending Link..." : "Send Reset Link"}
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

export default ForgotPassword;
