import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ShieldCheck, MapTrifold, ChartLineUp, ArrowRight, Plant, Timer, Truck } from '@phosphor-icons/react';
import { Button } from '../../components/ui/button';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-100">
      
      {/* Enterprise Header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
           <div className="flex items-center gap-2 font-bold text-[17px] tracking-tight text-slate-900">
             <div className="bg-emerald-600 text-white rounded-md p-1.5 shadow-sm">
               <Plant size={18} weight="bold" />
             </div>
             RTDMS
           </div>
           
           <div className="flex items-center gap-3">
             <Button variant="ghost" onClick={() => navigate('/login')} className="hidden sm:inline-flex text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 h-9 px-4">
               Log In
             </Button>
             <Button onClick={() => navigate('/register')} className="bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold h-9 px-4 rounded-md shadow-sm transition-colors">
               Get Started
             </Button>
           </div>
         </div>
      </nav>

      <main className="flex flex-col">
        
        {/* Hero Section */}
        <section className="relative px-4 pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden bg-white">
          <div className="absolute inset-0 bg-white opacity-50" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #d1fae5 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          
          <div className="relative max-w-7xl mx-auto z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Left — Text */}
              <div className="text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 shadow-sm text-xs font-semibold text-emerald-700 mb-8">
                   <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                   Farm-to-Market Platform
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
                  Fresh produce,<br/>delivered before<br/>it spoils.
                </h1>
                <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-xl leading-relaxed">
                  A real-time delivery management system for perishable agricultural produce in Lagos. Track shipments, monitor freshness, and prioritize deliveries based on spoilage risk.
                </p>
                
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <Button onClick={() => navigate('/register')} className="w-full sm:w-auto h-12 px-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base shadow-sm transition-all flex items-center gap-2">
                    Start Managing Deliveries <ArrowRight size={18} weight="bold" />
                  </Button>
                  <Link to="/track" className="w-full sm:w-auto block">
                    <Button variant="outline" className="w-full sm:w-auto h-12 px-8 rounded-lg font-semibold text-slate-700 bg-white border-slate-200 hover:bg-slate-50 text-base shadow-sm transition-all flex items-center gap-2">
                      <MapTrifold size={20} className="text-slate-400" /> Track a Delivery
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right — Hero Image */}
              <div className="relative hidden lg:block">
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200 transform rotate-1 hover:rotate-0 transition-transform duration-700">
                  <img 
                    src="/farm-hero.png" 
                    alt="Fresh agricultural produce being prepared for delivery" 
                    className="w-full h-[420px] object-cover"
                  />
                </div>
                {/* Floating stat card */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg border border-slate-200 p-4 flex items-center gap-3 transform hover:scale-105 transition-transform">
                  <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center border border-emerald-100">
                    <Timer size={22} weight="fill" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Avg. Delivery Time</p>
                    <p className="text-lg font-bold text-slate-900">2.4 hrs</p>
                  </div>
                </div>
                {/* Floating freshness card */}
                <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg border border-slate-200 p-4 flex items-center gap-3 transform hover:scale-105 transition-transform">
                  <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center border border-amber-100">
                    <Plant size={22} weight="fill" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Freshness Score</p>
                    <p className="text-lg font-bold text-emerald-600">94%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stakeholder Roles Strip */}
        <section className="bg-emerald-700 py-8 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-white">
            {[
              { role: 'Farmer', desc: 'Create delivery requests and track your produce in real-time.' },
              { role: 'Dispatcher', desc: 'Assign agents, prioritize by perishability, and monitor all deliveries.' },
              { role: 'Delivery Agent', desc: 'Transport goods, broadcast live GPS, and update delivery status.' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <h3 className="text-lg font-bold">{s.role}</h3>
                <p className="text-sm text-emerald-100 max-w-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section className="bg-white border-t border-slate-200 py-24 px-4 sm:px-6 z-10 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">Built for perishable goods</h2>
               <p className="text-slate-500 max-w-2xl mx-auto text-lg">Purpose-built features to reduce post-harvest losses and improve coordination across the agricultural supply chain.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: <Timer size={24} weight="duotone" />, title: 'Spoilage-Aware Tracking', desc: 'Monitor time in transit and freshness levels in real-time. The system continuously recalculates spoilage as delivery progresses.' },
                { icon: <ChartLineUp size={24} weight="duotone" />, title: 'Priority-Based Dispatch', desc: 'Deliveries with higher perishability are automatically flagged for urgent dispatch. No more first-come, first-served.' },
                { icon: <ShieldCheck size={24} weight="duotone" />, title: 'Secure Role-Based Access', desc: 'Farmers, dispatchers, and delivery agents each get tailored dashboards with JWT-authenticated endpoints.' }
              ].map((f, i) => (
                <div key={i} className="p-8 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-start group hover:-translate-y-1 transition-transform cursor-default">
                   <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center shadow-sm border border-slate-200 text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                     {f.icon}
                   </div>
                   <h3 className="text-lg font-bold text-slate-900 mb-3">{f.title}</h3>
                   <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dashboard Preview Section */}
        <section className="py-24 px-4 sm:px-6 bg-slate-50 border-t border-slate-200 relative">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">
                  Coordinate your entire fleet from one dashboard
                </h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  Dispatchers get a bird-eye view of all active shipments, delivery agent locations, and spoilage alerts — all updating in real-time via WebSocket connections.
                </p>
                <ul className="space-y-4">
                  {[
                    'Live GPS tracking of delivery agents on an interactive map',
                    'Automatic spoilage calculation based on time in transit',
                    'Priority scores: Perishability Rate × Time in Transit',
                    'Real-time status updates across all stakeholder dashboards',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                      <div className="h-5 w-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mt-0.5 shrink-0">
                        <ArrowRight size={10} weight="bold" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200">
                  <img 
                    src="/dashboard-preview.png" 
                    alt="RTDMS dispatcher dashboard showing live delivery tracking" 
                    className="w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 relative z-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight text-white">
             <Plant size={20} weight="fill" className="text-emerald-500" />
             RTDMS
          </div>
          <p className="text-sm font-medium">&copy; {new Date().getFullYear()} Real-Time Farm-to-Market Delivery Management System. Reducing post-harvest losses in Lagos.</p>
        </div>
      </footer>
    </div>
  );
}
