import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('user');
    return cached ? JSON.parse(cached) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const hydrate = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const profile = await authApi.me();
        setUser(profile);
      } catch (err) {
        logout();
      } finally {
        setLoading(false);
      }
    };
    hydrate();
  }, [token]);

  const persist = (payload) => {
    setUser(payload.user);
    setToken(payload.token);
    localStorage.setItem('user', JSON.stringify(payload.user));
    localStorage.setItem('token', payload.token);
  };

  const login = async (email, password) => {
    setError(null);
    const data = await authApi.login({ email, password });
    persist(data);
    return data.user;
  };

  const register = async (details) => {
    setError(null);
    const data = await authApi.register(details);
    persist(data);
    return data.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
