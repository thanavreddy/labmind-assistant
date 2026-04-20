/**
 * AppLayout.tsx
 *
 * Full-page shell with a PayPal-style sidebar.
 * The sidebar is self-contained here — role-based nav, profile footer, logout.
 * AppSidebar.tsx is no longer used.
 */

import { ReactNode, useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import {
  Home,
  FlaskConical,
  FileEdit,
  Users,
  LayoutDashboard,
  UserCircle,
  LogOut,
  ChevronRight,
  Menu,
  X,
  BookOpen,
  ClipboardCheck,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  /** If true, shows a right chevron (cosmetic — routes remain the same) */
  expandable?: boolean;
}

// ─── Role-based nav definitions ───────────────────────────────────────────────

const studentNav: NavItem[] = [
  { label: "Home",          href: "/student-dashboard", icon: Home },
  { label: "Lab Records",   href: "/lab-record",        icon: FileEdit,       expandable: true },
  { label: "AI Assistant",  href: "/assistant",          icon: MessageSquare,  expandable: true },
  { label: "Concept Check", href: "/concept-check",     icon: ClipboardCheck },
];

const facultyNav: NavItem[] = [
  { label: "Dashboard",    href: "/faculty-dashboard",    icon: LayoutDashboard },
  { label: "Courses",      href: "/faculty-courses",      icon: BookOpen,        expandable: true },
  { label: "Experiments",  href: "/faculty-experiments",  icon: FlaskConical,    expandable: true },
  { label: "Students",     href: "/faculty-students",     icon: Users },
  { label: "Submissions",  href: "/faculty-submissions",  icon: ClipboardCheck },
];

const sharedNav: NavItem[] = [
  { label: "My Profile",   href: "/profile",    icon: UserCircle },
];

// ─── Single nav link ─────────────────────────────────────────────────────────

function SideNavItem({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
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

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function Sidebar({ collapsed, onClose }: { collapsed: boolean; onClose?: () => void }) {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const dashboardLink = user 
    ? (role === "faculty" ? "/faculty-dashboard" : "/student-dashboard")
    : "/";

  const navItems = role === "faculty" ? facultyNav : studentNav;

  const displayName =
    user?.user_metadata?.full_name as string | undefined ??
    user?.email?.split("@")[0] ??
    "User";

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
        {/* Role nav */}
        {navItems.map((item) => (
          <SideNavItem key={item.href + item.label} item={item} collapsed={collapsed} />
        ))}

        {/* Divider */}
        <div className="my-3 mx-2 h-px bg-border" />

        {/* Shared nav (profile and assistant) */}
        {sharedNav.map((item) => (
          <SideNavItem key={item.href} item={item} collapsed={collapsed} />
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
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold select-none">
            {initials}
            {/* Role badge */}
            <span
              className={cn(
                "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card",
                role === "faculty" ? "bg-amber-400" : "bg-emerald-400"
              )}
            />
          </div>

          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-foreground leading-tight">
                {displayName}
              </p>
              <p className="truncate text-[11px] text-muted-foreground leading-tight">
                {role === "faculty" ? "Faculty" : "Student"}
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

// ─── AppLayout ────────────────────────────────────────────────────────────────

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex w-full bg-background">

      {/* ── Desktop sidebar ──────────────────────────────────────────────── */}
      <div className="hidden md:flex md:flex-col md:shrink-0 md:h-screen md:sticky md:top-0">
        <Sidebar collapsed={collapsed} />
      </div>

      {/* ── Mobile sidebar overlay ───────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 flex md:hidden"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <div className="relative z-50 flex h-full flex-col">
            <Sidebar collapsed={false} onClose={() => setMobileOpen(false)} />
          </div>
          {/* Close button */}
          <button
            className="absolute top-4 right-4 z-50 rounded-lg p-1.5 text-white/80 hover:text-white"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col min-h-screen min-w-0">

        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/90 backdrop-blur-md px-4">

          {/* Collapse toggle (desktop) */}
          <button
            className="hidden md:flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu className="h-4 w-4" />
          </button>

          {/* Hamburger (mobile) */}
          <button
            className="flex md:hidden items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>

          {/* App pulse indicator */}
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-[11px] text-muted-foreground tracking-wider uppercase hidden sm:inline">
              LabMind
            </span>
          </div>

          {/* Right side: theme toggle */}
          <div className="ml-auto flex items-center">
            <ThemeToggle />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
