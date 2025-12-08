import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, LogOut, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const SecuritySettings = () => {
  const { user, logout, resetPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isResetting, setIsResetting] = useState(false);

  const handleResetPassword = async () => {
    if (!user?.email) return;

    setIsResetting(true);
    const { error } = await resetPassword(user.email);

    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Password reset email sent",
        description: "Check your inbox for the password reset link.",
      });
    }

    setIsResetting(false);
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    navigate("/");
  };

  return (
    <div className="space-y-6">
      {/* Security Section */}
      <div className="bg-card rounded-2xl p-6 shadow-soft">
        <h2 className="font-display text-xl font-semibold text-foreground mb-6">
          Security
        </h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Password</Label>
            <div className="flex items-center gap-4">
              <Input
                type="password"
                value="••••••••"
                disabled
                className="h-12 bg-muted flex-1"
              />
              <Button
                variant="outline"
                onClick={handleResetPassword}
                disabled={isResetting}
              >
                <KeyRound className="w-4 h-4 mr-2" />
                {isResetting ? "Sending..." : "Reset Password"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              A password reset link will be sent to your email
            </p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-card rounded-2xl p-6 shadow-soft border border-destructive/20">
        <h2 className="font-display text-xl font-semibold text-destructive mb-6">
          Danger Zone
        </h2>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
          <Button variant="destructive" disabled>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Account
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Account deletion is not yet available. Contact support for assistance.
        </p>
      </div>
    </div>
  );
};

export default SecuritySettings;
