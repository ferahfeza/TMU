import React from 'react';
import { X, Music, Heart } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200">
        <div className="bg-stone-900 px-6 py-4 flex items-center justify-between border-b-4 border-amber-700">
           <h2 className="text-xl font-bold text-amber-50 ornament-font flex items-center gap-2">
             <Music size={20} className="text-amber-500"/>
             Hakkında
           </h2>
           <button onClick={onClose} className="text-stone-400 hover:text-white transition-colors">
             <X size={24} />
           </button>
        </div>
        
        <div className="p-6 space-y-4 text-stone-700">
          <p className="leading-relaxed">
            <strong>Usûlzen</strong>, Türk Mûsikîsi'nin zengin ritim dünyasını (usûllerini) görsel ve işitsel olarak keşfetmek isteyenler için tasarlanmış interaktif bir rehberdir.
          </p>
          
          <div className="bg-stone-50 p-4 rounded-lg border border-stone-100 text-sm space-y-2">
            <h3 className="font-bold text-amber-800 uppercase tracking-wide text-xs">Özellikler</h3>
            <ul className="list-disc pl-4 space-y-1 text-stone-600">
              <li>Klâsik usûlleri dinleme ve analiz etme</li>
              <li>Kendi usûlünü oluşturma ve kaydetme</li>
              <li>Usûl yapısını görsel olarak inceleme</li>
              <li>Eğitici içeriklerle usûl bilgisi edinme</li>
            </ul>
          </div>

          <p className="text-sm text-stone-500 italic flex items-center gap-1 pt-2 border-t border-stone-100">
            Kültür mirâsımıza katkı sağlamak amacıyla geliştirilmiştir. <Heart size={14} className="text-red-500 fill-current ml-1"/>
          </p>
        </div>
        
        <div className="bg-stone-100 px-6 py-3 text-right">
           <button 
             onClick={onClose}
             className="px-4 py-2 bg-stone-800 text-white rounded-lg text-sm font-bold hover:bg-stone-700 transition-colors"
           >
             Kapat
           </button>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;