import React from 'react';
import { GameState } from '../types';
import { MAX_TURNS, WIN_UNITY_THRESHOLD, LOSE_PRESSURE_THRESHOLD } from '../constants';

interface GameHUDProps {
  state: GameState;
  onEndTurn: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({ state, onEndTurn }) => {
  return (
    <div className="w-full flex flex-col md:flex-row gap-4 mb-4">
      
      {/* Stats Container */}
      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Unity (Health) */}
        <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 flex items-center justify-between shadow-sm relative overflow-hidden">
            <div className="absolute bottom-0 left-0 h-1 bg-emerald-500 transition-all duration-700" style={{ width: `${(state.unity / WIN_UNITY_THRESHOLD) * 100}%` }}></div>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-slate-700 flex items-center justify-center text-emerald-400 text-lg">
                    <i className="fa-solid fa-heart-pulse"></i>
                </div>
                <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">民族團結</p>
                    <p className="text-xl font-black text-white leading-none mt-1">{state.unity} <span className="text-[10px] text-slate-500 font-normal">/ {WIN_UNITY_THRESHOLD}</span></p>
                </div>
            </div>
        </div>

        {/* Resources */}
        <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 flex items-center justify-between shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-slate-700 flex items-center justify-center text-amber-400 text-lg">
                    <i className="fa-solid fa-coins"></i>
                </div>
                <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">動員資源</p>
                    <p className="text-xl font-black text-white leading-none mt-1">{state.resources}</p>
                </div>
            </div>
        </div>

        {/* Pressure (Danger) */}
        <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 flex items-center justify-between shadow-sm relative overflow-hidden">
             <div className="absolute bottom-0 left-0 h-1 bg-rose-500 transition-all duration-700" style={{ width: `${(state.pressure / LOSE_PRESSURE_THRESHOLD) * 100}%` }}></div>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-slate-700 flex items-center justify-center text-rose-400 text-lg">
                    <i className="fa-solid fa-gauge-high"></i>
                </div>
                <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">帝國壓迫</p>
                    <p className="text-xl font-black text-white leading-none mt-1">{state.pressure} <span className="text-[10px] text-slate-500 font-normal">/ {LOSE_PRESSURE_THRESHOLD}</span></p>
                </div>
            </div>
        </div>

        {/* Turn */}
        <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 flex items-center justify-between shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-slate-700 flex items-center justify-center text-indigo-400 text-lg">
                    <i className="fa-solid fa-hourglass-half"></i>
                </div>
                <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">剩餘回合</p>
                    <p className="text-xl font-black text-white leading-none mt-1">{MAX_TURNS - state.turn} <span className="text-[10px] text-slate-500 font-normal">/ {MAX_TURNS}</span></p>
                </div>
            </div>
        </div>
      </div>

      {/* End Turn Button */}
      <div className="w-full md:w-auto flex items-stretch">
          <button 
            onClick={onEndTurn}
            className="w-full md:w-32 bg-slate-700 hover:bg-amber-600 text-slate-200 hover:text-white border border-slate-600 hover:border-amber-500 rounded-lg shadow-lg transition-all flex flex-col items-center justify-center gap-1 group py-2 md:py-0"
          >
              <i className="fa-solid fa-forward text-xl group-hover:translate-x-1 transition-transform"></i>
              <span className="text-xs font-bold uppercase">結束回合</span>
          </button>
      </div>

    </div>
  );
};
