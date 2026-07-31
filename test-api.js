import { GoogleGenAI } from '@google/genai';
async function run() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite-image",
    contents: { parts: [{ text: "Hello" }] }
  });
  console.log(response.text);
}
run().catch(console.error);
