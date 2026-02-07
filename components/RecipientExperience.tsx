
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
          <div className="h-full bg-[#d4567f] animate-[shimmer_3s_infinite]" style={{ width: '75%', backgroundSize: '200%' }}></div>
        </div>
      </div>
    );
  }

  // --- STAGE 0: INTRO ---
  if (currentStage === 0) {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center p-6 md:p-8 text-center animate-stage font-josefin overflow-hidden">
        {/* Background Photo with Romantic Overlay */}
        {data.photos[0] && (
          <div
            className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[20s] scale-110"
            style={{
              backgroundImage: `url(${data.photos[0]})`,
              animation: 'slow-zoom 20s ease-in-out infinite alternate'
            }}
          >
            {/* Valentine-themed gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-rose-900/60 via-pink-800/50 to-red-900/60 backdrop-blur-[1px]"></div>
          </div>
        )}

        {/* Floating Hearts */}
        <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <span
              key={i}
              className="absolute animate-float opacity-20 text-2xl md:text-4xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${8 + Math.random() * 4}s`
              }}
            >
              {['💕', '💖', '🌹', '💗'][i % 4]}
            </span>
          ))}
        </div>

        <div className="space-y-6 md:space-y-8 relative z-10 max-w-4xl px-4">
          {/* Romantic Icon */}
          <div className="flex justify-center gap-3 md:gap-4 mb-4">
            <span className="text-5xl md:text-7xl animate-float drop-shadow-2xl" style={{ animationDelay: '0s' }}>💕</span>
            <span className="text-6xl md:text-8xl animate-float drop-shadow-2xl" style={{ animationDelay: '0.3s' }}>💖</span>
            <span className="text-5xl md:text-7xl animate-float drop-shadow-2xl" style={{ animationDelay: '0.6s' }}>💕</span>
          </div>

          {/* Romantic Heading */}
          <h1 className="font-cinzel text-4xl md:text-6xl lg:text-7xl text-white font-black leading-tight tracking-tight uppercase drop-shadow-2xl">
            To My Beloved<br /> {data.recipientName}
          </h1>

          {/* Romantic Quote */}
          <p className="font-vibes text-2xl md:text-4xl lg:text-5xl text-rose-100 max-w-2xl px-4 mx-auto leading-relaxed drop-shadow-xl">
            "You are the love I never knew I needed, and now can't live without."
          </p>

          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-3 py-4">
            <div className="w-12 md:w-20 h-0.5 bg-rose-200/50 rounded-full"></div>
            <span className="text-2xl md:text-3xl">💗</span>
            <div className="w-12 md:w-20 h-0.5 bg-rose-200/50 rounded-full"></div>
          </div>

          {/* Call to Action */}
          <div className="pt-6 md:pt-8">
            <button
              onClick={handleNext}
              className="font-cinzel tracking-[0.3em] md:tracking-[0.4em] px-10 py-5 md:px-12 md:py-6 bg-white text-rose-700 rounded-full text-base md:text-xl shadow-2xl hover:scale-105 hover:bg-rose-50 active:scale-95 transition-all uppercase font-black border-b-4 md:border-b-6 border-rose-200"
            >
              Open My Heart 💕
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
          <span className="text-6xl animate-pulse drop-shadow-lg">😍</span>
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
              <div key={i} className="glass-card p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] shadow-lg flex flex-col md:flex-row items-center gap-2 group transition-all hover:bg-white/15">
                <span className="text-3xl md:text-5xl filter drop-shadow-lg animate-float">💖</span>
                <p className="text-2xl md:text-2xl lg:text-3xl font-playfair italic text-pink-500 leading-relaxed font-light text-center md:text-left">{r}</p>
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
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-100 to-red-200 flex flex-col items-center justify-center p-6 text-center animate-stage overflow-hidden relative">
        {/* Minimal Floating Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="absolute animate-float opacity-20 text-xl md:text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${6 + Math.random() * 4}s`
              }}
            >
              {['💕', '🌹', '💖'][i % 3]}
            </span>
          ))}
        </div>

        {/* Simple Heading */}
        <h2 className="font-cinzel text-2xl md:text-6xl text-rose-800 font-bold tracking-widest uppercase mb-8 md:mb-12 px-4 select-none z-10">
          Feel My Love
        </h2>

        {/* Minimalist Heart */}
        <div
          onClick={handleNext}
          className="text-[8rem] md:text-[12rem] pulse-romantic cursor-pointer select-none filter drop-shadow-lg hover:scale-105 transition-transform z-10"
        >
          ❤️
        </div>

        {/* Simple Message */}
        <p className="font-vibes text-2xl md:text-6xl text-rose-600 mt-8 md:mt-12 tracking-wide animate-pulse z-10">
          Touch to continue...
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
    <div className="fixed inset-0 z-[1000] bg-gradient-to-br from-rose-900 via-pink-800 to-red-900 flex flex-col items-center justify-start text-center animate-stage overflow-y-auto">
      {/* Floating Hearts Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
        {[...Array(15)].map((_, i) => (
          <span
            key={i}
            className="absolute animate-float text-3xl md:text-5xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          >
            {['💕', '💖', '🌹', '💗'][i % 4]}
          </span>
        ))}
      </div>

      <div className="z-10 relative w-full py-8 md:py-16 px-4 md:px-6 max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 md:mb-20 space-y-4 md:space-y-6">
          <span className="font-cinzel text-xs md:text-sm text-rose-200 tracking-[0.5em] md:tracking-[0.8em] uppercase block font-bold animate-pulse">
            Our Forever Begins
          </span>
          <h1 className="font-cinzel text-5xl md:text-7xl lg:text-8xl text-white font-black drop-shadow-2xl leading-none uppercase">
            YES! 💕
          </h1>
          <div className="mt-6 md:mt-8 text-rose-100 text-2xl md:text-4xl font-vibes drop-shadow-lg px-2 leading-relaxed">
            My heart is yours, {data.recipientName}
          </div>
        </div>

        {/* Photo Gallery - Mobile Optimized */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-16 md:mb-24 px-2">
          {data.photos.map((img, i) => (
            <div
              key={i}
              className="w-32 md:w-48 group hover:scale-105 transition-all cursor-pointer shadow-2xl bg-white p-2 md:p-3 rounded-lg"
              style={{ transform: `rotate(${(i % 2 === 0 ? -3 : 3)}deg)` }}
            >
              <img
                src={img}
                alt="Memory"
                className="w-full h-32 md:h-48 object-cover rounded grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="font-cinzel text-rose-800 text-[8px] md:text-xs mt-2 tracking-wider uppercase font-bold">
                Memory {i + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Romantic Message Card */}
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md p-6 md:p-12 rounded-3xl md:rounded-[3rem] shadow-2xl border-2 border-rose-300/20 mb-16 md:mb-24 relative overflow-hidden">
          {/* Decorative Hearts */}
          <div className="absolute top-4 left-4 text-2xl md:text-4xl opacity-20">💖</div>
          <div className="absolute bottom-4 right-4 text-2xl md:text-4xl opacity-20">💕</div>

          <div className="space-y-6 md:space-y-10">
            <p className="font-playfair italic text-xl md:text-3xl lg:text-4xl text-white leading-relaxed drop-shadow-lg">
              "In a world of constant change,<br />you are my only constant."
            </p>
            <div className="w-16 h-1 bg-rose-300/30 mx-auto rounded-full"></div>
            <p className="font-vibes text-2xl md:text-4xl lg:text-5xl text-rose-200 leading-relaxed drop-shadow-xl">
              I promise to love you<br />with every breath I take.
            </p>
          </div>

          {/* Footer */}
          <div className="flex flex-col items-center gap-3 md:gap-6 mt-10 md:mt-16 pt-8 md:pt-12 border-t border-white/10">
            <div className="font-cinzel text-sm md:text-xl text-white font-bold tracking-[0.3em] md:tracking-[0.5em] uppercase">
              Two Souls, One Destiny
            </div>
            <div className="font-josefin text-[8px] md:text-xs text-rose-200/50 tracking-widest uppercase font-semibold">
              Forever {data.recipientName} • {new Date().getFullYear()}
            </div>
          </div>
        </div>

        {/* Exit Button */}
        <button
          onClick={onExit}
          className="font-cinzel tracking-[0.3em] md:tracking-[0.5em] px-8 py-4 md:px-16 md:py-6 bg-white/10 border-2 border-rose-300/30 text-white rounded-full text-sm md:text-lg hover:bg-white/20 hover:border-rose-300 transition-all shadow-xl mb-12 md:mb-20 uppercase font-bold group active:scale-95"
        >
          Exit Story <span className="group-hover:translate-x-1 transition-transform inline-block">💕</span>
        </button>
      </div>
    </div>
  );
};

export default RecipientExperience;
