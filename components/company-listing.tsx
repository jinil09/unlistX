import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

const allCompanies = [
  {
    name: "National Stock Exchange Ltd (NSE)",
    logo: "/nse-logo.jpg",
    price: "₹2,000",
    badge: "Limited Stock",
  },
  {
    name: "Oravel Stays Ltd (Oyo Rooms)",
    logo: "/oyo-logo.png",
    price: "₹51",
    badge: "1:1 Bonus Shares",
  },
  {
    name: "NCDEX Ltd",
    logo: "/ncdex-logo.jpg",
    price: "₹505",
    minShares: "28 shares min",
  },
  {
    name: "ASK Investment Managers Ltd",
    logo: "/ask-logo.jpg",
    price: "₹1,255",
    minShares: "4 shares min",
  },
  {
    name: "National e-Repository Limited (NeRL)",
    logo: "/nerl-logo.jpg",
    price: "₹70",
    minShares: "200 shares min",
  },
  {
    name: "SBI Funds Management Ltd (SBI AMC)",
    logo: "/sbi-amc-logo.jpg",
    price: "₹2,800",
    minShares: "4 shares min",
  },
  {
    name: "Metropolitan Stock Exchange of India Ltd",
    logo: "/mse-logo.jpg",
    price: "₹3.90",
    minShares: "2500 shares min",
  },
  {
    name: "Parag Parikh Financial Advisory Services Ltd",
    logo: "/parag-parikh-logo.jpg",
    price: "₹17,500",
    minShares: "1 share min",
  },
  {
    name: "Merino Industries Ltd",
    logo: "/merino-logo.jpg",
    price: "₹3,265",
    minShares: "1 share min",
  },
  {
    name: "Hella Infra Market Ltd",
    logo: "/hella-infra-logo.jpg",
    price: "₹2,25,998",
  },
]

export function CompanyListing() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Access Tomorrow&apos;s Market Leaders
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Before They Go Public
            </span>
          </h2>
          <p className="text-lg text-muted-foreground mb-2 max-w-2xl mx-auto">
            Invest in India&apos;s most promising unlisted companies with institutional-grade access.
          </p>
          <p className="text-lg font-semibold text-foreground">Start building your pre-IPO portfolio from just ₹51</p>
        </div>

        {/* Company Grid */}
        <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto mb-12">
          {allCompanies.map((company, index) => (
            <Card
              key={index}
              className="flex items-center justify-between p-4 hover:shadow-lg transition-shadow border-2"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                  <Image
                    src={company.logo || "/placeholder.svg"}
                    alt={company.name}
                    width={48}
                    height={48}
                    className="rounded-lg"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-1 truncate">{company.name}</h3>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-lg font-bold text-foreground">{company.price}</span>
                    {company.minShares && <span className="text-sm text-muted-foreground">· {company.minShares}</span>}
                    {company.badge && (
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-teal-50 text-teal-600">
                        {company.badge}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Button size="icon" variant="ghost" className="rounded-full flex-shrink-0">
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Card>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto rounded-full bg-transparent">
            View all Unlisted Shares
          </Button>
        </div>
      </div>
    </section>
  )
}
