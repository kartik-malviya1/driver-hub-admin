import { Bell, Search } from "lucide-react";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
}

export function AppHeader({ title, subtitle }: AppHeaderProps) {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border bg-background/80 backdrop-blur px-6 lg:px-10 py-5 sticky top-0 z-10">
      <div>
        <h1 className="font-display text-2xl lg:text-[28px] font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search drivers, vehicles…"
            className="h-10 w-72 rounded-xl border border-border bg-card pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary/40 transition"
          />
        </div>
        <button className="relative h-10 w-10 rounded-xl border border-border bg-card flex items-center justify-center hover:bg-muted transition shadow-soft">
          <Bell className="h-[18px] w-[18px] text-foreground/70" />
          <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />
        </button>
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center font-semibold text-sm shadow-pop">
          AS
        </div>
      </div>
    </header>
  );
}
