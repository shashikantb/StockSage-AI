import {genkit} from 'genkit';
import {groq} from 'genkitx-groq';
import { llama3 } from 'genkitx-groq';


export const ai = genkit({
  plugins: [
    groq({
      apiKey: process.env.GROQ_API_KEY,
    }),
  ],
  model: 'llama3-8b-8192',
});
