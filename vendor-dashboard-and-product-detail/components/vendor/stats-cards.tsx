import { Package, ShoppingBag, DollarSign, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function StatsCards({ stats }: { stats: any }) {
  const cards = [
    {
      label: "Total Products",
      value: stats.total_products,
      icon: Package,
      color: "text-blue-600 bg-blue-100",
    },
    {
      label: "Total Orders",
      value: stats.total_orders,
      icon: ShoppingBag,
      color: "text-emerald-600 bg-emerald-100",
    },
    {
      label: "Total Revenue",
      value: `$${Number(stats.total_revenue).toFixed(2)}`,
      icon: DollarSign,
      color: "text-amber-600 bg-amber-100",
    },
    {
      label: "Pending Orders",
      value: stats.pending_orders,
      icon: Clock,
      color: "text-rose-600 bg-rose-100",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} className="border-none shadow-sm ring-1 ring-border">
          <CardContent className="flex items-center gap-4 p-6">
            <div className={`rounded-xl p-3 ${card.color}`}>
              <card.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {card.label}
              </p>
              <p className="text-2xl font-bold tracking-tight">{card.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}