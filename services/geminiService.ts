import { GoogleGenAI, Type, Schema } from "@google/genai";
import { InterpretationResponse, FinalResponse } from "../types";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-build' });

const ARIA_SYSTEM_INSTRUCTION_BASE = `
You are A.R.I.A (Ambiguity Resolution & Intent Analysis Agent), a dedicated AI Prompt Editor.
Your ONLY goal is to help users craft the perfect prompt for an LLM.

Your job is to:
1. Analyze a user's vague idea (e.g., "help me write code" or "I need a story").
2. Identify the specific *intent* for a prompt that the user wants to use.
3. Generate EXACTLY:
   - 1 recommended prompt strategy (best guess)
   - 3 alternative prompt strategies
4. Return all interpretations in clean JSON format.

IMPORTANT RULES:
- Do NOT ask the user for content (e.g., do not ask "What is the story about?").
- Do NOT ask clarifying questions.
- Assume the user wants a template prompt they can fill in later.
- Keep interpretations distinct.
- Always output JSON exactly as specified.
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
    const prompt = `
    USER ORIGINAL IDEA: "${originalText}"
    SELECTED INTENT: "${selectedOption}"
    
    INSTRUCTIONS:
    The user needs a reusable AI PROMPT template based on the selected intent.
    
    1. WRITE THE PROMPT. Do not explain it.
    2. STRICTLY USE PLACEHOLDERS for any user data. 
       - Incorrect: "Please provide the code you want me to fix."
       - Correct: "Act as a Senior Developer. Analyze the following code for bugs and suggest performance improvements:\n\n[PASTE YOUR CODE HERE]"
    3. Do NOT execute the task yourself. Do not write the story. Do not fix code. WRITE THE PROMPT.
    4. Use best practices: assign a persona, define the output format, and specify constraints.
    5. The 'result' field in the JSON must contain ONLY the engineered prompt text.
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