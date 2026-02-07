
import React, { useState, useRef } from 'react';
import { ValentineData } from '../types';
import { DEFAULT_REASONS, DATE_CONTEXTS } from '../constants';
import { generateUniqueCode, saveValentineWithProgress } from '../utils/storage';
import { trimVideoTo30Seconds, blobToBase64 } from '../utils/videoProcessor';

interface CreatorModeProps {
  onSuccess: (data: ValentineData) => void;
  onCancel: () => void;
}

const CreatorMode: React.FC<CreatorModeProps> = ({ onSuccess, onCancel }) => {
  const [recipientName, setRecipientName] = useState('');

  const [photos, setPhotos] = useState<{ file: File; preview: string; id: string }[]>([]);
  const [video, setVideo] = useState<{ blob: Blob; preview: string } | null>(null);
  const [voiceNote, setVoiceNote] = useState<{ blob: Blob; preview: string } | null>(null);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessingVideo, setIsProcessingVideo] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [favoriteColor, setFavoriteColor] = useState('#FF1493');
  const [specialDate, setSpecialDate] = useState({ date: '', context: DATE_CONTEXTS[0] });
  const [customContext, setCustomContext] = useState('');
  const [memories, setMemories] = useState('');
  const [reasons, setReasons] = useState<string[]>(['']);
  const [creatorName, setCreatorName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newPhotos = filesArray.map(file => ({
        file,
        preview: URL.createObjectURL(file as Blob), // Create temporary preview URL
        id: Math.random().toString(36).substr(2, 9)
      }));
      setPhotos(prev => [...prev, ...newPhotos].slice(0, 8));
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsProcessingVideo(true);

      try {
        // Trim video to 30 seconds
        const trimmedBlob = await trimVideoTo30Seconds(file);
        // Create preview URL for the trimmed blob
        const previewUrl = URL.createObjectURL(trimmedBlob);
        setVideo({ blob: trimmedBlob, preview: previewUrl });
      } catch (error) {
        console.error('Error processing video:', error);
        alert('Failed to process video. Please try again.');
      } finally {
        setIsProcessingVideo(false);
      }
    }
  };

  const removeVideo = () => {
    if (video) {
      URL.revokeObjectURL(video.preview);
    }
    setVideo(null);
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const previewUrl = URL.createObjectURL(blob);
        setVoiceNote({ blob, preview: previewUrl });
        stream.getTracks().forEach(track => track.stop());
        setRecordingTime(0);
        if (recordingIntervalRef.current) {
          clearInterval(recordingIntervalRef.current);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 60) {
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const removeVoiceNote = () => {
    if (voiceNote) {
      URL.revokeObjectURL(voiceNote.preview);
    }
    setVoiceNote(null);
    setRecordingTime(0);
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

      const partialData = {
        code,
        recipientName,
        photos: photos.map(p => ({ file: p.file, id: p.id })),
        video: video?.blob,
        voiceNote: voiceNote?.blob,
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

      const finalData = await saveValentineWithProgress(partialData, (progress) => {
        setUploadProgress(progress);
      });

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
                  {photos.map((photo, idx) => (
                    <div key={photo.id} className="relative group p-1 bg-white shadow-sm rounded-lg overflow-hidden aspect-square">
                      <img src={photo.preview} alt="Memory" className="w-full h-full object-cover rounded-md" />
                      <button onClick={() => removePhoto(idx)} className="absolute top-1 right-1 w-6 h-6 bg-[#d4567f] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-xs">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Video Upload Section */}
            <div className="space-y-3">
              <label className="font-josefin text-[#d4567f] font-black uppercase text-[9px] tracking-widest">
                Video Message (30s Max)
              </label>
              {!video ? (
                <div
                  onClick={() => videoInputRef.current?.click()}
                  className="border-2 border-dashed border-[#d4567f]/20 rounded-2xl p-8 text-center cursor-pointer bg-white/40 hover:border-[#d4567f] transition-all group"
                >
                  {isProcessingVideo ? (
                    <>
                      <div className="text-4xl opacity-40 mb-2 animate-pulse">⏳</div>
                      <p className="font-cinzel text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        Processing Video...
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="text-4xl opacity-10 mb-2 group-hover:opacity-40 transition-all">🎥</div>
                      <p className="font-cinzel text-[9px] font-black text-gray-400 uppercase tracking-widest group-hover:text-[#d4567f]">
                        Upload Video
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    ref={videoInputRef}
                    onChange={handleVideoUpload}
                    accept="video/*"
                    className="hidden"
                    disabled={isProcessingVideo}
                  />
                </div>
              ) : (
                <div className="relative bg-white p-3 rounded-2xl shadow-sm">
                  <video src={video.preview} controls className="w-full rounded-lg" />
                  <button
                    onClick={removeVideo}
                    className="absolute top-5 right-5 w-8 h-8 bg-[#d4567f] text-white rounded-full flex items-center justify-center hover:bg-[#c14570] transition-all text-sm font-black"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Voice Note Section */}
            <div className="space-y-3">
              <label className="font-josefin text-[#d4567f] font-black uppercase text-[9px] tracking-widest">
                Voice Note (60s Max)
              </label>
              {!voiceNote ? (
                <div className="border-2 border-dashed border-[#d4567f]/20 rounded-2xl p-8 text-center bg-white/40">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="w-full flex flex-col items-center gap-3 group"
                    >
                      <div className="text-4xl opacity-10 group-hover:opacity-40 transition-all">🎙️</div>
                      <p className="font-cinzel text-[9px] font-black text-gray-400 uppercase tracking-widest group-hover:text-[#d4567f]">
                        Record Voice Note
                      </p>
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-4xl animate-pulse">🔴</div>
                      <p className="font-cinzel text-lg font-black text-[#d4567f]">
                        {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                      </p>
                      <button
                        onClick={stopRecording}
                        className="px-6 py-2 bg-[#d4567f] text-white rounded-full font-cinzel text-xs font-black uppercase tracking-wider hover:bg-[#c14570] transition-all"
                      >
                        Stop Recording
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative bg-white p-4 rounded-2xl shadow-sm">
                  <audio src={voiceNote.preview} controls className="w-full" />
                  <button
                    onClick={removeVoiceNote}
                    className="absolute top-2 right-2 w-8 h-8 bg-[#d4567f] text-white rounded-full flex items-center justify-center hover:bg-[#c14570] transition-all text-sm font-black"
                  >
                    ✕
                  </button>
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
          {isGenerating && (
            <div className="w-full max-w-md mx-auto space-y-2">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#d4567f] transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="font-cinzel text-xs font-black text-[#d4567f] uppercase tracking-widest">
                {uploadProgress < 100 ? `Uploading Memories... ${Math.round(uploadProgress)}%` : 'Finalizing...'}
              </p>
            </div>
          )}

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
