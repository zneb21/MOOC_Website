import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Check, User, Smile, Heart, Star, Zap, Leaf, Coffee, Music, Palette, BookOpen, Globe, Sun, Sparkles, X } from "lucide-react";
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

  useEffect(() => {
    setTempSelection(selectedAvatar);
  }, [selectedAvatar]);

  const handleConfirm = () => {
    onSelect(tempSelection);
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) setTempSelection(selectedAvatar);
  };

  const selectedOption = avatarOptions.find((opt) => opt.id === selectedAvatar);

  return (
    <div className="flex items-center gap-4">
      {/* Frosted Avatar (hover blur -> clear + glow + micro pop) */}
      <div className="group relative">
        <div
          className="absolute -inset-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: "radial-gradient(circle, var(--accent-soft), transparent 60%)" }}
        />
        <Avatar
          className={cn(
            "w-20 h-20 border overflow-hidden",
            "border-black/10 dark:border-white/10",
            "shadow-sm dark:shadow-[0_18px_60px_rgba(0,0,0,0.55)]",
            "transition-all duration-300",
            "group-hover:scale-[1.06]"
          )}
        >
          {/* frost overlay */}
          <div className="absolute inset-0 pointer-events-none bg-white/25 dark:bg-white/5 backdrop-blur-[2px] opacity-100 group-hover:opacity-0 transition-opacity duration-300" />

          {selectedOption ? (
            <AvatarFallback className={cn(selectedOption.bgClass, "text-white dark:ring-1 dark:ring-white/10")}>
              <selectedOption.icon className="w-8 h-8 drop-shadow-sm" />
            </AvatarFallback>
          ) : (
            <AvatarFallback className="bg-muted/50 dark:bg-white/5 text-zinc-700 dark:text-zinc-200">
              <User className="w-8 h-8" />
            </AvatarFallback>
          )}
        </Avatar>
      </div>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" size="sm" className="border-black/10 dark:border-white/10">
            <Palette className="w-4 h-4 mr-2" />
            Choose Avatar
          </Button>
        </DialogTrigger>

        <DialogContent
          className="sm:max-w-md bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border border-black/10 dark:border-white/10"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-zinc-900 dark:text-zinc-50">
              Choose Your Avatar
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-4">
              Select an icon to represent you, or choose no avatar.
            </p>

            {/* No Avatar */}
            <button
              type="button"
              onClick={() => setTempSelection(null)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg border transition-all mb-4",
                "border-black/10 dark:border-white/10",
                tempSelection === null
                  ? "bg-[color:var(--accent-soft)]"
                  : "hover:bg-muted/40 dark:hover:bg-white/5"
              )}
            >
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-muted/50 dark:bg-white/5 text-zinc-700 dark:text-zinc-200">
                  <X className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>

              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">No Avatar</span>

              {tempSelection === null && <Check className="w-5 h-5 ml-auto" style={{ color: "var(--accent)" }} />}
            </button>

            {/* Grid */}
            <div className="grid grid-cols-4 gap-3">
              {avatarOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setTempSelection(option.id)}
                  className={cn(
                    "relative flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
                    "border-black/10 dark:border-white/10",
                    "hover:scale-[1.04] active:scale-[0.98]",
                    tempSelection === option.id ? "bg-[color:var(--accent-soft)]" : "hover:bg-muted/40 dark:hover:bg-white/5"
                  )}
                >
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className={cn(option.bgClass, "text-white dark:ring-1 dark:ring-white/10")}>
                      <option.icon className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-zinc-600 dark:text-zinc-300">{option.label}</span>

                  {tempSelection === option.id && (
                    <div
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: "var(--accent)" }}
                    >
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="border-black/10 dark:border-white/10">
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
