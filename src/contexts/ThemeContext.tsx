import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserPreferences } from "@/hooks/useUserPreferences";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({ theme: "light", toggleTheme: () => {} });

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const { preferences, updateTheme: updateThemeInDB } = useUserPreferences(userId);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme") as Theme | null;
      if (stored) return stored;
    }
    return "light";
  });
  const persistingRef = useRef(false);

  // Restore theme from database when preferences load
  useEffect(() => {
    if (preferences?.theme && theme !== preferences.theme) {
      setTheme(preferences.theme);
    }
  }, [preferences?.theme]);

  // Update UI and persist theme
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);

    // Persist to database if user is logged in and not already persisting
    if (userId && !persistingRef.current) {
      persistingRef.current = true;
      updateThemeInDB(theme)
        .then(() => {
          persistingRef.current = false;
        })
        .catch(err => {
          console.error("[ThemeProvider] Failed to persist theme:", err);
          persistingRef.current = false;
        });
    }
  }, [theme, userId, updateThemeInDB]);

  // Keyboard shortcut: "m" to toggle (only when not typing in an input)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "m" && !["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName) && !(e.target as HTMLElement)?.isContentEditable) {
        setTheme(prev => prev === "light" ? "dark" : "light");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const toggleTheme = () => setTheme(prev => prev === "light" ? "dark" : "light");

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
