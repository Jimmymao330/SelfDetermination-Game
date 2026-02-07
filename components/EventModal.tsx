import React from 'react';
import { ActionType, EventScenario } from '../types';
import { TERRAIN_CONFIG } from '../constants';

interface EventModalProps {
  scenario: EventScenario;
  onOptionSelect: (type: ActionType, cost: number) => void;
  onCancel: () => void;
  currentResources: number;
}

const ActionIcon = ({ type }: { type: ActionType }) => {
    let iconClass = '';
    switch (type) {
        case ActionType.CULTURE: iconClass = 'fa-solid fa-music'; break;
        case ActionType.DIPLOMACY: iconClass = 'fa-solid fa-handshake'; break;
        case ActionType.PROTEST: iconClass = 'fa-solid fa-bullhorn'; break;
        default: return null;
    }
    return <i className={`${iconClass} text-lg`}></i>;
};

const ActionColor = (type: ActionType) => {
     switch (type) {
        case ActionType.CULTURE: return 'bg-emerald-600 hover:bg-emerald-500 border-emerald-500';
        case ActionType.DIPLOMACY: return 'bg-sky-600 hover:bg-sky-500 border-sky-500';
        case ActionType.PROTEST: return 'bg-rose-600 hover:bg-rose-500 border-rose-500';
        default: return 'bg-slate-600';
    }
};

export const EventModal: React.FC<EventModalProps> = ({ scenario, onOptionSelect, onCancel, currentResources }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-600 rounded-lg max-w-lg w-full shadow-2xl flex flex-col overflow-hidden transform transition-all scale-100">
        
        {/* Header */}
        <div className="bg-slate-800 p-5 border-b border-slate-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-amber-500 border border-slate-600">
                 <i className={`${TERRAIN_CONFIG[scenario.terrain[0]].iconClass} text-xl`}></i>
             </div>
             <div>
                <h2 className="text-xl font-bold text-white tracking-wide">{scenario.title}</h2>
                <span className="text-xs text-slate-400 uppercase tracking-wider">{TERRAIN_CONFIG[scenario.terrain[0]].label} 區域事件</span>
             </div>
          </div>
          <button onClick={onCancel} className="text-slate-500 hover:text-white transition-colors">
            <i className="fa-solid fa-xmark text-2xl"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="bg-slate-800/50 p-4 rounded border-l-4 border-amber-500 mb-6">
            <p className="text-slate-300 text-lg leading-relaxed font-serif">
                {scenario.description}
            </p>
          </div>

          <div className="space-y-3">
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <i className="fa-solid fa-gavel"></i>
                決策選項
             </h3>
             {scenario.options.map((option, idx) => {
                    const canAfford = currentResources >= option.baseCost;
                    return (
                        <button
                            key={idx}
                            onClick={() => canAfford && onOptionSelect(option.type, option.baseCost)}
                            disabled={!canAfford}
                            className={`w-full flex items-center justify-between p-4 rounded border transition-all group relative overflow-hidden ${
                                canAfford 
                                ? `${ActionColor(option.type)} text-white shadow-lg hover:translate-x-1` 
                                : 'bg-slate-800 border-slate-700 text-slate-600 cursor-not-allowed opacity-50 grayscale'
                            }`}
                        >
                            {/* Bg Pattern */}
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="flex items-center gap-4 relative z-10">
                                <div className={`w-10 h-10 rounded flex items-center justify-center bg-black/20 shadow-inner`}>
                                    <ActionIcon type={option.type} />
                                </div>
                                <div className="text-left">
                                    <div className="font-bold text-lg">{option.label}</div>
                                    <div className="text-xs opacity-80 font-light">
                                        {option.type === ActionType.CULTURE && "提升文化認同"}
                                        {option.type === ActionType.DIPLOMACY && "尋求外部支援"}
                                        {option.type === ActionType.PROTEST && "直接對抗體制"}
                                    </div>
                                </div>
                            </div>
                            <div className="relative z-10 flex flex-col items-end">
                                <span className={`font-mono text-lg font-bold ${canAfford ? 'text-white' : 'text-rose-500'}`}>
                                    -{option.baseCost}
                                </span>
                                <span className="text-[10px] uppercase opacity-70">資源</span>
                            </div>
                        </button>
                    );
                })
             }
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-3 flex justify-between items-center text-xs text-slate-500 px-6 border-t border-slate-800">
           <span><i className="fa-solid fa-circle-info mr-1"></i> 不同地形影響成功率</span>
           <span>當前資源: <span className={currentResources < 10 ? 'text-rose-500 font-bold' : 'text-emerald-400 font-bold'}>{currentResources}</span></span>
        </div>
      </div>
    </div>
  );
};
