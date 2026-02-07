
import React, { useState, useEffect } from 'react';
import { CREATOR_PASSWORD } from '../constants';

interface CodeEntryProps {
  onSuccess: (code: string) => void;
  onOpenCreator: () => void;
}

const CodeEntry: React.FC<CodeEntryProps> = ({ onSuccess, onOpenCreator }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [creatorPassword, setCreatorPassword] = useState('');
  const [pwError, setPwError] = useState('');

  // Auto-prefill code from URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const codeParam = urlParams.get('code');
    if (codeParam && codeParam.length === 6) {
      setCode(codeParam.toUpperCase());
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError('Enter the 6-character code');
      return;
    }
    try {
      await onSuccess(code);
    } catch (err) {
      setError('Secret not found. Try again.');
    }
  };

  const handleCreatorLogin = () => {
    if (creatorPassword === CREATOR_PASSWORD) {
      setShowPasswordModal(false);
      onOpenCreator();
    } else {
      setPwError('Incorrect password.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-rose-velvet relative overflow-hidden font-josefin">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <span
            key={i}
            className="absolute animate-float opacity-20 text-3xl md:text-5xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${6 + Math.random() * 8}s`
            }}
          >
            {['✨', '💖', '🌹', '🤍', '🌸'][i % 5]}
          </span>
        ))}
      </div>

      <div className="z-10 text-center max-w-sm w-full space-y-8 md:space-y-12 animate-stage">
        <div className="text-6xl md:text-8xl animate-float drop-shadow-2xl">💌</div>

        <div className="space-y-2 md:space-y-4">
          <h1 className="font-cinzel text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-tight drop-shadow-2xl">
            A Secret <br /> Journey
          </h1>
          <p className="font-josefin text-[10px] md:text-xs lg:text-sm text-white/80 font-bold tracking-[0.4em] md:tracking-[0.6em] uppercase drop-shadow-md">
            Unlock the gateway to your story
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
          <div className="relative group">
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase().slice(0, 6));
                setError('');
              }}
              placeholder="SECRET"
              className={`w-full h-14 md:h-16 text-xl md:text-2xl font-courier text-center tracking-[0.8rem] md:tracking-[1rem] border-2 md:border-4 rounded-2xl md:rounded-3xl focus:outline-none transition-all shadow-xl bg-white/95 backdrop-blur-xl placeholder:opacity-10 text-[#d4567f] font-bold ${error ? 'border-red-500 animate-shake' : 'border-white/20 focus:border-[#d4567f]'
                }`}
            />
          </div>

          {error && (
            <p className="text-white text-[10px] md:text-xs font-black animate-pulse bg-red-600/30 py-2 rounded-full px-4 border border-red-500/20">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full h-14 md:h-16 text-base md:text-xl font-cinzel font-black bg-[#d4567f] text-white rounded-full shadow-[0_15px_40px_rgba(138,34,62,0.4)] hover:bg-[#8a223e] hover:scale-102 transition-all tracking-[0.3em] uppercase border-b-4 md:border-b-8 border-[#590d22] active:translate-y-1 active:border-b-0"
          >
            Reveal Gateway
          </button>
        </form>

        <div className="pt-6">
          <p className="text-[8px] md:text-[9px] text-white/30 uppercase tracking-[0.8em] font-black">Encrypted Memory Vault v2.3</p>
        </div>
      </div>

      {/* Hidden Creator Key - Well-hidden and reachable */}
      <button
        onClick={() => setShowPasswordModal(true)}
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center  transition-all text-lg md:text-4xl z-50 cursor-pointer"
        aria-label="Creator Vault"
      >
        🗝️
      </button>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl flex items-center justify-center z-[2000] p-6 animate-stage">
          <div className="bg-white rounded-[2rem] p-8 md:p-10 max-w-xs w-full text-center shadow-[0_0_80px_rgba(212,86,127,0.3)] relative overflow-hidden border-t-8 border-[#d4567f]">
            <div className="text-4xl md:text-5xl mb-4">🔐</div>
            <h2 className="font-cinzel text-lg md:text-xl font-black text-[#5c3d4a] mb-1 uppercase tracking-tighter">Vault Entry</h2>
            <p className="font-josefin text-[8px] md:text-[10px] text-gray-400 mb-6 md:mb-8 uppercase tracking-[0.4em] font-bold">Authentication Required</p>

            <input
              type="password"
              value={creatorPassword}
              onChange={(e) => setCreatorPassword(e.target.value)}
              placeholder="••••"
              className="w-full p-4 border-2 border-gray-100 rounded-2xl text-center font-mono focus:border-[#d4567f] focus:outline-none mb-6 md:mb-8 shadow-inner text-2xl md:text-3xl tracking-[0.8rem]"
              onKeyDown={(e) => e.key === 'Enter' && handleCreatorLogin()}
              autoFocus
            />
            {pwError && <p className="text-red-500 text-[10px] font-black mb-6 animate-shake">{pwError}</p>}

            <div className="flex gap-4">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 p-3 text-gray-400 font-black hover:text-gray-700 transition-colors uppercase text-[10px] tracking-widest"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatorLogin}
                className="flex-1 p-3 bg-[#d4567f] text-white rounded-xl font-cinzel font-black shadow-lg hover:bg-[#8a223e] transition-all text-[10px] tracking-widest uppercase border-b-4 border-[#8a223e]"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEntry;
