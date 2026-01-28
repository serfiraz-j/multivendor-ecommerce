import { AddProductForm } from "@/components/vendor/add-product-form"

export default function NewProductPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add New Product</h1>
        <p className="text-muted-foreground">Create a new product listing for your shop</p>
      </div>

      <div className="max-w-3xl">
        <AddProductForm />
      </div>
    </div>
  )
}
