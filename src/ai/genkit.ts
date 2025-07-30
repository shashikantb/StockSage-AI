import {genkit} from 'genkit';
import {groq, llama3x8b} from 'genkitx-groq';


export const ai = genkit({
  plugins: [
    groq({
      apiKey: process.env.GROQ_API_KEY,
    }),
  ],
  model: llama3x8b,
});
