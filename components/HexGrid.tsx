import React from 'react';
import { HexTile, Faction, TerrainType } from '../types';
import { TERRAIN_CONFIG } from '../constants';

interface HexGridProps {
  map: HexTile[];
  onTileClick: (hex: HexTile) => void;
  selectedHexId: string | null;
}

const HEX_SIZE = 45; // Slightly larger
const HEX_WIDTH = Math.sqrt(3) * HEX_SIZE;
const HEX_HEIGHT = 2 * HEX_SIZE;

// Calculate pixel coordinates from axial coordinates (q, r)
const hexToPixel = (q: number, r: number) => {
  const x = HEX_SIZE * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r);
  const y = HEX_SIZE * (3 / 2) * r;
  return { x, y };
};

const Hexagon = ({ tile, onClick, isSelected }: { tile: HexTile; onClick: () => void; isSelected: boolean }) => {
  const { x, y } = hexToPixel(tile.q, tile.r);
  
  const config = TERRAIN_CONFIG[tile.terrain];
  
  let fill = config.color;
  let stroke = '#1e293b'; // slate-800
  let strokeWidth = 2;
  let opacity = 1;
  let iconColor = 'rgba(255,255,255,0.7)';

  const isPlayer = tile.owner === Faction.PLAYER;
  const isOppressor = tile.owner === Faction.OPPRESSOR;

  if (isOppressor) {
    fill = '#1e293b'; // Very dark slate for enemy territory
    stroke = '#334155';
    iconColor = 'rgba(255,255,255,0.15)'; // Faint icon
  } else if (isPlayer) {
    stroke = '#f59e0b'; // Amber-500 border
    strokeWidth = 3;
    iconColor = '#ffffff';
  }

  if (isSelected) {
    stroke = '#ffffff';
    strokeWidth = 4;
    // Glow effect handled by filter
  }

  const points = [
    [0, -HEX_SIZE],
    [HEX_WIDTH / 2, -HEX_SIZE / 2],
    [HEX_WIDTH / 2, HEX_SIZE / 2],
    [0, HEX_SIZE],
    [-HEX_WIDTH / 2, HEX_SIZE / 2],
    [-HEX_WIDTH / 2, -HEX_SIZE / 2]
  ].map(([px, py]) => `${px + x},${py + y}`).join(' ');

  return (
    <g 
        onClick={onClick} 
        className={`transition-all duration-300 ${isSelected ? '' : 'hover:brightness-125'} cursor-pointer`}
        style={{ transformOrigin: `${x}px ${y}px`}}
    >
      {/* The Hexagon Shape */}
      <polygon
        points={points}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        opacity={opacity}
        className="transition-all duration-500"
        filter={isSelected ? 'url(#glow)' : undefined}
      />
      
      {/* Pattern Overlay for Oppressor (Hatching) - Optional visual detail */}
      {isOppressor && (
         <polygon points={points} fill="url(#diagonalHatch)" opacity="0.3" pointerEvents="none" />
      )}

      {/* Font Awesome Icon via foreignObject */}
      <foreignObject 
        x={x - 15} 
        y={y - 15} 
        width="30" 
        height="30" 
        className="pointer-events-none"
        style={{ overflow: 'visible' }}
      >
        <div className="flex items-center justify-center w-full h-full">
            {isPlayer ? (
                 <i className="fa-solid fa-flag text-amber-400 text-2xl drop-shadow-md animate-pulse"></i>
            ) : (
                 <i className={`${config.iconClass} text-2xl`} style={{ color: iconColor }}></i>
            )}
        </div>
      </foreignObject>
    </g>
  );
};

export const HexGrid: React.FC<HexGridProps> = ({ map, onTileClick, selectedHexId }) => {
  const viewBoxSize = 700;
  
  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden bg-slate-950 relative rounded-xl border border-slate-800 shadow-2xl">
      
      {/* Legend */}
      <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur border border-slate-700 p-3 rounded-lg shadow-xl text-xs text-slate-300 pointer-events-none space-y-2">
        {Object.entries(TERRAIN_CONFIG).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded flex items-center justify-center bg-slate-800" style={{ color: cfg.color }}>
                    <i className={cfg.iconClass}></i>
                </div>
                <span>{cfg.label}</span>
            </div>
        ))}
         <div className="w-full h-px bg-slate-700 my-2"></div>
         <div className="flex items-center gap-2">
             <div className="w-6 h-6 rounded flex items-center justify-center bg-slate-800 text-amber-400">
                <i className="fa-solid fa-flag"></i>
             </div>
             <span>已解放區域</span>
         </div>
         <div className="flex items-center gap-2">
             <div className="w-6 h-6 rounded flex items-center justify-center bg-slate-800 text-slate-600">
                <i className="fa-solid fa-ban"></i>
             </div>
             <span>未覺醒區域</span>
         </div>
      </div>
      
      <svg 
        viewBox={`-${viewBoxSize/2} -${viewBoxSize/2} ${viewBoxSize} ${viewBoxSize}`} 
        className="w-full h-full max-w-[800px] max-h-[800px]"
      >
        <defs>
           <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <pattern id="diagonalHatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="10" style={{stroke: '#000', strokeWidth: 4}} />
          </pattern>
        </defs>
        {map.map((tile) => (
          <Hexagon
            key={tile.id}
            tile={tile}
            isSelected={selectedHexId === tile.id}
            onClick={() => onTileClick(tile)}
          />
        ))}
      </svg>
    </div>
  );
};
