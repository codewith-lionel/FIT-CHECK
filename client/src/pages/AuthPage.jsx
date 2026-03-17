import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLock, FiMail, FiUser, FiShield } from 'react-icons/fi';

const AuthPage = () => {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', adminCode: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.2em] text-purple-600 font-semibold">
          Secure access
        </p>
        <h1 className="text-3xl font-bold text-slate-900">Sign in to try outfits</h1>
        <p className="text-slate-600">
          Save your cart, sync try-on history, and manage products if you are an admin.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {['JWT Auth', 'Role-based Admin', 'Secure uploads', 'AI-powered'].map((item) => (
            <div key={item} className="p-3 rounded-2xl bg-white border border-slate-100 text-sm font-semibold">
              {item}
            </div>
          ))}
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border border-slate-100 shadow-lg p-6 space-y-4"
      >
        <div className="flex gap-2 bg-slate-100 rounded-full p-1">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-full text-sm font-semibold ${
              mode === 'login' ? 'bg-white shadow text-slate-900' : 'text-slate-600'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 rounded-full text-sm font-semibold ${
              mode === 'signup' ? 'bg-white shadow text-slate-900' : 'text-slate-600'
            }`}
          >
            Sign up
          </button>
        </div>

        {mode === 'signup' && (
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-2">
            <FiUser className="text-slate-500" />
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Full name"
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
        )}

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-2">
          <FiMail className="text-slate-500" />
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email address"
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-2">
          <FiLock className="text-slate-500" />
          <input
            required
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Password"
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>

        {mode === 'signup' && (
          <div className="flex items-center gap-2 bg-slate-50 border border-dashed border-purple-200 rounded-full px-3 py-2">
            <FiShield className="text-purple-500" />
            <input
              value={form.adminCode}
              onChange={(e) => setForm({ ...form, adminCode: e.target.value })}
              placeholder="Admin code (optional)"
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold shadow-lg disabled:opacity-70"
        >
          {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
        </button>
      </form>
    </div>
  );
};

export default AuthPage;
