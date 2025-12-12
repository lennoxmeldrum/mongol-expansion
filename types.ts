export interface HistoricalEvent {
  year: number;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Persona {
  id: string;
  name: string;
  role: string;
  avatar: string;
  systemPrompt: string;
}

export interface City {
  name: string;
  coordinates: [number, number]; // [lng, lat] for D3
  conqueredYear: number;
}

export type ImageSize = '1K' | '2K' | '4K';

// Add type definition for window.aistudio
declare global {
  // Augment the existing AIStudio interface to include necessary methods
  interface AIStudio {
    hasSelectedApiKey(): Promise<boolean>;
    openSelectKey(): Promise<void>;
  }
}