import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import { collections } from "../data/sampleData";

export default function CollectionsPage() {
  return (
    <>
      <PageHeader
        title="Our Collections"
        subtitle="Curated themes inspired by Cambodian craftsmanship — find your story in every piece."
        breadcrumbs={[{ label: "Collections" }]}
      />

      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-ivory">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {collections.map((c) => (
              <Link
                key={c.id}
                to={`/shop?collection=${encodeURIComponent(c.id)}`}
                className="group relative overflow-hidden rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gold-100"
              >
                {/* Background gradient */}
                <div
                  className="absolute inset-0 opacity-90"
                  style={{ background: `linear-gradient(135deg, ${c.color}25, ${c.color}10 50%, #faf7f0)` }}
                />
                {/* Decorative emoji */}
                <div className="absolute right-6 -bottom-6 text-9xl opacity-15 group-hover:scale-110 transition-transform duration-500">
                  {c.emoji}
                </div>
                {/* Pattern overlay */}
                <div className="absolute inset-0 opacity-5"
                  style={{ backgroundImage: "repeating-linear-gradient(45deg,transparent,transparent 6px,rgba(0,0,0,0.4) 6px,rgba(0,0,0,0.4) 7px)" }}
                />

                <div className="relative p-7 sm:p-9 min-h-[280px] flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color: c.color }}>
                      <Sparkles className="w-3 h-3" /> Collection
                    </div>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-brown-900">{c.name}</h2>
                    <p className="text-brown-600 text-sm max-w-md">{c.description}</p>
                  </div>

                  <div className="flex items-end justify-between mt-6">
                    <div className="text-xs">
                      <div className="text-brown-400">Pieces</div>
                      <div className="font-bold text-2xl text-brown-900">{c.productCount}</div>
                    </div>
                    <div className="flex items-center gap-1.5 px-4 py-2 bg-white/80 backdrop-blur-sm border border-white shadow-sm rounded-xl text-sm font-semibold text-brown-800 group-hover:gap-3 transition-all">
                      Explore <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: c.color }} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Highlight section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-ivory-dark silk-texture">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-gold-600 text-sm font-semibold uppercase tracking-widest">Custom Orders</span>
          <h2 className="font-display text-3xl font-bold text-brown-900">Looking for something unique?</h2>
          <p className="text-brown-600 max-w-2xl mx-auto">
            Tell us your story and we'll craft a one-of-a-kind piece just for you. Custom orders typically take 2–3 weeks.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-400 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all">
            Request Custom Order <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
