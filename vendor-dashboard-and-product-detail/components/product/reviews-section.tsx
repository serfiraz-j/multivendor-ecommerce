"use client"

import { useState, useMemo } from "react"
import { StarRating } from "@/components/ui/star-rating"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface ReviewsSectionProps {
  productId: number
  reviews: any[]
  averageRating: number
  reviewCount: number
  onReviewSuccess?: () => void
}

export function ReviewsSection({ 
  productId, 
  reviews, 
  averageRating, 
  reviewCount, 
  onReviewSuccess 
}: ReviewsSectionProps) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // KURAL: Mevcut kullanıcı bu ürüne daha önce yorum yapmış mı?
  const hasUserReviewed = useMemo(() => {
    if (!user || !reviews) return false
    return reviews.some((review) => review.username === user.username)
  }, [user, reviews])

  const handlePostReview = async () => {
    if (rating === 0) {
      toast.error("Please select a rating!")
      return
    }
    
    setSubmitting(true)
    const token = localStorage.getItem("access_token") || localStorage.getItem("access")
    
    try {
      const response = await fetch("http://127.0.0.1:8000/api/products/reviews/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          product: productId, 
          rating, 
          comment 
        })
      })

      if (response.ok) {
        toast.success("Review posted successfully!")
        setComment("")
        setRating(0)
        
        // Veriyi yenilemek için hem router'ı hem de callback'i tetikle
        router.refresh()
        if (onReviewSuccess) onReviewSuccess()
        
      } else {
        const errorData = await response.json()
        // Backend'den gelen spesifik hata mesajını göster
        toast.error(errorData.detail || "You cannot review this product at this time.")
      }
    } catch (err) {
      toast.error("Failed to connect to the server.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mt-12 border-t border-border pt-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Customer Reviews</h2>
          {reviewCount > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <StarRating rating={averageRating} size="md" />
              <span className="text-sm text-muted-foreground">
                {averageRating.toFixed(1)} out of 5 ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Sol Sütun: Yorum Listesi */}
        <div className="lg:col-span-2 space-y-6">
          {reviews.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-8 text-center">
              <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border-b border-border pb-6 last:border-0">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                      {review.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="font-medium">{review.username}</span>
                  </div>
                  <time className="text-xs text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <StarRating rating={review.rating} size="sm" className="mb-2" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {review.comment}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Sağ Sütun: Yorum Ekleme Formu */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-border p-6 bg-muted/5 sticky top-24">
            <h3 className="font-semibold mb-4">Add your review</h3>
            
            {!isAuthenticated ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-4">You must be logged in to share a review.</p>
                <Link href="/login">
                  <Button variant="outline" className="w-full">Sign In to Review</Button>
                </Link>
              </div>
            ) : hasUserReviewed ? (
              <div className="text-center py-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
                  ✓
                </div>
                <h4 className="font-bold text-sm mb-1">Review Submitted</h4>
                <p className="text-xs text-muted-foreground">You have already shared your feedback for this product.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter italic">
                  * Only verified purchasers can leave a review.
                </p>
                
                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block tracking-wider">
                    Rating
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button 
                        key={s} 
                        type="button"
                        onClick={() => setRating(s)} 
                        className="focus:outline-none transition-transform active:scale-90"
                      >
                        <span className={`text-2xl ${rating >= s ? "text-primary" : "text-muted-foreground/30"}`}>
                          ★
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block tracking-wider">
                    Your Comment
                  </label>
                  <Textarea 
                    placeholder="Tell us what you think..." 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="bg-background min-h-[100px]"
                  />
                </div>

                <Button 
                  className="w-full font-semibold" 
                  onClick={handlePostReview} 
                  disabled={submitting}
                >
                  {submitting ? "Posting..." : "Submit Review"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}