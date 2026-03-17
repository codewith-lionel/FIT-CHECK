import { useEffect, useState } from 'react';
import { productApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiTrash, FiSave } from 'react-icons/fi';

const AdminPage = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    image: '',
    price: '',
    category: '',
    description: '',
    sizes: '',
    stock: 5,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadProducts = async () => {
    try {
      const data = await productApi.list();
      setProducts(data);
    } catch (err) {
      setError('Unable to load products');
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await productApi.create({
        ...form,
        price: Number(form.price),
        sizes: form.sizes ? form.sizes.split(',').map((s) => s.trim()) : [],
        stock: Number(form.stock) || 0,
      });
      setForm({ name: '', image: '', price: '', category: '', description: '', sizes: '', stock: 5 });
      await loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save product');
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    await productApi.remove(id);
    await loadProducts();
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center">
        <p className="text-lg font-semibold text-slate-900">Admin only</p>
        <p className="text-slate-600">You need an admin account to manage products.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-purple-600 font-semibold">Admin</p>
        <h1 className="text-3xl font-bold text-slate-900">Manage products dynamically</h1>
        <p className="text-slate-600">No static data — add, update, or delete outfits instantly.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm grid md:grid-cols-2 gap-4"
      >
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Product name"
          className="border border-slate-200 rounded-xl px-3 py-2 text-sm"
        />
        <input
          required
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          placeholder="Price"
          className="border border-slate-200 rounded-xl px-3 py-2 text-sm"
        />
        <input
          required
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          placeholder="Category"
          className="border border-slate-200 rounded-xl px-3 py-2 text-sm"
        />
        <input
          required
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          placeholder="Image URL"
          className="border border-slate-200 rounded-xl px-3 py-2 text-sm"
        />
        <input
          value={form.sizes}
          onChange={(e) => setForm({ ...form, sizes: e.target.value })}
          placeholder="Sizes (comma separated)"
          className="border border-slate-200 rounded-xl px-3 py-2 text-sm md:col-span-2"
        />
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
          className="border border-slate-200 rounded-xl px-3 py-2 text-sm md:col-span-2"
        />
        <input
          type="number"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          placeholder="Stock"
          className="border border-slate-200 rounded-xl px-3 py-2 text-sm"
        />
        {error && <p className="text-sm text-red-600 md:col-span-2">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="md:col-span-2 inline-flex items-center gap-2 px-4 py-3 rounded-full bg-slate-900 text-white font-semibold justify-center"
        >
          {loading ? 'Saving...' : <><FiSave /> Save product</>}
        </button>
      </form>

      <div className="grid md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product._id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
            <img src={product.image} alt={product.name} className="h-32 w-full object-cover rounded-xl" />
            <div className="flex items-center justify-between pt-3">
              <div>
                <p className="font-semibold text-slate-900">{product.name}</p>
                <p className="text-sm text-slate-500">₹{product.price}</p>
              </div>
              <button
                onClick={() => remove(product._id)}
                className="text-slate-500 hover:text-red-600"
                title="Delete product"
              >
                <FiTrash />
              </button>
            </div>
          </div>
        ))}
        {!products.length && (
          <div className="md:col-span-3 bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center">
            <p className="font-semibold text-slate-800">No products yet</p>
            <p className="text-slate-600">Add the first dynamic product above.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
