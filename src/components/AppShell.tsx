import type { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen flex bg-background text-foreground font-sans antialiased overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">{children}</div>
    </div>
  );
}
