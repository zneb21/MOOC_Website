import { useTheme } from "@/contexts/ThemeContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="bg-card rounded-2xl p-6 shadow-soft">
      <h2 className="font-display text-xl font-semibold text-foreground mb-6">
        Appearance
      </h2>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isDark ? (
            <Moon className="w-5 h-5 text-secondary" />
          ) : (
            <Sun className="w-5 h-5 text-gold" />
          )}
          <div>
            <Label htmlFor="theme-toggle" className="text-base font-medium cursor-pointer">
              Dark Mode
            </Label>
            <p className="text-sm text-muted-foreground">
              {isDark ? "Currently using dark theme" : "Currently using light theme"}
            </p>
          </div>
        </div>

        <Switch
          id="theme-toggle"
          checked={isDark}
          onCheckedChange={toggleTheme}
          className="data-[state=checked]:bg-primary"
        />
      </div>

      {/* Theme Preview */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => !isDark || toggleTheme()}
          className={`relative p-4 rounded-xl border-2 transition-all ${
            !isDark ? "border-primary" : "border-border hover:border-muted-foreground/50"
          }`}
        >
          <div className="bg-[hsl(40,30%,97%)] rounded-lg p-3 space-y-2">
            <div className="h-2 w-12 bg-[hsl(170,45%,28%)] rounded" />
            <div className="h-2 w-16 bg-[hsl(35,20%,88%)] rounded" />
            <div className="h-2 w-10 bg-[hsl(38,70%,55%)] rounded" />
          </div>
          <p className="text-xs font-medium text-foreground mt-2">Light</p>
          {!isDark && (
            <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
              <Sun className="w-2.5 h-2.5 text-primary-foreground" />
            </div>
          )}
        </button>

        <button
          type="button"
          onClick={() => isDark || toggleTheme()}
          className={`relative p-4 rounded-xl border-2 transition-all ${
            isDark ? "border-primary" : "border-border hover:border-muted-foreground/50"
          }`}
        >
          <div className="bg-[hsl(25,25%,10%)] rounded-lg p-3 space-y-2">
            <div className="h-2 w-12 bg-[hsl(170,40%,45%)] rounded" />
            <div className="h-2 w-16 bg-[hsl(25,15%,20%)] rounded" />
            <div className="h-2 w-10 bg-[hsl(38,60%,50%)] rounded" />
          </div>
          <p className="text-xs font-medium text-foreground mt-2">Dark</p>
          {isDark && (
            <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
              <Moon className="w-2.5 h-2.5 text-primary-foreground" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default ThemeToggle;