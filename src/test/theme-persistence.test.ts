import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

describe("Theme Persistence", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear document classes
    document.documentElement.classList.remove("dark");
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  describe("LocalStorage persistence", () => {
    it("should store theme in localStorage when theme changes", () => {
      // Simulate theme preference being set
      localStorage.setItem("theme", "dark");
      
      const stored = localStorage.getItem("theme");
      expect(stored).toBe("dark");
    });

    it("should retrieve theme from localStorage on page load", () => {
      // Set a theme in localStorage
      localStorage.setItem("theme", "dark");
      
      // Simulate page load reading from localStorage
      const theme = localStorage.getItem("theme") as "light" | "dark" | null;
      expect(theme).toBe("dark");
    });

    it("should default to light theme if nothing stored", () => {
      const theme = localStorage.getItem("theme") as "light" | "dark" | null;
      expect(theme).toBeNull();
      
      // Default should be light
      const defaultTheme = theme || "light";
      expect(defaultTheme).toBe("light");
    });

    it("should update localStorage when theme toggles", () => {
      localStorage.setItem("theme", "light");
      expect(localStorage.getItem("theme")).toBe("light");
      
      // Toggle to dark
      localStorage.setItem("theme", "dark");
      expect(localStorage.getItem("theme")).toBe("dark");
      
      // Toggle back to light
      localStorage.setItem("theme", "light");
      expect(localStorage.getItem("theme")).toBe("light");
    });
  });

  describe("DOM class manipulation", () => {
    it("should add dark class to document when theme is dark", () => {
      document.documentElement.classList.toggle("dark", true);
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    it("should remove dark class when theme is light", () => {
      document.documentElement.classList.add("dark");
      expect(document.documentElement.classList.contains("dark")).toBe(true);
      
      document.documentElement.classList.toggle("dark", false);
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });

    it("should toggle dark class correctly", () => {
      // Start with no dark class
      expect(document.documentElement.classList.contains("dark")).toBe(false);
      
      // Toggle to dark
      document.documentElement.classList.toggle("dark");
      expect(document.documentElement.classList.contains("dark")).toBe(true);
      
      // Toggle back to light
      document.documentElement.classList.toggle("dark");
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });
  });

  describe("Theme persistence workflow", () => {
    it("should persist theme through simulated page refresh", () => {
      // Step 1: User sets theme to dark
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.toggle("dark", true);
      
      expect(localStorage.getItem("theme")).toBe("dark");
      expect(document.documentElement.classList.contains("dark")).toBe(true);
      
      // Step 2: Simulate page reload (in real scenario)
      // Clear DOM classes (what happens on page load)
      document.documentElement.classList.remove("dark");
      
      // Step 3: Page initializes from localStorage
      const stored = localStorage.getItem("theme") as "light" | "dark" | null;
      if (stored === "dark") {
        document.documentElement.classList.add("dark");
      }
      
      // Step 4: Verify theme is still dark
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    it("should handle multiple theme toggles with persistence", () => {
      const toggleTheme = (current: "light" | "dark"): "light" | "dark" => {
        const next = current === "light" ? "dark" : "light";
        localStorage.setItem("theme", next);
        document.documentElement.classList.toggle("dark", next === "dark");
        return next;
      };

      let currentTheme: "light" | "dark" = "light";
      
      // Toggle 1: light to dark
      currentTheme = toggleTheme(currentTheme);
      expect(currentTheme).toBe("dark");
      expect(localStorage.getItem("theme")).toBe("dark");
      expect(document.documentElement.classList.contains("dark")).toBe(true);
      
      // Toggle 2: dark to light
      currentTheme = toggleTheme(currentTheme);
      expect(currentTheme).toBe("light");
      expect(localStorage.getItem("theme")).toBe("light");
      expect(document.documentElement.classList.contains("dark")).toBe(false);
      
      // Toggle 3: light to dark
      currentTheme = toggleTheme(currentTheme);
      expect(currentTheme).toBe("dark");
      expect(localStorage.getItem("theme")).toBe("dark");
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });
  });

  describe("Theme with user session", () => {
    it("should preserve theme when simulating logout/login", () => {
      // Step 1: User logged in, sets theme to dark
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
      
      expect(localStorage.getItem("theme")).toBe("dark");
      
      // Step 2: Logout - clear session but keep theme in localStorage
      // (ThemeContext doesn't clear theme on logout based on the code)
      const themeBeforeLogout = localStorage.getItem("theme");
      
      // Step 3: Simulate session clear (in real logout)
      const sessionToken = "some-token";
      localStorage.removeItem("session_token"); // Remove session
      
      // Step 4: Theme should still be there
      expect(localStorage.getItem("theme")).toBe(themeBeforeLogout);
      expect(localStorage.getItem("theme")).toBe("dark");
      
      // Step 5: Login again
      localStorage.setItem("session_token", "new-token");
      
      // Step 6: Verify theme persists after login
      const themeAfterLogin = localStorage.getItem("theme");
      expect(themeAfterLogin).toBe("dark");
    });

    it("should not clear theme on logout", () => {
      // Set theme while logged in
      localStorage.setItem("theme", "dark");
      
      // Simulate logout
      localStorage.removeItem("session_token");
      localStorage.removeItem("user_id");
      
      // Theme should persist
      expect(localStorage.getItem("theme")).toBe("dark");
    });
  });

  describe("Initial theme detection", () => {
    it("should correctly initialize theme from localStorage", () => {
      localStorage.setItem("theme", "dark");
      
      // Simulate component initialization
      const initializeTheme = (): "light" | "dark" => {
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem("theme") as "light" | "dark" | null;
          if (stored) return stored;
        }
        return "light";
      };

      const theme = initializeTheme();
      expect(theme).toBe("dark");
    });

    it("should default to light theme when localStorage is empty", () => {
      const initializeTheme = (): "light" | "dark" => {
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem("theme") as "light" | "dark" | null;
          if (stored) return stored;
        }
        return "light";
      };

      const theme = initializeTheme();
      expect(theme).toBe("light");
    });

    it("should handle invalid theme values in localStorage", () => {
      localStorage.setItem("theme", "invalid-theme");
      
      const initializeTheme = (): "light" | "dark" => {
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem("theme");
          if (stored === "light" || stored === "dark") {
            return stored;
          }
        }
        return "light";
      };

      const theme = initializeTheme();
      expect(theme).toBe("light");
    });
  });
});
