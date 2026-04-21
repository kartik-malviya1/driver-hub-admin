import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "primary" | "success" | "warning" | "info" | "destructive";
  delta?: { value: string; positive?: boolean };
  hint?: string;
}

const toneStyles: Record<NonNullable<StatCardProps["tone"]>, string> = {
  primary: "bg-primary-soft text-primary",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  info: "bg-info-soft text-info",
  destructive: "bg-destructive/10 text-destructive",
};

export function StatCard({ title, value, icon: Icon, tone = "primary", delta, hint }: StatCardProps) {
  return (
    <div className="group relative rounded-2xl bg-card border border-border p-5 shadow-soft hover:shadow-card transition-all hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="font-display text-3xl font-bold tracking-tight text-foreground tabular-nums">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        </div>
        <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center", toneStyles[tone])}>
          <Icon className="h-5 w-5" strokeWidth={2.25} />
        </div>
      </div>
      {(delta || hint) && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          {delta && (
            <span
              className={cn(
                "inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5",
                delta.positive
                  ? "bg-success-soft text-success"
                  : "bg-destructive/10 text-destructive",
              )}
            >
              {delta.positive ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {delta.value}
            </span>
          )}
          {hint && <span className="text-muted-foreground">{hint}</span>}
        </div>
      )}
    </div>
  );
}
