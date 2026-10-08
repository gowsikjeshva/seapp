import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function AuthPage({ mode }) {
  const loginMode = mode === 'login';
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer', vehicleNumber: '' });
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const { login } = useAuth(); const navigate = useNavigate(); const location = useLocation();
  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setError('');
    try { const { data } = await api.post(`/auth/${loginMode ? 'login' : 'register'}`, form); login(data); navigate(location.state?.from?.pathname || '/dashboard'); }
    catch (err) { setError(err.response?.data?.message || 'Something went wrong.'); }
    finally { setBusy(false); }
  };
  return <main className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-md place-items-center px-4"><form className="card w-full" onSubmit={submit}>
    <Link className="text-sm font-bold text-brand-600" to="/">← ParcelPath</Link>
    <h1 className="mt-6 text-2xl font-bold">{loginMode ? 'Welcome back' : 'Create your account'}</h1>
    <p className="mt-1 text-sm text-slate-500">{loginMode ? 'Sign in to track or manage deliveries.' : 'Register as a customer or delivery driver.'}</p>
    {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <div className="mt-5 space-y-4">
      {!loginMode && <><div><label>Name</label><input required minLength="2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}/></div><div><label>Account type</label><select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option value="customer">Customer — track my deliveries</option><option value="driver">Driver — update delivery truck status</option><option value="admin">Admin — create and manage shipments</option></select></div>{form.role === 'driver' && <div><label>Truck / vehicle number</label><input required minLength="2" value={form.vehicleNumber} onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })} placeholder="e.g. TN 01 AB 1234"/></div>}</>}
      <div><label>Email</label><input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}/></div><div><label>Password</label><input type="password" required minLength="8" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}/></div>
    </div>
    <button className="btn-primary mt-6 w-full" disabled={busy}>{busy ? 'Please wait…' : loginMode ? 'Sign in' : 'Create account'}</button>
    <p className="mt-5 text-center text-sm text-slate-600">{loginMode ? 'New to ParcelPath?' : 'Already have an account?'} <Link className="font-semibold text-brand-600" to={loginMode ? '/register' : '/login'}>{loginMode ? 'Create an account' : 'Sign in'}</Link></p>
  </form></main>;
}
