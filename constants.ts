import { Usul } from './types';

export const DEFAULT_USULS: Usul[] = [
  {
    id: 'sofyan',
    name: 'Sofyan',
    timeSignature: '4/4',
    description: 'Dört zamanlı basit bir usuldür. Genellikle ilahilerde ve yürük şarkılarda kullanılır.',
    beats: [
      { type: 'Düm', duration: 1 },
      { type: 'Te', duration: 0.5  },
      { type: 'Ke', duration: 0.5  },
      { type: 'Tek', duration: 1  },
      { type: 'Ka', duration: 1, hand: 'left' },
    ]
  },
  {
    id: 'semai',
    name: 'Semâî',
    timeSignature: '3/4',
    description: 'Üç zamanlı bir usuldür. Vals ritmine benzer.',
    beats: [
      { type: 'Düm', duration: 1 },
      { type: 'Tek', duration: 1 },
      { type: 'Te', duration: 0.5 },
      { type: 'Ke', duration: 0.5 },
    ]
  },
  {
    id: 'duyek',
    name: 'Düyek',
    timeSignature: '8/4',
    description: 'Sekiz zamanlıdır. Türk musikisinde en çok kullanılan usullerden biridir.',
    beats: [
      { type: 'Düm', duration: 1 },
      { type: 'Te', duration: 0.5 },
      { type: 'Ke', duration: 0.5 },
      { type: 'Tek', duration: 1 },
      { type: 'Ka', duration: 1 },
      { type: 'Dü', duration: 0.5 },
      { type: 'Me', duration: 0.5 },
      { type: 'Düm', duration: 1 },
      { type: 'Hek', duration: 1 },
      { type: 'Te', duration: 0.5 },
      { type: 'Ke', duration: 0.5 },
    ]
  },
  {
    id: 'aksak',
    name: 'Aksak',
    timeSignature: '9/4',
    description: 'Dokuz zamanlı, kıvrak bir usuldür.',
    beats: [
      { type: 'Düm', duration: 1 },
      { type: 'Te', duration: 0.5 },
      { type: 'Ke', duration: 0.5 },
      { type: 'Düm', duration: 1 },
      { type: 'Tek', duration: 1 },
      { type: 'Tek', duration: 0.5 },
    ]
  },
  {
    id: 'curcuna',
    name: 'Curcuna',
    timeSignature: '10/8',
    description: 'On zamanlı, hareketli bir usuldür.',
    beats: [
      { type: 'Düm', duration: 1 },
      { type: 'Te', duration: 0.5 },
      { type: 'Ka', duration: 1 },
      { type: 'Düm', duration: 1 },
      { type: 'Tek', duration: 1 },
      { type: 'Tek', duration: 0.5 },
    ]
  },
  {
    id: 'yuruk-semai',
    name: 'Yürük Semâî',
    timeSignature: '6/8',
    description: 'Türk mûsikisi usul sisteminde altı zamanlı küçük bir usuldür. Bu usul üç adet iki zamanın veya iki adet üç zamanın, diğer bir ifadeyle üç nîm-sofyanın veya iki semâinin birbirine eklenmesiyle meydana gelmiştir (2 + 2 + 2 = 6 veya 3 + 3 = 6). Yürük semâi usulünün bu isme uygun olan mertebesi 6/8’lik mertebedir.',
    beats: [
      { type: 'Düm', duration: 1 },
      { type: 'Tek', duration: 1 },
      { type: 'Ka', duration: 1 },
      { type: 'Dü', duration: 0.5, hand: 'right' },
      { type: 'Me', duration: 0.5 },
      { type: 'Tek', duration: 1 },
      { type: 'Ka', duration: 1 },
    ]
  },
  {
    id: 'devri-revan',
    name: 'Devr-i Revân',
    timeSignature: '14/8',
    description: 'On dört zamanlı, Klasik Türk Musikisi ve Mevlevi ayinlerinde sıkça kullanılan köklü bir usuldür.',
    beats: [
      { type: 'Düm', duration: 1 },
      { type: 'Te', duration: 1 },
      { type: 'Ke', duration: 1 },
      { type: 'Dü', duration: 1 },
      { type: 'Me', duration: 1 },
      { type: 'Te', duration: 1 },
      { type: 'Ke', duration: 1 },
      { type: 'Dü', duration: 0.5 },
      { type: 'Me', duration: 0.5 },
      { type: 'Dü', duration: 1 },
      { type: 'Me', duration: 1 },
      { type: 'Tek', duration: 1 },
      { type: 'Ka', duration: 1 },
      { type: 'Tek', duration: 1 },
      { type: 'Ka', duration: 1 },
    ]
  }
];