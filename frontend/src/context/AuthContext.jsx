import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('parcelpath_user') || 'null')); const [loading, setLoading] = useState(true);
  useEffect(() => { if (!localStorage.getItem('parcelpath_token')) return setLoading(false); api.get('/auth/me').then(({ data }) => setUser(data.user)).catch(() => { localStorage.removeItem('parcelpath_token'); localStorage.removeItem('parcelpath_user'); setUser(null); }).finally(() => setLoading(false)); }, []);
  const login = ({ token, user: next }) => { localStorage.setItem('parcelpath_token', token); localStorage.setItem('parcelpath_user', JSON.stringify(next)); setUser(next); };
  const logout = () => { localStorage.removeItem('parcelpath_token'); localStorage.removeItem('parcelpath_user'); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}
