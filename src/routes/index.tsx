import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
import { VehicleBadge } from "@/components/VehicleBadge";
import { fetchStats, fetchDrivers } from "@/lib/api";
import { type Driver, type VehicleType } from "@/data/drivers";

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
  const [stats, setStats] = useState<any>(null);
  const [recentDrivers, setRecentDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [s, d] = await Promise.all([fetchStats(), fetchDrivers()]);
        setStats(s);
        
        // Map recent drivers
        const mapped: Driver[] = d.slice(0, 5).map((d: any) => ({
          id: String(d.id),
          name: d.name,
          photo: d.photoUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(d.name),
          vehicleNumber: d.vehicleNumber || "N/A",
          vehicleType: (d.vehicleType as VehicleType) || "Petrol",
          registrationDate: new Date(d.created_at).toLocaleDateString(),
          status: d.isApproved ? "approved" : "pending",
          phone: d.phoneNumber,
          documents: { license: "", rc: "", id: "" },
          trips: 0, // Placeholder
        }));
        setRecentDrivers(mapped);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <AppShell>
        <AppHeader title="Overview" subtitle="Loading your dashboard..." />
        <main className="flex-1 px-6 lg:px-10 py-8">
           <div className="animate-pulse space-y-8">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
               {[...Array(6)].map((_, i) => (
                 <div key={i} className="h-32 bg-muted rounded-2xl" />
               ))}
             </div>
             <div className="h-64 bg-muted rounded-2xl" />
           </div>
        </main>
      </AppShell>
    );
  }

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
            value={stats?.activeDrivers || 0}
            icon={UserCheck}
            tone="success"
            delta={{ value: "+0%", positive: true }}
            hint="vs last week"
          />
          <StatCard
            title="Non-Active Drivers"
            value={stats?.inactiveDrivers || 0}
            icon={UserX}
            tone="destructive"
            delta={{ value: "-0%", positive: true }}
            hint="vs last week"
          />
          <StatCard
            title="Drivers Registered"
            value={stats?.registered || 0}
            icon={Users}
            tone="primary"
            delta={{ value: "+0", positive: true }}
            hint="this month"
          />
          <StatCard
            title="Registrations Pending"
            value={stats?.pending || 0}
            icon={Clock}
            tone="warning"
            hint="awaiting review"
          />
          <StatCard
            title="Trips Completed"
            value={stats?.tripsCompleted || 0}
            icon={RouteIcon}
            tone="info"
            delta={{ value: "+0%", positive: true }}
            hint="vs last week"
          />
          <StatCard
            title="Revenue (this week)"
            value={`₹${stats?.revenueK || 0}K`}
            icon={TrendingUp}
            tone="primary"
            delta={{ value: "+0%", positive: true }}
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
            {recentDrivers.map((d) => (
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
