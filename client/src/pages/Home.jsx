import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../services/api';
import ProductCard from '../components/ProductCard';
import { FiZap, FiTruck, FiShield, FiImage } from 'react-icons/fi';

const highlights = [
  { icon: <FiZap />, title: 'AI Try-On', desc: 'Preview outfits instantly with Gemini-powered renders.' },
  { icon: <FiTruck />, title: 'Fast Delivery', desc: 'Same-day dispatch on top picks curated for you.' },
  { icon: <FiShield />, title: 'Secure Checkout', desc: 'Protected payments with end-to-end encryption.' },
  { icon: <FiImage />, title: 'Before / After', desc: 'See side-by-side previews before buying.' },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await productApi.list();
        setProducts(data.slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-12">
      <section className="grid lg:grid-cols-2 gap-8 items-center bg-gradient-to-r from-purple-100 via-white to-blue-50 p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="space-y-4">
          <p className="text-sm font-semibold text-purple-600 uppercase tracking-[0.2em]">
            AI VIRTUAL TRY-ON
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            See yourself in every outfit <span className="text-purple-600">before you buy.</span>
          </h1>
          <p className="text-lg text-slate-600">
            Upload your photo, pick any look, and preview a realistic render powered by Google Gemini.
            Chat with our Groq stylist for instant recommendations.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/try-on"
              className="px-4 py-3 rounded-full bg-slate-900 text-white font-semibold shadow-lg hover:-translate-y-0.5 transition"
            >
              Start Try-On
            </Link>
            <Link
              to="/products"
              className="px-4 py-3 rounded-full border border-slate-200 text-slate-800 font-semibold hover:bg-white/70"
            >
              Browse Collection
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="p-3 rounded-2xl bg-white/70 border border-slate-100 shadow-sm flex flex-col gap-2"
              >
                <div className="h-9 w-9 rounded-full bg-slate-900 text-white flex items-center justify-center">
                  {item.icon}
                </div>
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-300/40 to-blue-300/40 blur-3xl"></div>
          <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 space-y-3">
            <div className="bg-slate-900 rounded-2xl h-72 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=60"
                alt="Fashion collage"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {['streetwear', 'ethnic', 'formal'].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-sm font-semibold text-slate-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-purple-600 uppercase tracking-[0.2em]">Trending</p>
            <h2 className="text-2xl font-bold text-slate-900">New drops curated for you</h2>
          </div>
          <Link to="/products" className="text-sm font-semibold text-purple-600">
            View all
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="h-72 bg-white rounded-2xl border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
            {!products.length && (
              <div className="col-span-full bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center">
                <p className="text-lg font-semibold text-slate-800">No products yet</p>
                <p className="text-slate-500">
                  Ask an admin to add dynamic products in the Admin panel to keep everything live.
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
