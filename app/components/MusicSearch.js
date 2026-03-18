import React, { useState, useRef } from 'react';
import { MagnifyingGlassIcon, PlayIcon, CheckIcon, UpdateIcon, SpeakerLoudIcon, PauseIcon } from "@radix-ui/react-icons";
import { searchMusic } from '../services/musicService';

const MusicSearch = ({ onSelectMusic }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTrackId, setSelectedTrackId] = useState(null);
  
  // Audio handling
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm) return;
    setLoading(true);
    const data = await searchMusic(searchTerm);
    setResults(data || []);
    setLoading(false);
  };

  const togglePlay = (track) => {
    if (audioRef.current && selectedTrackId === track.id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      // New track selected
      if (audioRef.current) audioRef.current.pause();
      audioRef.current = new Audio(track.preview);
      audioRef.current.play();
      setSelectedTrackId(track.id);
      setIsPlaying(true);
      onSelectMusic(track.preview); // Send to your video engine
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="relative group/input">
        <input 
          type="text" 
          placeholder="Search viral beats..." 
          className="w-full bg-black/40 border border-white/5 rounded-2xl px-10 py-3 text-[11px] focus:border-blue-500/50 outline-none text-white transition-all shadow-inner placeholder:text-zinc-700" 
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
        <button onClick={handleSearch} disabled={loading} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-xl transition-all active:scale-90 disabled:opacity-50">
          {loading ? <UpdateIcon className="animate-spin w-4 h-4 text-blue-500" /> : <MagnifyingGlassIcon className="w-4 h-4 text-blue-500 font-bold" />}
        </button>
      </div>

      {results.length > 0 && (
        <div className="grid grid-cols-1 gap-2 max-h-[180px] overflow-y-auto pr-2 scrollbar-hide animate-in fade-in slide-in-from-top-2 duration-300">
          {results.map((track) => (
            <div 
              key={track.id} 
              className={`flex items-center gap-3 p-2 rounded-xl border transition-all cursor-pointer group ${selectedTrackId === track.id ? 'bg-blue-600/10 border-blue-500/50' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
              onClick={() => togglePlay(track)}
            >
              <div className="relative shrink-0 group/cover">
                <img src={track.album.cover_small} alt="cover" className="w-9 h-9 rounded-lg object-cover shadow-lg" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover/cover:opacity-100 transition-opacity rounded-lg">
                   {selectedTrackId === track.id && isPlaying ? <PauseIcon className="w-4 h-4 text-white" /> : <PlayIcon className="w-4 h-4 text-white" />}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-black text-zinc-100 truncate uppercase tracking-tight">{track.title}</div>
                <div className="text-[9px] text-zinc-500 truncate font-medium">{track.artist.name}</div>
              </div>

              <div className="flex items-center gap-2">
                {selectedTrackId === track.id ? (
                  <div className={`p-1 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)] ${isPlaying ? 'bg-blue-500' : 'bg-zinc-600'}`}>
                    <CheckIcon className="w-3 h-3 text-white" />
                  </div>
                ) : (
                  <SpeakerLoudIcon className="w-3 h-3 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MusicSearch;