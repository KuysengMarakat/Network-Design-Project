import { Star, Quote } from "lucide-react";

export default function Reviews({ reviews }) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-ivory lotus-pattern">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12 space-y-3">
          <span className="text-gold-600 text-sm font-semibold uppercase tracking-widest">
            Customer Love
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-brown-900">
            What Our Customers Say
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold-400" />
            <div className="w-2 h-2 rounded-full bg-gold-400" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold-400" />
          </div>
          {/* Overall rating */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-gold-400 text-gold-400" />
              ))}
            </div>
            <span className="text-brown-600 font-medium">4.9 out of 5 — based on 2,000+ reviews</span>
          </div>
        </div>

        {/* Review cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-ivory-dark/60"
            >
              {/* Quote icon */}
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-10 h-10 text-gold-600 fill-gold-200" />
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? "fill-gold-400 text-gold-400"
                        : "text-brown-200"
                    }`}
                  />
                ))}
              </div>

              {/* Review text */}
              <p className="text-brown-600 text-sm leading-relaxed mb-6 italic">
                "{review.text}"
              </p>

              {/* Purchased product */}
              <div className="mb-4 px-3 py-1.5 bg-gold-50 border border-gold-100 rounded-lg inline-block">
                <span className="text-xs text-gold-700 font-medium">✓ Purchased: {review.product}</span>
              </div>

              {/* Customer info */}
              <div className="flex items-center gap-3 pt-4 border-t border-ivory-dark/60">
                <div className={`w-10 h-10 rounded-full ${review.avatarColor} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                  {review.avatar}
                </div>
                <div>
                  <div className="font-semibold text-brown-900 text-sm">{review.name}</div>
                  <div className="text-brown-400 text-xs flex items-center gap-1">
                    <span>📍</span>
                    {review.location} · {review.date}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
