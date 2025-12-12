import { GoogleGenAI, Type, Schema } from "@google/genai";
import { InterpretationResponse, FinalResponse } from "../types";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-build' });

const ARIA_SYSTEM_INSTRUCTION_BASE = `
You are A.R.I.A (Ambiguity Resolution & Intent Analysis Agent), specialized in Prompt Engineering.
Your job is to:
1. Analyze a user's vague idea or rough instruction.
2. Detect the possible specific intents behind it.
3. Generate EXACTLY:
   - 1 recommended interpretation (best guess for a high-quality prompt intent)
   - 3 alternative interpretations
4. Return all interpretations in clean JSON format.

IMPORTANT RULES:
- Do NOT ask the user clarifying questions.
- Do NOT generate more than 4 interpretations total.
- Keep all text concise, friendly, and clear.
- Interpretations must be distinct from each other.
- Recommended interpretation must be the MOST probable usage pattern.
- Always output JSON exactly as specified.
- Never include commentary outside JSON.
`;

const INTERPRETATION_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    mode: { type: Type.STRING, enum: ["interpretation_panel"] },
    recommended: { type: Type.STRING },
    options: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: ["mode", "recommended", "options"],
};

const FINAL_OUTPUT_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    mode: { type: Type.STRING, enum: ["final_output"] },
    selected_option: { type: Type.STRING },
    result: { type: Type.STRING },
  },
  required: ["mode", "selected_option", "result"],
};

export const analyzeIntent = async (userText: string): Promise<InterpretationResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `USER MESSAGE: "${userText}"`,
      config: {
        systemInstruction: ARIA_SYSTEM_INSTRUCTION_BASE,
        responseMimeType: "application/json",
        responseSchema: INTERPRETATION_SCHEMA,
        temperature: 0.7, 
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as InterpretationResponse;
  } catch (error) {
    console.error("Error analyzing intent:", error);
    throw error;
  }
};

export const generateFinalResult = async (
  originalText: string,
  selectedOption: string,
  isRecommended: boolean
): Promise<FinalResponse> => {
  try {
    // CRITICAL: Logic changed to Generate a PROMPT, not execute the task.
    const prompt = `
    USER ORIGINAL IDEA: "${originalText}"
    SELECTED INTENT: "${selectedOption}"
    
    INSTRUCTIONS:
    The user wants to write an AI prompt for the intent selected above.
    Your task is to act as a World-Class Prompt Engineer.
    
    1. WRITE A HIGH-QUALITY PROMPT that the user can copy and paste into an LLM (like ChatGPT, Claude, or Gemini) to achieve the selected intent.
    2. Do NOT execute the task yourself. (e.g. if the intent is "write a story", do NOT write the story. Write the PROMPT to ask an AI to write the story).
    3. If the prompt requires input data (like code to fix, or text to summarize), use clear placeholders like "[INSERT CODE HERE]" or "[PASTE TEXT HERE]".
    4. Use best practices: assign a persona, define the output format, and specify constraints.
    5. The 'result' field in the JSON must contain ONLY the engineered prompt.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are an expert Prompt Editor. Output only the optimized prompt in JSON format.",
        responseMimeType: "application/json",
        responseSchema: FINAL_OUTPUT_SCHEMA,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    const json = JSON.parse(text) as FinalResponse;
    
    return {
      ...json,
      selected_option: isRecommended ? "recommended" : selectedOption 
    };
  } catch (error) {
    console.error("Error generating final result:", error);
    throw error;
  }
};