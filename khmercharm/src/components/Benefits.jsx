import { Heart, Sparkles, Truck, ShieldCheck } from "lucide-react";

const iconMap = { Heart, Sparkles, Truck, ShieldCheck };

export default function Benefits({ benefits }) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-ivory-dark silk-texture" id="about">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12 space-y-3">
          <span className="text-gold-600 text-sm font-semibold uppercase tracking-widest">
            Why Choose Us
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-brown-900">
            Why Shop with KhmerCharm
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold-400" />
            <div className="w-2 h-2 rounded-full bg-gold-400" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold-400" />
          </div>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit) => {
            const Icon = iconMap[benefit.icon] || Heart;
            return (
              <div
                key={benefit.id}
                className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-ivory-dark/60 text-center"
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-gold-300 to-clay-300 rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl ${benefit.bg} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`w-6 h-6 ${benefit.color}`} />
                </div>

                {/* Text */}
                <h3 className="font-display font-bold text-brown-900 mb-2 group-hover:text-gold-700 transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-brown-500 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div className="mt-16 pt-16 border-t border-gold-100">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Brand story */}
            <div className="space-y-5">
              <span className="text-gold-600 text-sm font-semibold uppercase tracking-widest">
                Our Story
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-brown-900">
                Crafted with Cambodian Soul
              </h2>
              <p className="text-brown-600 leading-relaxed text-base">
                KhmerCharm Accessories is inspired by Cambodian art, culture, and everyday elegance. We combine modern fashion with local beauty to create accessories that feel meaningful and stylish.
              </p>
              <p className="text-brown-500 leading-relaxed text-sm">
                Founded in Phnom Penh, we work directly with local artisans to ensure every piece is made with care, preserving traditional Khmer craftsmanship while embracing contemporary design.
              </p>
              <button className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gold-400 text-gold-700 hover:bg-gold-400 hover:text-white font-semibold rounded-xl transition-all duration-200">
                Learn More About Us
              </button>
            </div>

            {/* Visual stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: "500+", label: "Unique Products", color: "bg-gold-50 border-gold-200", numColor: "text-gold-700" },
                { num: "2,000+", label: "Happy Customers", color: "bg-clay-50 border-clay-200", numColor: "text-clay-600" },
                { num: "50+", label: "Local Artisans", color: "bg-khmer-green-50 border-khmer-green-200", numColor: "text-khmer-green-600" },
                { num: "5★", label: "Average Rating", color: "bg-brown-50 border-brown-200", numColor: "text-brown-700" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`rounded-2xl border p-6 text-center ${stat.color} hover:shadow-md transition-shadow`}
                >
                  <div className={`font-display text-3xl font-bold ${stat.numColor}`}>{stat.num}</div>
                  <div className="text-brown-600 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
