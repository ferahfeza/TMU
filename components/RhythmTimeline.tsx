import React from 'react';
import { Usul, StrokeType, Beat } from '../types';

interface RhythmTimelineProps {
  usul: Usul;
  currentBeatIndex: number;
  isPlaying: boolean;
}

const getBeatColor = (type: StrokeType, isActive: boolean) => {
  // Düm and Dü are both Right-hand/Strong strokes, so they share the Amber (Brown) color.
  if (type === 'Düm' || type === 'Dü') return isActive ? 'bg-amber-600 scale-105 ring-4 ring-amber-200' : 'bg-amber-800';
  
  // Left hand strokes (Tek, Te, Ke, etc.) - Switched to Emerald for Green
  if (type === 'Tek') return isActive ? 'bg-emerald-500 scale-105 ring-4 ring-emerald-200' : 'bg-emerald-700';
  
  // Te, Ke, Ka, Me, Teke, etc.
  return isActive ? 'bg-emerald-400 scale-105 ring-4 ring-emerald-100' : 'bg-emerald-600'; 
};

const RhythmTimeline: React.FC<RhythmTimelineProps> = ({ usul, currentBeatIndex, isPlaying }) => {
  
  const renderBeatItem = (beat: Beat, actualIndex: number) => {
    const isActive = isPlaying && currentBeatIndex === actualIndex;
    // Width based on duration
    const widthClass = beat.duration >= 2 ? 'w-24' : beat.duration >= 1 ? 'w-16' : 'w-12';
    
    return (
      <div key={actualIndex} className="flex flex-col items-center gap-2 relative group">
        <div 
          className={`h-16 ${widthClass} rounded-lg shadow-md flex items-center justify-center text-white font-bold text-sm sm:text-base transition-all duration-100 ${getBeatColor(beat.type, isActive)}`}
        >
          {beat.type}
        </div>
        <div className="flex flex-col items-center">
          <span className={`text-xs font-semibold font-mono ${isActive ? 'text-stone-900' : 'text-stone-400'}`}>
              {actualIndex + 1}
          </span>
          {/* Duration indicator line */}
          <div className="w-full h-0.5 mt-1 bg-stone-200 rounded-full overflow-hidden">
              <div className="h-full bg-stone-300" style={{ width: `${Math.min(beat.duration * 50, 100)}%` }}></div>
          </div>
        </div>
      </div>
    );
  };

  // Logic to split long usuls into two balanced rows
  const totalBeats = usul.beats.length;
  // Threshold to trigger split view (e.g., more than 10 beats)
  const isLongUsul = totalBeats > 10;

  if (isLongUsul) {
    let splitIndex = Math.ceil(totalBeats / 2);

    // SMART SPLIT LOGIC:
    // If there is a 'Dü' stroke, we prefer to start the second row with it.
    // We look for a 'Dü' that is relatively close to the center to keep rows balanced.
    
    // 1. Find all indices of 'Dü'
    const duIndices = usul.beats
      .map((b, i) => ({ type: b.type, index: i }))
      .filter(b => b.type === 'Dü')
      .map(b => b.index);

    if (duIndices.length > 0) {
      // 2. Find the 'Dü' index closest to the center
      const center = totalBeats / 2;
      
      // We start reduction with the first found 'Dü'
      const bestDuIndex = duIndices.reduce((prev, curr) => {
        return (Math.abs(curr - center) < Math.abs(prev - center) ? curr : prev);
      });

      // 3. Update split index if a valid Dü was found
      // We avoid splitting at the very beginning (index 0) or very end
      if (bestDuIndex > 2 && bestDuIndex < totalBeats - 2) {
         splitIndex = bestDuIndex;
      }
    }

    const firstRow = usul.beats.slice(0, splitIndex);
    const secondRow = usul.beats.slice(splitIndex);

    return (
      <div className="w-full flex flex-col gap-8">
        {/* Row 1 */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-6">
          {firstRow.map((beat, idx) => renderBeatItem(beat, idx))}
        </div>
        
        {/* Row 2 */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-6">
          {secondRow.map((beat, idx) => renderBeatItem(beat, splitIndex + idx))}
        </div>
      </div>
    );
  }

  // Standard single/wrapped flow for shorter usuls
  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-6">
        {usul.beats.map((beat, idx) => renderBeatItem(beat, idx))}
      </div>
    </div>
  );
};

export default RhythmTimeline;