import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: "sm" | "md" | "lg"
  showValue?: boolean
  className?: string
}

export function StarRating({ rating, maxRating = 5, size = "md", showValue = false, className }: StarRatingProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex">
        {Array.from({ length: maxRating }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              sizeClasses[size],
              i < Math.floor(rating)
                ? "fill-amber-400 text-amber-400"
                : i < rating
                  ? "fill-amber-400/50 text-amber-400"
                  : "fill-muted text-muted",
            )}
          />
        ))}
      </div>
      {showValue && <span className="text-sm text-muted-foreground">({rating.toFixed(1)})</span>}
    </div>
  )
}
