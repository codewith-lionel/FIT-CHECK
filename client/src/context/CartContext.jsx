import { createContext, useContext, useEffect, useState } from 'react';
import { cartApi } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadCart = async () => {
    if (!token) {
      setCart({ items: [] });
      return;
    }
    try {
      const data = await cartApi.get();
      setCart(data || { items: [] });
    } catch (err) {
      setError('Unable to load cart');
    }
  };

  useEffect(() => {
    loadCart();
  }, [token]);

  const addItem = async (productId, quantity = 1) => {
    if (!token) throw new Error('Login required');
    setLoading(true);
    const data = await cartApi.add(productId, quantity);
    setCart(data);
    setLoading(false);
  };

  const updateQuantity = async (productId, quantity) => {
    if (!token) throw new Error('Login required');
    setLoading(true);
    const data = await cartApi.update(productId, quantity);
    setCart(data);
    setLoading(false);
  };

  const removeItem = async (productId) => {
    if (!token) throw new Error('Login required');
    setLoading(true);
    const data = await cartApi.remove(productId);
    setCart(data);
    setLoading(false);
  };

  return (
    <CartContext.Provider
      value={{ cart, loading, error, addItem, updateQuantity, removeItem, reload: loadCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
