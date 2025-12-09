import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Check, User, Smile, Heart, Star, Zap, Leaf, Coffee, Music, Palette, BookOpen, Globe, Sun, Moon, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarOption {
  id: string;
  icon: React.ElementType;
  bgClass: string;
  label: string;
}

const avatarOptions: AvatarOption[] = [
  { id: "smile", icon: Smile, bgClass: "bg-secondary", label: "Smile" },
  { id: "heart", icon: Heart, bgClass: "bg-coral", label: "Heart" },
  { id: "star", icon: Star, bgClass: "bg-gold", label: "Star" },
  { id: "zap", icon: Zap, bgClass: "bg-accent", label: "Energy" },
  { id: "leaf", icon: Leaf, bgClass: "bg-primary", label: "Leaf" },
  { id: "coffee", icon: Coffee, bgClass: "bg-coral-light", label: "Coffee" },
  { id: "music", icon: Music, bgClass: "bg-teal", label: "Music" },
  { id: "palette", icon: Palette, bgClass: "bg-gold-light", label: "Art" },
  { id: "book", icon: BookOpen, bgClass: "bg-primary", label: "Book" },
  { id: "globe", icon: Globe, bgClass: "bg-teal-light", label: "Globe" },
  { id: "sun", icon: Sun, bgClass: "bg-secondary", label: "Sun" },
  { id: "sparkles", icon: Sparkles, bgClass: "bg-gold", label: "Sparkles" },
];

interface AvatarSelectorProps {
  selectedAvatar: string | null;
  onSelect: (avatarId: string | null) => void;
}

const AvatarSelector = ({ selectedAvatar, onSelect }: AvatarSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [tempSelection, setTempSelection] = useState<string | null>(selectedAvatar);

  // Ensure tempSelection is in sync if the parent's selectedAvatar changes
  useEffect(() => {
    setTempSelection(selectedAvatar);
  }, [selectedAvatar]);

  const handleConfirm = () => {
    onSelect(tempSelection);
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setTempSelection(selectedAvatar);
    }
  };

  const selectedOption = avatarOptions.find((opt) => opt.id === selectedAvatar);

  return (
    <div className="flex items-center gap-4">
      <Avatar className="w-20 h-20 border-2 border-border">
        {selectedOption ? (
          <AvatarFallback className={cn(selectedOption.bgClass, "text-primary-foreground")}>
            <selectedOption.icon className="w-8 h-8" />
          </AvatarFallback>
        ) : (
          <AvatarFallback className="bg-muted text-muted-foreground">
            <User className="w-8 h-8" />
          </AvatarFallback>
        )}
      </Avatar>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" size="sm">
            <Palette className="w-4 h-4 mr-2" />
            Choose Avatar
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Choose Your Avatar</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Select an icon to represent you, or choose no avatar.
            </p>

            {/* No Avatar Option */}
            <button
              type="button"
              onClick={() => setTempSelection(null)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all mb-4",
                tempSelection === null
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-muted-foreground/30"
              )}
            >
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-muted text-muted-foreground">
                  <X className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground">No Avatar</span>
              {tempSelection === null && (
                <Check className="w-5 h-5 text-primary ml-auto" />
              )}
            </button>

            {/* Avatar Grid */}
            <div className="grid grid-cols-4 gap-3">
              {avatarOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setTempSelection(option.id)}
                  className={cn(
                    "relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                    tempSelection === option.id
                      ? "border-primary bg-primary/5 scale-105"
                      : "border-transparent hover:border-muted-foreground/30 hover:bg-muted/50"
                  )}
                >
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className={cn(option.bgClass, "text-primary-foreground")}>
                      <option.icon className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">{option.label}</span>
                  {tempSelection === option.id && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="teal" onClick={handleConfirm}>
              Save Avatar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AvatarSelector;