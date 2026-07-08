"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { classNames } from "../../utils/helpers";

const CITIZEN_LINKS = [
  { href: "/dashboard", label: "Overview", icon: "📊" },
  { href: "/report", label: "Report an issue", icon: "📝" },
  { href: "/complaints", label: "All complaints", icon: "🗂️" },
  { href: "/notifications", label: "Notifications", icon: "🔔" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

const AUTHORITY_LINKS = [
  { href: "/dashboard", label: "Control room", icon: "📊" },
  { href: "/complaints", label: "Manage complaints", icon: "🗂️" },
  { href: "/notifications", label: "Notifications", icon: "🔔" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const links = user?.role === "authority" ? AUTHORITY_LINKS : CITIZEN_LINKS;

  return (
    <aside className="hidden w-56 shrink-0 border-r border-surface-border px-3 py-6 md:block dark:border-darksurface-border">
      <nav className="space-y-1">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={classNames(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
                active
                  ? "bg-civic-50 text-civic-600"
                  : "text-ink-muted hover:bg-surface-sunk dark:hover:bg-darksurface-raised"
              )}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
