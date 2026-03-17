import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { FiShoppingBag, FiImage } from 'react-icons/fi';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await productApi.get(id);
        setProduct(data);
      } catch (err) {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleAdd = async () => {
    try {
      await addItem(product._id, 1);
      alert('Added to cart');
    } catch (err) {
      alert('Login required to add items');
    }
  };

  if (loading) return <div className="h-64 bg-white rounded-2xl animate-pulse" />;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!product) return null;

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.2em] text-purple-600 font-semibold">
          {product.category}
        </p>
        <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>
        <p className="text-lg text-slate-600">{product.description}</p>
        <p className="text-2xl font-extrabold text-purple-600">₹{product.price}</p>
        {product.sizes?.length > 0 && (
          <div className="flex gap-2">
            {product.sizes.map((size) => (
              <span key={size} className="px-3 py-1 rounded-full border border-slate-200 text-sm">
                {size}
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleAdd}
            className="px-4 py-3 rounded-full bg-slate-900 text-white font-semibold inline-flex items-center gap-2"
          >
            <FiShoppingBag /> Add to Cart
          </button>
          <button
            onClick={() => navigate('/try-on', { state: { clothingUrl: product.image } })}
            className="px-4 py-3 rounded-full border border-slate-200 font-semibold inline-flex items-center gap-2"
          >
            <FiImage /> Try this look
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
