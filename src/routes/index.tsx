import { createFileRoute } from "@tanstack/react-router";
import {
  UserCheck,
  UserX,
  Users,
  Clock,
  Route as RouteIcon,
  TrendingUp,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AppHeader } from "@/components/AppHeader";
import { StatCard } from "@/components/StatCard";
import { stats, drivers } from "@/data/drivers";
import { VehicleBadge } from "@/components/VehicleBadge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview — Sawari Auto Admin" },
      {
        name: "description",
        content: "Driver and trip overview for the Sawari Auto ride-sharing admin console.",
      },
    ],
  }),
  component: OverviewPage,
});

function OverviewPage() {
  const recent = drivers.slice(0, 5);

  return (
    <AppShell>
      <AppHeader
        title="Overview"
        subtitle="Welcome back — here's what's happening with your fleet today."
      />
      <main className="flex-1 px-6 lg:px-10 py-8 space-y-8">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <StatCard
            title="Active Drivers"
            value={stats.activeDrivers}
            icon={UserCheck}
            tone="success"
            delta={{ value: "+12.4%", positive: true }}
            hint="vs last week"
          />
          <StatCard
            title="Non-Active Drivers"
            value={stats.inactiveDrivers}
            icon={UserX}
            tone="destructive"
            delta={{ value: "-3.1%", positive: true }}
            hint="vs last week"
          />
          <StatCard
            title="Drivers Registered"
            value={stats.registered}
            icon={Users}
            tone="primary"
            delta={{ value: "+18", positive: true }}
            hint="this month"
          />
          <StatCard
            title="Registrations Pending"
            value={stats.pending}
            icon={Clock}
            tone="warning"
            hint="awaiting review"
          />
          <StatCard
            title="Trips Completed"
            value={stats.tripsCompleted}
            icon={RouteIcon}
            tone="info"
            delta={{ value: "+8.7%", positive: true }}
            hint="vs last week"
          />
          <StatCard
            title="Revenue (this week)"
            value={`₹${stats.revenueK}K`}
            icon={TrendingUp}
            tone="primary"
            delta={{ value: "+22%", positive: true }}
            hint="vs last week"
          />
        </section>

        <section className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <div>
              <h2 className="font-display font-bold text-lg tracking-tight">Recent Drivers</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Latest approved drivers on the platform
              </p>
            </div>
          </div>
          <div className="divide-y divide-border">
            {recent.map((d) => (
              <div
                key={d.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-muted/40 transition"
              >
                <img
                  src={d.photo}
                  alt={d.name}
                  loading="lazy"
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{d.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{d.vehicleNumber}</p>
                </div>
                <VehicleBadge type={d.vehicleType} />
                <div className="hidden md:block text-right text-xs">
                  <p className="text-muted-foreground">Trips</p>
                  <p className="font-semibold tabular-nums">{d.trips?.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </AppShell>
  );
}
