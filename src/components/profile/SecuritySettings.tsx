import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  KeyRound, 
  LogOut, 
  Trash2, 
  AlertTriangle 
} from "lucide-react";
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


const SecuritySettings = () => {
  // Destructure the new function
  const { user, logout, resetPassword, deleteAccount } = useAuth(); 
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // State for Reset Password
  const [isResetting, setIsResetting] = useState(false);
  
  // State for Delete Account
  const [isDeleting, setIsDeleting] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  const handleResetPassword = async () => {
    if (!user?.email) return;

    setIsResetting(true);
    // This now correctly calls the Flask endpoint via AuthContext
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
    navigate("/login");
  };

  // ✅ NEW HANDLER: For Account Deletion
  const handleDeleteAccount = async () => {
    if (!passwordConfirm) {
      toast({
        title: "Error",
        description: "Please enter your password to confirm.",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);

    // Call the newly implemented deleteAccount function
    const { error } = await deleteAccount(passwordConfirm);

    setIsDeleting(false);
    setIsDialogOpen(false); // Close the dialog regardless of success/fail

    if (error) {
      toast({
        title: "Deletion Failed",
        description: error,
        variant: "destructive",
      });
    } else {
      // Deletion was successful, AuthContext already called logout()
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently removed.",
        variant: "default",
      });
      // Navigate to home/login page after successful deletion
      navigate("/"); 
    }
  };


  return (
    <div className="space-y-8">
      {/* 1. PASSWORD & SECURITY SECTION */}
      <div className="bg-card rounded-2xl p-6 shadow-soft border border-border">
        <h3 className="font-display text-lg font-semibold text-primary-600 mb-6">
          Password Security
        </h3>
        
        {/* Password Field (Masked) */}
        <div className="space-y-4">
          <Label htmlFor="password">Current Password</Label>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
            <Input
              id="password"
              type="password"
              value="••••••••"
              disabled
              className="h-12 bg-muted flex-1"
            />
            <Button
              variant="outline"
              onClick={handleResetPassword}
              disabled={isResetting}
              className="sm:w-auto w-full"
            >
              <KeyRound className="w-4 h-4 mr-2" />
              {isResetting ? "Sending..." : "Reset Password"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            A password reset link will be sent to your email ({user?.email || "N/A"}).
          </p>
        </div>
      </div>

      {/* 2. DANGER ZONE SECTION */}
      <div className="bg-card rounded-2xl p-6 shadow-soft border border-destructive/20">
        <h2 className="font-display text-xl font-semibold text-destructive mb-6">
          Danger Zone
        </h2>

        <div className="flex flex-col gap-4">
          
          {/* Sign Out Button */}
          <div className="flex justify-between items-center border-b pb-4 border-border/50">
            <p className="text-base text-foreground font-medium">Sign Out</p>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Delete Account */}
          <div className="flex justify-between items-start pt-2">
            <div>
              <p className="text-base text-destructive font-medium">Delete Account</p>
              <p className="text-sm text-muted-foreground mt-1">
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
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center text-destructive">
                    <AlertTriangle className="w-6 h-6 mr-2 text-destructive" />
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account, courses, and all chat history. 
                    Please confirm your action by typing your password below.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                
                <div className="space-y-2">
                  <Label htmlFor="delete-confirm-password">Your Password</Label>
                  <Input
                    id="delete-confirm-password"
                    type="password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    disabled={isDeleting}
                    placeholder="Enter your current password"
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
      </div>
    </div>
  );
};

export default SecuritySettings;