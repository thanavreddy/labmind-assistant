import { cn } from "@/lib/utils";

interface StatusChipProps {
  status: "pending" | "in-progress" | "done";
  className?: string;
}

const statusStyles = {
  pending: "bg-muted text-muted-foreground",
  "in-progress": "bg-primary/20 text-primary",
  done: "bg-emerald-500/20 text-emerald-400",
};

const statusLabels = {
  pending: "Pending",
  "in-progress": "In Progress",
  done: "Done",
};

export function StatusChip({ status, className }: StatusChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded font-mono text-[11px] tracking-wide",
        statusStyles[status],
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full mr-1.5", {
        "bg-muted-foreground": status === "pending",
        "bg-primary": status === "in-progress",
        "bg-emerald-400": status === "done",
      })} />
      {statusLabels[status]}
    </span>
  );
}
