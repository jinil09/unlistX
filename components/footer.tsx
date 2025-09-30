import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/logo"

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#1e3a8a] to-[#581c87] text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <Logo className="text-white mb-4" />
            <p className="text-white/80 text-sm leading-relaxed font-medium">
              India&apos;s trusted platform for investing in unlisted and pre-IPO shares. SEBI-compliant and secure.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-white/80 hover:text-white font-medium">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white font-medium">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white font-medium">
                  Investment Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white font-medium">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-white/80 hover:text-white font-medium">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white font-medium">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white font-medium">
                  Risk Disclosure
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white font-medium">
                  Compliance
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold mb-4">Stay Updated</h4>
            <p className="text-white/80 text-sm mb-4 font-medium">Get the latest investment opportunities</p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <Button className="bg-white text-primary hover:bg-white/90">Subscribe</Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8 text-center text-sm text-white/70">
          <p className="font-medium">© 2025 UnlistX. All rights reserved. | SEBI Registered | ISO 27001 Certified</p>
          <p className="mt-2 text-xs font-medium">
            Investments in securities market are subject to market risks. Read all the related documents carefully
            before investing.
          </p>
        </div>
      </div>
    </footer>
  )
}
