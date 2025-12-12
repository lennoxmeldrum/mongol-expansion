import React, { useState } from 'react';
import MapVisualization from './components/MapVisualization';
import ChatInterface from './components/ChatInterface';
import ImageGenerator from './components/ImageGenerator';
import { EVENTS } from './constants';
import { HistoricalEvent } from './types';

const App: React.FC = () => {
  const [currentYear, setCurrentYear] = useState(1206);
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Animation Loop
  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentYear(prev => {
          if (prev >= 1300) {
            setIsPlaying(false);
            return 1300;
          }
          return prev + 1;
        });
      }, 100); // 100ms per year
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleEventClick = (event: HistoricalEvent) => {
    setSelectedEvent(event);
    setCurrentYear(event.year); // Jump to event year
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentYear(Number(e.target.value));
    setIsPlaying(false); // Stop auto-play on manual intervention
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-100 font-sans">
      {/* Header */}
      <header className="bg-gray-950 border-b border-amber-900/30 p-4 flex items-center justify-between shadow-lg z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center text-xl font-bold text-black border-2 border-amber-400">
            M
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Mongol Empire Explorer</h1>
            <p className="text-xs text-amber-500 uppercase tracking-widest">Interactive History</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
           <span className="px-3 py-1 rounded bg-gray-800 border border-gray-700">1206 - 1300 AD</span>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Left Column: Map & Timeline */}
        <div className="flex-1 flex flex-col min-w-[50%] p-4 gap-4 relative">
          
          {/* Map Container */}
          <div className="flex-1 bg-gray-800 rounded-xl border border-gray-700 shadow-2xl relative overflow-hidden">
             <MapVisualization currentYear={currentYear} onEventClick={handleEventClick} />
             
             {/* Year Display Overlay */}
             <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm border border-amber-500/30 px-6 py-3 rounded-lg pointer-events-none">
               <span className="text-4xl font-mono font-bold text-amber-500">{currentYear}</span>
               <span className="text-sm text-gray-400 ml-2">AD</span>
             </div>

             {/* Event Modal Overlay */}
             {selectedEvent && (
               <div className="absolute bottom-4 right-4 w-80 bg-gray-900/95 backdrop-blur border border-amber-500 rounded-lg p-4 shadow-2xl transform transition-all animate-in fade-in slide-in-from-bottom-4">
                 <div className="flex justify-between items-start mb-2">
                   <h3 className="font-bold text-amber-400">{selectedEvent.title}</h3>
                   <button onClick={() => setSelectedEvent(null)} className="text-gray-400 hover:text-white">
                     &times;
                   </button>
                 </div>
                 <p className="text-sm text-gray-300 leading-relaxed">{selectedEvent.description}</p>
                 <div className="mt-2 text-xs text-gray-500 font-mono">Location: {selectedEvent.location.lat.toFixed(2)}, {selectedEvent.location.lng.toFixed(2)}</div>
               </div>
             )}
          </div>

          {/* Timeline Controls */}
          <div className="h-24 bg-gray-800 rounded-xl border border-gray-700 p-4 flex flex-col justify-center gap-2 shadow-lg">
            <div className="flex justify-between text-xs text-gray-400 px-1 font-mono">
              <span>1206 (Rise)</span>
              <span>1250</span>
              <span>1300 (Fall)</span>
            </div>
            <input 
              type="range" 
              min="1206" 
              max="1300" 
              value={currentYear} 
              onChange={handleSliderChange}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-600 hover:accent-amber-500"
            />
            <div className="flex justify-center mt-1">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-2 px-6 py-1.5 rounded-full text-sm font-bold transition-all ${
                  isPlaying 
                    ? 'bg-red-900/50 text-red-400 border border-red-800 hover:bg-red-900' 
                    : 'bg-amber-700 text-white border border-amber-600 hover:bg-amber-600'
                }`}
              >
                {isPlaying ? (
                  <>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    Pause History
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    Play History
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Tools */}
        <div className="w-[400px] flex flex-col p-4 pl-0 gap-4">
          
          {/* Chatbot (Top half) */}
          <div className="flex-1 h-[60%]">
            <ChatInterface />
          </div>

          {/* Image Gen (Bottom half) */}
          <div className="h-[40%] min-h-[300px]">
            <ImageGenerator />
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;