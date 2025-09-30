import { TrendingUp, PieChart, Globe } from "lucide-react"

export function WhyInvest() {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Be Among the First to Invest in Future Leaders",
      description:
        "Gain priority access to high-potential companies before they hit the stock exchange. By entering early, you position yourself for stronger growth opportunities and a competitive edge in the market.",
    },
    {
      icon: PieChart,
      title: "Build a Stronger, Smarter Portfolio",
      description:
        "Unlisted shares can add balance and resilience to your investments. Diversifying into pre-IPO opportunities helps reduce dependency on traditional assets and creates new avenues for wealth growth.",
    },
    {
      icon: Globe,
      title: "Unlock Access to Untapped Industries",
      description:
        "Step beyond the limits of the current market. Pre-IPO investments open doors to innovative sectors and fast-growing businesses that aren't yet available to the public, expanding both your reach and your returns.",
    },
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-balance">
            Why Invest in Unlisted Shares?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto text-pretty">
            Discover the advantages of early-stage investing and unlock opportunities that traditional markets can't
            offer
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6">
                  <IconComponent className="w-8 h-8 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-balance">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed text-pretty">{benefit.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
