import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      login(data.token, data.user);
      toast.success('Logged in successfully');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 font-sans text-slate-200 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="relative z-10 max-w-md w-full space-y-8 bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-2xl shadow-xl">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-teal-400 rounded-xl flex items-center justify-center mb-4 shadow-lg">
            <CheckSquare className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Sign in to manage your tasks
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 sm:text-sm transition-all"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 sm:text-sm transition-all"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/20"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-teal-400 hover:text-teal-300 transition-colors">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
