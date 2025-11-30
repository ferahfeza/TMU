export type StrokeType = 'Düm' | 'Tek' | 'Te' | 'Ke' | 'Ka' | 'Dü' | 'Me' | 'Teke' | 'Hek';

export interface Beat {
  type: StrokeType;
  duration: number; // In standard beat units (e.g., 1 for a quarter note)
  description?: string;
  hand?: 'left' | 'right';
}

export interface Usul {
  id: string;
  name: string;
  timeSignature: string;
  description: string;
  beats: Beat[];
}

export interface AudioState {
  isPlaying: boolean;
  bpm: number;
  currentBeatIndex: number;
}