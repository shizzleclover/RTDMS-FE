import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Package, ShieldCheck, SpinnerGap, CaretRight } from '@phosphor-icons/react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleQuickLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoading(true);
    setError('');
    const res = await login(demoEmail, demoPassword);
    setLoading(false);
    if (res.success) {
      navigate(res.role === 'admin' ? '/admin' : res.role === 'rider' ? '/rider' : '/customer');
    } else {
      setError(res.error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      navigate(res.role === 'admin' ? '/admin' : res.role === 'rider' ? '/rider' : '/customer');
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="min-h-screen font-sans flex text-slate-900 bg-white">
      {/* Left Pane - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 xl:px-24">
        
        <div className="w-full max-w-md mx-auto">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2 mb-12 group hover:opacity-80 transition-opacity">
            <div className="bg-sky-500 text-white rounded-md p-1.5 shadow-sm">
              <Package size={20} weight="bold" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">RTDMS</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Welcome back</h1>
            <p className="text-sm text-slate-500 font-medium">Log in to your enterprise workspace.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Email address</label>
              <Input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                className="h-11 border-slate-200 focus:border-sky-500 focus:ring-sky-500/20 shadow-sm rounded-lg"
                placeholder="developer@rtdms.com"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                 <label className="text-sm font-semibold text-slate-700 block">Password</label>
              </div>
              <Input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                className="h-11 border-slate-200 focus:border-sky-500 focus:ring-sky-500/20 shadow-sm rounded-lg" 
                placeholder="••••••••"
              />
            </div>

            {error && (
               <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-medium p-3 rounded-lg flex items-center gap-2">
                  <ShieldCheck size={18} /> {error}
               </div>
            )}

            <Button type="submit" disabled={loading} className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-sm transition-colors text-sm mt-2">
              {loading ? <SpinnerGap className="animate-spin text-white" size={20} /> : 'Sign in to workspace'}
            </Button>

            <div className="relative mt-8 mb-6">
               <div className="absolute inset-0 flex items-center">
                   <div className="w-full border-t border-slate-200"></div>
               </div>
               <div className="relative flex justify-center text-sm">
                   <span className="bg-white px-2 text-slate-500 font-medium whitespace-nowrap">Testing shortcuts</span>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
               <Button type="button" variant="outline" onClick={() => handleQuickLogin('admin@rtdms.com', 'password123')} className="text-xs h-9 border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm">Admin</Button>
               <Button type="button" variant="outline" onClick={() => handleQuickLogin('rider@rtdms.com', 'password123')} className="text-xs h-9 border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm">Rider</Button>
               <Button type="button" variant="outline" onClick={() => handleQuickLogin('customer@rtdms.com', 'password123')} className="text-xs h-9 border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm">Customer</Button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-sky-600 hover:text-sky-700 font-semibold group flex items-center justify-center gap-1 mt-1">
              Create one now <CaretRight size={12} weight="bold" className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </p>
        </div>
      </div>

      {/* Right Pane - Visual Art */}
      <div className="hidden lg:flex w-1/2 bg-slate-50 border-l border-slate-200 items-center justify-center relative overflow-hidden">
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #cbd5e1 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        
        {/* Decorative Graphic Element mimicking Stripe/Vercel technical visuals */}
        <div className="relative z-10 w-full max-w-lg p-12 bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col gap-6 transform -rotate-2 hover:rotate-0 transition-transform duration-700 cursor-default">
           
           <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
              <div className="h-12 w-12 bg-sky-50 text-sky-600 rounded-lg flex items-center justify-center border border-sky-100">
                <ShieldCheck size={28} weight="fill" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Secure Auth Engine</h3>
                <p className="text-sm text-slate-500 font-medium">JWT verification & role mapping</p>
              </div>
           </div>

           <div className="space-y-4">
              {[
                { label: 'Admin Access', desc: 'Full logistical routing control', col: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
                { label: 'Rider Protocol', desc: 'Secure GPS socket transmission', col: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
                { label: 'Customer Portal', desc: 'Read-only telemetry tracking', col: 'text-amber-600 bg-amber-50 border-amber-100' }
              ].map((r, i) => (
                <div key={i} className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${r.col}`}>Valid</div>
                  <div className="flex-1">
                     <p className="text-sm font-semibold text-slate-900">{r.label}</p>
                     <p className="text-xs font-medium text-slate-500">{r.desc}</p>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
