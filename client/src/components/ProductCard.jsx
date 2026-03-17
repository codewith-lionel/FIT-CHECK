import { Link } from 'react-router-dom';
import { FiShoppingBag, FiArrowRightCircle } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  const { user } = useAuth();

  const handleAdd = async () => {
    try {
      await addItem(product._id, 1);
    } catch (err) {
      alert('Please login to add items');
    }
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:-translate-y-1 hover:shadow-xl transition">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        <div className="absolute bottom-3 left-3 text-white text-xs bg-black/40 px-2 py-1 rounded-full backdrop-blur">
          {product.category}
        </div>
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
          <p className="text-lg font-bold text-purple-600">₹{product.price}</p>
        </div>
        <p className="text-sm text-slate-500 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold hover:shadow-lg transition"
          >
            <FiShoppingBag /> Add to Cart
          </button>
          <Link
            to={`/products/${product._id}`}
            className="text-sm font-semibold text-purple-600 inline-flex items-center gap-1 hover:gap-2 transition"
          >
            Try Now <FiArrowRightCircle />
          </Link>
        </div>
        {!user && <p className="text-xs text-amber-600">Login to save cart & try-on</p>}
      </div>
    </div>
  );
};

export default ProductCard;
