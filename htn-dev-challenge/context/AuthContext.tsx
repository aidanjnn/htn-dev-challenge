"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hardcoded credentials as required by the challenge spec
const VALID_USERNAME = "hacker";
const VALID_PASSWORD = "htn2026";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Restore session on mount
  useEffect(() => {
    const stored = sessionStorage.getItem("htn_auth");
    if (stored === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  function login(username: string, password: string): boolean {
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      setIsLoggedIn(true);
      sessionStorage.setItem("htn_auth", "true");
      return true;
    }
    return false;
  }

  function logout() {
    setIsLoggedIn(false);
    sessionStorage.removeItem("htn_auth");
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth state from any component.
 * Must be used within an <AuthProvider>.
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
