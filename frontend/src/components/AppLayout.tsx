import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="h-14 flex items-center border-b border-border px-4 glass-card">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="ml-4 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-glow-pulse" />
              <span className="font-mono text-xs text-muted-foreground tracking-wider uppercase">LabMind</span>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
