"use client";
export const dynamic = "force-dynamic"; // Add this line
import { supabase } from "@/lib/supabase";
import { useState, useEffect, useMemo } from "react"; 
import { usePersonaStore } from "@/store/usePersonaStore";
import { calculateCategory } from "@/lib/matchingEngine";
import { 
  Search, 
  ShoppingBag, 
  CheckCircle2, 
  Ruler, 
  User, 
  ChevronRight 
} from "lucide-react";

export default function AptyleHome() {
  const { user, setUserInfo, metrics, setMetrics, category, setCategory } = usePersonaStore();
  const [step, setStep] = useState(1); 
  const [cloudOutfits, setCloudOutfits] = useState<any[]>([]); 

  // --- STEP 1: FETCH OUTFITS FROM SUPABASE ---
  useEffect(() => {
    const fetchOutfits = async () => {
      const { data, error } = await supabase
        .from('outfits')
        .select('*');
      
      if (data) {
        setCloudOutfits(data);
        console.log("Cloud outfits loaded:", data.length);
      }
      if (error) console.error("Error fetching outfits:", error);
    };

    fetchOutfits();
  }, []);

  // --- STEP 2: SMART FILTERING LOGIC ---
  // This cleans strings like "Athletic/V-Shape" and "athletic_v_shape" 
  // into "athleticvshape" so they match perfectly.
  const filteredOutfits = useMemo(() => {
    if (!category) return cloudOutfits;

    const normalize = (str: string) => 
      str?.toLowerCase().replace(/[^a-z0-9]/g, "") || "";

    const userCategory = normalize(category);
    
    const matched = cloudOutfits.filter(outfit => 
      normalize(outfit.category) === userCategory
    );

    // If matches are found, return only those. 
    // If absolutely zero matches found, return all as a safety fallback.
    return matched.length > 0 ? matched : cloudOutfits;
  }, [category, cloudOutfits]);

  const handleComplete = async () => {
    const res = calculateCategory(metrics.height, metrics.weight, metrics.shoulderType, metrics.chestType);
    setCategory(res);

    try {
      const { error } = await supabase
        .from('profiles')
        .insert([
          { 
            full_name: user.name, 
            email: user.email, 
            height: metrics.height, 
            weight: metrics.weight,
            shoulder_type: metrics.shoulderType,
            chest_type: metrics.chestType,
            persona_category: res 
          }
        ]);

      if (error) console.error("Database Error:", error.message);
    } catch (err) {
      console.error("Connection Error:", err);
    }

    setStep(3);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-[#f17a28]/30 font-sans">
      
      {/* --- NAVIGATION --- */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-6 border-b border-gray-50 sticky top-0 bg-white z-[100]">
        <div className="flex flex-col leading-tight">
          <h1 className="text-3xl font-bold text-[#f17a28] tracking-tight">Aptyle</h1>
          <span className="text-[8px] uppercase tracking-[0.2em] text-gray-400 font-bold">Intelligent Style</span>
        </div>
        
        <div className="hidden md:flex gap-10 text-[10px] font-black uppercase tracking-[0.15em] text-gray-500">
          <a href="#" className="hover:text-[#f17a28] transition-colors">Collections</a>
          <a href="#" className="hover:text-[#f17a28] transition-colors">Style Guide</a>
          <a href="#" className="hover:text-[#f17a28] transition-colors">About</a>
        </div>

        <div className="flex items-center gap-6">
          <Search size={18} className="cursor-pointer hover:text-[#f17a28]" />
          <div className="relative cursor-pointer group">
            <ShoppingBag size={18} className="group-hover:text-[#f17a28]" />
            <span className="absolute -top-1 -right-1 bg-[#f17a28] text-white text-[8px] w-3 h-3 flex items-center justify-center rounded-full">0</span>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto py-12 md:py-20 px-6">
        
        {/* --- STEP PROGRESS BAR --- */}
        {step < 3 && (
          <div className="mb-16">
            <div className="flex justify-between mb-4">
              <span className={`text-[10px] font-black uppercase tracking-widest ${step >= 1 ? 'text-[#f17a28]' : 'text-gray-300'}`}>01. Identification</span>
              <span className={`text-[10px] font-black uppercase tracking-widest ${step >= 2 ? 'text-[#f17a28]' : 'text-gray-300'}`}>02. Body Persona</span>
            </div>
            <div className="h-1 w-full bg-gray-100 overflow-hidden">
              <div 
                className="h-full bg-[#f17a28] transition-all duration-700 ease-in-out" 
                style={{ width: step === 1 ? '50%' : '100%' }}
              ></div>
            </div>
          </div>
        )}

        {/* --- STEP 1: REGISTER --- */}
        {step === 1 && (
          <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-700">
            <h2 className="text-5xl font-black uppercase tracking-tighter leading-none mb-6">
              Establish Your<br />Identity.
            </h2>
            <p className="text-gray-400 font-medium mb-12 max-w-md">Create your profile to unlock our proprietary Intelligent Fit algorithm.</p>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="text-[9px] font-bold uppercase text-gray-400 mb-2 block group-focus-within:text-[#f17a28]">Full Name</label>
                  <input 
                    type="text" placeholder="e.g. Rahul Sharma" 
                    className="w-full p-5 bg-gray-50 border-b-2 border-transparent outline-none focus:border-[#f17a28] focus:bg-white transition-all font-bold text-sm"
                    onChange={(e) => setUserInfo({ ...user, name: e.target.value })}
                  />
                </div>
                <div className="group">
                  <label className="text-[9px] font-bold uppercase text-gray-400 mb-2 block group-focus-within:text-[#f17a28]">Email Address</label>
                  <input 
                    type="email" placeholder="rahul@example.com" 
                    className="w-full p-5 bg-gray-50 border-b-2 border-transparent outline-none focus:border-[#f17a28] focus:bg-white transition-all font-bold text-sm"
                    onChange={(e) => setUserInfo({ ...user, email: e.target.value })}
                  />
                </div>
              </div>
              <button 
                onClick={() => setStep(2)}
                disabled={!user.name || !user.email}
                className="flex items-center gap-4 bg-black text-white px-12 py-6 font-black uppercase text-[11px] tracking-[0.25em] hover:bg-[#f17a28] disabled:bg-gray-200 disabled:cursor-not-allowed transition-all shadow-xl"
              >
                Proceed to Sizing <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* --- STEP 2: PERSONA QUIZ --- */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-700">
            <h2 className="text-5xl font-black uppercase tracking-tighter leading-none mb-4">
              Body Analytics.
            </h2>
            <p className="text-gray-400 font-medium mb-12">Precision data for a tailored shopping experience.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <Ruler size={14} className="text-[#f17a28]"/> Vertical & Mass
                  </label>
                  <div className="flex gap-4">
                    <input 
                      type="number" placeholder="HEIGHT (CM)" 
                      className="flex-1 p-5 bg-gray-50 outline-none focus:ring-2 focus:ring-[#f17a28] font-bold text-sm"
                      onChange={(e) => setMetrics({ height: Number(e.target.value) })}
                    />
                    <input 
                      type="number" placeholder="WEIGHT (KG)" 
                      className="flex-1 p-5 bg-gray-50 outline-none focus:ring-2 focus:ring-[#f17a28] font-bold text-sm"
                      onChange={(e) => setMetrics({ weight: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <User size={14} className="text-[#f17a28]"/> Shoulder Architecture
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['average', 'broad', 'sloping'].map((type) => (
                      <button 
                        key={type}
                        onClick={() => setMetrics({ shoulderType: type })}
                        className={`py-4 text-[9px] font-black uppercase tracking-tighter border-2 transition-all ${metrics.shoulderType === type ? 'border-[#f17a28] bg-[#f17a28] text-white' : 'border-gray-100 hover:border-gray-300'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Chest Build</label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: 'flat', label: 'Flat / Lean' },
                      { id: 'average', label: 'Average / Proportional' },
                      { id: 'muscular', label: 'Broad / Developed' }
                    ].map((item) => (
                      <button 
                        key={item.id}
                        onClick={() => setMetrics({ chestType: item.id })}
                        className={`p-5 text-left text-xs font-bold uppercase border-2 flex justify-between items-center transition-all ${metrics.chestType === item.id ? 'border-[#f17a28] bg-white text-[#f17a28]' : 'border-gray-50 bg-gray-50'}`}
                      >
                        {item.label}
                        {metrics.chestType === item.id && <CheckCircle2 size={16} />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleComplete}
              disabled={!metrics.height || !metrics.weight || !metrics.shoulderType || !metrics.chestType}
              className="mt-16 w-full bg-black text-white py-7 font-black uppercase text-xs tracking-[0.4em] hover:bg-[#f17a28] transition-all shadow-2xl disabled:bg-gray-100"
            >
              Analyze Intelligent Fit
            </button>
          </div>
        )}

        {/* --- STEP 3: RESULTS --- */}
        {step === 3 && (
          <div className="animate-in zoom-in-95 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-1 w-10 bg-[#f17a28]"></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f17a28]">Curated for you</span>
                </div>
                <h2 className="text-5xl font-black uppercase tracking-tighter">Recommended Looks</h2>
                <p className="text-gray-400 mt-2 font-medium">Hello {user.name.split(' ')[0]}, here is your {category?.replace('_', ' ')} edit.</p>
              </div>
              <button 
                onClick={() => setStep(1)} 
                className="text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-[#f17a28] transition-colors border-b border-gray-100 pb-1"
              >
                Reset Persona
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-16">
              {filteredOutfits.map((outfit) => (
                <div key={outfit.id} className="group flex flex-col cursor-pointer">
                  <div className="aspect-[3/4] bg-gray-50 overflow-hidden relative mb-8">
                    <img 
                      src={outfit.image} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                      alt={outfit.name} 
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                    <div className="absolute bottom-0 left-0 bg-white p-4 group-hover:translate-x-2 transition-transform shadow-sm">
                       <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Persona Match</span>
                       <p className="text-[11px] font-bold text-[#f17a28] uppercase">{outfit.category}</p>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-[10px] font-bold text-[#f17a28] uppercase tracking-[0.2em]">{outfit.brand}</span>
                    <h3 className="text-2xl font-black uppercase tracking-tighter mt-1 group-hover:text-[#f17a28] transition-colors">{outfit.name}</h3>
                    <p className="text-gray-400 text-xs mt-4 leading-relaxed font-medium max-w-sm">{outfit.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-6">
                      {outfit.items?.map((item: string) => (
                        <span key={item} className="bg-gray-50 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-gray-500 border border-gray-100">{item}</span>
                      ))}
                    </div>
                    
                    <button className="w-full mt-10 bg-black text-white py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#f17a28] transition-all">
                      Shop Full Look — ${outfit.price}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* --- FOOTER --- */}
      <footer className="mt-40 border-t border-gray-50 px-12 py-20 text-center">
        <h2 className="text-xl font-bold text-[#f17a28] mb-4">Aptyle</h2>
        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.5em] mb-12">Intelligent Style © 2025</p>
        <div className="flex justify-center gap-12 text-[10px] font-black uppercase tracking-widest text-gray-400">
           <a href="#" className="hover:text-black transition-colors">Instagram</a>
           <a href="#" className="hover:text-black transition-colors">Twitter</a>
           <a href="#" className="hover:text-black transition-colors">Support</a>
        </div>
      </footer>
    </div>
  );
}