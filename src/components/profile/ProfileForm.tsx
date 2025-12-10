import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import AvatarSelector from "./AvatarSelector"; // Assuming this component exists
import { format } from "date-fns"; 

const ProfileForm = () => {
  const authContext = useAuth();
  const { toast } = useToast();

  if (!authContext || authContext.isLoading) {
    // Show a skeleton or loading state while context loads
    return <div className="p-6">Loading profile data...</div>; 
  }
  
  const { user, updateProfile } = authContext;

  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [selectedAvatar, setSelectedAvatar] = useState<string | number | null>(user?.avatarId || null);

  // Sync local state with context when user data changes
  useEffect(() => {
    setFullName(user?.fullName || "");
    setSelectedAvatar(user?.avatarId || null);
  }, [user]);

  // Handles immediate save when avatar is selected in the selector popup
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

  // Check if any field is different from the stored user data
  const isDirty = fullName !== user?.fullName || selectedAvatar !== user?.avatarId;


  return (
    <div className="space-y-8">
      
      {/* 1. PROFILE PICTURE / AVATAR SELECTOR SECTION */}
      <div className="bg-card rounded-2xl p-6 shadow-soft border border-border">
        <h3 className="font-display text-lg font-semibold text-primary-600 mb-6">
          Your Avatar
        </h3>
        <AvatarSelector
          selectedAvatar={selectedAvatar as string} 
          onSelect={handleAvatarCommit} 
        />
        <p className="text-sm text-muted-foreground mt-4">
          Click the avatar to change your look. Changes are saved instantly.
        </p>
      </div>

      
      {/* 2. PERSONAL INFORMATION FORM SECTION */}
      <div className="bg-card rounded-2xl p-6 shadow-soft border border-border">
        <h3 className="font-display text-lg font-semibold text-primary-600 mb-6">
          Personal Information
        </h3>
        <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
          
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-12"
              disabled={isLoading}
            />
          </div>

          {/* Email Address (Read-Only) */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={user?.email || "N/A"}
              disabled
              className="h-12 bg-muted/50 border-dashed"
            />
            <p className="text-xs text-muted-foreground">
              Your email is your primary login identifier.
            </p>
          </div>

          {/* Account Type (Read-Only) */}
          <div className="space-y-2">
            <Label>Account Type</Label>
            <div className="h-12 px-4 flex items-center bg-muted/50 rounded-lg text-foreground/80">
              <span className="capitalize font-medium">
                {user?.role || "Learner"}
              </span>
            </div>
          </div>

          {/* Member Since (Read-Only) */}
          <div className="space-y-2">
            <Label>Member Since</Label>
            <div className="h-12 px-4 flex items-center bg-muted/50 rounded-lg text-foreground/80">
              <span className="text-sm">
                {user?.createdAt
                  ? format(new Date(user.createdAt), "MMMM dd, yyyy")
                  : "N/A"}
              </span>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="md:col-span-2 pt-4">
            <Button 
              type="submit" 
              variant="teal" // Assuming 'teal' is your primary variant
              className="h-12 w-full max-w-xs transition-all duration-300"
              disabled={isLoading || !isDirty} 
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
      
    </div>
  );
};

export default ProfileForm;