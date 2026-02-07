
import React, { useState } from 'react';

interface SuccessScreenProps {
  code: string;
  onReset: () => void;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ code, onReset }) => {
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const shareUrl = `${window.location.origin}?code=${code}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'A Special Valentine Message',
          text: `I have something special for you! Use code: ${code}`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or share failed, fallback to copy
        copyLinkToClipboard();
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      copyLinkToClipboard();
    }
  };

  return (
    <div className="min-h-screen bg-rose-velvet flex flex-col items-center justify-center p-6 md:p-8 text-center animate-stage font-josefin overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute text-white text-4xl md:text-8xl font-cinzel font-black uppercase tracking-tighter" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, transform: `rotate(${Math.random() * 360}deg)` }}>LOVE</div>
        ))}
      </div>

      <div className="max-w-lg w-full space-y-10 md:space-y-16 relative z-10">
        <div className="text-6xl md:text-8xl animate-float drop-shadow-2xl">🌹✨</div>

        <div className="space-y-3 md:space-y-4">
          <h1 className="font-cinzel text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-none drop-shadow-lg">
            Protocol Sealed
          </h1>
          <p className="font-josefin text-sm md:text-lg lg:text-xl text-white/70 font-light tracking-[0.2em] md:tracking-[0.4em] uppercase drop-shadow-md italic">The magic is ready for delivery</p>
        </div>

        <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-14 shadow-2xl relative overflow-hidden group border-t-8 md:border-t-[12px] border-[#d4567f]">
          <p className="font-josefin text-[8px] md:text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] mb-6 md:mb-10">The Secret Access Token</p>

          <div className="text-3xl md:text-5xl lg:text-6xl font-courier font-black text-[#d4567f] tracking-[0.2em] md:tracking-[0.4em] mb-8 md:mb-10 select-all leading-none">
            {code}
          </div>

          <div className="space-y-3 md:space-y-4">
            <button
              onClick={copyToClipboard}
              className={`w-full py-4 md:py-6 rounded-2xl md:rounded-3xl font-cinzel font-black text-base md:text-xl transition-all flex items-center justify-center gap-3 uppercase tracking-[0.1em] md:tracking-[0.2em] shadow-lg ${copied ? 'bg-green-500 text-white scale-95' : 'bg-[#fff5f9] text-[#d4567f] border-2 border-[#f8c6d8] hover:bg-[#d4567f] hover:text-white hover:border-[#d4567f] active:scale-95'
                }`}
            >
              {copied ? '✓ Code Copied' : '📋 Copy Code'}
            </button>

            <button
              onClick={handleShare}
              className={`w-full py-4 md:py-6 rounded-2xl md:rounded-3xl font-cinzel font-black text-base md:text-xl transition-all flex items-center justify-center gap-3 uppercase tracking-[0.1em] md:tracking-[0.2em] shadow-lg ${linkCopied ? 'bg-green-500 text-white scale-95' : 'bg-rose-100 text-rose-700 border-2 border-rose-200 hover:bg-rose-200 active:scale-95'
                }`}
            >
              {linkCopied ? '✓ Link Copied' : '🔗 Share Link'}
            </button>
          </div>
        </div>

        <div className="glass-card p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] text-left space-y-6 md:space-y-8 shadow-xl border border-white/10">
          <h3 className="font-cinzel text-base md:text-lg font-black text-[#d4567f]  text-center tracking-[0.4em] md:tracking-[0.6em] uppercase opacity-80">Directive</h3>
          <div className="space-y-6 md:space-y-8">
            <div className="flex gap-4 md:gap-6 items-start">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-white text-[#d4567f] rounded-full flex-shrink-0 flex items-center justify-center font-black text-base md:text-lg shadow-lg">1</div>
              <p className="font-josefin text-[#d4567f]  text-sm md:text-base leading-relaxed font-light italic opacity-90">Share the link or code with your beloved.</p>
            </div>
            <div className="flex gap-4 md:gap-6 items-start">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-white text-[#d4567f] rounded-full flex-shrink-0 flex items-center justify-center font-black text-base md:text-lg shadow-lg">2</div>
              <p className="font-josefin text-[#d4567f]  text-sm md:text-base leading-relaxed font-light italic opacity-90">They'll enter the code to unlock your message.</p>
            </div>
            <div className="flex gap-4 md:gap-6 items-start">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-white text-[#d4567f] rounded-full flex-shrink-0 flex items-center justify-center font-black text-base md:text-lg shadow-lg">3</div>
              <p className="font-josefin text-[#d4567f]  text-sm md:text-base leading-relaxed font-light italic opacity-90">Celebrate together as they experience your creation.</p>
            </div>
          </div>
        </div>

        <div className="pt-8 md:pt-12 pb-6">
          <button
            onClick={onReset}
            className="font-cinzel text-white font-black text-[9px] md:text-xs uppercase tracking-[0.4em] md:tracking-[0.6em] hover:text-[#d4af37] transition-all underline decoration-white/20"
          >
            Return to Entrance
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessScreen;
