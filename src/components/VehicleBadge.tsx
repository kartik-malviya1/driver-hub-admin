import { Leaf, Fuel, Wind } from "lucide-react";
import type { VehicleType } from "@/data/drivers";
import { cn } from "@/lib/utils";

const map = {
  Electric: { icon: Leaf, cls: "bg-success-soft text-success" },
  Petrol: { icon: Fuel, cls: "bg-warning-soft text-warning" },
  CNG: { icon: Wind, cls: "bg-info-soft text-info" },
} as const;

export function VehicleBadge({ type }: { type: VehicleType }) {
  const { icon: Icon, cls } = map[type];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        cls,
      )}
    >
      <Icon className="h-3 w-3" strokeWidth={2.5} />
      {type}
    </span>
  );
}
