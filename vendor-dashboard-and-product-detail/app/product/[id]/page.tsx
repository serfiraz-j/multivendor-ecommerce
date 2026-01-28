import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ImageGallery } from "@/components/product/image-gallery"
import { ProductInfo } from "@/components/product/product-info"
import { ReviewsSection } from "@/components/product/reviews-section"

// Backend Base URL
const API_BASE_URL = "http://127.0.0.1:8000/api"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params

  let product;
  try {
    const response = await fetch(`${API_BASE_URL}/products/items/${id}/`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      notFound();
    }
    
    product = await response.json();
  } catch (error) {
    console.error("Product fetch error:", error);
    notFound();
  }

  // 2. Veri Hazırlama
  const productName: string = product.title || "Handmade Product";
  
  const safeImages = (product.images || []).map((img: any) => ({
    id: img.id,
    url: img.image.startsWith('http') ? img.image : `http://127.0.0.1:8000${img.image}`,
    alt: productName
  }));

  const formattedProduct = {
    ...product,
    name: productName,
    reviews: product.reviews || []
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image Gallery */}
          <ImageGallery 
            images={safeImages} 
            productName={productName} 
          />

          {/* Product Info */}
          <ProductInfo product={formattedProduct} />
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          {}
          <ReviewsSection
            productId={Number(id)}
            reviews={formattedProduct.reviews}
            averageRating={product.average_rating || 0}
            reviewCount={formattedProduct.reviews.length}
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}