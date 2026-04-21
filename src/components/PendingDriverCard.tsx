import { Calendar, Phone, Clock, Check, X, FileText, IdCard, Car } from "lucide-react";
import type { Driver } from "@/data/drivers";
import { VehicleBadge } from "./VehicleBadge";

interface Props {
  driver: Driver;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const docMeta = [
  { key: "license", label: "Driving License", icon: IdCard },
  { key: "rc", label: "RC Document", icon: Car },
  { key: "id", label: "ID Proof", icon: FileText },
] as const;

export function PendingDriverCard({ driver, onApprove, onReject }: Props) {
  return (
    <article className="rounded-2xl bg-card border border-border shadow-soft hover:shadow-card transition-all overflow-hidden">
      <div className="p-6 flex flex-col lg:flex-row lg:items-start gap-6 border-b border-border">
        <div className="flex items-center gap-4">
          <img
            src={driver.photo}
            alt={driver.name}
            loading="lazy"
            width={72}
            height={72}
            className="h-[72px] w-[72px] rounded-2xl object-cover ring-4 ring-warning-soft shadow-soft"
          />
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-warning-soft px-2.5 py-1 text-[11px] font-semibold text-warning mb-1.5">
              <Clock className="h-3 w-3" strokeWidth={2.5} />
              Pending Review
            </div>
            <h3 className="font-display font-bold text-xl tracking-tight">{driver.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 font-mono">{driver.id}</p>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 lg:border-l lg:border-border lg:pl-6">
          <div>
            <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
              Vehicle Number
            </p>
            <p className="font-mono font-semibold text-sm mt-1">{driver.vehicleNumber}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
              Vehicle Type
            </p>
            <div className="mt-1">
              <VehicleBadge type={driver.vehicleType} />
            </div>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Registered
            </p>
            <p className="font-medium text-sm mt-1">{driver.registrationDate}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1">
              <Phone className="h-3 w-3" /> Contact
            </p>
            <p className="font-medium text-sm mt-1">{driver.phone}</p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-muted/30">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-display font-semibold text-sm">Uploaded Documents</h4>
          <span className="text-xs text-muted-foreground">3 of 3 submitted</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {docMeta.map(({ key, label, icon: Icon }) => (
            <div
              key={key}
              className="group relative rounded-xl bg-card border border-border overflow-hidden hover:border-primary/40 hover:shadow-soft transition cursor-pointer"
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={driver.documents[key]}
                  alt={label}
                  loading="lazy"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-3 flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-primary-soft text-primary flex items-center justify-center">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold leading-tight">{label}</p>
                  <p className="text-[10px] text-muted-foreground">Click to preview</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-4 flex flex-col sm:flex-row gap-3 border-t border-border">
        <button
          onClick={() => onReject?.(driver.id)}
          className="flex-1 h-11 rounded-xl border border-border bg-card text-sm font-semibold text-foreground/80 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30 transition flex items-center justify-center gap-2"
        >
          <X className="h-4 w-4" />
          Reject Application
        </button>
        <button
          onClick={() => onApprove?.(driver.id)}
          className="flex-1 h-11 rounded-xl bg-success text-success-foreground text-sm font-semibold hover:bg-success/90 transition shadow-soft flex items-center justify-center gap-2"
        >
          <Check className="h-4 w-4" strokeWidth={2.5} />
          Approve Driver
        </button>
      </div>
    </article>
  );
}
