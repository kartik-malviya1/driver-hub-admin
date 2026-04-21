import { Link, useLocation, useRouter } from "@tanstack/react-router";
import { LayoutDashboard, Users, LogOut, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { title: "Overview", to: "/", icon: LayoutDashboard },
  { title: "Driver Data", to: "/drivers", icon: Users },
] as const;

export function AppSidebar() {
  const { pathname } = useLocation();
  const router = useRouter();

  const handleLogout = () => {
    router.navigate({ to: "/" });
  };

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-sidebar">
      <div className="flex h-16 items-center gap-2.5 px-6 border-b border-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-pop">
          <Zap className="h-5 w-5" strokeWidth={2.5} />
        </div>
        <div>
          <p className="font-display font-bold text-base leading-none tracking-tight">Rideflow</p>
          <p className="text-xs text-muted-foreground mt-0.5">Admin Console</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Main
        </p>
        {items.map((item) => {
          const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-soft"
                  : "text-foreground/70 hover:text-foreground hover:bg-muted",
              )}
            >
              <Icon className={cn("h-[18px] w-[18px]", active && "text-primary")} />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/70 hover:text-destructive hover:bg-destructive/5 transition-all"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Logout
        </button>
      </div>
    </aside>
  );
}
