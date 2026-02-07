import { ActionType, EventScenario, TerrainType } from '../types';

export const SCENARIO_DB: EventScenario[] = [
  // --- PLAINS SCENARIOS ---
  {
    id: 'plains_harvest',
    terrain: [TerrainType.PLAINS],
    title: '豐收祭典',
    description: '當地的農民正在籌備年度豐收祭，這是一個絕佳的機會，可以將我們的民族象徵融入慶典之中。',
    options: [
      {
        type: ActionType.CULTURE,
        label: '資助傳統歌舞表演',
        baseCost: 15,
        successRate: 0.8,
        successReward: { unity: 25, pressure: 0, resources: 5 },
        failPenalty: { unity: 0, pressure: 2, resources: 0 },
        successText: '歌聲傳遍了田野，人們含淚唱著古老的歌謠，認同感大幅提升。',
        failText: '表演被視為過於政治化，部分長老感到不悅。'
      },
      {
        type: ActionType.PROTEST,
        label: '藉機發表獨立演說',
        baseCost: 10,
        successRate: 0.4,
        successReward: { unity: 40, pressure: 5, resources: 0 },
        failPenalty: { unity: -5, pressure: 10, resources: 0 },
        successText: '你的演說點燃了群眾的熱情，歡呼聲蓋過了祭典的鼓聲。',
        failText: '帝國警察迅速介入中斷了演說，氣氛變得肅殺。'
      }
    ]
  },
  {
    id: 'plains_land',
    terrain: [TerrainType.PLAINS],
    title: '土地徵收案',
    description: '帝國政府計畫徵收這片肥沃的農地建造工廠，農民們憤怒不已，尋求你的指引。',
    options: [
      {
        type: ActionType.DIPLOMACY,
        label: '聘請律師團訴訟',
        baseCost: 30,
        successRate: 0.6,
        successReward: { unity: 20, pressure: -5, resources: 10 },
        failPenalty: { unity: 5, pressure: 0, resources: 0 },
        successText: '訴訟成功拖延了工程，我們被視為人民權益的捍衛者。',
        failText: '法院駁回了訴訟，但我們的努力贏得了些許敬重。'
      },
      {
        type: ActionType.PROTEST,
        label: '組織和平守護行動',
        baseCost: 15,
        successRate: 0.5,
        successReward: { unity: 35, pressure: 10, resources: 0 },
        failPenalty: { unity: -10, pressure: 15, resources: 0 },
        successText: '數百名農民手牽手守護土地，場面感人，迫使政府暫緩行動。',
        failText: '鎮暴部隊強制驅離，許多農民受傷，恐懼在蔓延。'
      }
    ]
  },
  
  // --- CITY SCENARIOS ---
  {
    id: 'city_university',
    terrain: [TerrainType.CITY],
    title: '大學思潮',
    description: '首都的大學生們正在秘密傳閱關於民族自決的禁書，但校方已經開始審查。',
    options: [
      {
        type: ActionType.CULTURE,
        label: '舉辦學術研討會',
        baseCost: 20,
        successRate: 0.7,
        successReward: { unity: 30, pressure: 5, resources: 5 },
        failPenalty: { unity: 0, pressure: 5, resources: 0 },
        successText: '透過學術包裝，思想的火種在年輕一代心中點燃，未來的領袖正在誕生。',
        failText: '會議被迫中止，書籍被沒收，但學生們的眼神中已無恐懼。'
      },
      {
        type: ActionType.PROTEST,
        label: '發動校園罷課',
        baseCost: 25,
        successRate: 0.3, // Difficult in city
        successReward: { unity: 50, pressure: 15, resources: 0 },
        failPenalty: { unity: -10, pressure: 20, resources: 0 },
        successText: '全城的大學響應罷課，震撼了教育當局。',
        failText: '校方開除了帶頭學生，家長們感到恐慌，運動受挫。'
      }
    ]
  },
  {
    id: 'city_trade',
    terrain: [TerrainType.CITY],
    title: '國際商會晚宴',
    description: '重要的外國投資者與帝國官員將出席晚宴，這是爭取外部同情的機會。',
    options: [
      {
        type: ActionType.DIPLOMACY,
        label: '遞交公開請願書',
        baseCost: 40,
        successRate: 0.6,
        successReward: { unity: 15, pressure: -10, resources: 30 }, // High resource reward
        failPenalty: { unity: 0, pressure: 0, resources: 0 },
        successText: '外國領事收下了請願書，並對我們的處境表示高度關注。',
        failText: '我們被拒於門外，但至少嘗試發出了聲音。'
      },
      {
        type: ActionType.PROTEST,
        label: '場外燭光晚會',
        baseCost: 10,
        successRate: 0.5,
        successReward: { unity: 20, pressure: 5, resources: 0 },
        failPenalty: { unity: -5, pressure: 5, resources: 0 },
        successText: '溫暖的燭光感動了路人與記者，國際媒體報導了此事。',
        failText: '警方以交通管制為由驅散了人群，無人知曉我們的訴求。'
      }
    ]
  },
  {
    id: 'city_coop',
    terrain: [TerrainType.CITY],
    title: '互助合作社',
    description: '為了支持被帝國企業排擠的本地商家，市民們提議建立互助經濟圈。',
    options: [
      {
        type: ActionType.DIPLOMACY,
        label: '整合商家資源',
        baseCost: 15,
        successRate: 0.8,
        successReward: { unity: 10, pressure: 0, resources: 40 }, // High resource gain
        failPenalty: { unity: 0, pressure: 0, resources: 0 },
        successText: '合作社成功建立，穩定的資金流開始支持我們的運動。',
        failText: '商家們因為恐懼報復而不敢加入。'
      },
       {
        type: ActionType.CULTURE,
        label: '發行社區貨幣',
        baseCost: 20,
        successRate: 0.6,
        successReward: { unity: 30, pressure: 10, resources: 20 },
        failPenalty: { unity: -5, pressure: 10, resources: 0 },
        successText: '社區貨幣凝聚了向心力，大家更願意購買彼此的服務。',
        failText: '帝國金融機關認定此舉違法，強行查禁。'
      }
    ]
  },

  // --- MOUNTAINS SCENARIOS ---
  {
    id: 'mountain_mines',
    terrain: [TerrainType.MOUNTAINS],
    title: '礦區權益',
    description: '山區的礦工不滿惡劣的工作環境與帝國的剝削，希望能改善生活。',
    options: [
      {
        type: ActionType.PROTEST,
        label: '組織工會談判',
        baseCost: 20,
        successRate: 0.7, // High success in mountains
        successReward: { unity: 35, pressure: 10, resources: 10 },
        failPenalty: { unity: -5, pressure: 10, resources: 0 },
        successText: '工會成功成立，並迫使資方改善條件，工人們士氣大振。',
        failText: '資方拒絕承認工會，並威脅解僱領袖。'
      },
      {
        type: ActionType.DIPLOMACY,
        label: '與部落長老協商',
        baseCost: 15,
        successRate: 0.8,
        successReward: { unity: 25, pressure: 0, resources: 5 },
        failPenalty: { unity: 0, pressure: 0, resources: 0 },
        successText: '長老們同意支持我們，山區成為了堅實的後盾。',
        failText: '長老們不願捲入政治紛爭，保持中立。'
      }
    ]
  },

  // --- COAST SCENARIOS ---
  {
    id: 'coast_culture',
    terrain: [TerrainType.COAST],
    title: '海外文化援助',
    description: '一艘來自自由國度的貨船停靠，船員帶來了海外僑胞捐贈的民族文學書籍與教育物資。',
    options: [
      {
        type: ActionType.DIPLOMACY,
        label: '遊說港務官員',
        baseCost: 25,
        successRate: 0.6,
        successReward: { unity: 20, pressure: 0, resources: 10 },
        failPenalty: { unity: -5, pressure: 5, resources: 0 },
        successText: '部分官員認同保存文化的必要性，默許了物資通關。',
        failText: '官員畏懼上級壓力，拒絕了我們的請求。'
      },
      {
        type: ActionType.CULTURE,
        label: '發動志工搬運',
        baseCost: 15,
        successRate: 0.5,
        successReward: { unity: 30, pressure: 5, resources: 0 },
        failPenalty: { unity: -10, pressure: 10, resources: 0 },
        successText: '在眾人齊心協力下，我們成功將書籍運出港口。',
        failText: '巡邏隊發現了我們，行動被迫中止。'
      }
    ]
  }
];

export const getRandomScenario = (terrain: TerrainType): EventScenario => {
  const candidates = SCENARIO_DB.filter(s => s.terrain.includes(terrain));
  if (candidates.length === 0) return SCENARIO_DB[0]; // Fallback
  return candidates[Math.floor(Math.random() * candidates.length)];
};
