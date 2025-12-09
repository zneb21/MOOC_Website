import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import AvatarSelector from "./AvatarSelector";

const ProfileForm = () => {
  const authContext = useAuth();
  const { toast } = useToast();

  // Gracefully handle the case where the component is rendered outside of the AuthProvider
  if (!authContext) {
    return null; // or a loading/error indicator
  }
  const { user, updateProfile } = authContext;

  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(user?.avatarId || null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Pass both fullName and the selected avatarId to the update function
    const { error } = await updateProfile({ fullName, avatarId: selectedAvatar });

    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-soft">
      <h2 className="font-display text-xl font-semibold text-foreground mb-6">
        Profile Information
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Selector */}
        <AvatarSelector selectedAvatar={selectedAvatar} onSelect={setSelectedAvatar} />

        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            className="h-12"
          />
        </div>

        {/* Email (read-only) */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={user?.email || ""}
            disabled
            className="h-12 bg-muted"
          />
          <p className="text-xs text-muted-foreground">
            Email cannot be changed
          </p>
        </div>

        {/* Role (read-only) */}
        <div className="space-y-2">
          <Label>Account Type</Label>
          <div className="h-12 px-4 flex items-center bg-muted rounded-lg">
            <span className="capitalize text-foreground">{user?.role || "Learner"}</span>
          </div>
        </div>

        {/* Member Since */}
        <div className="space-y-2">
          <Label>Member Since</Label>
          <div className="h-12 px-4 flex items-center bg-muted rounded-lg">
            <span className="text-foreground">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })
                : "N/A"}
            </span>
          </div>
        </div>

        <Button type="submit" variant="teal" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
};

export default ProfileForm;
