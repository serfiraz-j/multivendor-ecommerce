import type { ReactNode } from "react"
import { VendorSidebar } from "@/components/vendor/vendor-sidebar"

export default function VendorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      <VendorSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
