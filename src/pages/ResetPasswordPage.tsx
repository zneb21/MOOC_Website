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
  
  // Hook to read query parameters (like ?token=...)
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false); // State for success message

  useEffect(() => {
    // Basic check to see if a token exists in the URL
    if (!token) {
      toast({
        title: "Error",
        description: "Missing password reset token.",
        variant: "destructive",
      });
      navigate('/forgot-password');
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

    // NOTE TO USER: The minimum password length check (e.g., newPassword.length < 6)
    // has been REMOVED as requested.

    setIsLoading(true);

    try {
      const response = await fetch(`${AUTH_API_URL}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            token, 
            newPassword 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message || "Your password has been reset successfully.",
          variant: "default",
        });
        setIsPasswordReset(true);
      } else {
        const errorMessage = data.message || "Failed to reset password. The link may be invalid or expired.";
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
    // Optionally render a loading state or nothing while redirecting
    return <div className="p-10 text-center">Checking token...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md my-10">
          
          {/* HEADER SECTION */}
          <div className="text-center mb-8">
            <KeyRound className="w-10 h-10 text-primary mx-auto mb-2" />
            <h1 className="text-3xl font-bold font-display text-foreground">
              Set New Password
            </h1>
            <p className="text-muted-foreground mt-2">
              Use the form below to create your new account password.
            </p>
          </div>

          <div className="bg-card p-8 rounded-2xl shadow-2xl border border-border">
            {isPasswordReset ? (
              // Success State
              <div className="space-y-6 text-center">
                <CheckCircle className="w-10 h-10 text-green-500 mx-auto" />
                <p className="text-lg font-medium text-foreground">
                    Password Successfully Updated!
                </p>
                <p className="text-muted-foreground">
                    You can now use your new password to sign in.
                </p>
                <Button variant="teal" size="lg" className="w-full h-12" asChild>
                    <Link to="/login">Proceed to Sign In</Link>
                </Button>
              </div>
            ) : (
              // Form State
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* New Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="h-12 pr-12"
                      disabled={isLoading}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-12 px-3"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className={cn("h-12 pr-12", {
                        "border-red-500": newPassword && confirmPassword && newPassword !== confirmPassword,
                      })}
                      disabled={isLoading}
                    />
                    {/* The eye button controls both fields */}
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-12 px-3 opacity-0 pointer-events-none" 
                    >
                        {/* Invisible button, just for structural alignment with the one above */}
                    </Button>
                  </div>
                  {newPassword && confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-sm text-red-500">Passwords do not match.</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="teal"
                  size="lg"
                  className="w-full h-12"
                  disabled={isLoading || newPassword !== confirmPassword || !newPassword}
                >
                  {isLoading ? "Updating Password..." : "Update Password"}
                </Button>
              </form>
            )}

            {/* Back to Login Link */}
            <div className="text-center mt-6">
              <Link
                to="/login"
                className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
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