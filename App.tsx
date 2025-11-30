import React, { useState, useEffect } from 'react';
import { Play, Pause, Music, Sliders } from 'lucide-react';
import { Usul, StrokeType } from './types';
import { DEFAULT_USULS } from './constants';
import { audioEngine } from './services/audioEngine';
import RhythmTimeline from './components/RhythmTimeline';
import UsulBuilder from './components/UsulBuilder';
import AboutModal from './components/AboutModal';

const App: React.FC = () => {
  const [selectedUsul, setSelectedUsul] = useState<Usul>(DEFAULT_USULS[0]);
  const [customUsuls, setCustomUsuls] = useState<Usul[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(100);
  
  // Audio Frequency Settings
  const [rightFreq, setRightFreq] = useState(100);
  const [leftFreq, setLeftFreq] = useState(400);

  const [currentBeat, setCurrentBeat] = useState<{index: number, type: StrokeType, hand?: 'left' | 'right'} | null>(null);
  const [showAbout, setShowAbout] = useState(false);

  // Load custom usuls from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('customUsuls');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCustomUsuls(parsed);
      } catch (e) {
        console.error("Failed to parse stored usuls", e);
      }
    }
  }, []);

  // Sync audio engine
  useEffect(() => {
    audioEngine.setUsul(selectedUsul);
    audioEngine.setBPM(bpm);
    audioEngine.setFrequencies(rightFreq, leftFreq);
    audioEngine.setOnBeatCallback((index, type, hand) => {
      setCurrentBeat({ index, type, hand });
    });
  }, [selectedUsul, bpm, rightFreq, leftFreq]);

  const togglePlay = async () => {
    if (isPlaying) {
      audioEngine.stop();
      setIsPlaying(false);
      setCurrentBeat(null);
    } else {
      await audioEngine.start();
      setIsPlaying(true);
    }
  };

  const allUsuls = [...DEFAULT_USULS, ...customUsuls];

  const handleUsulChange = (usulId: string) => {
    const usul = allUsuls.find(u => u.id === usulId);
    if (usul) {
      setSelectedUsul(usul);
      setIsPlaying(false);
      audioEngine.stop();
      setCurrentBeat(null);
    }
  };

  const handleUsulCreated = (newUsul: Usul) => {
    // Add to state
    const updatedCustoms = [...customUsuls, newUsul];
    setCustomUsuls(updatedCustoms);
    
    // Save to local storage
    localStorage.setItem('customUsuls', JSON.stringify(updatedCustoms));

    // Select the new usul
    setSelectedUsul(newUsul);
    audioEngine.setUsul(newUsul);
    setIsPlaying(false);
    audioEngine.stop();
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-stone-800 pb-12">
      {/* Header */}
      <header className="bg-stone-900 text-amber-50 py-6 px-4 shadow-lg border-b-4 border-amber-700">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-amber-700 rounded-full">
                <Music size={24} />
             </div>
             <div>
               <h1 className="text-2xl font-bold ornament-font tracking-wide">USÛLZEN</h1>
               <p className="text-xs text-stone-400 tracking-wider">TÜRK MÛSİKÎSİ USÛLLERİ REHBERİ</p>
             </div>
          </div>
          <button 
            onClick={() => setShowAbout(true)}
            className="hidden sm:block text-sm text-stone-400 hover:text-amber-400 transition-colors focus:outline-none"
          >
            Hakkında
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          
          {/* Left Column: Info & Selection (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
              <label className="block text-sm font-bold text-stone-500 mb-2 uppercase tracking-wide">Usul Seç</label>
              <select 
                className="w-full bg-stone-50 border border-stone-300 text-stone-800 text-lg rounded-lg focus:ring-amber-500 focus:border-amber-500 block p-3"
                value={selectedUsul.id}
                onChange={(e) => handleUsulChange(e.target.value)}
              >
                <optgroup label="Klasik Usuller">
                  {DEFAULT_USULS.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.timeSignature})</option>
                  ))}
                </optgroup>
                {customUsuls.length > 0 && (
                  <optgroup label="Benim Usullerim">
                    {customUsuls.map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.timeSignature})</option>
                    ))}
                  </optgroup>
                )}
              </select>

              <div className="mt-6">
                <h2 className="text-xl font-bold text-amber-800 ornament-font mb-2">{selectedUsul.name}</h2>
                <p className="text-stone-600 text-sm leading-relaxed mb-4">{selectedUsul.description}</p>
                <div className="flex items-center gap-2 text-stone-500 text-xs font-mono bg-stone-100 p-2 rounded">
                    <span>ZAMAN: {selectedUsul.timeSignature}</span>
                    <span>•</span>
                    <span>VURUŞ SAYISI: {selectedUsul.beats.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Timeline & Player (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Playback Controls Box */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-amber-600">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-8 mb-6">
                
                {/* Play Button */}
                <button 
                  onClick={togglePlay}
                  className={`flex-shrink-0 w-20 h-20 flex items-center justify-center rounded-full shadow-xl transition-all transform hover:scale-105 active:scale-95 ${
                    isPlaying ? 'bg-amber-100 text-amber-700 ring-4 ring-amber-50' : 'bg-amber-700 text-white ring-4 ring-amber-100'
                  }`}
                >
                  {isPlaying ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-1" />}
                </button>

                {/* Main Controls Container */}
                <div className="flex-1 w-full space-y-4">
                    
                    {/* BPM Control */}
                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                        <div className="flex justify-between text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">
                            <span>Hız (BPM)</span>
                            <span className="text-amber-700 font-mono text-lg">{bpm}</span>
                        </div>
                        <input 
                            type="range" 
                            min="40" 
                            max="240" 
                            value={bpm} 
                            onChange={(e) => setBpm(parseInt(e.target.value))}
                            className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                        />
                    </div>

                    {/* Tone Controls */}
                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                        <div className="flex items-center gap-2 mb-2">
                           <Sliders size={14} className="text-stone-400"/>
                           <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Ton Ayarları</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                           {/* Right Hand Frequency */}
                           <div>
                                <label className="flex justify-between text-[10px] font-bold text-amber-600 uppercase mb-1">
                                    <span>Sağ El (Düm)</span>
                                    <span>{rightFreq} Hz</span>
                                </label>
                                <input 
                                    type="range" 
                                    min="50" 
                                    max="250" 
                                    value={rightFreq} 
                                    onChange={(e) => setRightFreq(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                                />
                           </div>
                           
                           {/* Left Hand Frequency */}
                           <div>
                                <label className="flex justify-between text-[10px] font-bold text-emerald-600 uppercase mb-1">
                                    <span>Sol El (Tek)</span>
                                    <span>{leftFreq} Hz</span>
                                </label>
                                <input 
                                    type="range" 
                                    min="200" 
                                    max="600" 
                                    value={leftFreq} 
                                    onChange={(e) => setLeftFreq(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                />
                           </div>
                        </div>
                    </div>

                </div>
              </div>

              <div className="border-t border-stone-100 pt-6">
                 <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Vuruş Haritası</h3>
                 <RhythmTimeline usul={selectedUsul} currentBeatIndex={currentBeat?.index ?? -1} isPlaying={isPlaying} />
              </div>
            </div>

          </div>
        </div>
        
        {/* Full Width Studio Section */}
        <div className="w-full">
            <UsulBuilder onUsulCreated={handleUsulCreated} />
        </div>

      </main>

      <footer className="mt-12 text-center text-stone-400 text-sm pb-8">
        <p>© 2024 Usulzen. Türk Musikisi Kültürü için tasarlanmıştır.</p>
      </footer>
      
      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
    </div>
  );
};

export default App;