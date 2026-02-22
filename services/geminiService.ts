import { GoogleGenAI, Chat } from "@google/genai";
import { EDWIN_SYSTEM_INSTRUCTION, tools } from "../constants";
import { searchFlights, searchLodging, getPoiInfo } from "./mockTools";

let chatSession: Chat | null = null;
let genAI: GoogleGenAI | null = null;

const getGenAI = () => {
  if (!genAI) {
    const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : undefined;
    if (!apiKey) return null;
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
};

export const initializeChat = async () => {
  const ai = getGenAI();
  if (!ai) throw new Error("API Key not found");

  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview', 
    config: {
      systemInstruction: EDWIN_SYSTEM_INSTRUCTION,
      tools: [
        { functionDeclarations: tools }
      ],
    },
  });
  return chatSession;
};

export const resetSession = () => {
  chatSession = null;
};

export const sendMessage = async (message: string): Promise<string> => {
  if (!chatSession) {
    await initializeChat();
  }
  if (!chatSession) throw new Error("Session error");

  let response = await chatSession.sendMessage({ message });

  let maxTurns = 5;
  while (response.functionCalls && response.functionCalls.length > 0 && maxTurns > 0) {
    maxTurns--;
    const toolResponses = await Promise.all(
      response.functionCalls.map(async (call) => {
        const { name, args, id } = call;
        let result: any = { error: "Not found" };
        try {
          if (name === 'search_flights') result = searchFlights(args.origin as string, args.destination as string, args.departureDate as string, args.returnDate as string);
          else if (name === 'search_lodging') result = searchLodging(args.location as string, args.checkIn as string, args.nights as number, (args.guests as number) || 2, args.accommodationType as string);
          else if (name === 'get_poi_info') result = getPoiInfo(args.location as string);
        } catch (e: any) { result = { error: e.message }; }
        return { id, name, response: { result } };
      })
    );

    response = await chatSession.sendMessage({
      message: toolResponses.map(tr => ({ functionResponse: tr }))
    });
  }

  let finalContent = response.text || "";

  // Append Grounding Metadata Links (Safe check if model supports it in future)
  const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
  if (groundingMetadata?.groundingChunks) {
    const mapLinks = groundingMetadata.groundingChunks
      .filter(chunk => chunk.maps)
      .map(chunk => `*   [🗺️ Ver en Mapa: ${chunk.maps?.title}](${chunk.maps?.uri})`)
      .join('\n');
    
    if (mapLinks) {
      finalContent += `\n\n### 📍 Ubicaciones Verificadas y Rutas\n${mapLinks}`;
    }
  }

  return finalContent;
};
