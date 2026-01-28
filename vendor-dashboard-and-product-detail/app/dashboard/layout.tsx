import type { ReactNode } from "react"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
