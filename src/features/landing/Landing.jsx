import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ShieldCheck, MapTrifold, ChartLineUp, ArrowRight } from '@phosphor-icons/react';
import { Button } from '../../components/ui/button';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-sky-100">
      
      {/* Enterprise Header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
           <div className="flex items-center gap-2 font-bold text-[17px] tracking-tight text-slate-900">
             <div className="bg-sky-500 text-white rounded-md p-1.5 shadow-sm">
               <Package size={18} weight="bold" />
             </div>
             RTDMS Cloud
           </div>
           
           <div className="flex items-center gap-3">
             <Button variant="ghost" onClick={() => navigate('/login')} className="hidden sm:inline-flex text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 h-9 px-4">
               Log In
             </Button>
             <Button onClick={() => navigate('/register')} className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold h-9 px-4 rounded-md shadow-sm transition-colors">
               Create Account
             </Button>
           </div>
         </div>
      </nav>

      <main className="flex flex-col">
        
        {/* Sleek Hero Section */}
        <section className="relative px-4 pt-24 pb-32 sm:pt-32 sm:pb-40 overflow-hidden">
          <div className="absolute inset-0 bg-slate-50 opacity-50" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #cbd5e1 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          
          <div className="relative max-w-4xl mx-auto text-center z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-semibold text-slate-600 mb-8">
               <span className="flex h-2 w-2 rounded-full bg-sky-500"></span>
               System Core Version 2.0 Live
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6 shadow-sm">
              Logistics management,<br/>engineered for scale.
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              A high-performance orchestration platform. Manage your fleet, track parcels in real-time, and securely process endpoints with zero friction.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button onClick={() => navigate('/register')} className="w-full sm:w-auto h-12 px-8 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-base shadow-sm transition-all flex items-center gap-2">
                Start Building <ArrowRight size={18} weight="bold" />
              </Button>
              <Link to="/track" className="w-full sm:w-auto block">
                <Button variant="outline" className="w-full sm:w-auto h-12 px-8 rounded-lg font-semibold text-slate-700 bg-white border-slate-200 hover:bg-slate-50 text-base shadow-sm transition-all flex items-center gap-2">
                  <MapTrifold size={20} className="text-slate-400" /> Track Open ID
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Technical Features Grid */}
        <section className="bg-white border-t border-slate-200 py-24 px-4 sm:px-6 z-10 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">Infrastructure capabilities</h2>
               <p className="text-slate-500 max-w-2xl mx-auto text-lg">Designed from the ground up to support high-throughput GPS analytics and real-time socket connections.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: <MapTrifold size={24} weight="duotone" />, title: 'Real-Time Telemetry', desc: 'Secure WebSockets stream live GPS coordinate matrices directly from active rider clients to your management overview.' },
                { icon: <ChartLineUp size={24} weight="duotone" />, title: 'Analytics Dashboard', desc: 'Enterprise-grade visualization of live routing data. Minimize constraints and re-allocate resources dynamically.' },
                { icon: <ShieldCheck size={24} weight="duotone" />, title: 'Encrypted Security', desc: 'End-to-end JWT authenticated roles. Admin endpoints are strictly guarded to ensure payload integrities.' }
              ].map((f, i) => (
                <div key={i} className="p-8 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-start group hover:-translate-y-1 transition-transform cursor-default">
                   <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center shadow-sm border border-slate-200 text-sky-600 mb-6 group-hover:scale-110 transition-transform">
                     {f.icon}
                   </div>
                   <h3 className="text-lg font-bold text-slate-900 mb-3">{f.title}</h3>
                   <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 relative z-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight text-white">
             <Package size={20} weight="fill" className="text-sky-500" />
             RTDMS
          </div>
          <p className="text-sm font-medium">&copy; {new Date().getFullYear()} Real-Time Delivery MS. Engineering standards strictly applied.</p>
        </div>
      </footer>
    </div>
  );
}
