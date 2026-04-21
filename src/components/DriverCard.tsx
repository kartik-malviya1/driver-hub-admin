import { CheckCircle2, Calendar, MoreVertical, Star, Hash } from "lucide-react";
import type { Driver } from "@/data/drivers";
import { VehicleBadge } from "./VehicleBadge";

export function DriverCard({ driver }: { driver: Driver }) {
  return (
    <article className="group rounded-2xl bg-card border border-border p-5 shadow-soft hover:shadow-card hover:border-primary/30 transition-all hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success">
          <CheckCircle2 className="h-3 w-3" strokeWidth={2.5} />
          Approved
        </div>
        <button className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <img
          src={driver.photo}
          alt={driver.name}
          loading="lazy"
          width={56}
          height={56}
          className="h-14 w-14 rounded-xl object-cover ring-2 ring-card shadow-soft"
        />
        <div className="min-w-0">
          <h3 className="font-display font-semibold text-base leading-tight truncate">
            {driver.name}
          </h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            <Hash className="h-3 w-3" />
            {driver.id}
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-muted/60 p-3 mb-4">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
          Vehicle Number
        </p>
        <p className="font-mono font-semibold text-sm text-foreground mt-1">
          {driver.vehicleNumber}
        </p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <VehicleBadge type={driver.vehicleType} />
        {driver.rating && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-foreground">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" />
            {driver.rating.toFixed(2)}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs border-t border-border pt-3">
        <div>
          <p className="text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" /> Registered
          </p>
          <p className="font-medium text-foreground mt-0.5">{driver.registrationDate}</p>
        </div>
        <div>
          <p className="text-muted-foreground flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Approved
          </p>
          <p className="font-medium text-foreground mt-0.5">{driver.approvalDate}</p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button className="flex-1 h-9 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition shadow-soft">
          View details
        </button>
        <button className="h-9 px-3 rounded-xl border border-border text-xs font-semibold text-foreground/80 hover:bg-muted transition">
          Disable
        </button>
      </div>
    </article>
  );
}
