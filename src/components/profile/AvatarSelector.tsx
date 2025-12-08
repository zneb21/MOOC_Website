import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Check } from "lucide-react";

// Pre-made avatar options (using UI gradient colors)
export const AVATAR_OPTIONS = [
  { id: "avatar-1", initials: "A1", color: "bg-blue-500" },
  { id: "avatar-2", initials: "A2", color: "bg-purple-500" },
  { id: "avatar-3", initials: "A3", color: "bg-pink-500" },
  { id: "avatar-4", initials: "A4", color: "bg-green-500" },
  { id: "avatar-5", initials: "A5", color: "bg-orange-500" },
  { id: "avatar-6", initials: "A6", color: "bg-red-500" },
  { id: "avatar-7", initials: "A7", color: "bg-teal-500" },
  { id: "avatar-8", initials: "A8", color: "bg-indigo-500" },
  { id: "avatar-9", initials: "A9", color: "bg-cyan-500" },
  { id: "avatar-10", initials: "A10", color: "bg-emerald-500" },
  { id: "avatar-11", initials: "A11", color: "bg-amber-500" },
  { id: "avatar-12", initials: "A12", color: "bg-rose-500" },
];

interface AvatarSelectorProps {
  selectedAvatarId?: string;
  onSelectAvatar: (avatarId: string) => void;
  userFullName?: string;
}

const AvatarSelector = ({
  selectedAvatarId,
  onSelectAvatar,
  userFullName,
}: AvatarSelectorProps) => {
  const [open, setOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const selectedAvatar = AVATAR_OPTIONS.find((a) => a.id === selectedAvatarId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Camera className="w-4 h-4 mr-2" />
          Choose Avatar
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Your Avatar</DialogTitle>
          <DialogDescription>
            Choose an avatar for your profile
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-4 gap-4 py-4">
          {AVATAR_OPTIONS.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => {
                onSelectAvatar(avatar.id);
                setOpen(false);
              }}
              className={`relative p-2 rounded-lg transition-all ${
                selectedAvatarId === avatar.id
                  ? "ring-2 ring-primary bg-primary/10"
                  : "hover:bg-muted"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className={`text-lg font-semibold text-white ${avatar.color}`}>
                    {userFullName ? getInitials(userFullName) : avatar.initials}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Check mark for selected */}
              {selectedAvatarId === avatar.id && (
                <div className="absolute top-0 right-0 bg-primary rounded-full p-1">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AvatarSelector;
