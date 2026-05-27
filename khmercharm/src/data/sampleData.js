// ─────────────────────────────────────────────
//  KhmerCharm — Sample data (used as fallback
//  when the backend API is unavailable, and as
//  a source for hard-coded UI elements like
//  benefits, collections, gallery, FAQs).
// ─────────────────────────────────────────────

export const categories = [
  { id: 1, slug: "bracelets",        name: "Bracelets",         description: "Handcrafted & modern", emoji: "💛", color: "from-gold-100 to-gold-200",         count: 24 },
  { id: 2, slug: "necklaces",        name: "Necklaces",         description: "Elegant everyday",     emoji: "📿", color: "from-brown-100 to-brown-200",        count: 18 },
  { id: 3, slug: "earrings",         name: "Earrings",          description: "From subtle to bold",  emoji: "✨", color: "from-gold-100 to-clay-100",          count: 22 },
  { id: 4, slug: "rings",            name: "Rings",             description: "Khmer-inspired",       emoji: "💍", color: "from-clay-100 to-clay-200",          count: 31 },
  { id: 5, slug: "hair-accessories", name: "Hair Accessories",  description: "Clips & headbands",    emoji: "🌸", color: "from-khmer-green-100 to-khmer-green-200", count: 15 },
  { id: 6, slug: "bags",             name: "Bags",              description: "Woven & handmade",     emoji: "👜", color: "from-gold-100 to-clay-100",          count: 12 },
  { id: 7, slug: "phone-charms",     name: "Phone Charms",      description: "Cute & cultural",      emoji: "🌺", color: "from-brown-100 to-gold-100",         count: 20 },
  { id: 8, slug: "keychains",        name: "Keychains",         description: "Travel-ready charms",  emoji: "🗝️", color: "from-brown-50 to-gold-100",          count: 9  },
];

// Default fallback products — kept in sync with backend seed
export const products = [
  { id: 1, name: "Golden Lotus Bracelet",  category: "Bracelets",        priceUSD: 12.00, priceKHR: 48000, rating: 5, reviewCount: 128, stock: 50,  tag: "Popular",    isBestSeller: true,  isNew: false, isSale: false },
  { id: 2, name: "Angkor Pearl Necklace",  category: "Necklaces",        priceUSD: 18.50, priceKHR: 74000, rating: 5, reviewCount: 94,  stock: 30,  tag: "New",        isBestSeller: false, isNew: true,  isSale: false },
  { id: 3, name: "Apsara Gold Earrings",   category: "Earrings",         priceUSD: 15.00, priceKHR: 60000, rating: 5, reviewCount: 89,  stock: 35,  tag: "Popular",    isBestSeller: true,  isNew: false, isSale: false },
  { id: 4, name: "Silk Charm Hair Clip",   category: "Hair Accessories", priceUSD: 6.00,  priceKHR: 24000, rating: 4, reviewCount: 57,  stock: 80,  tag: "Sale",       isBestSeller: false, isNew: false, isSale: true,  originalPriceUSD: 9.00 },
  { id: 5, name: "Handmade Woven Bag",     category: "Bags",             priceUSD: 34.00, priceKHR: 136000,rating: 5, reviewCount: 43,  stock: 20,  tag: "Popular",    isBestSeller: true,  isNew: false, isSale: false },
  { id: 6, name: "Khmer Pattern Ring",     category: "Rings",            priceUSD: 8.50,  priceKHR: 34000, rating: 4, reviewCount: 76,  stock: 45,  tag: "New",        isBestSeller: false, isNew: true,  isSale: false },
  { id: 7, name: "Mini Lotus Phone Charm", category: "Phone Charms",     priceUSD: 4.50,  priceKHR: 18000, rating: 5, reviewCount: 112, stock: 100, tag: "Sale",       isBestSeller: false, isNew: false, isSale: true,  originalPriceUSD: 7.00 },
  { id: 8, name: "Clay Stone Keychain",    category: "Keychains",        priceUSD: 3.50,  priceKHR: 14000, rating: 4, reviewCount: 65,  stock: 120, tag: "New",        isBestSeller: false, isNew: true,  isSale: false },
];

export const collections = [
  {
    id: "khmer-silk",
    name: "Khmer Silk Collection",
    description: "Soft colours and traditional inspiration for everyday silk-style accessories.",
    productCount: 12,
    accent: "from-clay-200 to-clay-400",
    emoji: "🪷",
    color: "#bf3a1e",
  },
  {
    id: "lotus-gold",
    name: "Lotus Gold Collection",
    description: "Sacred lotus motifs in 18k gold-plated finishes — sacred meets modern.",
    productCount: 9,
    accent: "from-gold-200 to-gold-400",
    emoji: "💛",
    color: "#d4a017",
  },
  {
    id: "everyday-charm",
    name: "Everyday Charm Collection",
    description: "Light, comfortable pieces designed for daily wear and effortless style.",
    productCount: 18,
    accent: "from-khmer-green-200 to-khmer-green-400",
    emoji: "🌿",
    color: "#226638",
  },
  {
    id: "gift-sets",
    name: "Gift Sets Collection",
    description: "Beautifully boxed bundles — perfect for birthdays, Pchum Ben, and Khmer New Year.",
    productCount: 7,
    accent: "from-brown-200 to-brown-400",
    emoji: "🎁",
    color: "#8f5d2c",
  },
];

export const reviews = [
  { id: 1, name: "Sreynich Mao",  location: "Phnom Penh", rating: 5, text: "I ordered the Golden Lotus Bracelet as a gift for my sister and she absolutely loved it! The quality is amazing and the packaging is beautiful 💛", avatar: "S", avatarColor: "bg-gold-400",        product: "Golden Lotus Bracelet",  date: "2 weeks ago" },
  { id: 2, name: "Dara Heng",     location: "Siem Reap",  rating: 5, text: "The Khmer Pattern Ring is so unique and beautifully crafted. I get compliments every time I wear it. Proud to support local Cambodian artisans!", avatar: "D", avatarColor: "bg-khmer-green-500", product: "Khmer Pattern Ring",      date: "1 month ago" },
  { id: 3, name: "Sophea Lim",    location: "Battambang", rating: 5, text: "Fast delivery, great packaging, and the Mini Lotus Phone Charm is even cuter in person! KhmerCharm is my new favourite shop 🌸",                  avatar: "P", avatarColor: "bg-clay-500",        product: "Mini Lotus Phone Charm", date: "3 weeks ago" },
];

export const benefits = [
  { id: 1, icon: "Heart",     title: "Handmade with Care",     description: "Every piece is crafted by local Cambodian artisans with attention to detail and love.", color: "text-clay-500",        bg: "bg-clay-50" },
  { id: 2, icon: "Sparkles",  title: "Cambodia-Inspired",      description: "Unique designs rooted in Khmer art, culture, and the beauty of everyday life.",          color: "text-gold-600",        bg: "bg-gold-50" },
  { id: 3, icon: "Truck",     title: "Fast Local Delivery",    description: "Same-day in Phnom Penh. Nationwide shipping within 1–3 business days.",                 color: "text-khmer-green-500", bg: "bg-khmer-green-50" },
  { id: 4, icon: "MessageCircle", title: "Friendly Support",   description: "Our team replies in English & Khmer within hours, every day of the week.",              color: "text-brown-500",       bg: "bg-brown-50" },
];

export const galleryItems = [
  { id: 1, title: "Bracelet Styling",  emoji: "💛", color: "#d4a017", customer: "@sreynich" },
  { id: 2, title: "Necklace Styling",  emoji: "📿", color: "#226638", customer: "@dara_lifestyle" },
  { id: 3, title: "Hair Clip Styling", emoji: "🌸", color: "#bf3a1e", customer: "@sophea_pp" },
  { id: 4, title: "Bag Styling",       emoji: "👜", color: "#8f5d2c", customer: "@khmer_minimal" },
  { id: 5, title: "Ring Styling",      emoji: "💍", color: "#3a8551", customer: "@cambodia_diaries" },
  { id: 6, title: "Gift Set Styling",  emoji: "🎁", color: "#7a5507", customer: "@charm_gifts" },
];

export const faqs = [
  { q: "How long does delivery take?",   a: "Same-day in Phnom Penh, 1–3 business days nationwide." },
  { q: "What payment methods do you accept?", a: "Cash on Delivery, ABA Bank, and Wing — all available at checkout." },
  { q: "What is your return policy?",    a: "30-day returns on unworn items. Custom pieces are final sale." },
  { q: "Do you make custom orders?",     a: "Yes! Email support@khmercharm.com with your idea — we love a custom request." },
];
