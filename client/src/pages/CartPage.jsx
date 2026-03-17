import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FiMinus, FiPlus, FiTrash } from 'react-icons/fi';

const CartPage = () => {
  const { cart, loading, updateQuantity, removeItem, reload } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [localItems, setLocalItems] = useState([]);

  useEffect(() => {
    setLocalItems(cart?.items || []);
  }, [cart]);

  const handleQuantity = async (id, delta) => {
    const item = localItems.find((i) => i.product._id === id);
    if (!item) return;
    const newQty = Math.max(1, item.quantity + delta);
    await updateQuantity(id, newQty);
  };

  const total = localItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (!user) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
        <p className="text-lg font-semibold text-slate-800">Login to view your cart</p>
        <Link to="/auth" className="text-purple-600 font-semibold">
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-purple-600 font-semibold">Cart</p>
          <h1 className="text-3xl font-bold text-slate-900">Your picks</h1>
        </div>
        <button
          onClick={reload}
          className="text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="h-40 bg-white rounded-2xl border border-slate-100 animate-pulse" />
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {localItems.map((item) => (
              <div
                key={item.product._id}
                className="flex gap-4 bg-white rounded-2xl border border-slate-100 p-4 shadow-sm"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="h-24 w-24 rounded-xl object-cover"
                />
                <div className="flex-1 space-y-1">
                  <p className="font-semibold text-slate-900">{item.product.name}</p>
                  <p className="text-sm text-slate-500">{item.product.category}</p>
                  <p className="font-bold text-purple-600">₹{item.product.price}</p>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => handleQuantity(item.product._id, -1)}
                      className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center"
                    >
                      <FiMinus />
                    </button>
                    <span className="text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantity(item.product._id, 1)}
                      className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center"
                    >
                      <FiPlus />
                    </button>
                    <button
                      onClick={() => removeItem(item.product._id)}
                      className="ml-auto text-slate-500 hover:text-red-600"
                    >
                      <FiTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {!localItems.length && (
              <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center">
                <p className="text-lg font-semibold text-slate-800">Cart is empty</p>
                <Link to="/products" className="text-purple-600 font-semibold">
                  Add outfits to try on
                </Link>
              </div>
            )}
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm h-fit">
            <h3 className="text-lg font-bold text-slate-900">Summary</h3>
            <div className="flex justify-between text-sm text-slate-500 pt-3">
              <span>Items</span>
              <span>{localItems.length}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-slate-900 pt-2">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => navigate('/try-on')}
              className="w-full mt-4 px-4 py-3 rounded-full bg-slate-900 text-white font-semibold"
            >
              Proceed to Try-On
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
