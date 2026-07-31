import { GoogleGenAI } from '@google/genai';
const modelsToTest = [
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-2.0-flash",
  "gemini-flash-latest",
  "gemini-flash-lite-latest",
  "gemini-3.1-pro-preview",
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash-lite"
];

async function run() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  for (const model of modelsToTest) {
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: { parts: [{ text: "Hello" }] }
      });
      console.log(`Success: ${model}`);
    } catch (e) {
      console.log(`Error ${model}: ${e.status} ${e.message.substring(0, 50)}`);
    }
  }
}
run().catch(console.error);
