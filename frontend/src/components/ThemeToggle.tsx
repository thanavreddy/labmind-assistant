import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="fixed top-3 right-4 z-50 h-9 w-9 rounded-lg border border-border bg-card hover:bg-muted transition-all duration-300"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4 text-foreground transition-transform duration-300" />
      ) : (
        <Sun className="h-4 w-4 text-foreground transition-transform duration-300" />
      )}
    </Button>
  );
};

export default ThemeToggle;
