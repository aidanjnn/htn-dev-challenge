"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import LoginModal from "./LoginModal";

/**
 * Top navigation bar.
 * Shows the app title and a login/logout button.
 * When "Log In" is clicked, the LoginModal opens.
 */
export default function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <a href="/" className="text-xl font-bold tracking-tight">
            HTN Events
          </a>
          <div className="flex items-center gap-3">
            {isLoggedIn && (
              <span className="hidden text-sm text-zinc-500 dark:text-zinc-400 sm:inline">
                Welcome, hacker
              </span>
            )}
            {isLoggedIn ? (
              <button
                onClick={logout}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Log Out
              </button>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Log In
              </button>
            )}
          </div>
        </div>
      </nav>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}
