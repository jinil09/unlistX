import { Clock, CheckCircle2, ArrowRight, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Navigation } from "@/components/navigation"

export default function CompanyPendingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-slate-50">
      <Navigation />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Status Card */}
          <Card className="p-8 md:p-12 text-center border-2 shadow-lg">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Clock className="w-10 h-10 text-white" />
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Registration Under Review
            </h1>

            <p className="text-lg text-slate-600 mb-8">
              Thank you for registering your company! Your application is currently being reviewed by our team.
            </p>

            {/* Timeline */}
            <div className="bg-slate-50 rounded-lg p-6 mb-8 border-2 border-slate-200">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-slate-900">Registration Submitted</h3>
                    <p className="text-sm text-slate-600">Your company details have been received</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 animate-pulse">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-slate-900">Under Review</h3>
                    <p className="text-sm text-slate-600">Our team is verifying your documents and information</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 opacity-50">
                  <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-slate-900">Listed on Platform</h3>
                    <p className="text-sm text-slate-600">Your company will be visible to investors</p>
                  </div>
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-6 mb-8 border-2 border-emerald-200">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center justify-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                What Happens Next?
              </h3>
              <ul className="text-sm text-slate-700 space-y-2 text-left max-w-md mx-auto">
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>
                    Review typically takes <strong>2-3 business days</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>We'll verify your documents and business information</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>You'll receive an email notification once approved</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>After approval, your company will be listed for investors</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline" className="border-2 bg-transparent">
                <Link href="/">Return to Home</Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </Card>

          {/* Help Text */}
          <p className="text-center text-sm text-slate-600 mt-6">
            Need help? Contact us at{" "}
            <a href="mailto:support@unlistedshares.com" className="text-emerald-600 hover:underline font-medium">
              support@unlistedshares.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
