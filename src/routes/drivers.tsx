import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, Filter, Users, Inbox, UserPlus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AppHeader } from "@/components/AppHeader";
import { DriverCard } from "@/components/DriverCard";
import { PendingDriverCard } from "@/components/PendingDriverCard";
import { RegisterDriverForm } from "@/components/RegisterDriverForm";
import { type Driver, type VehicleType, type DriverStatus } from "@/data/drivers";
import { cn } from "@/lib/utils";
import { fetchDrivers, approveDriver } from "@/lib/api";

export const Route = createFileRoute("/drivers")({
  head: () => ({
    meta: [
      { title: "Driver Data — Sawari Auto Admin" },
      {
        name: "description",
        content: "Manage approved and pending drivers on the Sawari Auto platform.",
      },
    ],
  }),
  component: DriversPage,
});

type Tab = "approved" | "pending" | "register";

function DriversPage() {
  const [tab, setTab] = useState<Tab>("approved");
  const [query, setQuery] = useState("");
  const [allDrivers, setAllDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const raw = await fetchDrivers();
        const mapped: Driver[] = raw.map((d: any) => ({
          id: String(d.id),
          name: d.name,
          photo: d.photoUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(d.name),
          vehicleNumber: d.vehicleNumber || "N/A",
          vehicleType: (d.vehicleType as VehicleType) || "Petrol",
          registrationDate: new Date(d.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          status: d.isApproved ? "approved" : "pending" as DriverStatus,
          phone: d.phoneNumber,
          documents: {
            license: d.licensePhotoUrl || "",
            rc: d.rcPhotoUrl || "",
            id: d.AadhaarCardPhotoUrl || "",
          },
        }));
        setAllDrivers(mapped);
      } catch (err) {
        console.error("Failed to load drivers:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const matchesQuery = (d: Driver) =>
    query === "" ||
    d.name.toLowerCase().includes(query.toLowerCase()) ||
    d.vehicleNumber.toLowerCase().includes(query.toLowerCase());

  const approved = useMemo(
    () => allDrivers.filter((d) => d.status === "approved" && matchesQuery(d)),
    [allDrivers, query],
  );

  const pending = useMemo(
    () => allDrivers.filter((d) => d.status === "pending" && matchesQuery(d)),
    [allDrivers, query],
  );

  const handleApprove = async (id: string) => {
    try {
      await approveDriver(parseInt(id));
      setAllDrivers(prev => prev.map(d => d.id === id ? { ...d, status: 'approved' } : d));
    } catch (err) {
      alert("Failed to approve driver");
    }
  };

  const handleRegister = (driver: Driver) => {
    setAllDrivers((prev) => [driver, ...prev]);
    setTab("pending");
  };

  return (
    <AppShell>
      <AppHeader title="Driver Data" subtitle="Review applications and manage active drivers." />
      <main className="flex-1 px-6 lg:px-10 py-8 space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-muted/70 border border-border w-fit">
            {[
              { key: "approved" as const, label: "Approved", count: approved.length, icon: null },
              { key: "pending" as const, label: "Pending", count: pending.length, icon: null },
              { key: "register" as const, label: "Register Driver", count: null, icon: UserPlus },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "relative inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all",
                  tab === t.key
                    ? t.key === "register"
                      ? "bg-foreground text-background shadow-soft"
                      : "bg-card text-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t.icon && <t.icon className="h-4 w-4" strokeWidth={2.5} />}
                {t.label}
                {t.count !== null && (
                  <span
                    className={cn(
                      "rounded-full text-[11px] font-bold px-1.5 min-w-[20px] text-center",
                      tab === t.key
                        ? t.key === "pending"
                          ? "bg-warning-soft text-warning"
                          : "bg-success-soft text-success"
                        : "bg-muted-foreground/15 text-muted-foreground",
                    )}
                  >
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {tab !== "register" && (
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name or vehicle…"
                  className="h-10 w-full sm:w-72 rounded-xl border border-border bg-card pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary/40 transition"
                />
              </div>
              <button className="h-10 px-3 rounded-xl border border-border bg-card text-sm font-medium text-foreground/80 hover:bg-muted transition flex items-center gap-2 shadow-soft">
                <Filter className="h-4 w-4" />
                Filter
              </button>
            </div>
          )}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground animate-pulse">Loading drivers...</p>
          </div>
        )}

        {!loading && tab === "approved" &&
          (approved.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
              {approved.map((d) => (
                <DriverCard key={d.id} driver={d} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="No approved drivers found"
              hint="Try adjusting your search or filters."
            />
          ))}

        {!loading && tab === "pending" &&
          (pending.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {pending.map((d) => (
                <PendingDriverCard
                  key={d.id}
                  driver={d}
                  onApprove={handleApprove}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Inbox}
              title="All caught up!"
              hint="No pending driver applications to review."
            />
          ))}

        {tab === "register" && <RegisterDriverForm onRegister={handleRegister} />}
      </main>
    </AppShell>
  );
}

function EmptyState({
  icon: Icon,
  title,
  hint,
}: {
  icon: typeof Users;
  title: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
      <div className="mx-auto h-14 w-14 rounded-2xl bg-primary-soft text-primary flex items-center justify-center mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-display font-semibold text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{hint}</p>
    </div>
  );
}
