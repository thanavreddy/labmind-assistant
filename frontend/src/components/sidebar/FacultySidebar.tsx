/**
 * FacultySidebar.tsx
 * 
 * Faculty-specific sidebar with navigation items for course management,
 * experiment oversight, student monitoring, and submission reviews.
 * Mirrors the design and styling of the student sidebar.
 */

import { ReactNode } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  FlaskConical,
  Users,
  ClipboardCheck,
  Bot,
  User,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  expandable?: boolean;
}

// ─── Faculty Navigation Items ─────────────────────────────────────────────────

const facultyNav: NavItem[] = [
  { label: "Dashboard",    href: "/faculty-dashboard",    icon: LayoutDashboard },
  { label: "Courses",      href: "/faculty-courses",      icon: BookOpen,        expandable: true },
  { label: "Experiments",  href: "/faculty-experiments",  icon: FlaskConical,    expandable: true },
  { label: "Students",     href: "/faculty-students",     icon: Users },
  { label: "Submissions",  href: "/faculty-submissions",  icon: ClipboardCheck },
  { label: "AI Assistant", href: "/assistant",            icon: Bot },
];

const profileNav: NavItem[] = [
  { label: "Profile", href: "/profile", icon: User },
];

// ─── Navigation Item Component ────────────────────────────────────────────────

function NavItemComponent({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  return (
    <NavLink
      to={item.href}
      end={item.href === "/"}
      className={({ isActive }) =>
        cn(
          "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 select-none",
          isActive
            ? "bg-primary/10 text-primary dark:bg-primary/15 dark:text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-muted/60"
        )
      }
    >
      {({ isActive }) => (
        <>
          <item.icon
            className={cn(
              "h-[18px] w-[18px] shrink-0 transition-colors",
              isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
            )}
          />
          {!collapsed && (
            <span className="flex-1 truncate">{item.label}</span>
          )}
          {!collapsed && item.expandable && (
            <ChevronRight
              className={cn(
                "h-3.5 w-3.5 shrink-0 opacity-40 transition-transform",
                isActive && "opacity-70"
              )}
            />
          )}
        </>
      )}
    </NavLink>
  );
}

// ─── Faculty Sidebar Component ────────────────────────────────────────────────

interface FacultySidebarProps {
  collapsed: boolean;
}

export function FacultySidebarContent({ collapsed }: FacultySidebarProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const dashboardLink = user ? "/faculty-dashboard" : "/";

  const displayName =
    user?.user_metadata?.full_name as string | undefined ??
    user?.email?.split("@")[0] ??
    "Faculty";

  const initials = displayName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-background border-r border-border transition-all duration-200",
        collapsed ? "w-[68px]" : "w-[240px]"
      )}
    >
      {/* ── Brand ──────────────────────────────────────────────────────── */}
      <div className={cn("flex items-center gap-2.5 px-4 py-5 shrink-0", collapsed && "justify-center px-0")}>
        <Link to={dashboardLink} className={cn("flex items-center gap-2.5 hover:opacity-80 transition-opacity", collapsed && "justify-center")}>
          <FlaskConical className="h-5 w-5 text-primary" />
          {!collapsed && (
            <span className="text-lg font-bold tracking-tight text-foreground">LabMind</span>
          )}
        </Link>
      </div>

      {/* ── Main nav ───────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
        {/* Faculty nav */}
        {facultyNav.map((item) => (
          <NavItemComponent key={item.href + item.label} item={item} collapsed={collapsed} />
        ))}

        {/* Divider */}
        <div className="my-3 mx-2 h-px bg-border" />

        {/* Profile nav */}
        {profileNav.map((item) => (
          <NavItemComponent key={item.href} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* ── Profile footer ─────────────────────────────────────────────── */}
      <div className="shrink-0 border-t border-border">
        {/* Avatar + info */}
        <div
          className={cn(
            "flex items-center gap-3 px-3 py-3",
            collapsed && "justify-center px-0"
          )}
        >
          {/* Avatar circle */}
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-amber-600 dark:text-amber-400 text-xs font-semibold select-none">
            {initials}
            {/* Faculty badge */}
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-amber-400" />
          </div>

          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-foreground leading-tight">
                {displayName}
              </p>
              <p className="truncate text-[11px] text-muted-foreground leading-tight">
                Faculty
              </p>
            </div>
          )}
        </div>

        {/* Logout */}
        <div className="px-2 pb-3">
          <button
            onClick={handleLogout}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-150",
              "hover:bg-destructive/10 hover:text-destructive",
              collapsed && "justify-center"
            )}
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Log out</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
