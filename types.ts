export enum TerrainType {
  PLAINS = 'PLAINS', // 平原
  MOUNTAINS = 'MOUNTAINS', // 山地
  CITY = 'CITY', // 城市
  COAST = 'COAST' // 海岸
}

export enum Faction {
  PLAYER = 'PLAYER',
  OPPRESSOR = 'OPPRESSOR'
}

export interface HexTile {
  id: string;
  q: number;
  r: number;
  terrain: TerrainType;
  owner: Faction;
  resourceValue: number; // Resources gained per turn from this tile
}

export interface GameState {
  turn: number;
  unity: number; // Score/HP
  resources: number; // Currency
  pressure: number; // Threat level
  map: HexTile[];
  selectedHexId: string | null;
  gameStatus: 'INTRO' | 'PLAYING' | 'VICTORY' | 'DEFEAT';
  history: { turn: number; text: string; type: 'success' | 'fail' | 'neutral' }[];
}

export enum ActionType {
  CULTURE = 'CULTURE', 
  DIPLOMACY = 'DIPLOMACY',
  PROTEST = 'PROTEST'
}

export interface ScenarioOption {
  type: ActionType;
  label: string;
  baseCost: number;
  successRate: number; // 0.0 to 1.0
  successReward: {
    unity: number;
    pressure: number;
    resources: number;
  };
  failPenalty: {
    unity: number;
    pressure: number;
    resources: number;
  };
  successText: string;
  failText: string;
}

export interface EventScenario {
  id: string;
  terrain: TerrainType[];
  title: string;
  description: string;
  options: ScenarioOption[];
}

export interface EventOutcome {
  success: boolean;
  message: string;
  unityChange: number;
  pressureChange: number;
  resourceChange: number;
}
