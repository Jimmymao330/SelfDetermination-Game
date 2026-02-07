import { GoogleGenAI, Type } from "@google/genai";
import { ActionType, EventOutcome, EventScenario, TerrainType } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelName = 'gemini-3-flash-preview';

export const generateTileEvent = async (terrain: TerrainType): Promise<EventScenario> => {
  const prompt = `
  Generate a brief political or cultural conflict scenario for a "${terrain}" region in a nation seeking self-determination.
  The scenario should require the player to make a decision.
  Return JSON only.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A short, catchy title (4-8 chars)" },
            description: { type: Type.STRING, description: "The situation description (max 60 words)" },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, enum: [ActionType.CULTURE, ActionType.DIPLOMACY, ActionType.PROTEST] },
                  label: { type: Type.STRING, description: "Action button text (e.g. '舉辦母語音樂節')" },
                  baseCost: { type: Type.NUMBER, description: "Resource cost (10-30)" },
                  successRate: { type: Type.NUMBER, description: "Probability 0.1-0.9" },
                  successText: { type: Type.STRING, description: "Result text if successful" },
                  failText: { type: Type.STRING, description: "Result text if failed" }
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
        const data = JSON.parse(response.text);
        // Map response to ensure full EventScenario compliance
        return {
          id: `gen-${Date.now()}`,
          terrain: [terrain],
          title: data.title,
          description: data.description,
          options: data.options.map((opt: any) => ({
            type: opt.type,
            label: opt.label,
            baseCost: opt.baseCost,
            successRate: opt.successRate || 0.5,
            successText: opt.successText || "行動成功。",
            failText: opt.failText || "行動失敗。",
            successReward: { unity: 15, pressure: -5, resources: 5 }, // Default rewards
            failPenalty: { unity: -5, pressure: 5, resources: 0 } // Default penalties
          }))
        } as EventScenario;
    }
    throw new Error("No response text");

  } catch (error) {
    console.error("Error generating event:", error);
    // Fallback if API fails
    return {
      id: "fallback-error",
      terrain: [terrain],
      title: "通訊中斷",
      description: "我們與該地區的聯繫暫時中斷，但仍需您的指示。",
      options: [
        { 
          type: ActionType.CULTURE, 
          label: "派遣文化特使", 
          baseCost: 10,
          successRate: 0.5,
          successReward: { unity: 10, pressure: 0, resources: 0 },
          failPenalty: { unity: -5, pressure: 5, resources: 0 },
          successText: "特使成功傳達了我們的善意。",
          failText: "特使無法突破封鎖。"
        },
        { 
          type: ActionType.DIPLOMACY, 
          label: "尋求當地長老支持", 
          baseCost: 20,
          successRate: 0.6,
          successReward: { unity: 20, pressure: -5, resources: 0 },
          failPenalty: { unity: 0, pressure: 0, resources: 0 },
          successText: "長老們願意與我們合作。",
          failText: "長老們保持觀望態度。"
        },
        { 
          type: ActionType.PROTEST, 
          label: "發動基層動員", 
          baseCost: 15,
          successRate: 0.4,
          successReward: { unity: 30, pressure: 5, resources: 0 },
          failPenalty: { unity: -10, pressure: 10, resources: 0 },
          successText: "民眾響應了號召，聲勢浩大。",
          failText: "動員遭到了強力鎮壓。"
        }
      ]
    };
  }
};

export const resolveGameAction = async (
  scenario: string,
  actionType: ActionType,
  terrain: TerrainType
): Promise<EventOutcome> => {
  const prompt = `
  Context: Terrain is ${terrain}. Scenario: "${scenario}".
  Player chose action: ${actionType}.
  Determine the outcome based on the nature of the action and terrain (e.g., Protest works poorly in Mountains, Diplomacy is hard in oppressed Cities).
  Return JSON.
  `;

  try {
     const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            success: { type: Type.BOOLEAN },
            message: { type: Type.STRING, description: "Narrative result of the action (max 40 words)" },
            unityChange: { type: Type.NUMBER, description: "Positive if success, small neg if fail" },
            pressureChange: { type: Type.NUMBER, description: "Increase if protest fails, decrease if diplomacy succeeds" },
            resourceChange: { type: Type.NUMBER, description: "Bonus resources if successful" }
          }
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text) as EventOutcome;
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("Error resolving action:", error);
    return {
      success: true, // Fail safe to true to not block game
      message: "行動已執行，局勢產生了些許變化。",
      unityChange: 10,
      pressureChange: 0,
      resourceChange: 5
    };
  }
};