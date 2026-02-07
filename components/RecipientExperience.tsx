
import React, { useState, useEffect, useRef } from 'react';
import { ValentineData } from '../types';

interface RecipientExperienceProps {
  data: ValentineData;
  onExit: () => void;
}

const TypewriterText: React.FC<{ text: string; speed?: number }> = ({ text, speed = 40 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text.charAt(index));
        setIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [index, text, speed]);

  return <div className="whitespace-pre-wrap">{displayedText}</div>;
};

const PhotoEnvelope: React.FC<{ photo: string; index: number }> = ({ photo, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <div 
        className={`envelope-container ${isOpen ? 'opened' : ''} group`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="envelope-body group-hover:rotate-y-3 transition-transform">
          <div className="envelope-flap"></div>
          <div className="envelope-front-pocket"></div>
          <div className="envelope-content">
            <img src={photo} className="w-full h-full object-cover rounded-[1px]" alt={`Memory ${index + 1}`} />
            <div className="mt-1 text-center font-josefin text-[7px] md:text-[9px] uppercase tracking-[0.2em] text-[#d4567f] font-black">Memory {index + 1}</div>
          </div>
          {!isOpen && (
            <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-[11] text-3xl md:text-4xl opacity-50 filter drop-shadow-md group-hover:scale-110 transition-transform duration-500">
              💌
            </div>
          )}
        </div>
      </div>
      <p className={`mt-4 md:mt-8 font-vibes text-xl md:text-2xl text-[#8a223e]/50 transition-all duration-1000 ${isOpen ? 'opacity-0 translate-y-2' : 'opacity-100 animate-pulse'}`}>
        Touch to open...
      </p>
    </div>
  );
};

const RecipientExperience: React.FC<RecipientExperienceProps> = ({ data, onExit }) => {
  const [currentStage, setCurrentStage] = useState(0); 
  const [loading, setLoading] = useState(true);
  const [yesScale, setYesScale] = useState(1);
  const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0 });
  const [noHidden, setNoHidden] = useState(false);
  const [noTextIndex, setNoTextIndex] = useState(0);

  const noTextVariations = [
    "No",
    "Really? 🥺",
    "You sure? 😢",
    "Nope! 😊",
    "Not happening! 💕"
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let interval: any;
    if (currentStage === 6) { 
      spawnParticles(35, ['#ff4d6d', '#ff758f', '#ffb3c1', '#ffffff'], ['❤️', '💖', '✨', '🌹', '🤍', '🌸']);
      interval = setInterval(() => {
        spawnParticles(4, ['#ff4d6d', '#ff758f'], ['❤️', '💖', '✨']);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentStage]);

  const handleNext = () => {
    if (currentStage === 1 && !data.specialDate) {
      setCurrentStage(3);
    } else {
      setCurrentStage(prev => prev + 1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const spawnParticles = (count: number, colors: string[], emojis: string[]) => {
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const isEmoji = Math.random() > 0.5;
      if (isEmoji) {
        p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        p.style.fontSize = Math.random() * 1.2 + 0.6 + 'rem';
      } else {
        p.style.width = Math.random() * 8 + 2 + 'px';
        p.style.height = p.style.width;
        p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        p.style.borderRadius = Math.random() > 0.5 ? '50%' : '1px';
      }
      p.style.left = Math.random() * 100 + 'vw';
      p.style.top = '-10vh';
      p.style.animationDuration = Math.random() * 3 + 2 + 's';
      p.style.animationDelay = Math.random() * 1 + 's';
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 5000);
    }
  };

  const handleNoHover = () => {
    if (noHidden) return;
    const maxX = window.innerWidth < 640 ? 50 : 100;
    const maxY = window.innerWidth < 640 ? 40 : 80;
    const x = Math.random() * (maxX * 2) - maxX;
    const y = Math.random() * (maxY * 2) - maxY;
    setNoBtnPos({ x, y });
    setYesScale(prev => Math.min(prev + 0.15, 3.5));
    setNoTextIndex((prev) => (prev + 1) % noTextVariations.length);
    if (yesScale > 3.0) setNoHidden(true);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-deep-romance text-white p-6 font-josefin overflow-hidden">
        <div className="text-6xl md:text-8xl animate-pulse mb-8 filter drop-shadow-[0_0_40px_rgba(212,86,127,1)]">💌</div>
        <h2 className="font-cinzel text-lg md:text-2xl tracking-[0.5em] text-white/50 uppercase font-black text-center">Unfolding Forever</h2>
        <div className="mt-8 w-40 md:w-56 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-[#d4567f] animate-[shimmer_3s_infinite]" style={{width: '75%', backgroundSize: '200%'}}></div>
        </div>
      </div>
    );
  }

  // --- STAGE 0: INTRO ---
  if (currentStage === 0) {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center p-8 text-center animate-stage font-josefin overflow-hidden">
        {data.photos[0] && (
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[20s] scale-110"
            style={{ 
              backgroundImage: `url(${data.photos[0]})`,
              animation: 'slow-zoom 20s ease-in-out infinite alternate'
            }}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
          </div>
        )}
        
        <div className="space-y-6 relative z-10 max-w-4xl px-4">
          <span className="text-7xl md:text-9xl mb-4 inline-block animate-float drop-shadow-2xl">🌹</span>
          <h1 className="font-cinzel text-4xl md:text-7xl lg:text-8xl text-white font-black leading-none tracking-tighter uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            My Only <br /> {data.recipientName}
          </h1>
          <p className="font-playfair italic text-lg md:text-3xl lg:text-4xl text-white/90 max-w-2xl px-4 mx-auto leading-tight font-light drop-shadow-lg">
            "Every love story is beautiful, but ours is my absolute favorite."
          </p>
          <div className="pt-10">
            <button 
              onClick={handleNext} 
              className="font-cinzel tracking-[0.4em] px-10 py-5 bg-white text-[#d4567f] rounded-full text-base md:text-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all uppercase font-black border-b-[6px] border-gray-200"
            >
              Enter Our World
            </button>
          </div>
        </div>
        
        <style>{`
          @keyframes slow-zoom {
            from { transform: scale(1); }
            to { transform: scale(1.15); }
          }
        `}</style>
      </div>
    );
  }

  // --- STAGE 1: GALLERY ---
  if (currentStage === 1) {
    return (
      <div className="min-h-screen py-16 md:py-24 px-6 bg-romantic-main animate-stage overflow-x-hidden relative">
        <div className="max-w-4xl mx-auto text-center mb-20 md:mb-32 space-y-3 relative z-10">
          <span className="font-cinzel text-[9px] md:text-[11px] tracking-[0.8em] text-[#d4567f]/60 uppercase block font-black">Memory Fragments</span>
          <h2 className="font-cinzel text-3xl md:text-5xl lg:text-6xl text-[#5c3d4a] font-black tracking-widest uppercase leading-none">The Moments</h2>
          <p className="font-josefin text-xs md:text-lg text-[#d4567f]/70 uppercase tracking-[0.3em] font-light max-w-2xl mx-auto leading-relaxed px-4">Touch to rediscover each chapter</p>
          <div className="w-12 h-0.5 bg-[#d4567f] mx-auto mt-6 rounded-full shadow-sm opacity-20"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-20 md:gap-y-32 gap-x-8 md:gap-x-12 max-w-5xl mx-auto mb-32 px-4 relative z-10">
          {data.photos.map((p, i) => (
            <PhotoEnvelope key={i} photo={p} index={i} />
          ))}
        </div>
        <div className="text-center py-20 relative z-10">
          <button onClick={handleNext} className="font-cinzel tracking-[0.4em] px-12 py-5 bg-[#d4567f] text-white rounded-full text-sm md:text-lg shadow-xl hover:scale-105 transition-all uppercase font-black border-b-[6px] border-[#8a223e]">
            {data.specialDate ? 'The Sacred Date' : 'Continue Journey'}
          </button>
        </div>
      </div>
    );
  }

  // --- STAGE 2: THE SPECIAL DATE ---
  if (currentStage === 2 && data.specialDate) {
    const formattedDate = new Date(data.specialDate.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-romantic-main text-center animate-stage font-josefin overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none opacity-10">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-cinzel text-[20rem] font-black tracking-tighter uppercase whitespace-nowrap">HISTORY</div>
        </div>
        <div className="z-10 space-y-12 max-w-3xl">
          <span className="text-6xl animate-pulse drop-shadow-lg">✨🕯️✨</span>
          <div className="space-y-4">
            <h3 className="font-cinzel text-xs md:text-sm tracking-[1em] text-[#d4567f] uppercase font-black opacity-60">A Day Written in Stars</h3>
            <p className="font-cinzel text-3xl md:text-6xl lg:text-7xl font-black text-[#5c3d4a] tracking-tighter uppercase leading-tight drop-shadow-md">
              {formattedDate}
            </p>
          </div>
          <div className="w-16 h-1 bg-[#d4567f] mx-auto rounded-full opacity-30"></div>
          <p className="font-playfair italic text-2xl md:text-4xl lg:text-5xl text-[#d4567f]/90 px-6 font-light leading-relaxed animate-fadeIn">
            "{data.specialDate.context}"
          </p>
          <div className="pt-16">
            <button onClick={handleNext} className="font-cinzel tracking-[0.4em] px-12 py-5 bg-[#d4567f] text-white rounded-full text-sm md:text-lg shadow-xl hover:scale-105 transition-all uppercase font-black border-b-[6px] border-[#8a223e]">
              See The Soul
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- STAGE 3: THE WORDS ---
  if (currentStage === 3) {
    return (
      <div className="min-h-screen py-16 md:py-24 px-6 bg-rose-velvet animate-stage">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16 md:mb-24 space-y-3">
            <span className="font-cinzel text-[9px] md:text-[11px] tracking-[1em] text-white/60 uppercase block font-black">Sacred Sentiment</span>
            <h2 className="font-cinzel text-3xl md:text-5xl lg:text-6xl text-white font-black tracking-widest uppercase leading-none drop-shadow-md">The Soul</h2>
            <p className="font-josefin text-xs md:text-base lg:text-lg text-white/70 uppercase tracking-[0.6em] font-light">From my heart to yours</p>
          </div>

          <div className="space-y-6 md:space-y-10 mb-24 md:mb-40 px-4">
            {data.reasons.map((r, i) => (
              <div key={i} className="glass-card p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] shadow-lg flex flex-col md:flex-row items-center gap-6 group transition-all hover:bg-white/15">
                <span className="text-3xl md:text-5xl filter drop-shadow-lg animate-float">💖</span>
                <p className="text-base md:text-xl lg:text-2xl font-playfair italic text-white leading-relaxed font-light text-center md:text-left">{r}</p>
              </div>
            ))}
          </div>

          {data.memories && (
            <div className="bg-white p-6 md:p-16 rounded-[2rem] md:rounded-[2.5rem] shadow-xl relative border border-gray-100 mx-2 overflow-hidden">
              <div className="font-courier text-xl md:text-3xl lg:text-4xl font-black text-[#d4567f] mb-8 border-b-2 border-[#fce7f3] pb-6 leading-tight uppercase tracking-tighter">
                Dear {data.recipientName},
              </div>
              <div className="font-courier text-sm md:text-lg lg:text-xl text-gray-800 leading-[1.6] whitespace-pre-wrap tracking-tighter font-medium">
                {/* Typewriter Animation added here */}
                <TypewriterText text={data.memories} />
              </div>
              <div className="mt-16 md:mt-20 text-right space-y-2">
                <p className="font-vibes text-3xl md:text-5xl text-gray-400 font-light leading-none">Always yours...</p>
                <span className="font-cinzel text-xl md:text-3xl text-[#d4567f] font-black block tracking-[0.2em] uppercase leading-none">{data.creatorName || 'Forever'}</span>
              </div>
            </div>
          )}

          <div className="text-center mt-24 md:mt-32">
            <button onClick={handleNext} className="font-cinzel tracking-[0.4em] px-12 py-5 md:px-16 md:py-7 bg-white text-[#d4567f] rounded-full text-base md:text-xl shadow-xl hover:scale-105 active:scale-95 transition-all uppercase font-black border-b-[6px] md:border-b-[10px] border-gray-200">
              The Threshold
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- STAGE 4: THE HEARTBEAT ---
  if (currentStage === 4) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center animate-stage overflow-hidden">
        <h2 className="font-cinzel text-2xl md:text-4xl lg:text-5xl text-white font-black opacity-30 tracking-[0.6em] md:tracking-[1em] uppercase mb-16 md:mb-24 leading-tight max-w-full px-4 select-none">
          Breathe <br className="md:hidden" /> & Feel <br /> My Heart
        </h2>
        {/* Heart size increased significantly */}
        <div 
          onClick={handleNext} 
          className="text-[12rem] md:text-[18rem] lg:text-[24rem] pulse-romantic cursor-pointer select-none filter drop-shadow-[0_0_100px_rgba(212,86,127,0.7)] hover:scale-110 transition-transform"
        >
          ❤️
        </div>
        <p className="font-vibes text-3xl md:text-5xl lg:text-6xl text-red-900/70 mt-16 md:mt-24 tracking-[0.2em] font-light animate-pulse">
          Touch to seal destiny...
        </p>
      </div>
    );
  }

  // --- STAGE 5: THE QUESTION ---
  if (currentStage === 5) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-deep-romance text-white animate-stage relative overflow-hidden">
        <div className="z-10 text-center max-w-3xl w-full px-4">
          <div className="mb-10 text-5xl md:text-8xl animate-bounce opacity-95">💍</div>
          <h1 className="font-cinzel text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-16 md:mb-24 drop-shadow-2xl leading-[1.1] tracking-tighter uppercase px-4 shimmer-text">
            {data.recipientName}, <br /> Will you be <br className="md:hidden" /> my Valentine?
          </h1>
          <div className="relative h-40 md:h-[15rem] flex flex-col items-center justify-center gap-12">
            <button 
              onClick={handleNext}
              className="px-14 py-5 md:px-20 md:py-8 bg-white text-[#590d22] text-3xl md:text-5xl lg:text-6xl font-black rounded-full shadow-[0_30px_100px_rgba(255,255,255,0.4)] z-50 transition-all hover:scale-105 active:scale-95 border-b-[8px] md:border-b-[12px] border-gray-200 font-cinzel leading-none uppercase tracking-tighter"
              style={{ transform: `scale(${yesScale})` }}
            >
              YES! 💖
            </button>
            {!noHidden && (
              <button 
                onMouseEnter={handleNoHover}
                onTouchStart={(e) => { e.preventDefault(); handleNoHover(); }}
                className="px-8 py-3 md:px-12 md:py-4 bg-black/60 backdrop-blur-2xl text-white rounded-full font-cinzel border-[2px] border-white/20 transition-all duration-300 text-base md:text-xl shadow-xl tracking-[0.3em] opacity-50 hover:opacity-100 uppercase font-black"
                style={{ transform: `translate(${noBtnPos.x}px, ${noBtnPos.y}px)` }}
              >
                {noTextVariations[noTextIndex]}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- STAGE 6: CELEBRATION ---
  return (
    <div className="fixed inset-0 z-[1000] bg-midnight-gold flex flex-col items-center justify-start text-center animate-stage overflow-y-auto">
      <div className="z-10 relative w-full py-12 md:py-20 px-6 max-w-4xl mx-auto">
        <div className="mb-16 md:mb-24 space-y-6 md:space-y-8">
          <span className="font-cinzel text-[9px] md:text-[14px] text-[#d4af37] tracking-[1em] md:tracking-[1.2em] uppercase block mb-4 font-black animate-pulse">Our Forever Begins</span>
          <h1 className="font-cinzel text-6xl md:text-8xl lg:text-9xl text-transparent bg-clip-text bg-gradient-to-t from-[#d4567f] via-white to-[#d4af37] font-black drop-shadow-[0_15px_40px_rgba(212,86,127,0.8)] leading-none uppercase tracking-tighter">
            YES!
          </h1>
          <div className="mt-8 md:mt-12 text-white/95 text-3xl md:text-6xl font-vibes drop-shadow-xl px-4 leading-none animate-float">My heart is yours, {data.recipientName}</div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-24 md:mb-40 px-4">
          {data.photos.map((img, i) => (
            <div key={i} className="polaroid w-40 md:w-64 group hover:scale-105 transition-all cursor-pointer shadow-xl bg-white"
                 style={{ transform: `rotate(${(i % 2 === 0 ? -6 : 6) + (Math.random() * 4 - 2)}deg)` }}>
              <img src={img} alt="Celebration" className="grayscale group-hover:grayscale-0 transition-all duration-1000 border border-[#d4af37]/10" />
              <div className="font-cinzel text-[#5c3d4a] text-[7px] md:text-[11px] mt-3 md:mt-6 tracking-[0.6em] md:tracking-[0.8em] uppercase font-black opacity-70">CHAPTER {i+1}</div>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto glass-card p-10 md:p-20 rounded-[3rem] md:rounded-[4rem] shadow-2xl relative overflow-hidden mb-24 md:mb-40 mx-4 transition-all hover:bg-white/10 group">
          <div className="absolute top-0 left-0 w-1.5 md:w-2 h-full bg-gradient-to-b from-[#d4af37] via-[#d4567f] to-transparent"></div>
          <div className="absolute top-0 right-0 w-1.5 md:w-2 h-full bg-gradient-to-b from-[#d4af37] via-[#d4567f] to-transparent"></div>
          
          <div className="space-y-12">
            <p className="font-playfair italic text-3xl md:text-5xl lg:text-6xl text-white/90 leading-tight drop-shadow-xl px-2">
              "In a world of constant change, <br /> you are my only constant."
            </p>
            <p className="font-vibes text-4xl md:text-6xl lg:text-7xl text-[#d4af37] leading-tight drop-shadow-2xl">
              I promise to love you <br /> with every breath I take.
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-6 md:gap-10 mt-16 pt-16 border-t border-white/10">
            <div className="font-cinzel text-lg md:text-3xl text-white font-black tracking-[0.6em] md:tracking-[0.8em] uppercase">Two Souls, One Destiny</div>
            <div className="font-josefin text-[7px] md:text-[11px] text-white/30 tracking-[0.5em] md:tracking-[0.6em] uppercase font-black">ETERNALLY CRAFTED FOR {data.recipientName?.toUpperCase()} • {new Date().getFullYear()}</div>
          </div>
        </div>

        <button 
          onClick={onExit}
          className="font-cinzel tracking-[0.6em] md:tracking-[0.8em] px-10 py-5 md:px-20 md:py-8 bg-white/5 border-2 md:border-4 border-[#d4af37]/30 text-white rounded-full text-base md:text-xl hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-1000 shadow-2xl mb-24 uppercase font-black group active:scale-95"
        >
          Exit Story <span className="group-hover:translate-x-1 transition-transform inline-block">🕊️</span>
        </button>
      </div>
    </div>
  );
};

export default RecipientExperience;
