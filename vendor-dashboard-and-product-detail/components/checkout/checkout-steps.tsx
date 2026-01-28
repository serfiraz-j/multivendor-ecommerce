import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckoutStepsProps {
  currentStep: number
}

const steps = [
  { id: 1, name: "Shipping" },
  { id: 2, name: "Payment" },
  { id: 3, name: "Confirmation" },
]

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  return (
    <nav aria-label="Checkout progress" className="mb-8">
      <ol className="flex items-center justify-center gap-2">
        {steps.map((step, index) => (
          <li key={step.id} className="flex items-center">
            <div
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                step.id < currentStep
                  ? "bg-primary text-primary-foreground"
                  : step.id === currentStep
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground",
              )}
            >
              {step.id < currentStep ? (
                <Check className="h-4 w-4" />
              ) : (
                <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-current text-xs">
                  {step.id}
                </span>
              )}
              <span className="hidden sm:inline">{step.name}</span>
            </div>
            {index < steps.length - 1 && <div className="mx-2 h-0.5 w-8 bg-border" />}
          </li>
        ))}
      </ol>
    </nav>
  )
}
