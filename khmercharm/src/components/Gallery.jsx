import { Camera } from "lucide-react";
import { galleryItems } from "../data/sampleData";

export default function Gallery() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-ivory-dark silk-texture">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <span className="text-gold-600 text-sm font-semibold uppercase tracking-widest">Styled by our community</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-brown-900">
            Tag us <span className="text-clay-500">#KhmerCharm</span>
          </h2>
          <p className="text-brown-500 text-sm max-w-md mx-auto">
            See how our community styles their KhmerCharm pieces. Follow us on Instagram for more inspiration.
          </p>
        </div>

        {/* Gallery grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {galleryItems.map((g) => (
            <a
              key={g.id}
              href="#"
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border border-white/60 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{ background: `linear-gradient(135deg, ${g.color}25, ${g.color}10 50%, #faf7f0)` }}
            >
              {/* Center emoji */}
              <div className="absolute inset-0 flex items-center justify-center text-5xl">
                {g.emoji}
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brown-900/90 via-brown-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                <div className="flex items-center gap-1.5 text-white text-xs font-semibold">
                  <Camera className="w-3.5 h-3.5" />
                  {g.customer}
                </div>
                <p className="text-white/80 text-[11px] mt-0.5">{g.title}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
