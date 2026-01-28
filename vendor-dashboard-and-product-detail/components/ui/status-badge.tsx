import { cn } from "@/lib/utils"
import { ORDER_STATUS_CONFIG } from "@/data/mock-data"

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = ORDER_STATUS_CONFIG[status] || { label: status, color: "bg-gray-100 text-gray-800" }

  return (
    <span
      className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", config.color, className)}
    >
      {config.label}
    </span>
  )
}
