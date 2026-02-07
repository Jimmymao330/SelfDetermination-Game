import { TerrainType } from './types';

export const MAP_RADIUS = 3;
export const MAX_TURNS = 25;
export const WIN_UNITY_THRESHOLD = 300;
export const LOSE_PRESSURE_THRESHOLD = 100;

export const INITIAL_RESOURCES = 60;
export const INITIAL_UNITY = 30;
export const INITIAL_PRESSURE = 10;
export const PASSIVE_INCOME_BASE = 10; // Base resources per turn

// Using Font Awesome class names
export const TERRAIN_CONFIG: Record<TerrainType, { label: string; color: string; iconClass: string; description: string }> = {
  [TerrainType.PLAINS]: { 
    label: '鄉村', 
    color: '#059669', // emerald-600
    iconClass: 'fa-solid fa-wheat-awn',
    description: '人口分散，適合文化傳播，但動員效率較低。'
  }, 
  [TerrainType.MOUNTAINS]: { 
    label: '高地', 
    color: '#475569', // slate-600
    iconClass: 'fa-solid fa-mountain', 
    description: '易守難攻，傳統勢力強大，抗爭效果佳。'
  }, 
  [TerrainType.CITY]: { 
    label: '都會', 
    color: '#4f46e5', // indigo-600
    iconClass: 'fa-solid fa-city',
    description: '帝國控制核心，資源豐富但壓迫感極高。'
  }, 
  [TerrainType.COAST]: { 
    label: '港口', 
    color: '#0284c7', // sky-600
    iconClass: 'fa-solid fa-anchor',
    description: '連結外部世界，易於尋求外交支持。'
  }, 
};

export const SYSTEM_INSTRUCTION = `
You are the narrator for a game called "National Awakening".
The user has just finished a game session.
Write a short, emotional, 2-paragraph epilogue based on whether they WON (Independence Achieved) or LOST (Suppressed).
Focus on the legacy of the movement.
`;
