import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Package, ShieldCheck, SpinnerGap, CaretRight, MapTrifold, ChartPieSlice } from '@phosphor-icons/react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await register(name, email, password, role);
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
        
        <div className="w-full max-w-md mx-auto py-12">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2 mb-10 group hover:opacity-80 transition-opacity">
            <div className="bg-sky-500 text-white rounded-md p-1.5 shadow-sm">
              <Package size={20} weight="bold" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">RTDMS</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Create workspace</h1>
            <p className="text-sm text-slate-500 font-medium">Join the logistics network as an admin, rider, or customer.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Full Name</label>
              <Input 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
                className="h-11 border-slate-200 focus:border-sky-500 focus:ring-sky-500/20 shadow-sm rounded-lg"
                placeholder="Alexander Doe"
              />
            </div>

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
              <label className="text-sm font-semibold text-slate-700 block">Password</label>
              <Input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                className="h-11 border-slate-200 focus:border-sky-500 focus:ring-sky-500/20 shadow-sm rounded-lg" 
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2 pb-2">
              <label className="text-sm font-semibold text-slate-700 block">Role Designation</label>
              <div className="grid grid-cols-3 gap-3">
                {['customer', 'rider', 'admin'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`h-11 border rounded-lg text-sm font-semibold capitalize transition-all ${
                      role === r 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-sm' 
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {error && (
               <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-medium p-3 rounded-lg flex items-center gap-2">
                  <ShieldCheck size={18} /> {error}
               </div>
            )}

            <Button type="submit" disabled={loading} className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-sm transition-colors text-sm mt-2">
              {loading ? <SpinnerGap className="animate-spin text-white" size={20} /> : 'Create Configuration'}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-sky-600 hover:text-sky-700 font-semibold group flex items-center justify-center gap-1 mt-1">
              Sign in securely <CaretRight size={12} weight="bold" className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </p>
        </div>
      </div>

      {/* Right Pane - Visual Art */}
      <div className="hidden lg:flex w-1/2 bg-slate-50 border-l border-slate-200 flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #cbd5e1 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        
        {/* Decorative Graphic Element */}
        <div className="relative z-10 w-full max-w-lg">
           <div className="flex bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden transform translate-x-4 translate-y-4 hover:translate-x-0 transition-transform duration-700">
             <div className="w-1/3 bg-slate-50 border-r border-slate-100 p-6 flex flex-col gap-6">
                <div className="h-4 w-12 bg-slate-200 rounded-sm"></div>
                <div className="space-y-4">
                  {[1,2,3,4].map(i => <div key={i} className="h-2 w-full bg-slate-200 rounded-full"></div>)}
                </div>
                <div className="mt-auto h-8 w-8 rounded bg-sky-100 text-sky-600 flex items-center justify-center">
                   <ChartPieSlice size={16} weight="fill" />
                </div>
             </div>
             <div className="w-2/3 p-8 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-100 text-xs font-bold text-slate-600 mb-6 w-max">
                  <MapTrifold size={14} className="text-sky-600" weight="fill" /> Telemetry Initialized
                </div>
                <h3 className="text-2xl font-black text-slate-900 leading-tight mb-2">Build the network.</h3>
                <p className="text-sm font-medium text-slate-500 leading-relaxed shadow-sm">
                  Connecting to the RTDMS infrastructure establishes a permanent socket tunnel for real-time telemetry processing and distribution.
                </p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
