import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { productApi } from '../services/api';
import { FiSearch } from 'react-icons/fi';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await productApi.list();
        setProducts(data);
        setFiltered(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const q = query.toLowerCase();
    setFiltered(
      products.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      )
    );
  }, [query, products]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-purple-600 font-semibold">Shop</p>
          <h1 className="text-3xl font-bold text-slate-900">Choose a look to try on</h1>
          <p className="text-slate-500">Select any product to preview it on your photo.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-slate-200 bg-white max-w-sm w-full">
          <FiSearch className="text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search styles, categories..."
            className="w-full border-none outline-none text-sm bg-transparent"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="h-72 bg-white rounded-2xl border border-slate-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
          {!filtered.length && (
            <div className="col-span-full bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center">
              <p className="text-lg font-semibold text-slate-800">No styles found</p>
              <p className="text-slate-500">Try another search or ask the admin to add products.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductList;
