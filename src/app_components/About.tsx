import React from 'react';
import { 
  Globe, 
  RefreshCw, 
  Layers, 
  Settings, 
  Scissors, 
  Link, 
  DollarSign, 
  Rocket, 
  Earth, 
  Flame 
} from 'lucide-react';

const About: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50/30 relative">
            <div className="max-w-6xl mx-auto px-4 py-20 animate-fade-in font-sans">
                {/* Header Tile */}
                <section className="mb-8">
                    <div className="bg-slate-900 text-white p-12 md:p-20 rounded-[40px] text-center space-y-6 shadow-2xl">
                        <div className="flex justify-center">
                            <Globe className="w-8 h-8 text-emerald-400" strokeWidth={1.5} />
                        </div>
                        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter uppercase">
                            Our Model
                        </h1>
                        <p className="text-emerald-400 font-mono tracking-widest text-sm">REVIVETEX / SUSTAINABLE SYSTEMS</p>
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Circular by Design Tile */}
                    <div className="md:col-span-7 bg-white border border-slate-100 p-12 rounded-[40px] flex flex-col justify-center space-y-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                        <RefreshCw className="w-12 h-12 text-emerald-600 group-hover:rotate-180 transition-transform duration-700" strokeWidth={1.5} />
                        <div className="space-y-4">
                            <h2 className="text-4xl font-bold tracking-tight text-slate-900">
                                Circular by Design
                            </h2>
                            <div className="text-2xl text-slate-700 font-medium space-y-1">
                                <p>Textile waste exists.</p>
                                <p>Value is lost.</p>
                            </div>
                            <p className="text-3xl font-bold text-emerald-600 pt-4">
                                We change that.
                            </p>
                        </div>
                    </div>

                    {/* A New System Tile */}
                    <div className="md:col-span-5 bg-white border border-slate-100 p-12 rounded-[40px] flex flex-col justify-between space-y-12 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <Layers className="w-10 h-10 text-slate-900" strokeWidth={1.5} />
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                                A New System
                            </h2>
                            <div className="space-y-4 text-lg text-slate-700 font-medium leading-relaxed">
                                <p>Factories produce more than they use.</p>
                                <p>Small businesses need more than they find.</p>
                                <p className="text-slate-400 font-normal">The connection is missing.</p>
                                <p className="text-slate-900 font-bold text-xl">We build it.</p>
                            </div>
                        </div>
                    </div>

                    {/* How It Works Tiles */}
                    <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {['Source.', 'Structure.', 'Distribute.'].map((step, i) => (
                            <div key={i} className="p-12 bg-white border border-slate-100 rounded-[40px] space-y-4 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                                <span className="text-slate-400 font-mono text-sm group-hover:text-emerald-500 transition-colors font-bold">0{i+1}</span>
                                <p className="text-4xl font-bold text-slate-900">{step}</p>
                                <p className="text-slate-700 text-base font-medium pt-4 leading-relaxed">
                                    {i === 0 && "Identifying high-quality surplus at the source."}
                                    {i === 1 && "Organizing inventory for real-world demand."}
                                    {i === 2 && "Connecting materials to creators worldwide."}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Two Models Tiles */}
                    <div className="md:col-span-6 bg-white border border-slate-100 p-12 rounded-[40px] space-y-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="space-y-2">
                            <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400 font-bold">Model 1</p>
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Trading</h2>
                        </div>
                        <div className="text-slate-700 space-y-2 text-2xl font-medium">
                            <p>We buy.</p>
                            <p>We supply.</p>
                        </div>
                        <p className="text-emerald-600 font-bold text-xl">Fast and reliable.</p>
                    </div>

                    <div className="md:col-span-6 bg-slate-50 border border-slate-200 p-12 rounded-[40px] space-y-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="space-y-2">
                            <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400 font-bold">Model 2</p>
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Platform</h2>
                            <p className="text-xs uppercase tracking-[0.25em] text-emerald-600 font-bold">Reflaunt-inspired</p>
                        </div>
                        <div className="text-slate-700 space-y-2 text-2xl font-medium">
                            <p>Factories list.</p>
                            <p>We connect.</p>
                            <p>We enable.</p>
                        </div>
                    </div>

                    {/* The Flow Tile */}
                    <div className="md:col-span-12 bg-emerald-50/50 border border-emerald-100 p-8 md:p-12 rounded-[40px] text-center space-y-12 shadow-sm hover:shadow-lg transition-all duration-500">
                        <div className="space-y-2">
                            <Link className="w-8 h-8 text-emerald-600 mx-auto" strokeWidth={1.5} />
                            <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-900">The Flow</h2>
                        </div>

                        <div className="max-w-4xl mx-auto space-y-12">
                            {/* Chain 1 */}
                            <div className="space-y-4">
                                <p className="text-[10px] uppercase tracking-[0.4em] text-emerald-800/60 font-black">Model 1</p>
                                <div className="text-2xl md:text-5xl font-black text-slate-900 flex items-center justify-center gap-4 md:gap-10">
                                    <span>Factory</span>
                                    <span className="text-emerald-400">→</span>
                                    <div className="flex flex-col items-center">
                                        <span>Platform</span>
                                        <span className="text-[10px] md:text-xs text-emerald-600 font-bold tracking-widest mt-1 uppercase">Distributed Marketplace</span>
                                    </div>
                                    <span className="text-emerald-400">→</span>
                                    <span>Buyer</span>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="w-16 h-px bg-emerald-200 mx-auto opacity-40"></div>

                            {/* Chain 2 */}
                            <div className="space-y-4">
                                <p className="text-[10px] uppercase tracking-[0.4em] text-emerald-800/60 font-black">Model 2</p>
                                <div className="text-2xl md:text-5xl font-black text-slate-900 flex items-center justify-center gap-4 md:gap-10">
                                    <span>Factory/Buyer</span>
                                    <span className="text-emerald-400">→</span>
                                    <div className="flex flex-col items-center">
                                        <span>Platform</span>
                                        <span className="text-[10px] md:text-xs text-emerald-600 font-bold tracking-widest mt-1 uppercase">Circular Marketplace</span>
                                    </div>
                                    <span className="text-emerald-400">→</span>
                                    <span>Consumer</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center gap-8 text-emerald-800 font-bold text-sm pt-4">
                            <span>Simple.</span>
                            <span>Transparent.</span>
                            <span>Scalable.</span>
                        </div>
                    </div>

                    {/* Value Created Tile */}
                    <div className="md:col-span-8 bg-white border border-slate-100 p-12 rounded-[40px] space-y-12 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center space-x-4">
                            <DollarSign className="w-8 h-8 text-slate-900" strokeWidth={2} />
                            <h2 className="text-2xl font-bold text-slate-900">Value Created</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400">For factories</p>
                                <p className="text-xl text-slate-900 font-bold">Recover lost value.</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400">For buyers</p>
                                <p className="text-xl text-slate-900 font-bold">Access better materials.</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400">For the system</p>
                                <p className="text-xl text-emerald-600 font-black">Reduce waste.</p>
                            </div>
                        </div>
                    </div>

                    {/* Why It Matters Tile */}
                    <div className="md:col-span-4 bg-white border border-slate-100 p-12 rounded-[40px] space-y-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <Rocket className="w-8 h-8 text-slate-900" strokeWidth={1.5} />
                        <h2 className="text-2xl font-bold text-slate-900">Why It Matters</h2>
                        <div className="text-xl text-slate-800 space-y-2 font-bold">
                            <p>Less waste.</p>
                            <p>More access.</p>
                            <p>Smarter flow.</p>
                        </div>
                    </div>

                    {/* Vision Tile */}
                    <div className="md:col-span-12 bg-white border border-slate-100 p-12 md:p-20 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-12 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="space-y-6">
                            <Earth className="w-12 h-12 text-emerald-600" strokeWidth={1.5} />
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Our Vision</h2>
                        </div>
                        <div className="text-2xl md:text-4xl text-slate-800 space-y-2 font-bold text-right">
                            <p>From waste to value.</p>
                            <p>From Bangladesh to the world.</p>
                        </div>
                    </div>

                    {/* Final Highlight Tile */}
                    <div className="md:col-span-12 py-20 text-center space-y-8">
                        <Flame className="w-10 h-10 text-orange-500 animate-pulse mx-auto" strokeWidth={2} />
                        <p className="text-4xl md:text-7xl font-black text-slate-900 leading-tight tracking-tighter uppercase">
                            We don’t just sell fabric.<br/>
                            <span className="text-emerald-600">We redesign the system.</span>
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                  @keyframes fade-in {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                  }
                  .animate-fade-in {
                    animation: fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                  }
               `}</style>
        </div>
    );
};

export default About;
