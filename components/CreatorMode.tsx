
import React, { useState, useRef } from 'react';
import { ValentineData } from '../types';
import { DEFAULT_REASONS, DATE_CONTEXTS } from '../constants';
import { generateUniqueCode, saveValentine, fileToBase64 } from '../utils/storage';

interface CreatorModeProps {
  onSuccess: (data: ValentineData) => void;
  onCancel: () => void;
}

const CreatorMode: React.FC<CreatorModeProps> = ({ onSuccess, onCancel }) => {
  const [recipientName, setRecipientName] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [favoriteColor, setFavoriteColor] = useState('#FF1493');
  const [specialDate, setSpecialDate] = useState({ date: '', context: DATE_CONTEXTS[0] });
  const [customContext, setCustomContext] = useState('');
  const [memories, setMemories] = useState('');
  const [reasons, setReasons] = useState<string[]>(['']);
  const [creatorName, setCreatorName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newPhotos = await Promise.all(filesArray.map(fileToBase64));
      setPhotos(prev => [...prev, ...newPhotos].slice(0, 8));
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const addReason = () => {
    if (reasons.length < 10) setReasons([...reasons, '']);
  };

  const updateReason = (index: number, val: string) => {
    const newReasons = [...reasons];
    newReasons[index] = val;
    setReasons(newReasons);
  };

  const removeReason = (index: number) => {
    setReasons(reasons.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (!recipientName) {
      alert("Please enter the recipient's name.");
      return;
    }

    setIsGenerating(true);

    try {
      const code = await generateUniqueCode();

      const finalData: ValentineData = {
        code,
        recipientName,
        photos,
        favoriteColor,
        musicEnabled: true,
        specialDate: specialDate.date ? {
          date: specialDate.date,
          context: specialDate.context === 'Custom...' ? customContext : specialDate.context
        } : undefined,
        memories: memories.trim() || undefined,
        reasons: reasons.filter(r => r.trim() !== '').length > 0
          ? reasons.filter(r => r.trim() !== '')
          : DEFAULT_REASONS,
        creatorName,
        createdAt: new Date().toISOString()
      };

      await saveValentine(finalData);

      setTimeout(() => {
        onSuccess(finalData);
      }, 2000);
    } catch (error) {
      console.error('Error saving valentine:', error);
      alert('Failed to save valentine. Please try again.');
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-romantic-main flex flex-col font-josefin text-gray-800">
      <header className="sticky top-0 z-50 bg-[#d4567f] text-white py-4 px-6 md:px-8 shadow-xl flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="text-xl md:text-2xl animate-pulse">✨</span>
          <h1 className="font-cinzel text-xs md:text-sm font-black tracking-widest uppercase">Love Designer</h1>
        </div>
        <button
          onClick={onCancel}
          className="px-4 py-1.5 rounded-full border-2 border-white/30 text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-[#d4567f] transition-all"
        >
          Close
        </button>
      </header>

      <main className="max-w-2xl mx-auto w-full p-6 space-y-12 animate-stage">
        <section className="text-center space-y-3 pt-6">
          <h2 className="font-cinzel text-2xl md:text-4xl font-black text-[#5c3d4a] uppercase tracking-tighter leading-tight">
            Design Your <br /> Sacred Story
          </h2>
          <p className="font-josefin text-gray-500 font-bold tracking-[0.2em] md:tracking-[0.4em] uppercase text-[9px] md:text-[10px]">
            A digital sanctuary for your greatest journey
          </p>
          <div className="w-10 h-1 bg-[#d4567f] mx-auto rounded-full mt-4 opacity-30"></div>
        </section>

        {/* Recipient Details */}
        <div className="bg-white/70 backdrop-blur-md p-6 md:p-10 rounded-3xl shadow-lg border border-white space-y-8">
          <div className="flex items-center gap-4 border-b border-[#d4567f]/10 pb-4">
            <span className="text-xl md:text-2xl">👤</span>
            <h3 className="font-cinzel text-base md:text-lg font-black text-[#5c3d4a] uppercase tracking-widest">Recipient</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="font-josefin text-[#d4567f] font-black uppercase text-[9px] tracking-widest">Their Name</label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="My One and Only..."
                className="w-full p-4 border-2 border-gray-50 rounded-2xl focus:border-[#d4567f] focus:outline-none transition-all text-base font-cinzel font-black shadow-sm bg-white/50"
              />
            </div>

            <div className="space-y-3">
              <label className="font-josefin text-[#d4567f] font-black uppercase text-[9px] tracking-widest">Photos (8 Max)</label>
              <div onClick={() => photoInputRef.current?.click()} className="border-2 border-dashed border-[#d4567f]/20 rounded-2xl p-8 text-center cursor-pointer bg-white/40 hover:border-[#d4567f] transition-all group">
                <div className="text-4xl opacity-10 mb-2 group-hover:opacity-40 transition-all">📸</div>
                <p className="font-cinzel text-[9px] font-black text-gray-400 uppercase tracking-widest group-hover:text-[#d4567f]">Select Memories</p>
                <input type="file" ref={photoInputRef} onChange={handlePhotoUpload} multiple accept="image/*" className="hidden" />
              </div>
              {photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                  {photos.map((url, idx) => (
                    <div key={idx} className="relative group p-1 bg-white shadow-sm rounded-lg overflow-hidden aspect-square">
                      <img src={url} alt="Memory" className="w-full h-full object-cover rounded-md" />
                      <button onClick={() => removePhoto(idx)} className="absolute top-1 right-1 w-6 h-6 bg-[#d4567f] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-xs">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Special Date Section */}
        <div className="bg-white/70 backdrop-blur-md p-6 md:p-10 rounded-3xl shadow-lg border border-white space-y-8">
          <div className="flex items-center gap-4 border-b border-[#d4567f]/10 pb-4">
            <span className="text-xl md:text-2xl">🗓️</span>
            <h3 className="font-cinzel text-base md:text-lg font-black text-[#5c3d4a] uppercase tracking-widest">The Calendar</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="font-josefin text-[#d4567f] font-black uppercase text-[9px] tracking-widest">Pick a Special Date</label>
              <input
                type="date"
                value={specialDate.date}
                onChange={(e) => setSpecialDate({ ...specialDate, date: e.target.value })}
                className="w-full p-4 border-2 border-gray-50 rounded-2xl focus:border-[#d4567f] focus:outline-none font-josefin text-base shadow-sm bg-white/50"
              />
            </div>

            <div className="space-y-2">
              <label className="font-josefin text-[#d4567f] font-black uppercase text-[9px] tracking-widest">Significance</label>
              <select
                value={specialDate.context}
                onChange={(e) => setSpecialDate({ ...specialDate, context: e.target.value })}
                className="w-full p-4 border-2 border-gray-50 rounded-2xl focus:border-[#d4567f] focus:outline-none font-josefin text-base shadow-sm bg-white/50"
              >
                {DATE_CONTEXTS.map(ctx => (
                  <option key={ctx} value={ctx}>{ctx}</option>
                ))}
              </select>
            </div>

            {specialDate.context === 'Custom...' && (
              <div className="space-y-2 animate-fadeIn">
                <label className="font-josefin text-[#d4567f] font-black uppercase text-[9px] tracking-widest">Custom Context</label>
                <input
                  type="text"
                  value={customContext}
                  onChange={(e) => setCustomContext(e.target.value)}
                  placeholder="e.g. The first time we stayed up all night talking..."
                  className="w-full p-4 border-2 border-gray-50 rounded-2xl focus:border-[#d4567f] focus:outline-none font-josefin text-sm shadow-sm bg-white/50"
                />
              </div>
            )}
          </div>
        </div>

        {/* The Story Section */}
        <div className="bg-white/70 backdrop-blur-md p-6 md:p-10 rounded-3xl shadow-lg border border-white space-y-8">
          <div className="flex items-center gap-4 border-b border-[#d4567f]/10 pb-4">
            <span className="text-xl md:text-2xl">🖋️</span>
            <h3 className="font-cinzel text-base md:text-lg font-black text-[#5c3d4a] uppercase tracking-widest">The Story</h3>
          </div>

          <div className="space-y-8">
            <div className="space-y-2">
              <label className="font-josefin text-[#d4567f] font-black uppercase text-[9px] tracking-widest">Love Letter</label>
              <textarea
                value={memories}
                onChange={(e) => setMemories(e.target.value)}
                placeholder="Write from the depth of your soul..."
                className="w-full p-4 md:p-6 h-40 md:h-64 border-2 border-gray-50 rounded-2xl focus:border-[#d4567f] focus:outline-none resize-none font-courier text-sm md:text-base shadow-inner bg-white/50"
              />
            </div>

            <div className="space-y-4">
              <label className="font-josefin text-[#d4567f] font-black uppercase text-[9px] tracking-widest">Core Sentiments</label>
              <div className="space-y-3">
                {reasons.map((reason, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={reason}
                      onChange={(e) => updateReason(idx, e.target.value)}
                      placeholder={`sentiment ${idx + 1}`}
                      className="flex-1 p-3 md:p-4 border-2 border-gray-50 rounded-xl focus:border-[#d4567f] focus:outline-none font-josefin text-sm shadow-sm bg-white/50"
                    />
                    <button onClick={() => removeReason(idx)} className="w-8 h-8 flex-shrink-0 text-gray-200 hover:text-red-400">✕</button>
                  </div>
                ))}
                <button onClick={addReason} className="w-full p-3 border-2 border-dashed border-[#d4567f]/20 text-[#d4567f] rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-[#d4567f] hover:text-white transition-all">
                  + Add Sentiment
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-josefin text-[#d4567f] font-black uppercase text-[9px] tracking-widest">Signature</label>
              <input
                type="text"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                placeholder="Yours Forever, [Your Name]"
                className="w-full p-4 border-2 border-gray-50 rounded-2xl focus:border-[#d4567f] focus:outline-none transition-all font-cinzel font-black uppercase tracking-wider text-sm bg-white/50"
              />
            </div>
          </div>
        </div>

        <div className="py-8 text-center space-y-4">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !recipientName}
            className={`w-full max-w-md py-5 md:py-6 text-base md:text-lg font-cinzel font-black text-white rounded-full shadow-2xl transition-all uppercase tracking-[0.4em] ${isGenerating ? 'bg-gray-300 cursor-wait' : 'bg-[#d4567f] hover:bg-[#8a223e] border-b-4 md:border-b-8 border-[#590d22]'
              }`}
          >
            {isGenerating ? 'Infusing Love...' : 'Seal the Secret 💌'}
          </button>
          <p className="font-josefin text-[8px] md:text-[10px] text-gray-400 uppercase tracking-[0.3em] font-black">Memory Archive Protocol Secured</p>
        </div>
      </main>
    </div>
  );
};

export default CreatorMode;
