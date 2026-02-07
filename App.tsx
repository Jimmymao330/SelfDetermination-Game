import React, { useState, useEffect } from 'react';
import { HexGrid } from './components/HexGrid';
import { GameHUD } from './components/GameHUD';
import { EventModal } from './components/EventModal';
import { GameState, HexTile, Faction, TerrainType, EventScenario, ActionType, EventOutcome } from './types';
import { MAP_RADIUS, INITIAL_RESOURCES, INITIAL_UNITY, INITIAL_PRESSURE, MAX_TURNS, WIN_UNITY_THRESHOLD, LOSE_PRESSURE_THRESHOLD, PASSIVE_INCOME_BASE } from './constants';
import { getRandomScenario } from './data/scenarios';

const generateMap = (radius: number): HexTile[] => {
  const tiles: HexTile[] = [];
  const terrainTypes = Object.values(TerrainType);
  
  for (let q = -radius; q <= radius; q++) {
    const r1 = Math.max(-radius, -q - radius);
    const r2 = Math.min(radius, -q + radius);
    for (let r = r1; r <= r2; r++) {
      const isCenter = q === 0 && r === 0;
      tiles.push({
        id: `${q},${r}`,
        q,
        r,
        terrain: isCenter ? TerrainType.CITY : terrainTypes[Math.floor(Math.random() * terrainTypes.length)],
        owner: isCenter ? Faction.PLAYER : Faction.OPPRESSOR,
        resourceValue: Math.floor(Math.random() * 5) + 3 // Static value for income calculation
      });
    }
  }
  return tiles;
};

const App: React.FC = () => {
  // --- State ---
  const [gameState, setGameState] = useState<GameState>({
    turn: 1,
    unity: INITIAL_UNITY,
    resources: INITIAL_RESOURCES,
    pressure: INITIAL_PRESSURE,
    map: [],
    selectedHexId: null,
    gameStatus: 'INTRO',
    history: []
  });

  const [activeScenario, setActiveScenario] = useState<EventScenario | null>(null);
  const [outcomeMessage, setOutcomeMessage] = useState<EventOutcome | null>(null);
  const [showFundraising, setShowFundraising] = useState(false);

  // --- Initialization ---
  useEffect(() => {
    const initialMap = generateMap(MAP_RADIUS);
    setGameState(prev => ({ ...prev, map: initialMap }));
  }, []);

  // --- Handlers ---
  
  const handleTileClick = (tile: HexTile) => {
    if (gameState.gameStatus !== 'PLAYING') return;
    if (tile.owner === Faction.PLAYER) return; // Already owned
    
    setGameState(prev => ({ ...prev, selectedHexId: tile.id }));
    
    // Get Instant Static Scenario
    const scenario = getRandomScenario(tile.terrain);
    setActiveScenario(scenario);
  };

  const handleActionSelect = (type: ActionType, cost: number) => {
    if (!gameState.selectedHexId || !activeScenario) return;

    const targetTile = gameState.map.find(t => t.id === gameState.selectedHexId)!;
    const option = activeScenario.options.find(o => o.type === type)!;

    // Deduct cost
    setGameState(prev => ({ ...prev, resources: prev.resources - cost }));

    // Logic Resolution (Probability)
    const roll = Math.random();
    const isSuccess = roll < option.successRate;

    const result = isSuccess ? option.successReward : option.failPenalty;
    const message = isSuccess ? option.successText : option.failText;

    const outcome: EventOutcome = {
        success: isSuccess,
        message: message,
        unityChange: result.unity,
        pressureChange: result.pressure,
        resourceChange: result.resources
    };

    setOutcomeMessage(outcome);
    setActiveScenario(null);

    // Apply Effects
    setGameState(prev => {
        let newMap = [...prev.map];
        let unityGain = outcome.unityChange;
        
        if (outcome.success) {
            // Conquer Tile
             newMap = newMap.map(t => {
                if (t.id === prev.selectedHexId) {
                    return { ...t, owner: Faction.PLAYER };
                }
                return t;
            });
            unityGain += 10; // Bonus for map control
        }

        const historyItem = { 
            turn: prev.turn, 
            text: outcome.message, 
            type: (outcome.success ? 'success' : 'fail') as 'success' | 'fail' | 'neutral' 
        };

        return checkEndGame({
            ...prev,
            map: newMap,
            unity: prev.unity + unityGain,
            pressure: prev.pressure + outcome.pressureChange,
            resources: prev.resources + outcome.resourceChange,
            selectedHexId: null,
            history: [historyItem, ...prev.history].slice(0, 8)
        });
    });
  };

  const handleEndTurn = () => {
      // Calculate Income
      const ownedTiles = gameState.map.filter(t => t.owner === Faction.PLAYER);
      const income = PASSIVE_INCOME_BASE + (ownedTiles.length * 5);
      
      // Calculate Pressure Creep (Empire fights back)
      const pressureCreep = Math.floor(gameState.turn / 2) + 2;

      setGameState(prev => {
        const nextState = {
            ...prev,
            turn: prev.turn + 1,
            resources: prev.resources + income,
            pressure: prev.pressure + pressureCreep,
            history: [{ turn: prev.turn, text: `回合結束。獲得 ${income} 資源。帝國壓力上升 ${pressureCreep}。`, type: 'neutral' as const }, ...prev.history].slice(0, 8)
        };
        return checkEndGame(nextState);
      });
  };

  const handleFundraising = () => {
    // Special Action: Spend Turn to get Resources
    const amount = 25;
    setGameState(prev => {
        const nextState = {
            ...prev,
            turn: prev.turn + 1, // Costs a turn
            resources: prev.resources + amount,
            history: [{ turn: prev.turn, text: `發起緊急募款，獲得 ${amount} 資源。`, type: 'neutral' as const }, ...prev.history].slice(0, 8)
        };
        return checkEndGame(nextState);
    });
    setShowFundraising(false);
  };

  const checkEndGame = (state: GameState): GameState => {
      if (state.unity >= WIN_UNITY_THRESHOLD) return { ...state, gameStatus: 'VICTORY' };
      if (state.pressure >= LOSE_PRESSURE_THRESHOLD) return { ...state, gameStatus: 'DEFEAT' };
      if (state.turn > MAX_TURNS) return { ...state, gameStatus: 'DEFEAT' };
      return state;
  };

  const closeOutcome = () => {
    setOutcomeMessage(null);
  };

  const startGame = () => {
    setGameState(prev => ({ ...prev, gameStatus: 'PLAYING' }));
  };

  // --- Renders ---

  if (gameState.gameStatus === 'INTRO') {
      return (
          <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 to-slate-950">
              <div className="max-w-2xl w-full bg-slate-900 border border-slate-700 p-8 rounded-2xl shadow-2xl text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500"></div>
                  <i className="fa-solid fa-book-open text-5xl text-amber-500 mb-6 block drop-shadow-lg"></i>
                  <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                      聲浪：<span className="text-amber-500">民族覺醒</span>
                  </h1>
                  <p className="text-slate-400 text-lg mb-8 leading-relaxed max-w-lg mx-auto">
                      你身處一個被強權籠罩的時代。<br/>
                      作為新興的領袖，你的任務是喚醒各地的民族意識。<br/>
                      透過<b>文化</b>、<b>外交</b>或<b>抗爭</b>，將灰色區域轉化為你的力量。
                  </p>
                  <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
                      <div className="bg-emerald-900/30 border border-emerald-800 p-4 rounded text-left flex-1">
                          <h3 className="text-emerald-400 font-bold mb-1"><i className="fa-solid fa-wheat-awn mr-2"></i>佔領領土</h3>
                          <p className="text-xs text-slate-400">擴大版圖以獲得每回合的資源收入。</p>
                      </div>
                      <div className="bg-rose-900/30 border border-rose-800 p-4 rounded text-left flex-1">
                          <h3 className="text-rose-400 font-bold mb-1"><i className="fa-solid fa-clock mr-2"></i>時間壓力</h3>
                          <p className="text-xs text-slate-400">在 {MAX_TURNS} 回合內達成目標，否則運動將被遺忘。</p>
                      </div>
                  </div>
                  <button 
                    onClick={startGame}
                    className="group bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 px-10 rounded-full text-xl transition-all shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.6)]"
                  >
                      開始旅程 <i className="fa-solid fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                  </button>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-amber-500/30 flex flex-col">
      
      <div className="container mx-auto px-4 py-4 max-w-6xl flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
            <h1 className="text-lg font-bold tracking-wider text-slate-400 flex items-center gap-2">
                <i className="fa-solid fa-feather text-amber-500"></i>
                聲浪：民族覺醒 
                <span className="ml-2 px-2 py-0.5 rounded bg-slate-800 text-[10px] border border-slate-700">Beta</span>
            </h1>
            
            {/* Fundraising Button (Emergency Resource) */}
            <button 
                onClick={() => setShowFundraising(true)}
                className="text-xs flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors"
            >
                <i className="fa-solid fa-hand-holding-dollar"></i> 資源不足？
            </button>
        </header>

        {/* HUD */}
        <GameHUD state={gameState} onEndTurn={handleEndTurn} />

        {/* Main Game Area */}
        <div className="flex-1 relative flex flex-col lg:flex-row gap-6 overflow-hidden min-h-[500px]">
            {/* Map Container */}
            <div className="flex-1 relative bg-slate-900/50 rounded-xl border border-slate-800 shadow-inner p-4 flex items-center justify-center">
                 {/* End Game Overlays */}
                 {(gameState.gameStatus === 'VICTORY' || gameState.gameStatus === 'DEFEAT') && (
                    <div className="absolute inset-0 z-20 bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-1000">
                        <i className={`fa-solid ${gameState.gameStatus === 'VICTORY' ? 'fa-trophy text-yellow-400' : 'fa-skull text-slate-400'} text-6xl mb-6`}></i>
                        <h2 className="text-5xl font-black text-white mb-2 tracking-tighter">
                            {gameState.gameStatus === 'VICTORY' ? '獨立建國' : '運動失敗'}
                        </h2>
                        <p className={`text-xl mb-8 ${gameState.gameStatus === 'VICTORY' ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {gameState.gameStatus === 'VICTORY' 
                                ? '世界聽見了你們的聲音，新的歷史篇章已然展開。' 
                                : '在帝國的鐵蹄下，火種暫時熄滅，等待下一次風起。'}
                        </p>
                        <button onClick={() => window.location.reload()} className="px-8 py-3 bg-white text-slate-900 rounded font-bold hover:scale-105 transition-transform">
                            重新開始 <i className="fa-solid fa-rotate-right ml-2"></i>
                        </button>
                    </div>
                 )}

                <HexGrid 
                    map={gameState.map} 
                    onTileClick={handleTileClick} 
                    selectedHexId={gameState.selectedHexId}
                />
            </div>

            {/* Side Panel: Logs / History */}
            <div className="lg:w-80 bg-slate-900 rounded-xl border border-slate-800 flex flex-col h-64 lg:h-auto">
                <div className="p-4 border-b border-slate-800 bg-slate-900 rounded-t-xl">
                    <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        <i className="fa-solid fa-rss"></i> 最新動態
                    </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {gameState.history.length === 0 && <p className="text-slate-600 text-sm italic text-center mt-10">尚無重大事件...</p>}
                    {gameState.history.map((log, i) => (
                        <div key={i} className={`text-sm p-3 rounded border-l-2 animate-in slide-in-from-right-2 fade-in ${
                            log.type === 'success' ? 'bg-emerald-950/30 border-emerald-500 text-emerald-100' :
                            log.type === 'fail' ? 'bg-rose-950/30 border-rose-500 text-rose-100' :
                            'bg-slate-800/50 border-slate-500 text-slate-300'
                        }`}>
                            <div className="text-[10px] opacity-50 mb-1">Turn {log.turn}</div>
                            {log.text}
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* Modals */}
      {activeScenario && (
        <EventModal 
            scenario={activeScenario}
            currentResources={gameState.resources}
            onOptionSelect={handleActionSelect}
            onCancel={() => {
                setActiveScenario(null);
                setGameState(prev => ({ ...prev, selectedHexId: null }));
            }}
        />
      )}

      {/* Fundraising Modal */}
      {showFundraising && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 animate-in fade-in">
              <div className="bg-slate-800 border border-slate-600 rounded-lg max-w-sm w-full p-6 shadow-2xl">
                  <h3 className="text-xl font-bold text-white mb-2"><i className="fa-solid fa-hand-holding-dollar text-sky-400 mr-2"></i> 緊急募款</h3>
                  <p className="text-slate-300 mb-6">
                      由於資源短缺，你必須暫停擴張，花費一個回合的時間向民間進行小額募款。
                      <br/><br/>
                      <span className="text-sky-400 font-bold">效果：</span> 跳過本回合，獲得 25 資源。
                  </p>
                  <div className="flex gap-3">
                      <button onClick={() => setShowFundraising(false)} className="flex-1 py-2 bg-slate-700 text-slate-300 rounded hover:bg-slate-600">取消</button>
                      <button onClick={handleFundraising} className="flex-1 py-2 bg-sky-600 text-white rounded font-bold hover:bg-sky-500">確認募款</button>
                  </div>
              </div>
          </div>
      )}

      {/* Result Popup */}
      {outcomeMessage && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 animate-in zoom-in duration-200">
              <div className={`max-w-md w-full p-6 rounded-xl shadow-2xl border-2 transform transition-all ${outcomeMessage.success ? 'bg-slate-900 border-emerald-500' : 'bg-slate-900 border-rose-500'}`}>
                  <div className="flex items-center gap-3 mb-4">
                      <i className={`fa-solid text-2xl ${outcomeMessage.success ? 'fa-circle-check text-emerald-400' : 'fa-triangle-exclamation text-rose-400'}`}></i>
                      <h3 className={`text-xl font-bold ${outcomeMessage.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {outcomeMessage.success ? '行動成功' : '行動受挫'}
                      </h3>
                  </div>
                  <p className="text-white text-lg mb-6 leading-relaxed font-serif">
                      {outcomeMessage.message}
                  </p>
                  <div className="flex gap-4 text-sm mb-6 bg-black/20 p-3 rounded">
                      {outcomeMessage.unityChange !== 0 && (
                          <span className={`font-bold ${outcomeMessage.unityChange > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              <i className="fa-solid fa-heart-pulse mr-1"></i> {outcomeMessage.unityChange > 0 ? '+' : ''}{outcomeMessage.unityChange}
                          </span>
                      )}
                       {outcomeMessage.pressureChange !== 0 && (
                          <span className={`font-bold ${outcomeMessage.pressureChange < 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              <i className="fa-solid fa-gauge-high mr-1"></i> {outcomeMessage.pressureChange > 0 ? '+' : ''}{outcomeMessage.pressureChange}
                          </span>
                      )}
                      {outcomeMessage.resourceChange !== 0 && (
                          <span className={`font-bold ${outcomeMessage.resourceChange > 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                              <i className="fa-solid fa-coins mr-1"></i> {outcomeMessage.resourceChange > 0 ? '+' : ''}{outcomeMessage.resourceChange}
                          </span>
                      )}
                  </div>
                  <button 
                    onClick={closeOutcome}
                    className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold uppercase tracking-wider transition-colors"
                  >
                      繼續 <i className="fa-solid fa-caret-right ml-1"></i>
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

export default App;