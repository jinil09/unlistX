import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"
import Image from "next/image"

const reviews = [
  {
    name: "Rajesh Kumar",
    avatar: "/indian-professional-man.png",
    rating: 5,
    date: "2 weeks ago",
    text: "Excellent platform for investing in unlisted shares. The process is transparent and SEBI-compliant. I invested in NSE shares and the experience was seamless.",
  },
  {
    name: "Priya Sharma",
    avatar: "/indian-woman-professional.png",
    rating: 5,
    date: "1 month ago",
    text: "Great selection of pre-IPO companies. The customer support team is very responsive and helped me understand the entire investment process. Highly recommended!",
  },
  {
    name: "Amit Patel",
    avatar: "/indian-businessman.png",
    rating: 5,
    date: "3 weeks ago",
    text: "I have been using this platform for 6 months now. The returns have been impressive and the platform is very secure. Love the detailed company information provided.",
  },
  {
    name: "Sneha Reddy",
    avatar: "/indian-woman-business.png",
    rating: 5,
    date: "1 week ago",
    text: "Best platform for unlisted shares in India. The minimum investment requirement is very reasonable and the variety of companies available is impressive.",
  },
]

export function GoogleReviews() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Image src="/google-logo.png" alt="Google" width={40} height={40} />
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground">Google Reviews</h2>
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-2xl font-bold text-foreground">4.9</span>
          </div>
          <p className="text-muted-foreground">Based on 1,200+ reviews</p>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {reviews.map((review, index) => (
            <Card key={index} className="p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-3 mb-4">
                <Image
                  src={review.avatar || "/placeholder.svg"}
                  alt={review.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground truncate">{review.name}</h4>
                  <p className="text-sm text-muted-foreground">{review.date}</p>
                </div>
              </div>

              <div className="flex mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
            </Card>
          ))}
        </div>

        {/* Google Badge */}
        <div className="flex justify-center mt-12">
          <Card className="inline-flex items-center gap-3 px-6 py-4">
            <Image src="/google-logo.png" alt="Google" width={32} height={32} />
            <div>
              <p className="text-sm font-semibold text-foreground">Verified by Google</p>
              <p className="text-xs text-muted-foreground">Trusted by 10,000+ investors</p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
