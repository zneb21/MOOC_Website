import { useTheme } from "@/contexts/ThemeContext";
import { Label } from "@/components/ui/label";
import { Moon, Sun } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-2">
      <Label htmlFor="theme-select" className="flex items-center gap-2">
        <Sun className="w-4 h-4" />
        <Moon className="w-4 h-4" />
        Theme
      </Label>
      <Select value={theme} onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}>
        <SelectTrigger id="theme-select" className="h-12">
          <SelectValue placeholder="Select theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        Choose how you prefer the website to look
      </p>
    </div>
  );
};

export default ThemeToggle;
