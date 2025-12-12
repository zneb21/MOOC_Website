import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

// Utility function for basic email format validation
const isValidEmail = (email: string) => {
  return /\S+@\S+\.\S+/.test(email);
};

const Login = () => {
  const { toast } = useToast();
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidEmail(formData.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const { error } = await login(formData.email, formData.password);

    setIsLoading(false);

    if (error) {
      toast({
        title: "Login Failed",
        description: error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome Back!",
        description: "You have successfully logged in.",
        variant: "default",
      });
      navigate("/dashboard");
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
              <GraduationCap className="w-7 h-7 text-[#F4B942]" />
            </div>
            <h1 className="text-3xl font-bold font-display text-white">
              Welcome Back
            </h1>
            <p className="text-white/65 mt-2">
              Sign in to continue your learning journey.
            </p>
          </div>

          {/* Glass Card */}
          <div className="relative rounded-3xl bg-black/20 backdrop-blur-2xl border border-white/10 shadow-[0_28px_90px_rgba(0,0,0,0.55)] p-7 sm:p-8 overflow-hidden">
            {/* subtle shine */}
            <div className="pointer-events-none absolute -inset-x-24 -inset-y-24 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-30" />

            <form onSubmit={handleSubmit} className="space-y-6 relative">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/80">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="
                    h-12
                    bg-white/5 border-white/15 text-white placeholder:text-white/40
                    focus-visible:ring-emerald-300/40
                  "
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-white/80">
                    Password
                  </Label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-[#F4B942]/90 hover:text-[#F4B942] transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="
                      h-12 pr-10
                      bg-white/5 border-white/15 text-white placeholder:text-white/40
                      focus-visible:ring-emerald-300/40
                    "
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="
                  w-full h-12
                  bg-[#F4B942] text-black
                  hover:bg-[#e6a92f]
                  active:bg-[#d99f2c]
                  shadow-[0_16px_40px_rgba(0,0,0,0.25)]
                "
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black/20 px-2 text-white/50 backdrop-blur-sm">
                  New to SilayLearn?
                </span>
              </div>
            </div>

            {/* Sign Up */}
            <Button
              variant="outline"
              size="lg"
              className="
                w-full h-12
                bg-white/5 hover:bg-white/10
                border-white/15 text-white
              "
              asChild
            >
              <Link to="/register">Create an Account</Link>
            </Button>
          </div>

          {/* Footer Text */}
          <p className="text-center text-white/55 text-sm mt-6 p-2">
            By signing in, you agree to our{" "}
            <Link to="#" className="text-white/70 hover:text-white underline-offset-4 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="#" className="text-white/70 hover:text-white underline-offset-4 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
