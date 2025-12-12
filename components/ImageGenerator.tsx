import React, { useState } from 'react';
import { generateHistoricalImage } from '../services/geminiService';
import { ImageSize } from '../types';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<ImageSize>('1K');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      // Prepend context to help the model maintain the theme
      const historicalPrompt = `Historical scene from the Mongol Empire: ${prompt}. Cinematic lighting, photorealistic, high detail.`;
      const result = await generateHistoricalImage(historicalPrompt, size);
      setImageUrl(result);
    } catch (err: any) {
      setError("Failed to generate image. Please ensure you have selected a valid API Key (requires paid project for Veo/Image models).");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-800 rounded-lg border border-gray-700 shadow-xl overflow-hidden">
      <div className="p-4 bg-gray-900 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-amber-500 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          Empire Visualizer
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          Generate high-fidelity scenes using <span className="text-amber-300 font-mono">Nano Banana Pro</span>.
        </p>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-4 overflow-y-auto">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Scene Description</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A Mongol horse archer riding across the steppe at sunset..."
              className="w-full h-24 bg-gray-900 border border-gray-600 rounded-lg p-3 text-sm text-white focus:border-amber-500 focus:outline-none resize-none"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Resolution</label>
            <div className="flex gap-2">
              {(['1K', '2K', '4K'] as ImageSize[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`flex-1 py-2 text-xs font-bold rounded border ${
                    size === s 
                      ? 'bg-amber-600 border-amber-500 text-white' 
                      : 'bg-gray-900 border-gray-600 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="w-full py-3 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-bold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.01] active:scale-[0.99]"
          >
            {isLoading ? 'Conjuring Vision...' : 'Generate Image'}
          </button>
          
          {error && (
            <div className="p-3 bg-red-900/50 border border-red-800 rounded text-red-200 text-xs">
              {error}
               <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline block mt-1">Billing Info</a>
            </div>
          )}
        </div>

        <div className="flex-1 bg-black/40 rounded-lg border-2 border-dashed border-gray-700 flex items-center justify-center relative min-h-[200px]">
          {imageUrl ? (
            <img src={imageUrl} alt="Generated scene" className="w-full h-full object-contain rounded-lg shadow-2xl" />
          ) : (
            <div className="text-gray-600 text-center p-4">
              {isLoading ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm animate-pulse">Consulting the oracles...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                   <svg className="w-12 h-12 mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                   <span className="text-sm">Visuals will appear here</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;