import {
  Home,
  MessageSquare,
  ClipboardCheck,
  FileEdit,
  LayoutDashboard,
  Users,
  FlaskConical,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "AI Assistant", url: "/assistant", icon: MessageSquare },
  { title: "Concept Check", url: "/concept-check", icon: ClipboardCheck },
  { title: "Lab Record", url: "/lab-record", icon: FileEdit },
];

const dashItems = [
  { title: "Student Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Professor View", url: "/professor", icon: Users },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent className="py-4">
        {/* Brand */}
        <div className="px-4 mb-6 flex items-center gap-3">
          <FlaskConical className="h-6 w-6 text-primary shrink-0" />
          {!collapsed && (
            <span className="text-lg font-bold tracking-tight">LabMind</span>
          )}
        </div>

        {/* Progress indicator */}
        {!collapsed && (
          <div className="px-4 mb-6">
            <div className="glass-card p-3 space-y-2">
              <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
                Lab Flow
              </p>
              <div className="flex items-center gap-1">
                {["Learn", "Verify", "Record"].map((step, i) => (
                  <div key={step} className="flex items-center gap-1">
                    <div
                      className={`h-6 px-2 rounded flex items-center justify-center text-[10px] font-mono tracking-wide ${
                        i === 0
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step}
                    </div>
                    {i < 2 && (
                      <div className="w-3 h-px bg-border" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={`transition-all duration-200 ${
                        isActive(item.url)
                          ? "bg-primary/10 text-primary sapphire-glow"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                      activeClassName=""
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
            Dashboards
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dashItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`transition-all duration-200 ${
                        isActive(item.url)
                          ? "bg-primary/10 text-primary sapphire-glow"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                      activeClassName=""
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!collapsed && (
          <div className="glass-card p-3">
            <p className="font-mono text-[10px] text-muted-foreground tracking-wider">
              v1.0 — CS Department
            </p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
