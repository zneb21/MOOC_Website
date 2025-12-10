import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// --- API Endpoint: Targeting the Flask Backend (app.py) on port 5000 ---
// The forgotten password route is handled by the Flask app on this endpoint.
const AUTH_API_URL = "http://localhost:5000/api/auth";
// -----------------------------------------------------------------------

// Utility function for basic email format validation (Copied from Login.tsx)
const isValidEmail = (email: string) => {
  return /\S+@\S+\.\S+/.test(email);
};

const ForgotPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        // The backend returns success even if the email doesn't exist
        // for security reasons, so we show a general success message.
        toast({
          title: "Request Sent",
          description: data.message || "If an account exists, a password reset link has been sent to your email.",
          variant: "default",
        });
        setIsSubmitted(true);
      } else {
        // If the backend returns a 500 error (e.g., email sending failed)
        const errorMessage = data.error || data.message || "Failed to initiate password reset.";
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md my-10">
          {/* HEADER SECTION (Matching Login.tsx) */}
          <div className="text-center mb-8">
            <Mail className="w-10 h-10 text-primary mx-auto mb-2" />
            <h1 className="text-3xl font-bold font-display text-foreground">
              Forgot Your Password?
            </h1>
            <p className="text-muted-foreground mt-2">
              Enter the email address associated with your account.
            </p>
          </div>

          <div className="bg-card p-8 rounded-2xl shadow-2xl border border-border">
            {isSubmitted ? (
              // Success Message State
              <div className="space-y-6 text-center">
                <p className="text-lg font-medium text-green-600">
                    Success! Check your inbox.
                </p>
                <p className="text-muted-foreground">
                    If an account is found, a password reset link has been sent to **{email}**. Please check your spam folder.
                </p>
                <Button variant="teal" size="lg" className="w-full h-12" asChild>
                    <Link to="/login">Back to Sign In</Link>
                </Button>
              </div>
            ) : (
              // Form State
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={handleInputChange}
                    required
                    className="h-12"
                    disabled={isLoading}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="teal"
                  size="lg"
                  className="w-full h-12"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending Link..." : "Send Reset Link"}
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

export default ForgotPassword;