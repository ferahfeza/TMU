import { Usul, StrokeType } from '../types';

class AudioEngine {
  private audioContext: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentUsul: Usul | null = null;
  private bpm: number = 60;
  private nextNoteTime: number = 0;
  private currentBeatIndex: number = 0;
  private timerID: number | null = null;
  private scheduleAheadTime: number = 0.1; // Seconds
  private lookahead: number = 25.0; // Milliseconds
  private onBeatCallback: ((index: number, type: StrokeType, hand?: 'left' | 'right') => void) | null = null;

  // Tone settings
  private rightBaseFreq: number = 100;
  private leftBaseFreq: number = 400;

  constructor() {
    // Lazy initialization in start() to handle browser autoplay policies
  }

  public setUsul(usul: Usul) {
    this.currentUsul = usul;
    this.currentBeatIndex = 0;
  }

  public setBPM(bpm: number) {
    this.bpm = bpm;
  }

  public setFrequencies(right: number, left: number) {
    this.rightBaseFreq = right;
    this.leftBaseFreq = left;
  }

  public setOnBeatCallback(cb: (index: number, type: StrokeType, hand?: 'left' | 'right') => void) {
    this.onBeatCallback = cb;
  }

  public async start() {
    if (this.isPlaying) return;

    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    this.isPlaying = true;
    this.currentBeatIndex = 0;
    this.nextNoteTime = this.audioContext.currentTime + 0.1;
    this.scheduler();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerID !== null) {
      window.clearTimeout(this.timerID);
      this.timerID = null;
    }
  }

  private nextNote() {
    if (!this.currentUsul) return;
    const secondsPerBeat = 60.0 / this.bpm;
    // Current beat duration determines when the NEXT note happens
    const currentDuration = this.currentUsul.beats[this.currentBeatIndex].duration;
    
    this.nextNoteTime += currentDuration * secondsPerBeat;
    
    this.currentBeatIndex++;
    if (this.currentBeatIndex === this.currentUsul.beats.length) {
      this.currentBeatIndex = 0;
    }
  }

  private scheduleNote(beatIndex: number, time: number) {
    if (!this.currentUsul || !this.audioContext) return;
    const beat = this.currentUsul.beats[beatIndex];

    // Determine hand: explicit beat.hand OR inferred from type
    // Inferred Left: Tek, Te, Ke, Me, Teke, Hek
    // Inferred Right: Düm, Ka, Dü
    const isLeft = beat.hand === 'left' || (!beat.hand && ['Tek', 'Te', 'Ke', 'Me', 'Teke', 'Hek'].includes(beat.type));
    
    // Audio Synthesis
    const osc = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    osc.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Sound shaping based on stroke type
    
    if (beat.type === 'Düm') {
      // Düm: Low, Boom (Right Hand)
      osc.frequency.value = this.rightBaseFreq;
      osc.type = 'triangle';
      gainNode.gain.setValueAtTime(1, time);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.5);
    } else if (beat.type === 'Dü') {
      // Dü: Like Düm but slightly lighter/shorter (Right Hand)
      // Same frequency as Düm
      osc.frequency.value = this.rightBaseFreq; 
      osc.type = 'triangle';
      gainNode.gain.setValueAtTime(0.9, time);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
    } else if (isLeft) {
      // Unified sound for all left hand strikes (Tek, Te, Ke, Me, Teke, Hek)
      osc.frequency.value = this.leftBaseFreq;
      osc.type = 'sine';
      gainNode.gain.setValueAtTime(0.7, time);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
    } else if (beat.type === 'Ka') {
      // Ka sound matches Left sound exactly
      osc.frequency.value = this.leftBaseFreq;
      osc.type = 'sine';
      gainNode.gain.setValueAtTime(0.7, time);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
    }

    // Start/stop oscillator for all defined stroke types
    osc.start(time);
    osc.stop(time + 0.5);

    // Schedule visual callback
    const timeToDraw = time - this.audioContext.currentTime;
    if (this.onBeatCallback) {
      setTimeout(() => {
        if (this.isPlaying && this.onBeatCallback) {
            this.onBeatCallback(beatIndex, beat.type, beat.hand);
        }
      }, Math.max(0, timeToDraw * 1000));
    }
  }

  private scheduler() {
    if (!this.audioContext) return;

    // While there are notes that will need to play before the next interval, schedule them and advance the pointer.
    while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.currentBeatIndex, this.nextNoteTime);
      this.nextNote();
    }

    if (this.isPlaying) {
      this.timerID = window.setTimeout(() => this.scheduler(), this.lookahead);
    }
  }
}

export const audioEngine = new AudioEngine();