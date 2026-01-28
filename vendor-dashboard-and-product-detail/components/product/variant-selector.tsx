"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface VariantSelectorProps {
  variants: any[]
  selectedVariants: { size?: string; color?: string }
  onSelect: (type: "size" | "color", value: string) => void
}

export function VariantSelector({ variants, selectedVariants, onSelect }: VariantSelectorProps) {
  // 1. Benzersiz Size ve Color listelerini çıkaralım
  const sizes = Array.from(new Set(variants.map((v) => v.size).filter(Boolean)))
  const colors = Array.from(new Set(variants.map((v) => v.color).filter(Boolean)))

  return (
    <div className="flex flex-col gap-6">
      {/* Size Seçimi */}
      {sizes.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Size</h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size: any) => (
              <Button
                key={size}
                variant="outline"
                onClick={() => onSelect("size", size)}
                className={cn(
                  "min-w-[3.5rem] h-10 border-2",
                  selectedVariants.size === size ? "border-primary bg-primary/10 text-primary" : ""
                )}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Color Seçimi */}
      {colors.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Color</h3>
          <div className="flex flex-wrap gap-2">
            {colors.map((color: any) => (
              <Button
                key={color}
                variant="outline"
                onClick={() => onSelect("color", color)}
                className={cn(
                  "min-w-[3.5rem] h-10 border-2",
                  selectedVariants.color === color ? "border-primary bg-primary/10 text-primary" : ""
                )}
              >
                {color}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}