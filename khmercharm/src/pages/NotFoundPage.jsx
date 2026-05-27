import { Link } from "react-router-dom";
import { ArrowRight, Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <section className="min-h-screen pt-24 pb-12 px-4 bg-ivory lotus-pattern flex items-center justify-center">
      <div className="max-w-md text-center space-y-5">
        <div className="text-8xl">🪷</div>
        <h1 className="font-display text-6xl font-bold text-brown-900">404</h1>
        <h2 className="font-display text-2xl font-bold text-brown-700">Lost in the lotus pond</h2>
        <p className="text-brown-500">
          The page you're looking for doesn't exist. But our shop has plenty of beautiful pieces waiting for you.
        </p>
        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all">
            <Home className="w-4 h-4" /> Back Home
          </Link>
          <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gold-300 text-gold-700 hover:bg-gold-50 font-semibold rounded-xl transition-colors">
            Visit Shop <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
