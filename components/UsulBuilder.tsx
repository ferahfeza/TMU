import React, { useState } from 'react';
import { Music, Plus, X, Save, Trash2 } from 'lucide-react';
import { Usul, Beat, StrokeType } from '../types';

interface UsulBuilderProps {
  onUsulCreated: (usul: Usul) => void;
}

const STROKE_OPTIONS: { type: StrokeType; label: string; hand: 'right' | 'left' | 'none' }[] = [
  { type: 'Düm', label: 'Düm', hand: 'right' },
  { type: 'Dü', label: 'Dü', hand: 'right' },
  { type: 'Tek', label: 'Tek', hand: 'left' },
  { type: 'Te', label: 'Te', hand: 'left' },
  { type: 'Ke', label: 'Ke', hand: 'left' },
  { type: 'Ka', label: 'Ka', hand: 'left' },
  { type: 'Me', label: 'Me', hand: 'left' },
  { type: 'Teke', label: 'Teke', hand: 'left' },
];

const DURATIONS = [
  { value: 0.5, label: '½ Yarım' },
  { value: 1, label: '1 Tam' },
  { value: 2, label: '2 İki' },
];

const UsulBuilder: React.FC<UsulBuilderProps> = ({ onUsulCreated }) => {
  // Manual State
  const [manualName, setManualName] = useState("");
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [beats, setBeats] = useState<Beat[]>([]);

  const addBeat = (type: StrokeType, hand: 'right' | 'left' | 'none') => {
    const newBeat: Beat = {
      type,
      duration: selectedDuration,
      hand: hand === 'none' ? undefined : hand
    };
    setBeats([...beats, newBeat]);
  };

  const removeBeat = (index: number) => {
    setBeats(beats.filter((_, i) => i !== index));
  };

  const clearBeats = () => {
      if(confirm('Tüm vuruşları silmek istediğinize emin misiniz?')) {
          setBeats([]);
      }
  }

  const saveManual = () => {
    if (!manualName || beats.length === 0) return;
    
    const totalDuration = beats.reduce((acc, b) => acc + b.duration, 0);
    const timeSignature = `${totalDuration}/4`; 

    const newUsul: Usul = {
      id: `custom-${Date.now()}`,
      name: manualName,
      timeSignature,
      description: 'Kullanıcı tarafından oluşturuldu.',
      beats
    };
    
    onUsulCreated(newUsul);
    setManualName("");
    setBeats([]);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-stone-200 overflow-hidden mt-8">
      {/* Header */}
      <div className="px-6 py-4 border-b border-stone-100 bg-stone-50 flex items-center gap-2">
        <Music size={20} className="text-amber-600" />
        <h2 className="text-lg font-bold text-stone-800 tracking-wide">Stüdyo: Manuel Usul Oluştur</h2>
      </div>

      <div className="p-0">
          <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-stone-100">
            
            {/* LEFT PANEL: CONTROLS */}
            <div className="w-full lg:w-4/12 p-6 bg-stone-50/50 space-y-8">
                
                {/* 1. Usul Name */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Usul Adı</label>
                    <input 
                        type="text" 
                        value={manualName}
                        onChange={(e) => setManualName(e.target.value)}
                        placeholder="Usul Adını Girin"
                        className="w-full p-3 bg-white border border-stone-300 rounded-lg text-stone-800 font-medium focus:ring-2 focus:ring-amber-500 outline-none shadow-sm"
                    />
                </div>

                {/* 2. Duration Selection */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">1. Süre Seç</label>
                    <div className="flex bg-stone-200 p-1 rounded-lg">
                        {DURATIONS.map(d => (
                        <button
                            key={d.value}
                            onClick={() => setSelectedDuration(d.value)}
                            className={`flex-1 py-2 rounded-md text-xs sm:text-sm font-bold transition-all ${selectedDuration === d.value ? 'bg-amber-600 text-white shadow-md' : 'text-stone-600 hover:text-stone-800 hover:bg-stone-50/50'}`}
                        >
                            {d.label}
                        </button>
                        ))}
                    </div>
                </div>

                {/* 3. Stroke Grid */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">2. Vuruş Ekle</label>
                    <div className="grid grid-cols-3 gap-3">
                        {STROKE_OPTIONS.map((opt) => (
                        <button
                            key={opt.type}
                            onClick={() => addBeat(opt.type, opt.hand)}
                            className={`
                                h-16 rounded-xl border-2 flex flex-col items-center justify-center transition-all transform active:scale-95 shadow-sm
                                ${opt.hand === 'right'
                                    ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 hover:border-amber-300'
                                    : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300'
                                }
                            `}
                        >
                            <span className="font-bold text-sm md:text-base">{opt.label}</span>
                            <span className="text-[9px] uppercase tracking-widest opacity-60">
                                {opt.hand === 'right' ? 'SAĞ' : 'SOL'}
                            </span>
                        </button>
                        ))}
                    </div>
                </div>

                {/* Save Action */}
                <div className="pt-4 border-t border-stone-200">
                    <button 
                    onClick={saveManual}
                    disabled={!manualName || beats.length === 0}
                    className="w-full bg-stone-800 text-white py-4 rounded-xl text-base font-bold hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                    <Save size={20} />
                    Usulü Kaydet ve Çal
                    </button>
                </div>
            </div>

            {/* RIGHT PANEL: TIMELINE CANVAS */}
            <div className="w-full lg:w-8/12 p-6 bg-white flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
                        <Music size={16} />
                        Vuruş Dizilimi
                    </h3>
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-mono text-stone-500 bg-stone-100 px-2 py-1 rounded">
                            Vuruş: <strong className="text-stone-800">{beats.length}</strong>
                        </span>
                        <span className="text-xs font-mono text-stone-500 bg-stone-100 px-2 py-1 rounded">
                            Süre: <strong className="text-stone-800">{beats.reduce((a,b)=>a+b.duration,0)}</strong>
                        </span>
                        {beats.length > 0 && (
                            <button onClick={clearBeats} className="text-stone-400 hover:text-red-500 transition-colors p-1" title="Temizle">
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {/* The "Canvas" */}
                <div className="flex-1 min-h-[400px] bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200 p-6 relative overflow-hidden">
                    {beats.length === 0 ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-300 pointer-events-none">
                            <Plus size={48} className="mb-2 opacity-50" />
                            <p className="text-lg font-medium">Buraya vuruş ekleyin</p>
                            <p className="text-sm opacity-60">Soldaki panelden vuruş butonlarına tıklayarak usulünüzü oluşturun.</p>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-3 items-start content-start">
                             {beats.map((beat, idx) => {
                                 const widthClass = beat.duration >= 2 ? 'w-32' : beat.duration >= 1 ? 'w-20' : 'w-14';
                                 return (
                                    <div key={idx} className="relative group animate-popIn">
                                        <div 
                                            className={`
                                                h-24 rounded-lg shadow-sm border-2 flex flex-col items-center justify-center transition-all
                                                ${widthClass}
                                                ${(beat.hand === 'right' || (!beat.hand && ['Düm','Dü'].includes(beat.type))) 
                                                        ? 'bg-amber-100 border-amber-200 text-amber-800' 
                                                        : 'bg-emerald-100 border-emerald-200 text-emerald-800'
                                                }
                                            `}
                                        >
                                            <span className="text-xl font-bold">{beat.type}</span>
                                            <div className="mt-2 h-1 w-8 bg-current opacity-20 rounded-full">
                                                <div style={{width: `${Math.min(beat.duration * 50, 100)}%`}} className="h-full bg-current opacity-100 rounded-full"></div>
                                            </div>
                                        </div>
                                        
                                        {/* Beat Number */}
                                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-stone-300 font-bold">
                                            {idx + 1}
                                        </div>

                                        {/* Remove Button */}
                                        <button 
                                            onClick={() => removeBeat(idx)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md hover:scale-110 z-10"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                 );
                             })}
                        </div>
                    )}
                </div>
            </div>

          </div>
      </div>
    </div>
  );
};

export default UsulBuilder;