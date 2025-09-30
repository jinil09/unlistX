import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, FileCheck, Mail, Phone } from "lucide-react"
import Link from "next/link"

export default function SellerPendingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <Navigation />

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Card className="shadow-2xl border-0">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <CheckCircle2 className="h-16 w-16" />
              </div>
            </div>
            <CardTitle className="text-3xl mb-2">Registration Submitted Successfully!</CardTitle>
            <CardDescription className="text-purple-100 text-lg">
              Your secondary seller application is under review
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8 space-y-8">
            {/* Status Timeline */}
            <div className="space-y-6">
              <h3 className="font-semibold text-lg text-gray-900">Application Status</h3>

              <div className="space-y-4">
                {/* Step 1 - Completed */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="bg-green-500 rounded-full p-2">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                    <div className="w-0.5 h-16 bg-green-500" />
                  </div>
                  <div className="flex-1 pt-1">
                    <h4 className="font-semibold text-gray-900">Application Submitted</h4>
                    <p className="text-sm text-gray-600">Your registration has been received</p>
                    <p className="text-xs text-green-600 mt-1">Completed</p>
                  </div>
                </div>

                {/* Step 2 - In Progress */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="bg-blue-500 rounded-full p-2 animate-pulse">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div className="w-0.5 h-16 bg-gray-300" />
                  </div>
                  <div className="flex-1 pt-1">
                    <h4 className="font-semibold text-gray-900">Document Verification</h4>
                    <p className="text-sm text-gray-600">Our team is verifying your documents and share ownership</p>
                    <p className="text-xs text-blue-600 mt-1">In Progress (2-3 business days)</p>
                  </div>
                </div>

                {/* Step 3 - Pending */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="bg-gray-300 rounded-full p-2">
                      <FileCheck className="h-5 w-5 text-white" />
                    </div>
                    <div className="w-0.5 h-16 bg-gray-300" />
                  </div>
                  <div className="flex-1 pt-1">
                    <h4 className="font-semibold text-gray-500">Approval & Listing</h4>
                    <p className="text-sm text-gray-500">Your shares will be listed on the secondary market</p>
                    <p className="text-xs text-gray-400 mt-1">Pending</p>
                  </div>
                </div>

                {/* Step 4 - Pending */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="bg-gray-300 rounded-full p-2">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <h4 className="font-semibold text-gray-500">Active on Secondary Market</h4>
                    <p className="text-sm text-gray-500">Buyers can view and express interest in your shares</p>
                    <p className="text-xs text-gray-400 mt-1">Pending</p>
                  </div>
                </div>
              </div>
            </div>

            {/* What Happens Next */}
            <div className="bg-purple-50 rounded-lg p-6 space-y-3">
              <h3 className="font-semibold text-gray-900">What Happens Next?</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Our team will verify your documents and share ownership details</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>You'll receive an email notification once your application is approved</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Your shares will be listed on our secondary market platform</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>We'll notify you when potential buyers express interest</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Our team will facilitate the transaction and ensure secure settlement</span>
                </li>
              </ul>
            </div>

            {/* Expected Timeline */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Expected Timeline</h3>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">2-3</div>
                  <div className="text-sm text-gray-600">Business Days</div>
                  <div className="text-xs text-gray-500 mt-1">Verification</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">1</div>
                  <div className="text-sm text-gray-600">Business Day</div>
                  <div className="text-xs text-gray-500 mt-1">Listing</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">Varies</div>
                  <div className="text-sm text-gray-600">Time to Sale</div>
                  <div className="text-xs text-gray-500 mt-1">Based on demand</div>
                </div>
              </div>
            </div>

            {/* Contact Support */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                If you have any questions or need to update your information, please contact our support team.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Mail className="h-4 w-4" />
                  support@unlistedshares.com
                </Button>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Phone className="h-4 w-4" />
                  +91 98765 43210
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  Back to Home
                </Button>
              </Link>
              <Link href="/secondary-market" className="flex-1">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Browse Secondary Market
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
