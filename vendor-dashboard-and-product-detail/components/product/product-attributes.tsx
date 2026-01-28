import type { ProductAttribute } from "@/types"

interface ProductAttributesProps {
  attributes: ProductAttribute[]
}

export function ProductAttributes({ attributes }: ProductAttributesProps) {
  if (attributes.length === 0) return null

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Product Details</h3>
      <dl className="grid gap-2 text-sm">
        {attributes.map((attr) => (
          <div key={attr.id} className="flex justify-between border-b border-border/50 pb-2">
            <dt className="text-muted-foreground">{attr.name}</dt>
            <dd className="font-medium">{attr.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
