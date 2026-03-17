import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiLogOut, FiUser, FiShield } from 'react-icons/fi';

const NavLink = ({ to, label, active }) => (
  <Link
    to={to}
    className={`px-3 py-2 rounded-full text-sm font-semibold transition ${
      active ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
    }`}
  >
    {label}
  </Link>
);

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg">
            AI
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">FIT-CHECK</p>
            <p className="text-xs text-slate-500">Virtual Try-On Fashion</p>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <NavLink to="/" label="Home" active={location.pathname === '/'} />
          <NavLink to="/products" label="Shop" active={location.pathname.startsWith('/products')} />
          <NavLink to="/try-on" label="Try-On" active={location.pathname === '/try-on'} />
          {user?.role === 'admin' && (
            <NavLink to="/admin" label="Admin" active={location.pathname === '/admin'} />
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/cart"
            className="relative inline-flex items-center gap-2 px-3 py-2 rounded-full bg-slate-900 text-white"
          >
            <FiShoppingCart />
            <span className="text-sm font-semibold">Cart</span>
            <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
              {cart?.items?.length || 0}
            </span>
          </Link>

          {user ? (
            <>
              <span className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                <FiUser className="text-purple-500" />
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-slate-900"
              >
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-2 px-3 py-2 rounded-full border border-slate-200 hover:border-slate-300"
            >
              <FiShield />
              <span className="text-sm font-semibold text-slate-700">Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
