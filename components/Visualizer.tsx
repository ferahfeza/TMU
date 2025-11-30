import React, { useEffect, useState } from 'react';
import { StrokeType } from '../types';

interface VisualizerProps {
  currentBeat: { index: number; type: StrokeType; hand?: 'left' | 'right' } | null;
  isPlaying: boolean;
}

const Visualizer: React.FC<VisualizerProps> = ({ currentBeat, isPlaying }) => {
  const [rightHandAnim, setRightHandAnim] = useState('');
  const [leftHandAnim, setLeftHandAnim] = useState('');
  const [rightKneeRipple, setRightKneeRipple] = useState(false);
  const [leftKneeRipple, setLeftKneeRipple] = useState(false);

  useEffect(() => {
    if (!currentBeat || !isPlaying) return;

    const { type, hand } = currentBeat;

    // Reset animations to re-trigger reflow if needed
    setRightHandAnim('');
    setLeftHandAnim('');
    setRightKneeRipple(false);
    setLeftKneeRipple(false);

    // Determine hand side
    // If hand is explicitly set, use it.
    // Otherwise, default: 
    // Left: Tek, Te, Ke, Me, Teke, Hek
    // Right: Düm, Ka, Dü
    // Note: Ka is traditionally Right (Sako) unless specified otherwise (like in Sofyan).
    const isLeft = hand === 'left' || (!hand && ['Tek', 'Te', 'Ke', 'Me', 'Teke', 'Hek'].includes(type));
    const isRight = hand === 'right' || (!hand && ['Düm', 'Dü', 'Ka'].includes(type));

    // Small timeout to allow state reset for re-animation
    const t = setTimeout(() => {
      if (isLeft) {
        // Left hand strike -> Shown on Right side of screen (Mirror Mode)
        setLeftHandAnim('hit-left');
        setLeftKneeRipple(true);
      } else if (isRight) {
        // Right hand strike -> Shown on Left side of screen (Mirror Mode)
        setRightHandAnim('hit-right');
        setRightKneeRipple(true);
      }
    }, 10);

    return () => clearTimeout(t);
  }, [currentBeat, isPlaying]);

  return (
    <div className="relative w-full h-80 bg-stone-100 rounded-xl overflow-hidden shadow-inner flex justify-center items-end pb-4 border border-stone-200">
      {/* Background Texture/Rug Pattern suggestion */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

      <div className="flex gap-16 relative z-10">
        
        {/* Left Side of Screen (Mirror Mode: Represents Teacher's Right Side / DÜM) */}
        <div className="relative group">
           {/* Thigh/Knee Graphic */}
           <div className={`w-32 h-40 bg-amber-800 rounded-t-full rounded-b-lg shadow-lg transform rotate-6 relative overflow-hidden transition-colors duration-100 ${rightKneeRipple ? 'bg-amber-600' : ''}`}>
               <div className="absolute top-0 w-full h-full bg-gradient-to-b from-white/10 to-black/20"></div>
           </div>
           
           {/* Impact Ripple */}
           {rightKneeRipple && (
             <div className="absolute top-10 left-1/2 -translate-x-1/2 w-20 h-20 border-4 border-amber-400 rounded-full ripple pointer-events-none"></div>
           )}

           {/* Hand Visual (Context: Teacher's Right Hand on Viewer's Left) */}
           <div className={`absolute -top-16 -left-4 w-28 h-28 pointer-events-none hand ${rightHandAnim}`}>
             {/* Hand Graphic (SVG) */}
             <svg viewBox="0 0 100 100" className="w-full h-full fill-stone-800 drop-shadow-xl">
                <path d="M20,10 C20,10 5,30 15,50 C20,60 40,70 60,60 C70,55 80,40 75,30 C70,20 60,10 50,20 Z" transform="rotate(-20 50 50)"/>
                <rect x="40" y="-20" width="20" height="60" rx="10" transform="rotate(-10 50 50)" />
             </svg>
             <div className="text-center font-bold text-stone-500 mt-2 text-sm tracking-widest">SAĞ (DÜM)</div>
           </div>
        </div>

        {/* Right Side of Screen (Mirror Mode: Represents Teacher's Left Side / TEK) */}
        <div className="relative group">
           {/* Thigh/Knee Graphic */}
           <div className={`w-32 h-40 bg-amber-800 rounded-t-full rounded-b-lg shadow-lg transform -rotate-6 relative overflow-hidden transition-colors duration-100 ${leftKneeRipple ? 'bg-amber-600' : ''}`}>
               <div className="absolute top-0 w-full h-full bg-gradient-to-b from-white/10 to-black/20"></div>
           </div>

           {/* Impact Ripple */}
           {leftKneeRipple && (
             <div className="absolute top-10 left-1/2 -translate-x-1/2 w-24 h-24 border-4 border-amber-400 rounded-full ripple pointer-events-none"></div>
           )}

           {/* Hand Visual (Context: Teacher's Left Hand on Viewer's Right) */}
           <div className={`absolute -top-16 -right-4 w-28 h-28 pointer-events-none hand ${leftHandAnim}`}>
             {/* Hand Graphic (SVG) */}
             <svg viewBox="0 0 100 100" className="w-full h-full fill-stone-800 drop-shadow-xl">
                <path d="M20,10 C20,10 5,30 15,50 C20,60 40,70 60,60 C70,55 80,40 75,30 C70,20 60,10 50,20 Z" transform="scale(-1, 1) translate(-100, 0) rotate(-20 50 50)"/>
                <rect x="40" y="-20" width="20" height="60" rx="10" transform="scale(-1, 1) translate(-100, 0) rotate(-10 50 50)" />
             </svg>
             <div className="text-center font-bold text-stone-500 mt-2 text-sm tracking-widest">SOL (TEK)</div>
           </div>
        </div>
      </div>
      
      <div className="absolute bottom-2 text-stone-400 text-xs uppercase tracking-widest">Diz Vuruşu Simülasyonu (Ayna Modu)</div>
    </div>
  );
};

export default Visualizer;