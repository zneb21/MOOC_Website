import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Camera } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const ProfileForm = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await updateProfile({ fullName });

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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-soft">
      <h2 className="font-display text-xl font-semibold text-foreground mb-6">
        Profile Information
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={user?.avatarUrl} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              {user?.fullName ? getInitials(user.fullName) : <User className="w-8 h-8" />}
            </AvatarFallback>
          </Avatar>
          <div>
            <Button type="button" variant="outline" size="sm" disabled>
              <Camera className="w-4 h-4 mr-2" />
              Upload Photo
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              Photo upload coming soon
            </p>
          </div>
        </div>

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
