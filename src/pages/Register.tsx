import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Eye, EyeOff, User, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

// --- ABSOLUTE URL: CRITICAL FIX for XAMPP connection ---
const API_BASE_URL = "http://localhost/mooc_api";
// --------------------------------------------------------

// Utility function for basic email format validation
const isValidEmail = (email: string) => {
  return /\S+@\S+\.\S+/.test(email);
};

// NEW CONSTANT: Minimum password length
const MIN_PASSWORD_LENGTH = 6;

const Register = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<"learner" | "instructor">("learner");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Client-Side Validations
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
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
    
    // Password Length Validation (Client-side)
    if (formData.password.length < MIN_PASSWORD_LENGTH) {
        toast({
            title: "Validation Error",
            description: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
            variant: "destructive",
        });
        return;
    }

    setIsLoading(true);

    try {
      // 2. API Call
      const response = await fetch(`${API_BASE_URL}/api/auth/register.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: role,
        }),
      });

      // 3. Handle API Response
      
      // ✅ SUCCESS (201 Created)
      if (response.status === 201 || response.ok) {
        toast({
          title: "Registration Successful! 🎉",
          description: "Your account has been created. Please sign in now.",
        });
        navigate("/login"); 
      }

      // ❌ DUPLICATE EMAIL (409 Conflict)
      else if (response.status === 409) {
        const FRIENDLY_MESSAGE = "This email is already in use. Please sign in.";
        let errorMessage = FRIENDLY_MESSAGE;

        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {}

        toast({
          title: "Registration Failed",
          description: errorMessage,
          variant: "destructive", // Shows red error toast
        });
      }

      // ❌ OTHER ERRORS (400, 500, etc.)
      else {
        let errorMessage = "An unexpected error occurred during registration.";
        let errorTitle = "Registration Failed";

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          if (response.status === 500) {
            errorTitle = "Server Error";
            errorMessage = "Internal Server Error. Please check XAMPP logs.";
          }
        }

        toast({
          title: errorTitle,
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Network Error",
        description:
          "Could not connect to the server. Please ensure your XAMPP Apache service is running.",
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
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10 bg-emerald-950/90" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-black/55 via-emerald-950/70 to-black/55" />
        <div className="absolute -top-28 left-12 -z-10 w-80 h-80 bg-[#F4B942]/12 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 -z-10 w-72 h-72 bg-teal-400/12 rounded-full blur-3xl" />
        <div className="absolute inset-0 -z-10 opacity-[0.07] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/45 via-transparent to-black/30 pointer-events-none" />

        <div className="w-full max-w-md">
          {/* Glass Card */}
          <div className="relative rounded-3xl bg-black/20 backdrop-blur-2xl border border-white/10 shadow-[0_28px_90px_rgba(0,0,0,0.55)] p-7 sm:p-8 overflow-hidden">
            <div className="pointer-events-none absolute -inset-x-24 -inset-y-24 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-30" />

            {/* Header */}
            <div className="text-center mb-8 relative">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 mb-3 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
                <GraduationCap className="w-7 h-7 text-[#F4B942]" />
              </div>
              <h1 className="font-display text-2xl font-bold text-white mb-2">
                Create Account
              </h1>
              <p className="text-white/65">Join SilayLearn and start your journey</p>
            </div>

            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-3 mb-6 relative">
              <button
                type="button"
                onClick={() => setRole("learner")}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all",
                  role === "learner"
                    ? "border-emerald-300/30 bg-emerald-400/10 ring-1 ring-emerald-300/20"
                    : "border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/20"
                )}
              >
                <User
                  className={cn(
                    "w-6 h-6",
                    role === "learner" ? "text-emerald-200" : "text-white/60"
                  )}
                />
                <span
                  className={cn(
                    "text-sm font-medium",
                    role === "learner" ? "text-white" : "text-white/70"
                  )}
                >
                  Learner
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRole("instructor")}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all",
                  role === "instructor"
                    ? "border-[#F4B942]/35 bg-[#F4B942]/10 ring-1 ring-[#F4B942]/20"
                    : "border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/20"
                )}
              >
                <BookOpen
                  className={cn(
                    "w-6 h-6",
                    role === "instructor" ? "text-[#F4B942]" : "text-white/60"
                  )}
                />
                <span
                  className={cn(
                    "text-sm font-medium",
                    role === "instructor" ? "text-white" : "text-white/70"
                  )}
                >
                  Instructor
                </span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 relative">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-white/80">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="h-12 bg-white/5 border-white/15 text-white placeholder:text-white/40 focus-visible:ring-emerald-300/40"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/80">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="h-12 bg-white/5 border-white/15 text-white placeholder:text-white/40 focus-visible:ring-emerald-300/40"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/80">
                  Password (Min. {MIN_PASSWORD_LENGTH} Chars)
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength={MIN_PASSWORD_LENGTH}
                    className="h-12 pr-12 bg-white/5 border-white/15 text-white placeholder:text-white/40 focus-visible:ring-emerald-300/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white/80">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="h-12 pr-12 bg-white/5 border-white/15 text-white placeholder:text-white/40 focus-visible:ring-emerald-300/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-12 bg-[#F4B942] text-black hover:bg-[#e6a92f] active:bg-[#d99f2c] shadow-[0_16px_40px_rgba(0,0,0,0.25)]"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black/20 px-2 text-white/50 backdrop-blur-sm">
                  Already have an account?
                </span>
              </div>
            </div>

            {/* Login Link */}
            <Button
              variant="outline"
              size="lg"
              className="w-full h-12 bg-white/5 hover:bg-white/10 border-white/15 text-white"
              asChild
            >
              <Link to="/login">Sign In</Link>
            </Button>
          </div>

          {/* Footer */}
          <p className="text-center text-white/55 text-sm mt-6">
            By creating an account, you agree to our{" "}
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

export default Register;