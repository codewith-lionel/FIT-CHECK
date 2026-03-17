import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { tryOnApi, productApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiUploadCloud, FiImage, FiLoader } from 'react-icons/fi';

const TryOnPage = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [userFile, setUserFile] = useState(null);
  const [clothFile, setClothFile] = useState(null);
  const [userPreview, setUserPreview] = useState('');
  const [clothPreview, setClothPreview] = useState('');
  const [resultImage, setResultImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');

  useEffect(() => {
    if (location.state?.clothingUrl) {
      preloadCloth(location.state.clothingUrl);
    }
  }, [location.state]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await productApi.list();
        setProducts(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadProducts();
  }, []);

  const preloadCloth = async (url) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const file = new File([blob], 'product-image.png', { type: blob.type });
      setClothFile(file);
      setClothPreview(url);
    } catch (err) {
      console.error('Unable to preload cloth image', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userFile || !clothFile) {
      setStatus('Upload both your photo and a clothing image.');
      return;
    }
    setLoading(true);
    setStatus('Generating AI try-on...');
    const formData = new FormData();
    formData.append('userImage', userFile);
    formData.append('clothImage', clothFile);
    try {
      const data = await tryOnApi.send(formData);
      setResultImage(data.resultImage);
      setStatus(data.source === 'fallback' ? 'Using demo fallback preview.' : 'AI render ready!');
    } catch (err) {
      setStatus('AI service unavailable — showing fallback preview.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center">
        <p className="text-lg font-semibold text-slate-900">Login required</p>
        <p className="text-slate-600">Sign in to upload your photo and save try-on results.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-purple-600 font-semibold">
            Virtual Try-On
          </p>
          <h1 className="text-3xl font-bold text-slate-900">Preview outfits on your photo</h1>
          <p className="text-slate-600">Upload a clear photo, select an outfit, and get a before/after view.</p>
        </div>
        <div className="px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
          Saved to your account automatically
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3">
          <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <FiUploadCloud /> Upload your photo
          </p>
          <label className="flex flex-col items-center justify-center border border-dashed border-slate-300 rounded-xl p-4 text-sm text-slate-500 cursor-pointer hover:border-purple-400 hover:text-purple-600">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setUserFile(file);
                  setUserPreview(URL.createObjectURL(file));
                }
              }}
            />
            {userPreview ? (
              <img src={userPreview} alt="User" className="h-48 w-full object-cover rounded-lg" />
            ) : (
              <>Drop or select a clear full-body photo</>
            )}
          </label>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3">
          <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <FiImage /> Select clothing
          </p>
          <select
            value={selectedProduct}
            onChange={(e) => {
              const id = e.target.value;
              setSelectedProduct(id);
              const prod = products.find((p) => p._id === id);
              if (prod) preloadCloth(prod.image);
            }}
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
          >
            <option value="">Choose from catalogue</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} — ₹{p.price}
              </option>
            ))}
          </select>
          <label className="flex flex-col items-center justify-center border border-dashed border-slate-300 rounded-xl p-4 text-sm text-slate-500 cursor-pointer hover:border-purple-400 hover:text-purple-600">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setClothFile(file);
                  setClothPreview(URL.createObjectURL(file));
                }
              }}
            />
            {clothPreview ? (
              <img src={clothPreview} alt="Clothing" className="h-48 w-full object-cover rounded-lg" />
            ) : (
              <>Upload a clothing image or pick from catalogue</>
            )}
          </label>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            Before / After preview
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="h-32 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden">
              {userPreview ? (
                <img src={userPreview} className="w-full h-full object-cover" alt="Before" />
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-500">Upload photo</div>
              )}
            </div>
            <div className="h-32 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden">
              {resultImage ? (
                <img src={resultImage} className="w-full h-full object-cover" alt="After" />
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-500">
                  AI preview appears here
                </div>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin" /> Generating
              </>
            ) : (
              'Generate Try-On'
            )}
          </button>
          {status && <p className="text-sm text-slate-600">{status}</p>}
        </div>
      </form>
    </div>
  );
};

export default TryOnPage;
