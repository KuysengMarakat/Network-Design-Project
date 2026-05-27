import { Link } from "react-router-dom";
import { Heart, Sparkles, Award, Users, ArrowRight } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";

const TEAM = [
  { name: "Sreyleak Pich",  role: "Founder & Designer",   emoji: "🌸", color: "bg-clay-100",        location: "Phnom Penh" },
  { name: "Vibol Kim",      role: "Head Artisan",         emoji: "🪷", color: "bg-gold-100",        location: "Siem Reap"  },
  { name: "Chenda Sok",     role: "Customer Care",        emoji: "💛", color: "bg-khmer-green-100", location: "Phnom Penh" },
  { name: "Bunna Chea",     role: "Logistics Lead",       emoji: "📦", color: "bg-brown-100",       location: "Phnom Penh" },
];

const VALUES = [
  { Icon: Heart,    title: "Made with Love",       desc: "Every piece is hand-finished by local artisans who put their heart into the craft." },
  { Icon: Sparkles, title: "Cambodia-Inspired",    desc: "Designs rooted in Khmer art, Apsara grace, and the beauty of Cambodian everyday life." },
  { Icon: Award,    title: "Quality You Trust",    desc: "We only use premium materials and stand behind every piece with a happy-wear promise." },
  { Icon: Users,    title: "Supporting Artisans",  desc: "Fair wages, safe workshops, and skill development for the makers behind every piece." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader title="Made with Khmer Charm" subtitle="Modern fashion meets Cambodian craftsmanship" breadcrumbs={[{ label: "About" }]} />

      {/* Hero story */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-ivory">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-gold-600 text-sm font-semibold uppercase tracking-widest">Our Story</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-brown-900 leading-tight">
              From Phnom Penh, with love. <span className="text-clay-500">🇰🇭</span>
            </h2>
            <p className="text-brown-600 leading-relaxed">
              KhmerCharm Accessories was born in 2024 from a simple belief: Cambodian artistry deserves to be worn every day, not just on special occasions.
            </p>
            <p className="text-brown-600 leading-relaxed">
              We work directly with local artisans across Cambodia — silk weavers in Takeo, silver-smiths in Siem Reap, and clay sculptors in Battambang — to bring you accessories that carry real Khmer charm.
            </p>
            <p className="text-brown-600 leading-relaxed">
              Each piece is small in size but rich in meaning, blending traditional motifs with modern design that fits effortlessly into your daily wardrobe.
            </p>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-gold-100 via-clay-100 to-khmer-green-100 border border-gold-200 flex items-center justify-center overflow-hidden">
              <div className="text-center space-y-3">
                <div className="text-9xl">🪷</div>
                <p className="font-display text-lg text-brown-700">Since 2024</p>
              </div>
            </div>
            <div className="absolute -top-3 -right-3 bg-white rounded-2xl shadow-lg p-3 flex items-center gap-2 border border-gold-100">
              <span className="text-xl">✨</span>
              <div>
                <p className="text-xs font-bold text-brown-800">2,000+</p>
                <p className="text-[10px] text-brown-400">Happy customers</p>
              </div>
            </div>
            <div className="absolute -bottom-3 -left-3 bg-white rounded-2xl shadow-lg p-3 flex items-center gap-2 border border-gold-100">
              <span className="text-xl">👐</span>
              <div>
                <p className="text-xs font-bold text-brown-800">50+ artisans</p>
                <p className="text-[10px] text-brown-400">Across Cambodia</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-brown-900 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-gold-400 text-xs font-bold uppercase tracking-widest">Our Mission</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold leading-snug">
            To celebrate Khmer culture through wearable art, and to support the artisans who keep it alive.
          </h2>
          <div className="flex justify-center pt-2">
            <div className="flex items-center gap-3">
              <div className="h-px w-16 bg-gold-400/40" />
              <Sparkles className="w-4 h-4 text-gold-400" />
              <div className="h-px w-16 bg-gold-400/40" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-ivory-dark silk-texture">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-gold-600 text-sm font-semibold uppercase tracking-widest">What We Stand For</span>
            <h2 className="font-display text-3xl font-bold text-brown-900">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VALUES.map(({ Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gold-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-100 to-clay-100 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-gold-700" />
                </div>
                <h3 className="font-display font-bold text-brown-900 mb-2">{title}</h3>
                <p className="text-brown-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-ivory">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-gold-600 text-sm font-semibold uppercase tracking-widest">Meet the Team</span>
            <h2 className="font-display text-3xl font-bold text-brown-900">The People Behind KhmerCharm</h2>
            <p className="text-brown-500 max-w-2xl mx-auto">A small team in Phnom Penh working with artisans across Cambodia.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {TEAM.map((m) => (
              <div key={m.name} className="bg-white rounded-2xl p-4 border border-gold-100 shadow-sm hover:shadow-md transition-all text-center">
                <div className={`w-16 h-16 rounded-full ${m.color} mx-auto mb-3 flex items-center justify-center text-3xl`}>
                  {m.emoji}
                </div>
                <p className="font-semibold text-brown-900 text-sm">{m.name}</p>
                <p className="text-xs text-gold-700 font-medium">{m.role}</p>
                <p className="text-[10px] text-brown-400 mt-1">📍 {m.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-ivory">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-gold-100 via-clay-50 to-khmer-green-50 rounded-3xl p-8 sm:p-12 border border-gold-100 text-center">
          <h2 className="font-display text-3xl font-bold text-brown-900 mb-3">Become part of our story</h2>
          <p className="text-brown-600 mb-6 max-w-xl mx-auto">Browse our collections, share your style, or send us your idea for a custom piece.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all">
              Browse Shop <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gold-300 text-gold-700 hover:bg-gold-50 font-semibold rounded-xl transition-colors">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
