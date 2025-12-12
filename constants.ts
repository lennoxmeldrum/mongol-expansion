import { City, HistoricalEvent, Persona } from './types';

export const EVENTS: HistoricalEvent[] = [
  {
    year: 1206,
    title: "Unification of Tribes",
    description: "Temüjin is proclaimed Genghis Khan, uniting the Mongol tribes.",
    location: { lat: 47.9, lng: 106.9 }
  },
  {
    year: 1215,
    title: "Fall of Zhongdu (Beijing)",
    description: "The Mongols capture the Jin capital, marking a major expansion into China.",
    location: { lat: 39.9, lng: 116.4 }
  },
  {
    year: 1219,
    title: "Invasion of Khwarezmia",
    description: "The Mongols invade Central Asia after their envoys are executed.",
    location: { lat: 41.2, lng: 69.2 }
  },
  {
    year: 1227,
    title: "Death of Genghis Khan",
    description: "Genghis Khan dies; the empire is divided among his sons.",
    location: { lat: 38.0, lng: 106.0 }
  },
  {
    year: 1240,
    title: "Fall of Kiev",
    description: "Batu Khan's Golden Horde captures Kiev, devastating Rus'.",
    location: { lat: 50.45, lng: 30.5 }
  },
  {
    year: 1258,
    title: "Siege of Baghdad",
    description: "Hulagu Khan sacks Baghdad, ending the Islamic Golden Age.",
    location: { lat: 33.3, lng: 44.4 }
  },
  {
    year: 1279,
    title: "Conquest of Song China",
    description: "Kublai Khan defeats the Song Dynasty, establishing the Yuan Dynasty.",
    location: { lat: 30.2, lng: 120.1 }
  },
  {
    year: 1294,
    title: "Pax Mongolica Peaks",
    description: "The empire reaches its maximum stable extent before fracturing.",
    location: { lat: 45.0, lng: 80.0 }
  }
];

export const CITIES: City[] = [
  { name: "Karakorum", coordinates: [102.78, 47.2], conqueredYear: 1200 }, // Capital
  { name: "Beijing (Zhongdu)", coordinates: [116.4, 39.9], conqueredYear: 1215 },
  { name: "Samarkand", coordinates: [66.96, 39.65], conqueredYear: 1220 },
  { name: "Bukhara", coordinates: [64.42, 39.77], conqueredYear: 1220 },
  { name: "Kiev", coordinates: [30.52, 50.45], conqueredYear: 1240 },
  { name: "Baghdad", coordinates: [44.42, 33.31], conqueredYear: 1258 },
  { name: "Moscow", coordinates: [37.61, 55.75], conqueredYear: 1238 },
  { name: "Hangzhou", coordinates: [120.15, 30.27], conqueredYear: 1276 },
  { name: "Tabriz", coordinates: [46.29, 38.06], conqueredYear: 1231 },
  { name: "Sarai", coordinates: [47.5, 47.2], conqueredYear: 1242 }
];

export const PERSONAS: Persona[] = [
  {
    id: "genghis",
    name: "Genghis Khan",
    role: "Supreme Khan",
    avatar: "https://picsum.photos/id/1005/200/200",
    systemPrompt: "You are Genghis Khan (Temüjin). You are strategic, ruthless to enemies but loyal to those who submit. You value meritocracy and discipline. Speak with authority and archaic wisdom about the unification of the steppes and the Tengri."
  },
  {
    id: "soldier",
    name: "Subutai's Archer",
    role: "Mongol Soldier",
    avatar: "https://picsum.photos/id/1011/200/200",
    systemPrompt: "You are a common horse archer in the army of Subutai. You are tough, practical, and fiercely loyal. You talk about life in the saddle, the speed of the pony express (Yam), and the thrill of the hunt/battle."
  },
  {
    id: "citizen",
    name: "Baghdad Scholar",
    role: "Conquered Citizen",
    avatar: "https://picsum.photos/id/1025/200/200",
    systemPrompt: "You are a scholar living in Baghdad during the 1258 siege. You are fearful yet observant. You mourn the loss of the House of Wisdom. You describe the terrifying efficiency of the Mongol war machine from a victim's perspective."
  },
  {
    id: "merchant",
    name: "Silk Road Merchant",
    role: "Trader",
    avatar: "https://picsum.photos/id/1060/200/200",
    systemPrompt: "You are a merchant traveling the Silk Road under the Pax Mongolica. You appreciate the safety the Mongols bring to trade, despite their brutality. You talk about spices, silk, and the safe passage tokens (Paiza)."
  }
];