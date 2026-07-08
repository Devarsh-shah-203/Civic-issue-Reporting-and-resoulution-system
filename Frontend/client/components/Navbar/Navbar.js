"use client";

import { useState, useContext } from "react";
import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import { NotificationContext } from "../../context/NotificationContext";
import ThemeToggle from "../DarkMode/ThemeToggle";
import NotificationPanel from "../Notification/NotificationPanel";
import { getInitials } from "../../utils/helpers";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount } = useContext(NotificationContext) || { unreadCount: 0 };
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-surface-border bg-surface/90 backdrop-blur dark:border-darksurface-border dark:bg-darksurface/90">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-civic-600 font-display text-sm font-bold text-white">
            CP
          </span>
          <span className="font-display text-lg font-semibold text-ink dark:text-surface-sunk">
            CivicPulse
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <>
              <Link
                href="/report"
                className="hidden rounded-md bg-signal px-4 py-2 text-xs font-semibold text-ink hover:bg-signal-dark sm:block"
              >
                + Report an issue
              </Link>

              <div className="relative">
                <button
                  onClick={() => setPanelOpen((prev) => !prev)}
                  aria-label="Notifications"
                  className="relative flex h-9 w-9 items-center justify-center rounded-full border border-surface-border text-ink hover:bg-surface-sunk dark:border-darksurface-border dark:text-surface-sunk"
                >
                  🔔
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-urgent px-1 text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {panelOpen && <NotificationPanel onClose={() => setPanelOpen(false)} />}
              </div>

              <ThemeToggle />

              <Link href="/profile" className="flex h-9 w-9 items-center justify-center rounded-full bg-civic-600 text-xs font-semibold text-white">
                {getInitials(user?.name)}
              </Link>

              <button
                onClick={logout}
                className="hidden text-xs font-semibold text-ink-muted hover:text-urgent sm:block"
              >
                Log out
              </button>
            </>
          )}

          {!isAuthenticated && (
            <>
              <ThemeToggle />
              <Link
                href="/login"
                className="text-sm font-medium text-ink hover:text-civic-600 dark:text-surface-sunk"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-civic-600 px-4 py-2 text-sm font-semibold text-white hover:bg-civic-700"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
