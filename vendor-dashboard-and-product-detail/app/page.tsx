import { Suspense } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroBanner } from "@/components/home/hero-banner"
import { CategoryNav } from "@/components/home/category-nav"
import { ProductGrid } from "@/components/home/product-grid"

const API_BASE_URL = "http://127.0.0.1:8000/api"

interface HomePageProps {
  searchParams: Promise<{ category?: string; search?: string }>
}

async function HomeContent({ searchParams }: HomePageProps) {
  const params = await searchParams
  
  const categoryQuery = params.category ? `category__slug=${params.category}` : ""
  const searchQuery = params.search ? `search=${params.search}` : ""
  const queryString = [categoryQuery, searchQuery].filter(Boolean).join("&")

  const [categoriesRes, productsRes] = await Promise.all([
    fetch(`${API_BASE_URL}/products/categories/`, { cache: 'no-store' }),
    fetch(`${API_BASE_URL}/products/items/?${queryString}`, { cache: 'no-store' })
  ])

  const categories = await categoriesRes.json()
  const products = await productsRes.json()

  const title = params.search
    ? `Search results for "${params.search}"`
    : params.category
      ? categories.find((c: any) => c.slug === params.category)?.name || "Products"
      : "Featured Products"

  return (
    <>
      {!params.search && !params.category && <HeroBanner />}
      <CategoryNav categories={categories} selectedCategory={params.category} />
      <ProductGrid products={products} title={title} />
    </>
  )
}

export default function HomePage(props: HomePageProps) {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="py-24 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="mt-4 text-muted-foreground italic">Fetching artisan treasures...</p>
            </div>
          }
        >
          <HomeContent {...props} />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}