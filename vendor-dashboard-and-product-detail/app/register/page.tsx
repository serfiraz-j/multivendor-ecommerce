import { Suspense } from "react"
import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-8">
      <Suspense fallback={<div className="w-full max-w-md h-[600px] animate-pulse rounded-lg bg-muted" />}>
        <RegisterForm />
      </Suspense>
    </div>
  )
}
