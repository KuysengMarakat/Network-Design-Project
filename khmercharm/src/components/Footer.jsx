import { Link } from "react-router-dom";
import { MapPin, Mail, Phone, Sparkles, Heart } from "lucide-react";

function FacebookIcon() { return <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>; }
function InstagramIcon() { return <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" /></svg>; }
function TelegramIcon() { return <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>; }
function TiktokIcon() { return <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" /></svg>; }

export default function Footer() {
  const year = new Date().getFullYear();
  const quickLinks = [
    { to: "/",            label: "Home" },
    { to: "/shop",        label: "Shop" },
    { to: "/collections", label: "Collections" },
    { to: "/about",       label: "About" },
    { to: "/contact",     label: "Contact" },
  ];
  const shopCategories = [
    { to: "/shop?category=Bracelets",        label: "Bracelets" },
    { to: "/shop?category=Necklaces",        label: "Necklaces" },
    { to: "/shop?category=Earrings",         label: "Earrings" },
    { to: "/shop?category=Rings",            label: "Rings" },
    { to: "/shop?category=Bags",             label: "Bags" },
    { to: "/shop?category=Phone+Charms",     label: "Phone Charms" },
  ];
  const customerService = [
    { to: "/account",  label: "My Account" },
    { to: "/account?tab=orders", label: "Track Order" },
    { to: "/contact",  label: "Returns & Exchange" },
    { to: "/contact",  label: "Shipping Info" },
    { to: "/contact",  label: "FAQ" },
  ];

  return (
    <footer className="bg-brown-900 text-ivory/80" id="contact">
      <div className="h-1 bg-gradient-to-r from-clay-400 via-gold-400 to-khmer-green-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="col-span-2 lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-clay-500 flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-display text-xl font-bold text-white">KhmerCharm</span>
            </Link>
            <p className="text-sm text-ivory/60 leading-relaxed max-w-xs">
              Handcrafted accessories inspired by Cambodian art, culture, and everyday elegance. Made with love in Phnom Penh. 🇰🇭
            </p>
            <div className="flex gap-2 pt-2">
              {[
                { Icon: FacebookIcon,  label: "Facebook" },
                { Icon: InstagramIcon, label: "Instagram" },
                { Icon: TelegramIcon,  label: "Telegram" },
                { Icon: TiktokIcon,    label: "TikTok" },
              ].map(({ Icon, label }) => (
                <button key={label} aria-label={label} className="w-9 h-9 rounded-lg bg-white/10 hover:bg-gold-500 text-ivory/70 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110">
                  <Icon />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-display font-bold text-white text-base">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-ivory/60 hover:text-gold-400 transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-gold-400/50 group-hover:bg-gold-400 transition-colors" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-display font-bold text-white text-base">Shop</h4>
            <ul className="space-y-2">
              {shopCategories.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-ivory/60 hover:text-gold-400 transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-gold-400/50 group-hover:bg-gold-400 transition-colors" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-display font-bold text-white text-base">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-ivory/60">
                <MapPin className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                <span>Phnom Penh, Cambodia</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-ivory/60">
                <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <a href="mailto:support@khmercharm.com" className="hover:text-gold-400 transition-colors">support@khmercharm.com</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-ivory/60">
                <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <a href="tel:+85512345678" className="hover:text-gold-400 transition-colors">+855 12 345 678</a>
              </li>
            </ul>
            <div className="pt-2 p-3 bg-white/5 rounded-xl border border-white/10 text-xs text-ivory/50">
              <div className="font-medium text-ivory/70 mb-1">Business Hours</div>
              <div>Mon–Sat: 8 AM – 8 PM</div>
              <div>Sun: 9 AM – 6 PM (ICT)</div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ivory/40">
          <span>© {year} KhmerCharm Accessories. All rights reserved.</span>
          <div className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-clay-400 fill-clay-400 mx-1" /> in Phnom Penh
          </div>
          <div className="flex gap-4">
            <Link to="/about" className="hover:text-gold-400 transition-colors">About</Link>
            <Link to="/contact" className="hover:text-gold-400 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
