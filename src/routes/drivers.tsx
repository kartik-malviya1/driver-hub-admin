import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Filter, Users, Inbox } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AppHeader } from "@/components/AppHeader";
import { DriverCard } from "@/components/DriverCard";
import { PendingDriverCard } from "@/components/PendingDriverCard";
import { drivers } from "@/data/drivers";
import { cn } from "@/lib/utils";

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

type Tab = "approved" | "pending";

function DriversPage() {
  const [tab, setTab] = useState<Tab>("approved");
  const [query, setQuery] = useState("");
  const [pendingIds, setPendingIds] = useState(() =>
    drivers.filter((d) => d.status === "pending").map((d) => d.id),
  );

  const approved = useMemo(
    () =>
      drivers.filter(
        (d) =>
          d.status === "approved" &&
          (query === "" ||
            d.name.toLowerCase().includes(query.toLowerCase()) ||
            d.vehicleNumber.toLowerCase().includes(query.toLowerCase())),
      ),
    [query],
  );

  const pending = useMemo(
    () =>
      drivers.filter(
        (d) =>
          pendingIds.includes(d.id) &&
          (query === "" ||
            d.name.toLowerCase().includes(query.toLowerCase()) ||
            d.vehicleNumber.toLowerCase().includes(query.toLowerCase())),
      ),
    [query, pendingIds],
  );

  const handleResolve = (id: string) => {
    setPendingIds((prev) => prev.filter((x) => x !== id));
  };

  return (
    <AppShell>
      <AppHeader title="Driver Data" subtitle="Review applications and manage active drivers." />
      <main className="flex-1 px-6 lg:px-10 py-8 space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-muted/70 border border-border w-fit">
            {[
              { key: "approved" as const, label: "Approved", count: approved.length },
              { key: "pending" as const, label: "Pending", count: pending.length },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "relative inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all",
                  tab === t.key
                    ? "bg-card text-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t.label}
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
              </button>
            ))}
          </div>

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
        </div>

        {tab === "approved" ? (
          approved.length > 0 ? (
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
          )
        ) : pending.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {pending.map((d) => (
              <PendingDriverCard
                key={d.id}
                driver={d}
                onApprove={handleResolve}
                onReject={handleResolve}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Inbox}
            title="All caught up!"
            hint="No pending driver applications to review."
          />
        )}
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
